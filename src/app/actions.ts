"use server";

import nodemailer from 'nodemailer';

export async function sendEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    console.log('Attempting to send email via Nodemailer:', { name, email, phone, message });

    // Create a transporter using environment variables for security
    // Defaulting to Gmail settings since the recipient is a Gmail address
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // hashanmadushanka9122@gmail.com
            pass: process.env.EMAIL_PASS, // App-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'hashanmadushanka9122@gmail.com',
        replyTo: email,
        subject: `New Repair Inquiry from ${name} - Hashan e solution`,
        text: `
      You have a new repair inquiry from your website.

      Contact Details:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone || 'Not provided'}

      Message:
      ${message}
    `,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1E3A8A;">New Repair Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
    };

    try {
        // Note: This will fail if EMAIL_USER and EMAIL_PASS are not set.
        // For local development without credentials, we can return success but log a warning.
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('EMAIL_USER or EMAIL_PASS environment variables are missing. Email not actually sent.');
            // Simulate success for UI purposes if desired, or return failure
            // For now, let's return a specific message
            return {
                success: false,
                error: 'Email configuration missing on server.'
            };
        }

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: 'Failed to send message. Please try again later or contact via WhatsApp.'
        };
    }
}
