import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { CTA } from "@/components/CTA";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <About />
        <WhyChooseUs />
        <Portfolio />
        <Process />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
