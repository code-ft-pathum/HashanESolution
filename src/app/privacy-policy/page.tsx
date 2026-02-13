import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read the Privacy Policy of Hashan E Solution. We are committed to protecting your privacy and personal information.",
    robots: { index: false, follow: true } // Usually legal pages don't need high search priority
};

const PrivacyPolicy = () => {
    return (
        <div className="bg-primary-dark pt-32 pb-24 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-300">
                <h1 className="text-4xl font-bold text-white mb-8 font-poppins">Privacy Policy</h1>
                <p className="mb-6">Last updated: February 11, 2026</p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
                    <p>Welcome to Hashan E Solution. We respect your privacy and want to protect your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">2. The Data We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                    <ul className="list-disc ml-6 mt-4 space-y-2">
                        <li><strong>Identity Data:</strong> Includes first name, last name.</li>
                        <li><strong>Contact Data:</strong> Includes email address and telephone numbers.</li>
                        <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul className="list-disc ml-6 mt-4 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., to provide repair services).</li>
                        <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">4. Contact Us</h2>
                    <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
                    <p className="mt-4">Email: hashanmadushanka9122@gmail.com</p>
                    <p>Phone: 074 240 9092</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
