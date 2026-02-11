import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Products from "@/components/Products";
import ServiceAreas from "@/components/ServiceAreas";
import Contact from "@/components/Contact";
import WorkPreview from "@/components/WorkPreview";
import FAQSection from "@/components/FAQSection";

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            <Hero />
            <Services />
            <WorkPreview />
            <Products />
            <ServiceAreas />
            <FAQSection />
            <Contact />
        </div>
    );
}
