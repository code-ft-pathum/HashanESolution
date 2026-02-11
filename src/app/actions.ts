"use server";

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    // Server-side validation
    if (!name || !email || !message) {
        return {
            success: false,
            error: 'All required fields must be filled.'
        };
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email configuration missing on server: EMAIL_USER or EMAIL_PASS not set.');
        return {
            success: false,
            error: 'The server is not configured to send emails. Please contact us via WhatsApp.'
        };
    }

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: 'hashanmadushanka9122@gmail.com',
        replyTo: email,
        subject: `New Repair Inquiry: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eab308; border-radius: 12px; background: #0f172a; color: white;">
                <h2 style="color: #eab308; margin-bottom: 20px;">New Repair Inquiry</h2>
                <div style="margin-bottom: 10px;">
                    <p style="margin: 5px 0;"><strong>Customer:</strong> ${name}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                </div>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
                <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <p style="margin-top: 0;"><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #64748b;">Sent from Hashan e solution website</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error: any) {
        console.error('Nodemailer Error:', error.message);
        return {
            success: false,
            error: 'Failed to send email. Please use WhatsApp for a faster response.'
        };
    }
}
