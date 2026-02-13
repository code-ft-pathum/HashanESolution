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
        default: "Hashan E Solution | Expert LED/LCD TV & Digital Meter Repair Polonnaruwa",
        template: "%s | Hashan E Solution"
    },
    description: "Professional chip-level repair for LED/LCD TVs (Samsung, LG, Sony, TCL), Digital Meters (Pulsar, Apache, Yamaha), and household electronics (Ovens, Blenders, Fridges) in Welikanda, Polonnaruwa.",
    keywords: [
        "TV repair Polonnaruwa", "LED TV repair Sri Lanka", "Hashan E Solution",
        "Samsung TV repair Polonnaruwa", "LG TV repair Sri Lanka", "Sony TV repair Welikanda", "TCL TV repair", "Singer TV repair", "Abans TV repair",
        "Pulsar 150 digital meter repair", "Pulsar 180 digital meter repair", "Pulsar 220 meter repair", "NS200 meter fix", "Apache digital meter repair", "Yamaha FZ meter repair",
        "Digital meter repair Sri Lanka", "Motorcycle meter repair Polonnaruwa",
        "Blender repair Welikanda", "Rice cooker repair", "Microwave oven repair", "Refrigerator repair Polonnaruwa", "Iron repair",
        "Electronics repair Welikanda", "LCD panel repair Polonnaruwa", "TV chip level repair"
    ],
    authors: [{ name: "Hashan Madushanka" }],
    creator: "Hashan Madushanka",
    publisher: "Hashan E Solution",
    applicationName: "Hashan E Solution",
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
        title: "Hashan E Solution | Expert Electronics & TV Repair Polonnaruwa",
        description: "Professional repair for Samsung, LG, Sony TVs and Pulsar, Apache bike digital meters in Polonnaruwa.",
        url: "https://hashanesolution.netlify.app/",
        siteName: "Hashan E Solution",
        images: [
            {
                url: "/images/logo.png",
                width: 1200,
                height: 1200,
                alt: "Hashan E Solution - Expert Electronics Repair in Polonnaruwa",
            },
        ],
        locale: "en_LK",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Hashan E Solution | TV & Digital Meter Repair Polonnaruwa",
        description: "Expert chip-level repair for TVs, bike digital meters, and household appliances.",
        images: ["/images/logo.png"],
    },
    icons: {
        icon: [
            { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/images/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/images/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
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
    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Hashan E Solution",
        "url": "https://hashanesolution.netlify.app/",
        "alternateName": ["Hashan Electronics", "Hashan E Solution Polonnaruwa", "Hashan TV Repair"],
    };

    const businessJsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Hashan E Solution",
        "image": "https://hashanesolution.netlify.app/images/logo.png",
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
        "priceRange": "$$",
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 7.9250,
            "longitude": 81.1092
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ],
            "opens": "09:00",
            "closes": "18:00"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Repair Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "LED/LCD TV Repair",
                        "description": "Chip-level repair for Samsung, LG, Sony, TCL, Panasonic TVs."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Bike Digital Meter Repair",
                        "description": "Restoration of Pulsar 150/180/220, Apache, and Yamaha digital clusters."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Household Appliance Repair",
                        "description": "Fixing Blenders, Rice Cookers, Microwave Ovens, and Refrigerators."
                    }
                }
            ]
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
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
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
