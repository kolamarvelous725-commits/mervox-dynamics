"use client";

import { useState } from "react";
import { Mail, MessageCircle, Share2, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "Web Development",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({
      name: "",
      email: "",
      projectType: "Web Development",
      message: "",
    });

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const whatsappNumber = "1234567890";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Mervox%20Dynamics,%20I'd%20like%20to%20discuss%20a%20project.`;

  return (
    <section id="contact" className="py-24 bg-background relative border-t border-card-border/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Info & Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-accent mb-3">
                  Let's Connect
                </h2>
                <h3 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
                  Ready to Start Your Project?
                </h3>
                <div className="h-1 w-10 bg-accent/20 rounded-full mt-4" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Have an idea or a project you want to discuss? Contact us via the form, email, or WhatsApp, and let's bring it to life.
              </p>

              {/* Info Items */}
              <div className="space-y-4 pt-6">
                {/* Email */}
                <a
                  href="mailto:mervoxdynamics@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-card-border bg-card/25 hover:bg-card hover:border-accent/15 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/5 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Email Us
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      mervoxdynamics@gmail.com
                    </span>
                  </div>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@marv_web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-card-border bg-card/25 hover:bg-card hover:border-accent/15 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/5 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      TikTok
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      @marv_web
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* WhatsApp direct CTA */}
            <div className="pt-8 lg:pt-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-[18px] shadow-sm hover:shadow-md cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white/10" />
                Message on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Clean Form Card */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-[24px] border border-card-border bg-card/45 backdrop-blur-sm shadow-sm relative overflow-hidden">
              <h4 className="text-lg font-heading font-bold text-foreground mb-6 text-left">
                Send Us a Message
              </h4>

              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:border-accent/40 text-sm transition-colors text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:border-accent/40 text-sm transition-colors text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="projectType" className="text-xs font-semibold text-muted-foreground">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:border-accent/40 text-sm transition-colors text-foreground cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.25em",
                    }}
                  >
                    <option value="Web Design">Web Design</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Store Creation">Store Creation</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="Full Stack App">Full Stack App</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-semibold text-muted-foreground">
                    Project Details
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us about your project goals and budget..."
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:border-accent/40 text-sm transition-colors resize-none text-foreground"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-white bg-accent hover:bg-accent-hover active:scale-[0.98] transition-all duration-300 rounded-[18px] cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Success Overlay */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20"
                  >
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20"
                    >
                      <Check className="w-8 h-8 stroke-[2.5]" />
                    </motion.div>
                    <h5 className="text-lg font-heading font-bold text-foreground mb-2">
                      Message Sent Successfully!
                    </h5>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Thank you for reaching out. We will review your request and get back to you within 24 hours.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
