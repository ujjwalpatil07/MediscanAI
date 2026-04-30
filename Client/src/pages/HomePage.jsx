import React from "react";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Specialists from "../components/home/Specialists";
import DentalBanner1 from "../components/home/DentalBanner1";
import DentalBanner2 from "../components/home/DentalBanner2";
import Welcome from "../components/home/Welcome";
import Testimonials from "../components/home/Testimonials";
import Blog from "../components/home/Blog";
import FAQ from "../components/home/FAQ";

export default function HomePage() {
    return (
        <div className="space-y-16 md:space-y-24">
            <Hero />
            <Services />
            <Specialists />
            <DentalBanner1 />
            <DentalBanner2 />
            <Welcome />
            <Testimonials />
            <Blog />
            <FAQ />
        </div>
    );
}
