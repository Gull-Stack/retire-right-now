# RETIRE RIGHT NOW — Build Brief

## Client
Mike Stevens, President of Capital Wealth Advisors (Lehi, UT)

## Book
"Retire Right, Retire Now" (Spring 2026 launch)

## URL Structure
- Landing: /retire-right-now/ (or root /)
- Resources: /retire-right-now/resources/ (April 24)

## Design System
- Primary Yellow: #FFD970
- Primary Blue: #0073C4
- Heading Font: Glacial Indifference (self-hosted)
- Body Font: Myriad Pro (self-hosted, fallback to system sans)
- Background: Light/warm (#f5f5f0 or white — Editorial Light feel)
- Body Text: #333–#555 (never pure black)
- 80% light backgrounds, dark only for nav + footer
- NO emojis — SVG icons or nothing
- High-end editorial feel, book-first, author-second, firm-invisible
- Reference: dwzero.com (book page), bossretirement.com

## Similar Feel To
Look at /tmp/capital-wealth for the sister site's CSS patterns (dark financial advisory site).
This book site should be LIGHT/editorial but share the same quality level and component patterns.

## LinkedIn
https://www.linkedin.com/in/mstevens317/

## Pages to Build

### Page 1: Landing Page (/)

**Nav:** Minimal. No Capital Wealth logo. Book title as wordmark. CTA: "Get Your Free Chapter"

**Hero:** Book cover (placeholder) + "A portfolio is not a plan." + tagline + CTA button (#0073C4 bg, white text)

**Problem Section:** "You've Done Everything Right. So Why Does Retirement Still Feel Uncertain?"
Copy: You saved in your 401(k). You paid off the house. You did what you were told. But now you're staring at a pile of accounts, wondering: Is it enough? Will it last? What am I forgetting? "Retire Right, Retire Now" answers those questions — clearly, honestly, and without the jargon.

**Book Section:** What's inside — origin story (father died at 49), bullet points (income plan, reduce taxes, manage risk, healthcare, legacy plan)

**About Author:** Michael Stevens bio with photo placeholder. Fiduciary advisor, founder, radio host, board member.

**Social Proof:** "As Seen & Heard On" — horizontal logo bar (placeholder logos for now)

**Free Chapter Opt-In:** Email capture form (Snappy Kraken placeholder). "Get Your Free Chapter" CTA.

**FAQ:** 6 questions with <details> accordion. FAQPage schema in head.

**Footer:** © 2026 Mike Stevens. Social: LinkedIn + Retire Right Radio. Built by GullStack.

### Page 2: Resources (/resources/) — Stub only for now

## Tech Stack
- 11ty (Eleventy) + Nunjucks
- Vanilla CSS with custom properties
- Vanilla JS (form validation only)
- Self-hosted fonts (Glacial Indifference + Myriad Pro fallback)

## Schema (in <head>)
- Book (@type: Book)
- Person (@type: Person) — Mike Stevens
- FAQPage — landing page
- BreadcrumbList — all pages
- Organization — minimal

## AEO Requirements
- FAQPage schema on landing page
- BreadcrumbList on all pages
- E-E-A-T signals throughout

## Git
- Commit format: Bot Melvin: [what changed]
- Never force push
- Push to main when done

## GullStack Footer
Small "Built by GullStack" attribution in footer
