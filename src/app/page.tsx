import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Overview } from "@/components/Overview";
import { About } from "@/components/About";
import dynamic from "next/dynamic";

// Below-the-fold components split dynamically to optimize bundle load size
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs").then((m) => m.WhyChooseUs), { ssr: true });
const Portfolio = dynamic(() => import("@/components/Portfolio").then((m) => m.Portfolio), { ssr: true });
const CTA = dynamic(() => import("@/components/CTA").then((m) => m.CTA), { ssr: true });
const Contact = dynamic(() => import("@/components/Contact").then((m) => m.Contact), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer").then((m) => m.Footer), { ssr: true });

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Overview />
        <About />
        <WhyChooseUs />
        <Portfolio />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
