"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, MessageCircle, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isHandoff?: boolean;
  showHandoffPrompt?: boolean;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi 👋 I'm Mervox AI, your Mervox Dynamics digital assistant. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHandoffBanner, setShowHandoffBanner] = useState(false);
  const [meaningfulCount, setMeaningfulCount] = useState(0);
  const [hasOfferedHandoff, setHasOfferedHandoff] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What services do you offer?",
    "I need a website",
    "I need digital marketing",
    "I want an online store",
    "How much do your services cost?",
    "I want to talk to a human",
  ];

  // Auto-scroll to the bottom of the chat history when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Close chat on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isMeaningfulMessage = (content: string): boolean => {
    const clean = content.trim().toLowerCase();
    const simpleGreetings = [
      "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
      "thanks", "thank you", "ty", "bye", "goodbye", "how are you", "how's it going",
      "sup", "yo", "fine", "ok", "okay", "yes", "no"
    ];
    if (simpleGreetings.includes(clean)) return false;
    if (clean.length < 3) return false;
    return true;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Check if there's any active handoff prompt in the last message, and hide its buttons
    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].showHandoffPrompt) {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          showHandoffPrompt: false,
        };
        return updated;
      }
      return prev;
    });

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];

    // Determine if user message is meaningful
    let nextMeaningfulCount = meaningfulCount;
    if (isMeaningfulMessage(textToSend)) {
      nextMeaningfulCount = meaningfulCount + 1;
      setMeaningfulCount(nextMeaningfulCount);
    }

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = await response.json();

      let botContent = data.content;
      let shouldShowHandoffPrompt = false;

      // Ask for human handoff after the 2nd meaningful message, or if specifically triggered
      if (
        (nextMeaningfulCount === 2 && !hasOfferedHandoff) ||
        data.triggerHandoffPrompt
      ) {
        if (!hasOfferedHandoff) {
          botContent += "\n\nBy the way, would you like to continue chatting with me, or would you prefer to speak directly with someone from the Mervox Dynamics team?";
          shouldShowHandoffPrompt = true;
        }
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: botContent,
        isHandoff: data.handoff,
        showHandoffPrompt: shouldShowHandoffPrompt,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (data.handoff) {
        setShowHandoffBanner(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to the server. Let me connect you directly with the team on WhatsApp!",
          isHandoff: true,
        },
      ]);
      setShowHandoffBanner(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHandoff = (connect: boolean) => {
    // 1. Remove the prompt buttons from the current message
    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          showHandoffPrompt: false,
        };
      }
      return updated;
    });

    setHasOfferedHandoff(true);

    if (connect) {
      // User chose Yes, connect me
      const userMsg: Message = { role: "user", content: "Yes, connect me" };
      const botMsg: Message = {
        role: "assistant",
        content: "Absolutely! 👋 I'll connect you with the Mervox Dynamics team. You can continue the conversation with us directly on WhatsApp.",
        isHandoff: true,
      };
      setMessages((prev) => [...prev, userMsg, botMsg]);
      setShowHandoffBanner(true);
    } else {
      // User chose No, continue chatting
      const userMsg: Message = { role: "user", content: "No, continue chatting" };
      const botMsg: Message = {
        role: "assistant",
        content: "No problem! 😊 Let's continue. What else would you like to know?",
      };
      setMessages((prev) => [...prev, userMsg, botMsg]);
    }
  };

  const handleRestartConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi 👋 I'm Mervox AI, your Mervox Dynamics digital assistant. How can I help you today?",
      },
    ]);
    setShowHandoffBanner(false);
    setMeaningfulCount(0);
    setHasOfferedHandoff(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {(!isOpen || typeof window !== "undefined" && window.innerWidth >= 640) && (
          <motion.button
            key="chat-fab"
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="fixed bottom-6 right-6 z-45 sm:bottom-8 sm:right-8 w-14 h-14 bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-full shadow-[0_6px_24px_rgba(0,85,255,0.3)] hover:shadow-[0_8px_30px_rgba(0,85,255,0.45)] flex items-center justify-center cursor-pointer transition-colors duration-300"
            aria-label="Toggle Mervox AI Chatbot"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            {/* Subtle pulse ring */}
            <span className="absolute inset-0 rounded-full border border-[#0055ff] animate-ping opacity-20 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-4 left-auto z-40 w-[320px] max-w-[calc(100vw-2rem)] h-[400px] max-h-[60vh] sm:w-[380px] sm:h-[calc(100vh-9rem)] sm:max-h-[500px] sm:bottom-20 sm:right-8 rounded-[24px] bg-card border border-card-border/60 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0055ff] text-white px-5 py-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                  <Bot className="w-4.5 h-4.5 text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0055ff] rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-extrabold tracking-wide">Mervox AI</h4>
                  <p className="text-[10px] text-white/80 font-medium">Digital Assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 text-white/95 hover:text-white transition-all duration-200 cursor-pointer relative z-50 shrink-0 sm:hidden"
                aria-label="Close Chat"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Restart/Continue Banner */}
            {showHandoffBanner && (
              <div className="bg-[#0055ff]/10 dark:bg-blue-500/10 border-b border-card-border/50 px-4 py-2.5 flex items-center justify-between text-xs gap-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Chat with a human or restart?
                </span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleRestartConversation}
                    className="px-2.5 py-1.5 bg-[#0055ff] hover:bg-[#0044dd] text-white font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Start Fresh
                  </button>
                  <button
                    onClick={() => setShowHandoffBanner(false)}
                    className="px-2.5 py-1.5 border border-card-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Chat History Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-card/25 scrollbar-thin">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl whitespace-pre-line text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-[#0055ff] text-white rounded-tr-sm shadow-sm"
                        : "bg-muted text-foreground rounded-tl-sm border border-card-border/50 shadow-xs"
                    }`}
                  >
                    {message.content}

                    {/* Render WhatsApp button if marked as handoff */}
                    {message.isHandoff && (
                      <a
                        href="https://wa.me/2348112769033"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3.5 flex items-center justify-center gap-2 w-full px-5 py-3 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md cursor-pointer select-none"
                      >
                        <MessageCircle className="w-4 h-4 fill-white/10 shrink-0" />
                        <span className="text-xs">Chat with Mervox Dynamics on WhatsApp</span>
                      </a>
                    )}

                    {/* Render Handoff buttons if prompt is active */}
                    {message.showHandoffPrompt && index === messages.length - 1 && (
                      <div className="mt-4 flex flex-col sm:flex-row gap-2.5 w-full">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectHandoff(true);
                          }}
                          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white font-bold text-xs rounded-xl shadow-[0_2px_8px_rgba(0,85,255,0.2)] hover:shadow-[0_4px_12px_rgba(0,85,255,0.3)] transition-all duration-200 cursor-pointer text-center"
                        >
                          Yes, connect me
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectHandoff(false);
                          }}
                          className="flex-1 flex items-center justify-center px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all duration-200 cursor-pointer text-center"
                        >
                          No, continue chatting
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loader/Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 bg-muted border border-card-border/50 px-4 py-3 rounded-2xl rounded-tl-sm w-fit max-w-[85%] shadow-xs">
                  <div className="flex gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}

              {/* Quick Questions on First Load */}
              {messages.length === 1 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
                    Frequently Asked
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="text-left text-xs font-semibold px-4 py-2.5 rounded-xl border border-card-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#0055ff]/35 dark:hover:border-blue-500/35 text-foreground transition-all duration-200 cursor-pointer shadow-xs"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 border-t border-card-border/50 flex items-center gap-2 bg-card relative z-10"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Mervox AI a question..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-card-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0055ff]/40 text-left transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 bg-[#0055ff] hover:bg-[#0044dd] disabled:opacity-40 text-white rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
