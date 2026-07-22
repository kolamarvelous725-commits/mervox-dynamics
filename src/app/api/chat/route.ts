import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    const apiKey = process.env.GEMINI_API_KEY;

    // Check for handoff requests in the user message
    const textLower = lastMessage.toLowerCase().trim();
    const isHandoff =
      textLower.includes("human") ||
      textLower.includes("person") ||
      textLower.includes("owner") ||
      textLower.includes("contact the team") ||
      textLower.includes("chat with the owner") ||
      textLower.includes("speak to someone") ||
      textLower.includes("get personal assistance") ||
      textLower.includes("real person") ||
      textLower.includes("whatsapp") ||
      textLower.includes("talk to a human") ||
      textLower.includes("connect me") ||
      textLower.includes("talk to someone");

    if (isHandoff) {
      return NextResponse.json({
        content: "Of course! 👋 I'll connect you with the Mervox Dynamics team. You can continue the conversation with us directly on WhatsApp.",
        handoff: true,
      });
    }

    if (!apiKey) {
      // Local smart response generator if API key is not configured
      const reply = getLocalResponse(textLower, messages);
      const requiresHandoff = reply.includes("connect you with someone from the Mervox Dynamics team");
      return NextResponse.json({
        content: reply,
        handoff: false, // Do not trigger whatsapp link directly; the frontend will show the Yes/No prompt for this
        triggerHandoffPrompt: requiresHandoff // special flag for frontend to show Yes/No buttons
      });
    }

    // Prepare system instructions and prompt
    const systemPrompt = `You are "Mervox AI" (also known as Mervox Dynamics AI Assistant), the premium digital assistant for Mervox Dynamics.
Mervox Dynamics is a premium digital studio/agency specializing in state-of-the-art digital craftsmanship (web design, web development, brand identity, digital marketing, SEO, social media management, virtual assistant services).

Company Background & Info:
- Experience: 6+ years of industry experience, 180+ clients helped, 99% success rate.
- Services Offered:
  1. Web Design & Development (modern, responsive websites built to convert and scale using Next.js and Tailwind CSS)
  2. E-Commerce Development (high-performing online stores driving digital sales)
  3. Branding & Identity (bespoke designs and visual identities that make brands memorable)
  4. Digital Marketing (strategic campaigns to bring traffic and generate qualified leads)
  5. Social Media Management (growing audience engagement and consistent content scheduling)
  6. SEO & Performance Optimization (faster load times, search engine rank audits)
  7. Graphics Design (logo packages, banners, and digital graphics)
  8. Virtual Assistant Services (administration, email handling, scheduling, customer support)
- Development Process (Workflow Path):
  1. Discovery (research, competitor audits, and persona requirements)
  2. Strategy (tech stack selection, site architectures, and project milestones)
  3. Design (bespoke high-end UI/UX designs)
  4. Development (clean TypeScript/Next.js/Tailwind code)
  5. Launch (quality checks, speed optimization, and deployment to production)
  6. Growth (marketing campaign audits, email funnels, and data analytics refinement)

Tone & Rules:
- Maintain a friendly, professional, helpful, and natural tone.
- Keep answers concise and to the point (preferably under 3-4 sentences).
- Avoid robotic responses. Do not answer every message with: "Thank you for your question."
- DO NOT output any WhatsApp links, phone numbers, or raw URLs in your responses.
- If a question is unrelated to Mervox Dynamics or outside your knowledge, respond with exactly: "I'm not completely sure about that, but I can connect you with someone from the Mervox Dynamics team who can give you the right answer."
- If the user explicitly asks for human contact, to speak with the owner, support, or personal help, let them know you'll connect them and the system will provide the option.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const body = {
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      }
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API request failed:", errText);
      const reply = getLocalResponse(textLower, messages);
      const requiresHandoff = reply.includes("connect you with someone from the Mervox Dynamics team");
      return NextResponse.json({
        content: reply,
        handoff: false,
        triggerHandoffPrompt: requiresHandoff
      });
    }

    const data = await res.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!botReply) {
      const reply = getLocalResponse(textLower, messages);
      const requiresHandoff = reply.includes("connect you with someone from the Mervox Dynamics team");
      return NextResponse.json({
        content: reply,
        handoff: false,
        triggerHandoffPrompt: requiresHandoff
      });
    }

    const botReplyLower = botReply.toLowerCase();
    const requiresHandoffPrompt = botReplyLower.includes("not completely sure about that") || botReplyLower.includes("connect you with someone from the mervox dynamics team");

    return NextResponse.json({
      content: botReply,
      handoff: false, // The frontend will handle whether to show WhatsApp link via triggerHandoffPrompt or user selection
      triggerHandoffPrompt: requiresHandoffPrompt
    });
  } catch (error) {
    console.error("Chat API handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getLocalResponse(text: string, history: any[] = []): string {
  const textClean = text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

  // 1. Greetings
  if (["hi", "hello", "hey", "yo", "sup", "greetings"].includes(textClean)) {
    return "Hi! 👋 Welcome to Mervox Dynamics. I'm Mervox AI, your digital assistant. How can I help you today?";
  }
  if (textClean === "good morning") {
    return "Good morning! ☀️ Welcome to Mervox Dynamics. How can I help you today?";
  }
  if (textClean === "good afternoon") {
    return "Good afternoon! ☀️ Welcome to Mervox Dynamics. How can I help you today?";
  }
  if (textClean === "good evening") {
    return "Good evening! 🌙 Welcome to Mervox Dynamics. How can I help you today?";
  }
  if (textClean === "how are you" || textClean === "how are you doing") {
    return "I'm doing great, thanks for asking! 😊 I'm here to help you learn more about Mervox Dynamics and our digital services. What would you like to know?";
  }
  if (["thanks", "thank you", "thank you so much", "ty"].includes(textClean)) {
    return "You're very welcome! 😊 Let me know if you have any other questions about our services.";
  }
  if (["bye", "goodbye", "see ya"].includes(textClean)) {
    return "Goodbye! 👋 Have a wonderful day, and feel free to reach back out if you ever need premium digital services!";
  }

  // 2. Check for Contextual Conversation History
  const assistantMessages = history.filter((m: any) => m.role === "assistant");
  const lastBotMsg = assistantMessages[assistantMessages.length - 1]?.content.toLowerCase() || "";
  const askedAboutBusiness = lastBotMsg.includes("what type of business") || lastBotMsg.includes("what kind of business");

  if (askedAboutBusiness) {
    if (
      textClean.includes("clothing") ||
      textClean.includes("clothes") ||
      textClean.includes("fashion") ||
      textClean.includes("boutique") ||
      textClean.includes("apparel") ||
      textClean.includes("wear") ||
      textClean.includes("sell clothes")
    ) {
      return "That sounds great! For a clothing business, we could create an attractive website or online store where customers can explore your products and place orders. Would you like to tell me more about what you have in mind?";
    }
    if (
      textClean.includes("restaurant") ||
      textClean.includes("food") ||
      textClean.includes("cafe") ||
      textClean.includes("bakery") ||
      textClean.includes("catering")
    ) {
      return "Delicious! 🍔 For a food business, a modern website with a digital menu, reservation system, or online ordering would be perfect. What features are you looking to include?";
    }
    if (
      textClean.includes("agency") ||
      textClean.includes("consulting") ||
      textClean.includes("coach") ||
      textClean.includes("service")
    ) {
      return "Excellent! A service-based business benefits greatly from a clean portfolio, client testimonials, and an automated booking system to schedule appointments. Would you like to see some of our design ideas?";
    }
    return "That sounds like an exciting project! Mervox Dynamics specializes in custom designs and high-performance development tailored to your industry. Would you like to tell me more about what you have in mind?";
  }

  // 3. General business matching
  if (
    textClean.includes("what does your company do") ||
    textClean.includes("what do you do") ||
    textClean.includes("company do") ||
    textClean.includes("who are you")
  ) {
    return "Mervox Dynamics is a premium digital agency specializing in state-of-the-art digital craftsmanship. We collaborate with forward-thinking brands to design and build high-performance solutions. What are you looking to build or grow?";
  }

  if (
    textClean.includes("online store") ||
    textClean.includes("build an online store") ||
    textClean.includes("e-commerce") ||
    textClean.includes("ecom") ||
    textClean.includes("store")
  ) {
    return "Yes, we build high-performing online stores driving digital sales with fast loading times, premium checkout layouts, responsive product catalogs, and secure payment integrations. What type of products do you sell?";
  }

  if (
    textClean.includes("businesses do you work with") ||
    textClean.includes("what kind of businesses") ||
    textClean.includes("work with")
  ) {
    return "We work with a wide range of businesses, including e-commerce brands, fashion lines, local services, tech startups, consultancies, and forward-thinking creators looking for premium digital representation. What type of business do you run?";
  }

  if (
    textClean.includes("how long does it take") ||
    textClean.includes("how long to build") ||
    textClean.includes("timeline") ||
    textClean.includes("take to build a website")
  ) {
    return "Typically, a custom website project takes between 2 to 4 weeks depending on the complexity, features, and revisions. We focus on premium quality and speed optimization. Do you have a specific target launch date?";
  }

  if (
    textClean.includes("do you do marketing") ||
    textClean.includes("marketing") ||
    textClean.includes("smm") ||
    textClean.includes("social media") ||
    textClean.includes("ads") ||
    textClean.includes("seo")
  ) {
    return "Yes! We offer digital marketing, search engine optimization (SEO), social media management, and email funnels to drive qualified traffic and help your business scale. Are you looking to improve your search ranking or run advertising campaigns?";
  }

  if (
    textClean.includes("start a business") ||
    textClean.includes("don't know what website") ||
    textClean.includes("don't know what") ||
    textClean.includes("start")
  ) {
    return "Starting a business is an exciting journey! 🚀 Depending on your model, you might need a simple landing page to generate leads, a professional portfolio site to build trust, or a full e-commerce store to sell products. What is your business concept?";
  }

  if (
    textClean.includes("website") ||
    textClean.includes("i want a website") ||
    textClean.includes("i need a website") ||
    textClean.includes("web site")
  ) {
    return "Absolutely! What type of business or project is the website for?";
  }

  if (
    textClean.includes("cost") ||
    textClean.includes("price") ||
    textClean.includes("pricing") ||
    textClean.includes("how much")
  ) {
    return "Since every project is custom-tailored to your unique business goals, pricing depends on the specific scope and features. We'd love to discuss your budget and requirements. Would you like to connect with someone from our team to get a quote?";
  }

  if (
    textClean.includes("experience") ||
    textClean.includes("years") ||
    textClean.includes("clients")
  ) {
    return "Mervox Dynamics has over 6 years of experience helping over 180 clients build, deploy, and scale high-performance digital products with a 99% success rate.";
  }

  if (
    textClean.includes("graphics") ||
    textClean.includes("branding") ||
    textClean.includes("logo") ||
    textClean.includes("identity")
  ) {
    return "We provide premium branding, custom logos, visual assets, and UI styles to establish a strong, unified digital identity for your business.";
  }

  if (
    textClean.includes("virtual assistant") ||
    textClean.includes("va ") ||
    textClean.includes("assistant")
  ) {
    return "Yes, we offer professional Virtual Assistant (VA) services, assisting you with administration tasks, scheduling, support, and day-to-day operations.";
  }

  if (
    textClean.includes("process") ||
    textClean.includes("workflow") ||
    textClean.includes("how it works")
  ) {
    return "Our workflow path includes 6 stages: 1. Discovery (research), 2. Strategy (tech stack & milestones), 3. Design (UI/UX design mockups), 4. Development (clean code), 5. Launch (speed optimization), and 6. Growth (ongoing marketing & data refinements).";
  }

  // 4. Default Unknown Response (triggers frontend handoff offer)
  return "I'm not completely sure about that, but I can connect you with someone from the Mervox Dynamics team who can give you the right answer.";
}
