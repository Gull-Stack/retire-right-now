const sgMail = require('@sendgrid/mail');
const https = require('https');

// Salesforce Web-to-Lead — same OID as capitalwealth.com
const SF_OID = '00DDm0000011JUMMA2';

function syncToSalesforce({ firstName, email, source }) {
  return new Promise((resolve) => {
    try {
      const params = new URLSearchParams();
      params.append('oid', SF_OID);
      params.append('retURL', 'https://retirerightbook.com/');
      params.append('first_name', firstName || '');
      params.append('last_name', '(Book Lead)');
      params.append('email', email);
      params.append('lead_source', 'Retire Right Book');
      params.append('description', `Free chapter request from ${source || 'retirerightbook.com'}`);
      params.append('Campaign_ID', '701VS00000dB91aYAC');

      const postData = params.toString();
      const options = {
        hostname: 'webto.salesforce.com',
        path: '/servlet/servlet.WebToLead?encoding=UTF-8',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        console.log(`[salesforce] Web-to-Lead sync: ${res.statusCode}`);
        resolve(res.statusCode < 400);
      });
      req.on('error', (e) => {
        console.error('[salesforce] Web-to-Lead sync failed:', e.message);
        resolve(false);
      });
      req.write(postData);
      req.end();
    } catch (e) {
      console.error('[salesforce] Web-to-Lead sync failed:', e.message);
      resolve(false);
    }
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { first_name, email, fax_number, _loadedAt } = req.body;

    // --- SPAM PROTECTION ---

    // 1. Honeypot: bots fill hidden fields, humans don't
    if (fax_number) {
      return res.status(200).json({ ok: true });
    }

    // 2. Timing check: reject submissions faster than 3 seconds (bots are instant)
    if (_loadedAt) {
      const elapsed = Date.now() - parseInt(_loadedAt, 10);
      if (elapsed < 3000) {
        return res.status(200).json({ ok: true });
      }
    }

    // 3. Basic email validation
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailTrimmed = email.trim().toLowerCase();

    // 4. Reject obviously fake/disposable patterns
    const disposableDomains = ['mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email', 'yopmail.com', 'sharklasers.com', 'grr.la', 'guerrillamailblock.com', 'fakeinbox.com', 'trashmail.com'];
    const domain = emailTrimmed.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return res.status(200).json({ ok: true });
    }

    // 5. Reject if email doesn't look valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // 6. Rate limit by IP (basic — log for monitoring)
    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    console.log(`[subscribe] IP=${clientIP} email=${emailTrimmed} name=${first_name || 'none'}`);

    // --- END SPAM PROTECTION ---

    // Sync to Salesforce Web-to-Lead (fire-and-forget)
    syncToSalesforce({
      firstName: first_name || '',
      email: emailTrimmed,
      source: 'retirerightbook.com',
    }).catch(err => console.error('[salesforce] async error:', err.message));

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Notify Bryce (lead notification)
    await sgMail.send({
      to: 'bryce@gullstack.com',
      from: { email: 'leads@gullstack.com', name: 'Retire Right Book' },
      subject: `📖 New Chapter Request: ${first_name || 'Someone'} (${emailTrimmed})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a2332, #2d3748); padding: 30px; text-align: center;">
            <h1 style="color: #f6c547; margin: 0;">New Free Chapter Request</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${first_name || 'Not provided'}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${emailTrimmed}">${emailTrimmed}</a></td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>IP:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${clientIP}</td></tr>
            </table>
          </div>
          <div style="background: #1a2332; padding: 15px; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">Lead from retirerightbook.com — also synced to Salesforce</p>
          </div>
        </div>
      `,
      replyTo: emailTrimmed,
    });

    // Auto-reply to subscriber
    await sgMail.send({
      to: emailTrimmed,
      from: { email: 'leads@gullstack.com', name: 'Mike Stevens' },
      subject: "You're on the list — Retire Right, Retire Now",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="padding: 40px 30px; background: #fafafa; border-bottom: 3px solid #f6c547;">
            <h1 style="font-size: 24px; color: #1a2332;">Thanks${first_name ? `, ${first_name}` : ''}!</h1>
            <p style="font-size: 16px; line-height: 1.6;">You're officially on the early access list for <strong>Retire Right, Retire Now</strong>.</p>
            <p style="font-size: 16px; line-height: 1.6;">When the free chapter is ready, you'll be the first to know. In the meantime, if you have questions about retirement planning, feel free to reply to this email.</p>
            <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">To your golden years,<br/><strong>Mike Stevens</strong></p>
          </div>
          <div style="padding: 15px; text-align: center; color: #999; font-size: 12px;">
            <p>You're receiving this because you signed up at retirerightbook.com</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
