export interface ServiceDetail {
  slug: string;
  aliases?: string[];
  title: string;
  shortDesc: string;
  color: string;
  intro: string;
  detailedExplanation: string;
  whatWeOffer: { title: string; desc: string }[];
  benefits: { title: string; desc: string }[];
  whyChooseUs: { title: string; desc: string }[];
  ctaHeadline: string;
  ctaText: string;
}

export const servicesData: ServiceDetail[] = [
  {
    slug: "web-design",
    aliases: ["website-design"],
    title: "Web Design",
    shortDesc: "We design beautiful websites that help your business make a great first impression.",
    color: "text-blue-500 bg-blue-500/10",
    intro: "Transform your online presence with visually captivating, modern web designs crafted to reflect your brand identity and captivate your audience from the very first click.",
    detailedExplanation: "At Mervox Dynamics, our web design process blends artistic elegance with conversion-focused psychology. We don't just create pretty pages; we engineer interactive visual experiences that guide your visitors effortlessly through your value proposition, building trust and turning casual traffic into loyal clients.",
    whatWeOffer: [
      { title: "Custom Website Layouts", desc: "Bespoke designs tailored strictly to your brand aesthetic and business goals." },
      { title: "Mobile-First Responsiveness", desc: "Pixel-perfect visual harmony across smartphones, tablets, laptops, and 4K displays." },
      { title: "User Experience (UX) Architecture", desc: "Intuitive page structures and navigation paths that make finding information effortless." },
      { title: "Conversion Rate Optimization (CRO)", desc: "Strategic placement of buttons, call-to-actions, and trust elements to maximize inquiries." },
      { title: "Modern Visual Styling", desc: "Subtle micro-animations, sleek typography, clean color palettes, and glassmorphic accents." }
    ],
    benefits: [
      { title: "Instant Brand Credibility", desc: "A sleek, professional site builds immediate trust with first-time prospective clients." },
      { title: "Lower Bounce Rates", desc: "Engaging layouts and lightning-fast aesthetic clarity keep visitors on your site longer." },
      { title: "Higher Conversion Rates", desc: "Clear user pathways guide prospects toward booking calls, purchasing, or requesting quotes." },
      { title: "Consistent Brand Voice", desc: "Unified typography, color schemes, and iconography across every page." }
    ],
    whyChooseUs: [
      { title: "Tailored to Your Vision", desc: "We never use generic, bloated templates. Every design is built around your unique market positioning." },
      { title: "Design Meets Strategy", desc: "Our designers collaborate directly with growth strategists to ensure high engagement." },
      { title: "Transparent Revisions", desc: "Collaborative feedback loops ensure the final design exceeds your expectations." }
    ],
    ctaHeadline: "Ready to elevate your online presence with a stunning website design?",
    ctaText: "Let our design experts craft a tailored digital experience that sets your brand apart from the competition."
  },
  {
    slug: "web-development",
    aliases: ["website-development", "fullstack-development"],
    title: "Web Development",
    shortDesc: "We build fast, secure, and professional websites that work on every device.",
    color: "text-emerald-500 bg-emerald-500/10",
    intro: "Engineering robust, scalable, and lightning-fast web applications built on modern frameworks like Next.js, React, TypeScript, and high-security cloud backends.",
    detailedExplanation: "Mervox Dynamics develops clean, production-grade web solutions that load in milliseconds, score near 100 on Google Core Web Vitals, and handle traffic surges effortlessly. From dynamic client portals and database integrations to API connections and search engine optimized landing pages, we build technology that powers real business growth.",
    whatWeOffer: [
      { title: "Full-Stack Web Engineering", desc: "Custom Next.js, React, and Node.js solutions engineered for extreme stability." },
      { title: "Database & Backend Integration", desc: "Secure Supabase, PostgreSQL, and RESTful/GraphQL API infrastructure." },
      { title: "Technical SEO & Speed Optimization", desc: "Optimized server-side rendering (SSR), image compression, and minimal script payloads." },
      { title: "Custom Admin Portals & Dashboards", desc: "Empower your team with intuitive internal management tools and analytics." },
      { title: "Ironclad Security & SSL", desc: "Automated backups, encrypted sessions, cross-site scripting protections, and compliance." }
    ],
    benefits: [
      { title: "Sub-Second Page Speeds", desc: "Keep users engaged and rank higher on Google search results with blazing-fast loads." },
      { title: "Effortless Scalability", desc: "Architecture designed to expand seamlessly as your user base and transaction volumes grow." },
      { title: "Reliable 99.9% Uptime", desc: "Enterprise cloud hosting and resilient database fallbacks ensure 24/7 reliability." },
      { title: "Clean, Maintainable Code", desc: "Built with industry standard TypeScript and modular components for easy long-term maintenance." }
    ],
    whyChooseUs: [
      { title: "Modern Tech Stack", desc: "We utilize cutting-edge industry frameworks that guarantee long-term performance." },
      { title: "Full Ownership & Control", desc: "You receive clean, well-documented code with zero vendor lock-in." },
      { title: "End-to-End Testing", desc: "Thorough quality assurance and automated testing across all browsers and devices." }
    ],
    ctaHeadline: "Build a high-performance web platform tailored for growth.",
    ctaText: "Schedule a consultation with our engineering team to discuss your project requirements and architecture."
  },
  {
    slug: "digital-products-design",
    aliases: ["ui-ux-design", "digital-product-design"],
    title: "UI/UX & Digital Product Design",
    shortDesc: "We design websites, SaaS platforms, and apps that are simple, attractive, and easy for people to use.",
    color: "text-purple-500 bg-purple-500/10",
    intro: "Create intuitive, engaging digital products and SaaS dashboard experiences that delight users and maximize retention through human-centric UI/UX design.",
    detailedExplanation: "Designing a successful software product requires a deep understanding of user behavior, interactive prototyping, and functional elegance. Our UI/UX specialists design high-fidelity design systems, user journeys, interactive wireframes, and dashboard interfaces that solve complex workflows with simplicity.",
    whatWeOffer: [
      { title: "SaaS Dashboard & App Design", desc: "Intuitive interfaces for complex web applications, analytics tools, and portals." },
      { title: "User Journey & Wireframing", desc: "Detailed structural blueprints mapping every user interaction and click flow." },
      { title: "Interactive Figma Prototypes", desc: "Clickable prototypes that let you test and validate workflows before coding." },
      { title: "Comprehensive Design Systems", desc: "Scalable component libraries, typography tokens, and style guides." },
      { title: "Usability Testing & Refinement", desc: "Data-backed optimization to eliminate friction and enhance task completion." }
    ],
    benefits: [
      { title: "Higher Product Adoption", desc: "Intuitive workflows allow new users to get immediate value without confusion." },
      { title: "Reduced Development Costs", desc: "Clear wireframes and design systems streamline engineering and prevent rework." },
      { title: "Increased Customer Retention", desc: "Delightful UX encourages daily active usage and reduces software churn." },
      { title: "Consistent Brand Identity", desc: "Unified design patterns across web, desktop, and mobile touchpoints." }
    ],
    whyChooseUs: [
      { title: "User-Centered Methodology", desc: "We design around real user needs, pain points, and natural interaction habits." },
      { title: "Pixel-Perfect Precision", desc: "Every micro-interaction, hover state, and layout grid is meticulously crafted." },
      { title: "Developer-Friendly Handoffs", desc: "Organized Figma tokens and assets that your developers can implement with ease." }
    ],
    ctaHeadline: "Turn complex workflows into simple, beautiful digital products.",
    ctaText: "Partner with our UI/UX designers to bring your SaaS or digital product concept to life."
  },
  {
    slug: "graphics-design",
    aliases: ["graphic-design"],
    title: "Graphic Design",
    shortDesc: "We create logos, flyers, social media designs, brochures, and visuals that help your brand stand out.",
    color: "text-pink-500 bg-pink-500/10",
    intro: "Captivate your market with high-impact visual graphics, marketing collateral, promotional flyers, and social media creative packages that elevate your brand authority.",
    detailedExplanation: "Visual communication is the heartbeat of your marketing strategy. At Mervox Dynamics, our creative graphic design team produces stunning, high-resolution visual assets that communicate your message clearly, resonate with your target demographic, and command attention across digital and print mediums.",
    whatWeOffer: [
      { title: "Logo & Brand Asset Creation", desc: "Memorable, versatile vector logos and brand icon sets." },
      { title: "Marketing Collateral & Flyers", desc: "High-converting digital and print flyers, banners, and promotional posters." },
      { title: "Social Media Creative Kits", desc: "Cohesive Instagram, LinkedIn, and Facebook post and story graphics." },
      { title: "Digital Product Covers & Mockups", desc: "3D realistic mockups for e-books, software bundles, and online courses." },
      { title: "Presentation & Pitch Decks", desc: "Executive slide decks designed to impress investors, partners, and corporate clients." }
    ],
    benefits: [
      { title: "Stand Out in Crowded Feeds", desc: "Vibrant, professionally designed assets capture attention in fractions of a second." },
      { title: "Professional Brand Image", desc: "High-standard visual aesthetics elevate perceived value and command premium pricing." },
      { title: "Multi-Platform Consistency", desc: "Uniform brand presence across your website, social media, and offline events." },
      { title: "Print & Web Ready", desc: "Delivered in crisp vector, CMYK for printing and RGB for high-DPI digital screens." }
    ],
    whyChooseUs: [
      { title: "Creative Storytelling", desc: "We translate your brand mission into compelling visual metaphors that resonate." },
      { title: "Fast Turnaround Times", desc: "Efficient design workflows deliver polished assets without delaying your campaigns." },
      { title: "Full Commercial Rights", desc: "You receive all source files, exports, and complete commercial ownership." }
    ],
    ctaHeadline: "Elevate your visual marketing with world-class graphic design.",
    ctaText: "Let our creative studio craft memorable visual assets that inspire action and drive engagement."
  },
  {
    slug: "mobile-app-development",
    aliases: ["mobile-app", "app-development"],
    title: "Mobile App Development",
    shortDesc: "We build mobile applications that help businesses connect with customers and simplify everyday tasks.",
    color: "text-amber-500 bg-amber-500/10",
    intro: "Empower your business with high-performance iOS and Android mobile applications built with fluid animations, native hardware integrations, and offline capabilities.",
    detailedExplanation: "Mobile apps place your business directly in your customer's pocket. Mervox Dynamics engineers sleek cross-platform mobile apps using React Native and Flutter, delivering native speed, push notification systems, secure mobile checkout, and intuitive navigation.",
    whatWeOffer: [
      { title: "Cross-Platform iOS & Android Apps", desc: "Single codebase apps with native performance on both Apple App Store and Google Play." },
      { title: "Push Notification Systems", desc: "Engage your audience with automated, personalized real-time push alerts." },
      { title: "Secure Mobile In-App Payments", desc: "Integrate Apple Pay, Google Pay, Stripe, and localized payment gateways." },
      { title: "Offline Data Synchronization", desc: "Allow users to browse content and log actions even without active internet." },
      { title: "App Store Publishing & Compliance", desc: "Complete handling of app store submissions, review approvals, and asset compliance." }
    ],
    benefits: [
      { title: "Direct Customer Access", desc: "Engage users anytime with home-screen presence and instant push notifications." },
      { title: "Streamlined Mobile Checkouts", desc: "Reduce cart abandonment with frictionless mobile payment flows." },
      { title: "Superior Mobile UX", desc: "Fluid 60fps animations and gesture-driven navigation tailored for touchscreens." },
      { title: "Enhanced Customer Loyalty", desc: "Built-in loyalty rewards, account profiles, and personalized content feeds." }
    ],
    whyChooseUs: [
      { title: "Cross-Platform Efficiency", desc: "Launch on both iOS and Android simultaneously, cutting development cost and timeline." },
      { title: "Robust Backend Architecture", desc: "Seamless cloud database sync, user authentication, and real-time messaging." },
      { title: "Post-Launch Support", desc: "Continuous maintenance, OS compatibility updates, and feature enhancements." }
    ],
    ctaHeadline: "Turn your mobile app idea into a reality.",
    ctaText: "Speak with our mobile development specialists to plan your app's architecture and launch timeline."
  },
  {
    slug: "store-creation",
    aliases: ["ecommerce-solutions", "ecommerce-development", "online-store-creation"],
    title: "E-commerce & Store Creation",
    shortDesc: "We create online stores where customers can browse products and buy from you anytime.",
    color: "text-cyan-500 bg-cyan-500/10",
    intro: "Launch high-converting online storefronts equipped with automated inventories, seamless multi-currency checkouts, and integrated logistics tracking.",
    detailedExplanation: "A successful online store requires more than product listings—it requires friction-free navigation, instant page loads, dynamic search filters, and an optimized checkout experience. Mervox Dynamics builds custom e-commerce platforms and Shopify stores engineered to maximize Average Order Value (AOV) and conversion rates.",
    whatWeOffer: [
      { title: "Custom Store Architecture", desc: "High-performance storefronts built on custom Next.js e-commerce or Shopify Plus." },
      { title: "Payment Gateway Integration", desc: "Seamless support for Stripe, PayPal, Paystack, Apple Pay, and credit cards." },
      { title: "Inventory & Order Automation", desc: "Real-time stock level synchronization, automated invoice generation, and fulfillment alerts." },
      { title: "Upsell & Cross-Sell Funnels", desc: "Smart cart recommendations and one-click post-purchase upsells that boost revenue." },
      { title: "Customer Account Portals", desc: "Self-service order tracking, saved wishlists, and hassle-free returns management." }
    ],
    benefits: [
      { title: "24/7 Global Revenue", desc: "Sell products and digital downloads around the clock to customers worldwide." },
      { title: "Higher Average Order Value", desc: "Strategic product bundling, upsells, and discount triggers increase total cart value." },
      { title: "Minimal Abandoned Carts", desc: "Streamlined single-page checkout eliminates friction and boosts completed orders." },
      { title: "Complete Mobile Optimization", desc: "Designed for the 70%+ of online shoppers purchasing directly on mobile devices." }
    ],
    whyChooseUs: [
      { title: "Conversion-Focused Engineering", desc: "Every layout element is tested to reduce friction and encourage purchase completion." },
      { title: "Security & Fraud Protection", desc: "PCI-DSS compliant checkouts, SSL encryption, and automated fraud prevention." },
      { title: "Scalable Infrastructure", desc: "Stores engineered to handle Black Friday traffic spikes without slowing down." }
    ],
    ctaHeadline: "Start selling online with a high-converting e-commerce store.",
    ctaText: "Let our e-commerce engineers build an online shopping experience that drives sales 24/7."
  },
  {
    slug: "digital-marketing",
    aliases: ["marketing-services"],
    title: "Digital Marketing",
    shortDesc: "We help your business reach more people through online advertising and data-driven marketing.",
    color: "text-indigo-500 bg-indigo-500/10",
    intro: "Accelerate your revenue with targeted digital marketing campaigns, conversion-driven funnels, and data-backed client acquisition strategies.",
    detailedExplanation: "Great products need targeted visibility. Mervox Dynamics designs comprehensive digital marketing roadmaps that align search engine marketing, paid performance funnels, retargeting mechanisms, and content syndication to consistently generate qualified business leads and paying customers.",
    whatWeOffer: [
      { title: "Multi-Channel Paid Campaigns", desc: "ROI-driven advertising campaigns across Google Search, Meta Ads, and YouTube." },
      { title: "Sales Funnel Architecture", desc: "Custom landing page pipelines designed to capture leads and guide them to purchase." },
      { title: "Search Engine Optimization (SEO)", desc: "Keyword targeting, on-page optimization, and authoritative backlink strategies." },
      { title: "Conversion Tracking & Analytics", desc: "Precise pixel tracking, Google Analytics 4 dashboards, and attribution modeling." },
      { title: "Audience Retargeting", desc: "Re-engage interested visitors with dynamic remarketing campaigns that close deals." }
    ],
    benefits: [
      { title: "Predictable Lead Generation", desc: "Establish consistent pipelines of qualified prospects seeking your services." },
      { title: "Measurable Return on Investment", desc: "Track every marketing dollar with clear metrics on cost per lead and revenue generated." },
      { title: "Rapid Market Visibility", desc: "Outrank competitors and capture high-intent buyers at the exact moment they search." },
      { title: "Long-Term Organic Authority", desc: "Strategic SEO builds lasting organic search traffic that compounds over time." }
    ],
    whyChooseUs: [
      { title: "Data-Driven Strategy", desc: "We base every campaign decision on live performance data and A/B testing insights." },
      { title: "Full Transparency Reporting", desc: "Clear, understandable performance dashboards that show real business impact." },
      { title: "Dedicated Growth Managers", desc: "Experienced marketing strategists focused on maximizing your campaign ROI." }
    ],
    ctaHeadline: "Scale your business with high-ROI digital marketing.",
    ctaText: "Schedule a growth strategy call with our digital marketing experts today."
  },
  {
    slug: "email-marketing",
    aliases: ["email-automation"],
    title: "Email Marketing & Automation",
    shortDesc: "Custom email automation sequences and nurturing campaigns built to educate leads and maximize customer lifetime value.",
    color: "text-blue-600 bg-blue-600/10",
    intro: "Turn leads into repeat buyers with automated email sequences, personalized newsletter broadcasts, and behavioral segmentation workflows.",
    detailedExplanation: "Email marketing remains one of the highest-ROI channels available to modern businesses. Mervox Dynamics crafts captivating email copy, designs branded HTML newsletter templates, and builds automated behavioral triggers that nurture prospects and boost customer lifetime value.",
    whatWeOffer: [
      { title: "Automated Welcome & Onboarding Flows", desc: "Introduce new subscribers to your brand and deliver immediate value." },
      { title: "Abandoned Cart & Browse Recovery", desc: "Reclaim lost sales with automated reminder emails and exclusive discount incentives." },
      { title: "Lead Nurturing Sequences", desc: "Educate prospects over time with high-value content that overcomes objections." },
      { title: "List Segmentation & Personalization", desc: "Send relevant offers tailored to specific user interests and purchasing history." },
      { title: "Deliverability & Spam Protection", desc: "Configure SPF, DKIM, DMARC, and domain warmup to guarantee inbox placement." }
    ],
    benefits: [
      { title: "Automated 24/7 Sales", desc: "Trigger-based sequences generate sales automatically while you focus on operations." },
      { title: "Higher Customer Retention", desc: "Keep your brand top-of-mind and encourage repeat purchases from existing clients." },
      { title: "Direct Audience Ownership", desc: "Own your customer communications free from social media algorithm shifts." },
      { title: "High Return on Investment", desc: "Email consistently delivers industry-leading ROI across all digital channels." }
    ],
    whyChooseUs: [
      { title: "Copywriting That Converts", desc: "Persuasive, engaging email copy that drives opens, clicks, and conversions." },
      { title: "Deliverability First", desc: "Technical DNS configuration ensures your emails land in the primary inbox." },
      { title: "Platform Agnostic", desc: "Expert setup on Klaviyo, Mailchimp, ActiveCampaign, HubSpot, and custom SMTP." }
    ],
    ctaHeadline: "Turn your email list into a reliable revenue engine.",
    ctaText: "Let our email automation team build automated nurturing campaigns for your brand."
  },
  {
    slug: "social-media-ads",
    aliases: ["social-media-advertising", "paid-ads"],
    title: "Social Media Advertising",
    shortDesc: "Targeted paid traffic campaigns across Meta, Google, and LinkedIn designed to acquire leads with a positive return on spend.",
    color: "text-rose-500 bg-rose-500/10",
    intro: "Scale your customer acquisition with laser-targeted paid advertising campaigns on Meta (Facebook & Instagram), TikTok, and LinkedIn.",
    detailedExplanation: "Paid social advertising is the fastest way to place your offers directly in front of your ideal customers. Mervox Dynamics combines high-converting ad creative, video hooks, precision demographic targeting, and continuous bid optimization to deliver low Cost Per Acquisition (CPA) and scalable returns on ad spend (ROAS).",
    whatWeOffer: [
      { title: "Campaign Strategy & Account Setup", desc: "Structured ad account hierarchy, pixel setup, and Custom Conversion tracking." },
      { title: "High-Converting Ad Creatives & Copy", desc: "Attention-grabbing video ads, carousel formats, and persuasive direct-response copy." },
      { title: "Lookalike & Retargeting Audiences", desc: "Target high-intent audiences modelled after your highest-value customers." },
      { title: "Continuous A/B Split Testing", desc: "Systematically test headlines, visual creative, hooks, and landing page angles." },
      { title: "Daily Bid & Budget Optimization", desc: "Active budget reallocation to maximize ad spend efficiency and scale winning campaigns." }
    ],
    benefits: [
      { title: "Rapid Customer Acquisition", desc: "Generate immediate traffic, leads, and sales from day one of campaign launch." },
      { title: "Laser Precision Targeting", desc: "Reach prospects based on precise interests, job titles, behaviors, and locations." },
      { title: "Predictable Cost Per Lead", desc: "Know exactly what it costs to acquire a new customer and scale predictably." },
      { title: "Full Funnel Coverage", desc: "Move prospects smoothly from brand awareness to decision and checkout." }
    ],
    whyChooseUs: [
      { title: "Creative-Led Performance", desc: "We produce the exact creative styles and hooks that outperform generic agency ads." },
      { title: "No Wasted Ad Spend", desc: "Strict negative audience exclusions and daily monitoring protect your budget." },
      { title: "Proven Track Record", desc: "Experience scaling ad budgets profitably across e-commerce, services, and digital products." }
    ],
    ctaHeadline: "Acquire customers profitably through targeted social media ads.",
    ctaText: "Schedule a free paid traffic assessment with our performance marketing team."
  },
  {
    slug: "social-media-management",
    aliases: ["social-management", "community-management"],
    title: "Social Media Management",
    shortDesc: "Creative content calendars, visual scheduling, and community engagement strategies to grow organic brand authority.",
    color: "text-indigo-600 bg-indigo-600/10",
    intro: "Build a vibrant, loyal community and expand your organic reach across Instagram, LinkedIn, X, and Facebook with consistent, high-value social media management.",
    detailedExplanation: "An active, authoritative social media presence builds trust and validates your business in the eyes of prospective clients. Mervox Dynamics handles your entire social media workflow—from strategic content planning and professional visual design to daily publishing, engagement, and audience growth.",
    whatWeOffer: [
      { title: "Monthly Content Calendar Strategy", desc: "Structured content themes aligned with your business milestones and promotional goals." },
      { title: "Custom Branded Graphic & Video Content", desc: "High-quality reels, carousels, infographics, and story assets crafted for engagement." },
      { title: "Captions & Hashtag Research", desc: "Persuasive copywriting and targeted hashtag strategies to expand discoverability." },
      { title: "Community Interaction & Moderation", desc: "Timely responses to comments, mentions, and direct messages to foster community trust." },
      { title: "Monthly Growth & Engagement Analytics", desc: "Detailed reporting on reach, follower growth, click-through rates, and best-performing posts." }
    ],
    benefits: [
      { title: "Consistent Brand Visibility", desc: "Stay in front of your audience every day without spending internal team hours." },
      { title: "Organic Brand Authority", desc: "High-quality educational and visual content positions your brand as an industry leader." },
      { title: "Higher Engagement & Loyalty", desc: "Build meaningful relationships with followers that turn into long-term brand advocates." },
      { title: "Time Freedom for Your Team", desc: "Free up your internal staff while your social channels grow on autopilot." }
    ],
    whyChooseUs: [
      { title: "Tailored to Your Industry", desc: "We study your niche to craft authentic content that speaks your audience's language." },
      { title: "Professional Aesthetic Standards", desc: "Every visual asset is designed by professional graphic artists, not low-effort templates." },
      { title: "Strategic Growth Focus", desc: "We focus on real engagement and lead generation rather than hollow vanity metrics." }
    ],
    ctaHeadline: "Grow your brand authority with professional social media management.",
    ctaText: "Let our social media strategists manage, design, and grow your channels today."
  },
  {
    slug: "virtual-assistant",
    aliases: ["virtual-assistant-services", "va-services"],
    title: "Virtual Assistant Services",
    shortDesc: "Administrative support operations, schedule management, and client inquiry handling to streamline your daily operations.",
    color: "text-teal-500 bg-teal-500/10",
    intro: "Delegate routine administrative tasks, client inquiries, scheduling, and data operations to dedicated, highly trained virtual assistants.",
    detailedExplanation: "Running a growing business requires your focus on high-leverage strategic decisions. Mervox Dynamics provides reliable, professional virtual assistant support to handle daily operations, calendar scheduling, customer support tickets, email management, and workflow coordination with precision.",
    whatWeOffer: [
      { title: "Email & Inbox Management", desc: "Organize incoming emails, prioritize critical messages, and filter spam." },
      { title: "Calendar & Appointment Scheduling", desc: "Coordinate meetings across time zones and manage client booking links." },
      { title: "Customer Support & Live Chat", desc: "Respond to customer inquiries, tickets, and FAQs with professionalism and speed." },
      { title: "Data Entry & Document Preparation", desc: "Maintain accurate CRM records, update spreadsheets, and format business presentations." },
      { title: "Research & Workflow Coordination", desc: "Conduct market research, gather lead lists, and coordinate supplier communications." }
    ],
    benefits: [
      { title: "Reclaim Valuable Hours", desc: "Save 15–20+ hours each week by delegating repetitive administrative tasks." },
      { title: "Faster Customer Response Times", desc: "Delight clients with prompt inquiry responses and reliable support availability." },
      { title: "Operational Efficiency", desc: "Keep schedules, customer databases, and files organized and up to date." },
      { title: "Flexible & Cost-Effective", desc: "Scale assistance up or down without the overhead of full-time in-house hires." }
    ],
    whyChooseUs: [
      { title: "Vetted & Trained Professionals", desc: "Our assistants undergo rigorous testing in communication, confidentiality, and tools." },
      { title: "Seamless Tool Integration", desc: "Proficient in Google Workspace, Microsoft 365, Slack, Notion, Asana, and CRMs." },
      { title: "Dedicated Oversight", desc: "Account managers ensure quality assurance and smooth workflow handoffs." }
    ],
    ctaHeadline: "Streamline your business operations with a dedicated virtual assistant.",
    ctaText: "Book a consultation to identify which tasks to delegate and get matched with the right assistant."
  },
  {
    slug: "promotion",
    aliases: ["brand-identity", "branding"],
    title: "Brand Identity & Promotion",
    shortDesc: "We help businesses create a professional image people can trust and remember across every touchpoint.",
    color: "text-rose-500 bg-rose-500/10",
    intro: "Define a distinctive, memorable brand identity with complete visual guidelines, voice positioning, typography systems, and promotional rollout strategies.",
    detailedExplanation: "Your brand identity is how the world perceives, remembers, and values your business. Mervox Dynamics develops cohesive brand identities that communicate your core values, evoke emotion, and build enduring consumer trust across all digital and physical touchpoints.",
    whatWeOffer: [
      { title: "Brand Strategy & Positioning", desc: "Define your unique value proposition, target customer persona, and market angle." },
      { title: "Complete Brand Style Guide", desc: "Comprehensive brand manuals defining color palettes, typography, spacing, and icon sets." },
      { title: "Logo Suites & Vector Assets", desc: "Primary logos, secondary marks, favicons, and monochrome formats for all mediums." },
      { title: "Brand Voice & Messaging Guidelines", desc: "Clear tone-of-voice frameworks for marketing copy, emails, and website text." },
      { title: "Launch & Promotion Rollout", desc: "Strategic launch campaigns and promotional creative kits to announce your brand." }
    ],
    benefits: [
      { title: "Instant Market Distinction", desc: "Differentiate your company clearly from generic competitors." },
      { title: "Command Premium Pricing", desc: "A polished, world-class brand identity elevates perceived value and client trust." },
      { title: "Seamless Team Consistency", desc: "Clear guidelines ensure all future marketing and design assets stay on-brand." },
      { title: "Long-Term Brand Equity", desc: "Build recognizable brand equity that grows in value alongside your business." }
    ],
    whyChooseUs: [
      { title: "Strategic Depth", desc: "We align aesthetic design with deep business positioning and competitive analysis." },
      { title: "Comprehensive Asset Delivery", desc: "Receive every file format (AI, EPS, SVG, PNG, PDF) ready for any use case." },
      { title: "End-to-End Execution", desc: "From concept sketching to live implementation across your website and socials." }
    ],
    ctaHeadline: "Build a memorable brand that commands authority.",
    ctaText: "Schedule a brand identity strategy session with our creative directors."
  },
  {
    slug: "business-brochure-design",
    aliases: ["brochure-design", "company-profile"],
    title: "Business Brochure & Profile Design",
    shortDesc: "We design professional brochures, company profiles, and business documents that showcase your business.",
    color: "text-teal-500 bg-teal-500/10",
    intro: "Showcase your company's capabilities, case studies, and service offerings with high-impact executive brochures, PDF presentations, and company profiles.",
    detailedExplanation: "When pitching to corporate clients, investors, or high-ticket prospects, professional documentation makes all the difference. Mervox Dynamics designs corporate profiles, product catalogs, service decks, and digital brochures with typography, layout grids, and brand aesthetics that close deals.",
    whatWeOffer: [
      { title: "Corporate Company Profiles", desc: "Structured multi-page profiles showcasing your mission, team, and capabilities." },
      { title: "Product & Service Catalogs", desc: "Clear, visually rich product guides with specifications, pricing tiers, and visuals." },
      { title: "Interactive Digital PDFs", desc: "Clickable PDFs with embedded hyperlinks, video buttons, and table of contents." },
      { title: "Print-Ready Layouts", desc: "Precise bleed, crop marks, and CMYK color profiles ready for commercial printing." },
      { title: "Case Study & Capability Sheets", desc: "Single and multi-page one-sheets designed for swift stakeholder reviews." }
    ],
    benefits: [
      { title: "Win High-Value Contracts", desc: "Impress enterprise decision-makers with corporate-grade documentation." },
      { title: "Clear Service Communication", desc: "Present complex service packages and technical features with visual clarity." },
      { title: "Multi-Purpose Marketing", desc: "Distribute digitally via email or print physically for conferences and meetings." },
      { title: "Timeless Brand Asset", desc: "A polished company profile serves as a core sales collateral piece for years." }
    ],
    whyChooseUs: [
      { title: "Executive Polish", desc: "We design with clean corporate aesthetics that appeal to high-level stakeholders." },
      { title: "Editorial Layout Expertise", desc: "Masterful typography, spacing hierarchy, and infographic data visualization." },
      { title: "Digital & Print Ready", desc: "Optimized both for lightweight email attachments and ultra-high-res physical prints." }
    ],
    ctaHeadline: "Showcase your company with a professional corporate brochure.",
    ctaText: "Let our editorial design team create an executive brochure or company profile for your business."
  }
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  const normalized = slug.toLowerCase().trim();
  return servicesData.find(
    (s) => s.slug === normalized || (s.aliases && s.aliases.includes(normalized))
  );
}
