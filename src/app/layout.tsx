import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
    weight: ["400", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins"
});

export const metadata: Metadata = {
    title: {
        default: "Hashan e solution | Expert Electronics & TV Repair Polonnaruwa",
        template: "%s | Hashan e solution"
    },
    description: "Professional LED/LCD TV chip-level repair, digital meter diagnostics, and electronic spare parts in Welikanda, Polonnaruwa. Fast, reliable service with 500+ happy customers.",
    keywords: [
        "TV repair Polonnaruwa",
        "LED TV repair Sri Lanka",
        "Hashan e solution",
        "Electronics repair Welikanda",
        "Digital meter repair Sri Lanka",
        "LCD panel repair Polonnaruwa",
        "Electronic spare parts Sri Lanka",
        "TV chip level repair",
        "Polonnaruwa electronics shop"
    ],
    authors: [{ name: "Hashan Madushanka" }],
    creator: "Hashan Madushanka",
    publisher: "Hashan e solution",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL("https://hashanesolution.netlify.app/"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Hashan e solution | Expert Electronics & TV Repair Polonnaruwa",
        description: "Professional LED/LCD TV chip-level repair, digital meter diagnostics, and electronic spare parts in Welikanda, Polonnaruwa.",
        url: "https://hashanesolution.netlify.app/",
        siteName: "Hashan e solution",
        images: [
            {
                url: "/images/logo.png",
                width: 1200,
                height: 1200,
                alt: "Hashan e solution - Expert Electronics Repair",
            },
        ],
        locale: "en_LK",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Hashan e solution | Expert Electronics & TV Repair Polonnaruwa",
        description: "Professional LED/LCD TV chip-level repair and electronic spare parts in Welikanda.",
        images: ["/og-image.jpg"],
    },
    icons: {
        icon: [
            { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/images/favicon.ico' }
        ],
        apple: [
            { url: '/images/apple-touch-icon.png' }
        ],
    },
    manifest: '/images/site.webmanifest',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Hashan e solution",
        "image": "https://hashanesolution.netlify.app/images/logo.png", // Replace with real URL later
        "@id": "",
        "url": "https://hashanesolution.netlify.app/",
        "telephone": "+94742409092",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "No 09, New Town",
            "addressLocality": "Welikanda",
            "addressRegion": "Polonnaruwa",
            "postalCode": "51050",
            "addressCountry": "LK"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 7.9250,
            "longitude": 81.1092
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "09:00",
            "closes": "18:00"
        },
        "sameAs": [
            "https://web.facebook.com/profile.php?id=61587911941346"
        ]
    };

    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased bg-[#F3F4F6]">
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />
                <WhatsAppButton />
            </body>
        </html>
    );
}
