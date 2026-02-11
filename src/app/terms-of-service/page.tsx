import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read the Terms of Service for Hashan e solution for information on our repair service agreements and website usage.",
    robots: { index: false, follow: true }
};

const TermsOfService = () => {
    return (
        <div className="bg-primary-dark pt-32 pb-24 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-300">
                <h1 className="text-4xl font-bold text-white mb-8 font-poppins">Terms of Service</h1>
                <p className="mb-6">Last updated: February 11, 2026</p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">1. Agreement to Terms</h2>
                    <p>By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">2. Repair Services</h2>
                    <p>Our repair services are provided "as is". While we strive for excellence, we are not responsible for any data loss during the repair process. We strongly recommend customers back up their devices before bringing them for repair.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">3. Spare Parts</h2>
                    <p>All spare parts supplied are genuine to the best of our knowledge. Warranty on spare parts is subject to the specific terms provided at the time of purchase.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">4. Limitation of Liability</h2>
                    <p>In no event shall Hashan e solution be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">5. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
