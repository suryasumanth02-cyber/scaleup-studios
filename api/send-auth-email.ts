export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  const sendJson = (status: number, data: any) => {
    if (typeof res.status === 'function') {
      return res.status(status).json(data);
    }
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(405, { error: 'Method not allowed' });
  }

  // Robust Body Parsing across Vercel environments
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {}
  } else if (!body) {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = JSON.parse(Buffer.concat(chunks).toString());
    } catch (_) {
      body = {};
    }
  }

  const { email, code, type = 'verification_code', name, businessName, apiKey } = body || {};

  if (!email) {
    return sendJson(400, { error: 'Email address is required' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const activeApiKey = process.env.RESEND_API_KEY || apiKey;

  // If no Resend API key is configured yet, provide clear status and code for test verification
  if (!activeApiKey) {
    return sendJson(200, {
      success: false,
      needsApiKey: true,
      error: 'RESEND_API_KEY is not configured yet. Please enter a free Resend key or set RESEND_API_KEY in your Vercel Environment Variables.',
      code: code
    });
  }

  try {
    const subject = type === 'welcome' 
      ? `Welcome to ScaleUp Studios, ${name || 'Creator'}! 🚀` 
      : `Your ScaleUp Studios Login Code: ${code}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f9fafb; margin: 0; padding: 40px 20px; }
            .card { max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 36px 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
            .brand { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 8px; }
            .title { font-size: 18px; font-weight: 700; color: #e2e8f0; margin-bottom: 12px; }
            .text { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
            .code-box { background: #020617; border: 2px dashed #10b981; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px; }
            .code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #10b981; margin: 0; }
            .subtext { font-size: 12px; color: #64748b; margin-top: 8px; }
            .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #1e293b; font-size: 11px; color: #475569; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">ScaleUp Studios Security</span>
            <div class="brand">ScaleUp Studios</div>
            <div class="title">${type === 'welcome' ? 'Your AI Video Studio Account is Ready' : 'One-Time Verification Code'}</div>
            <p class="text">
              ${type === 'welcome' 
                ? `Hello ${name || 'there'}, your ScaleUp Studios account for <strong>${businessName || 'your business'}</strong> has been created successfully.` 
                : `Use the secure 6-digit verification code below to sign in to your ScaleUp Studios dashboard.`}
            </p>
            ${code ? `
              <div class="code-box">
                <div class="code">${code}</div>
                <div class="subtext">Valid for 10 minutes • Do not share this code</div>
              </div>
            ` : ''}
            <p class="text" style="font-size: 12px; margin-bottom: 0;">
              If you did not request this email, you can safely ignore it.
            </p>
            <div class="footer">
              © 2026 ScaleUp Studios Inc. • Automated AI Video Attribution Platform
            </div>
          </div>
        </body>
      </html>
    `;

    // Dispatch real email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ScaleUp Studios <onboarding@resend.dev>',
        to: [cleanEmail],
        subject: subject,
        html: htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return sendJson(response.status || 400, {
        success: false,
        error: data.message || 'Resend API returned an error',
        details: data
      });
    }

    return sendJson(200, {
      success: true,
      messageId: data.id,
      deliveredTo: cleanEmail
    });
  } catch (err: any) {
    return sendJson(500, {
      success: false,
      error: err.message || 'Internal Server Error sending email'
    });
  }
}
