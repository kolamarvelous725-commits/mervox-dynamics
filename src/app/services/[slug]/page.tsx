import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { servicesData, getServiceBySlug } from "@/data/services";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Phone,
  ShieldCheck,
  Zap,
  Star,
  Award,
  Layers,
  Clock
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  servicesData.forEach((s) => {
    params.push({ slug: s.slug });
    if (s.aliases) {
      s.aliases.forEach((alias) => {
        params.push({ slug: alias });
      });
    }
  });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return {
      title: "Service Not Found | Mervox Dynamics",
    };
  }

  return {
    title: `${service.title} | Mervox Dynamics Services`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background text-foreground">
        
        {/* HERO / INTRO SECTION */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-card-border/50 overflow-hidden">
          {/* Subtle background grid pattern matching the website */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a04_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a04_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
            {/* Back to Services Navigation Link */}
            <div className="mb-8">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-accent transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to All Services</span>
              </Link>
            </div>

            {/* Service Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/45 backdrop-blur-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Professional Service
              </span>
            </div>

            {/* Service Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-[1.15] max-w-3xl mb-6">
              {service.title}
            </h1>

            {/* Short Professional Introduction */}
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              {service.intro}
            </p>

            {/* CTA Buttons Header */}
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="https://wa.me/2348112769033"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-semibold text-white bg-accent hover:bg-accent-hover rounded-[14px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-[2px]"
              >
                <span>Book a Free Call</span>
                <Phone className="w-4 h-4" />
              </a>

              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-foreground border border-card-border bg-card hover:bg-white dark:hover:bg-slate-900 rounded-[14px] shadow-xs transition-all duration-300 hover:-translate-y-[2px]"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* DETAILED EXPLANATION SECTION */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
                OVERVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
                How We Approach {service.title}
              </h2>
              <div className="h-1 w-12 bg-accent/30 rounded-full" />
            </div>
            <div className="lg:col-span-8">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                {service.detailedExplanation}
              </p>
            </div>
          </div>
        </section>

        {/* WHAT WE OFFER UNDER THIS SERVICE */}
        <section className="py-16 md:py-20 bg-card/20 border-t border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6 text-left">
            <div className="max-w-2xl mb-12">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">
                DELIVERABLES & SCOPE
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
                What We Offer Under {service.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Comprehensive, end-to-end solutions tailored to your unique market positioning and business requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.whatWeOffer.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-card-border bg-card shadow-xs hover:border-accent/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <h3 className="text-sm font-heading font-extrabold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENT BENEFITS & WHY CHOOSE US */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Benefits */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">
                  CLIENT ADVANTAGES
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
                  Key Benefits to Your Business
                </h2>
              </div>

              <div className="space-y-4">
                {service.benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-card-border bg-card/45 flex items-start gap-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground mb-1">
                        {b.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Why Choose Mervox Dynamics */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">
                  THE MERVOX STANDARD
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
                  Why Choose Mervox Dynamics
                </h2>
              </div>

              <div className="space-y-4">
                {service.whyChooseUs.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-card-border bg-card/45 flex items-start gap-4"
                  >
                    <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground mb-1">
                        {w.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        {w.desc}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-accent shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">100% Quality & Transparency Guarantee</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Direct access to the founders and dedicated project managers throughout execution.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="py-16 md:py-24 border-t border-card-border/50 bg-background">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/45 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                TAKE THE NEXT STEP
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground">
              {service.ctaHeadline}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {service.ctaText}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
              <a
                href="https://wa.me/2348112769033"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-[14px] shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book a Free Call</span>
                <Phone className="w-4 h-4" />
              </a>

              <Link
                href="/services"
                className="w-full sm:w-auto px-8 py-4 border border-card-border bg-card hover:bg-white dark:hover:bg-slate-900 text-foreground font-bold rounded-[14px] shadow-xs hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Services</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
