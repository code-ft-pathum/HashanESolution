"use server";

import nodemailer from 'nodemailer';

export async function sendEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { success: false, error: 'All required fields must be filled.' };
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.error('Email configuration missing in environment variables');
        return { success: false, error: 'Server configuration missing.' };
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    const mailOptions = {
        from: `"Hashan E Solution Notifications" <${emailUser}>`,
        to: 'hashanmadushanka9122@gmail.com',
        replyTo: email,
        subject: `🛠️ New Repair Inquiry from ${name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
                    .header { background: #0f172a; padding: 30px; text-align: center; }
                    .logo { width: 150px; height: auto; margin-bottom: 15px; }
                    .header h1 { color: #eab308; margin: 0; font-size: 24px; letter-spacing: 1px; }
                    .content { padding: 30px; background: #ffffff; }
                    .customer-info { background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #eab308; }
                    .customer-info p { margin: 8px 0; font-size: 15px; }
                    .label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 12px; margin-right: 10px; }
                    .message-box { background: #fffbeb; padding: 20px; border-radius: 12px; border: 1px solid #fef3c7; }
                    .message-title { color: #eab308; font-weight: bold; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
                    .message-text { white-space: pre-wrap; color: #1e293b; font-size: 16px; }
                    .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
                    .highlight { color: #0f172a; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://hashanesolution.netlify.app/images/logo.png" alt="Hashan E Solution Logo" class="logo">
                        <h1>New Repair Inquiry</h1>
                    </div>
                    <div class="content">
                        <div class="customer-info">
                            <p><span class="label">Customer Name:</span> <span class="highlight">${name}</span></p>
                            <p><span class="label">Email Address:</span> <a href="mailto:${email}" style="color: #0f172a; text-decoration: none; font-weight: 600;">${email}</a></p>
                            <p><span class="label">Phone Number:</span> <span class="highlight">${phone || 'Not provided'}</span></p>
                        </div>
                        
                        <div class="message-box">
                            <div class="message-title">Client Message</div>
                            <div class="message-text">${message}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This message was sent from the <strong>Hashan E Solution</strong> official website.</p>
                        <p>© 2026 Hashan E Solution | Welikanda, Polonnaruwa</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error: any) {
        console.error('Nodemailer Error:', error.message);
        // Provide more detailed error message for debugging if needed
        return { success: false, error: `Failed to send email: ${error.message}` };
    }
}
