const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { first_name, email, fax_number } = req.body;

    // Honeypot
    if (fax_number) {
      return res.status(200).json({ ok: true });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Notify Bryce (lead notification)
    await sgMail.send({
      to: 'bryce@gullstack.com',
      from: { email: 'leads@gullstack.com', name: 'Retire Right Book' },
      subject: `📖 New Chapter Request: ${first_name || 'Someone'} (${email})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a2332, #2d3748); padding: 30px; text-align: center;">
            <h1 style="color: #f6c547; margin: 0;">New Free Chapter Request</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${first_name || 'Not provided'}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
            </table>
          </div>
          <div style="background: #1a2332; padding: 15px; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">Lead from retirerightbook.com</p>
          </div>
        </div>
      `,
      replyTo: email,
    });

    // Auto-reply to subscriber
    await sgMail.send({
      to: email,
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
