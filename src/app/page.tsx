import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Products from "@/components/Products";
import ServiceAreas from "@/components/ServiceAreas";
import Contact from "@/components/Contact";

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            <Hero />
            <Services />
            <Products />
            <ServiceAreas />
            <Contact />
        </div>
    );
}
