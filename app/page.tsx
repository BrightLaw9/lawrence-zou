"use client"

import { useState, useEffect } from "react"
import "./page.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, GitPullRequest, Code, Wrench, Lightbulb, Music, Send } from "lucide-react"

interface CardData {
  text: string;
  cards?: any[];
  cardDirection?: string;
}

const chipData = [
  { icon: GitPullRequest, text: "Accomplishments in industry" },
  { icon: Code, text: "Projects" },
  { icon: Wrench, text: "Technologies I've tinkered with" },
  { icon: Lightbulb, text: "What resonates with me" },
  { icon: Music, text: "Hobbies" },
]

export default function PersonalWebsite() {
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [responseData, setResponseData] = useState<CardData | null>(null)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Simple, small Markdown-like formatter:
  // - escapes HTML
  // - supports code blocks (```), inline code (`), bold (**), italics (*), links [text](url)
  // - converts headings (#, ##, ###), unordered lists (- or *), paragraphs and line breaks
  const formatDisplayedText = (raw: string) => {
    if (!raw) return "";

    const escapeHtml = (str: string) =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

    let s = escapeHtml(raw);

    // Code blocks ```code```
    s = s.replace(/```([\s\S]*?)```/g, (_m, code) => `<pre class="rounded bg-[rgba(0,0,0,0.24)] p-3 overflow-auto"><code>${code}</code></pre>`);

    // Inline code `code`
    s = s.replace(/`([^`]+)`/g, (_m, code) => `<code class="rounded px-1 bg-[rgba(255,255,255,0.03)]">${code}</code>`);

    // Links [text](url) - allow only http(s) and mailto
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
      const safe = /^(https?:\/\/|mailto:)/i.test(url);
      if (!safe) return text;
      const href = url.replace(/"/g, '%22');
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="underline">${text}</a>`;
    });

    // Bold **text** and italic *text*
    s = s.replace(/\*\*([^*]+)\*\*/g, (_m, t) => `<strong>${t}</strong>`);
    s = s.replace(/\*([^*]+)\*/g, (_m, t) => `<em>${t}</em>`);

    // Now split into lines and build paragraphs/lists/headings
    const lines = s.split(/\r?\n/);
    let out = "";
    let inList = false;
    let paragraphLines: string[] = [];

    const flushParagraph = () => {
      if (paragraphLines.length) {
        out += `<p>${paragraphLines.join("<br/>")}</p>`;
        paragraphLines = [];
      }
    };

    for (let rawLine of lines) {
      const line = rawLine.trimEnd();
      if (/^#{1,6}\s+/.test(line)) {
        flushParagraph();
        if (inList) { out += "</ul>"; inList = false; }
        const m = line.match(/^(#{1,6})\s+(.*)$/)!;
        const level = Math.min(6, m[1].length);
        out += `<h${level}>${m[2]}</h${level}>`;
        continue;
      }

      const liMatch = line.match(/^[-*]\s+(.*)$/);
      if (liMatch) {
        flushParagraph();
        if (!inList) { out += "<ul class=\"list-disc pl-6\">"; inList = true; }
        out += `<li>${liMatch[1]}</li>`;
        continue;
      }

      if (line.trim() === "") {
        // blank line
        flushParagraph();
        if (inList) { out += "</ul>"; inList = false; }
        continue;
      }

      // regular paragraph line
      paragraphLines.push(line);
    }

    flushParagraph();
    if (inList) out += "</ul>";

    return out;
  };

  useEffect(() => {
  setMounted(true)
    if (responseData?.text && isTyping) {
      let index = 0
      const interval = setInterval(() => {
        if (index < responseData.text.length) {
          setDisplayedText(responseData.text.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [responseData?.text, isTyping])

  const handleSearch = async (inputValueParam: string = inputValue) => {
    if (!inputValueParam.trim()) return

    setIsSearching(true)
    setIsLoading(true)
    setInputValue("")
    setShowResults(false)
    setResponseData(null)
    setDisplayedText("")

    // Make API call
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: inputValueParam }),
    });

    if (!response.ok) {
      console.error("Error fetching OpenAI API:", response.statusText);
      setIsLoading(false);
      return;
    }

    var data = await response.json();

    if (typeof data === "string") { 
      data = JSON.parse(data);
    }
    console.log(data);
    setResponseData(data);
    setIsLoading(false);
    setIsTyping(true);
    setShowResults(true);
  }

  const handleChipClick = (chipText: string) => {
    setInputValue(chipText);
    handleSearch(chipText);
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* Background for non-searching state */}
      {!isSearching && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 opacity-20">
            <div className="diagonal-stripes-1" />
            <div className="diagonal-stripes-2" />
            <div className="diagonal-stripes-3" />
          </div>
        </div>
      )}

      {/* Background for searching state */}
      {isSearching && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 opacity-15">
            <div className="diagonal-stripes-search-1" />
            <div className="diagonal-stripes-search-2" />
            <div className="diagonal-stripes-search-3" />
          </div>
        </div>
      )}

       {/* Right-aligned nav/link - visible in both searching and non-searching states */}
        <div className="sm:absolute right-4 top-8 transform -translate-y-1/2 flex items-center gap-3">
          <a
            href="https://linkedin.com/in/lawrence-zou8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-200 hover:text-white transition"
          >
            LinkedIn
          </a>

          <a href="mailto:lawrencezou3s@gmail.com">
            <Button className="px-3 py-1">Let's Connect! <Send /></Button>
          </a>
        </div>

      {/* Main Content */}
      <div className="relative min-h-screen container flex flex-col z-10">
        {/* center container */}
        <div className={`mx-auto px-4 ${!isSearching ? 'flex flex-col items-center justify-center min-h-screen pb-4' : ''}`}>
          {/* Header */}
          <div
            className={`transition-all duration-700 ease-in-out ${
              isSearching
                ? "fixed top-4 left-1/2 transform -translate-x-1/2 z-30 px-4 py-2 w-full relative"
                : "pb-8 flex items-center justify-center w-full relative"
            }`}
          >
            <h1
              className={`transition-all duration-700 ease-in-out ${
                isSearching ? "text-2xl text-left" : "text-5xl md:text-6xl text-center"
              }`}
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Lawrence Zou
            </h1>
          </div>

          {/* Subtitle - only show when not searching */}
          {!isSearching && (
            <div className="text-center mb-12">
              <p className="text-xl md:text-2xl text-gray-300 mb-8" style={{ fontFamily: "var(--font-sans)" }}>
                Welcome! What would you like to learn about me?
              </p>
            </div>
          )}

          {/* Search Section */}
          <div
            className={`transition-all duration-700 ease-in-out ${
              isSearching
                ? "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full px-4"
                : "flex flex-col items-center justify-center max-w-2xl mx-auto px-4"
            }`}
          >
            {/* Input Field */}
            <div className="flex gap-4 w-full mb-6">
              {mounted ? (
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className={`flex-1 text-white placeholder-gray-300 transform transition-all duration-500 hover:scale-[1.02] focus:border-white/40 shadow-lg
                    ${!isLoading && showResults ? "hover:bg-[rgba(255,255,255,0.80)] focus:bg-[rgba(255,255,255,0.80)]" : ""}
                    ${
                      showResults
                        ? "backdrop-blur-[0.2px] hover:backdrop-blur-[6.8px] focus:backdrop-blur-[6.8px]"
                        : "backdrop-blur-[4.4px]"
                    }`}
                  style={{
                    fontFamily: "var(--font-sans)",
                    background: !isLoading && showResults ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.19)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              ) : (
                <div className="flex-1 h-9 rounded-md bg-transparent" />
              )}

              <Button
                onClick={() => handleSearch()}
                className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 p-3 shadow-lg backdrop-blur-md border border-white/20"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Chips - only show when not searching */}
            {!isSearching && (
              <div className="flex flex-wrap gap-3 justify-center">
                {chipData.map((chip, index) => {
                  const IconComponent = chip.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleChipClick(chip.text)}
                      className="flex items-center gap-2 px-4 py-2 hover:scale-105 rounded-full transition-all duration-200 text-sm shadow-lg text-gray-100 hover:text-white font-medium"
                      style={{
                        fontFamily: "var(--font-sans)",
                        background: "rgba(255, 255, 255, 0.25)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(4.4px)",
                        WebkitBackdropFilter: "blur(4.4px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{chip.text}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-40">
            <div className="bouncing-ball"></div>
          </div>
        )}

        {/* Results */}
        {showResults && !isLoading && responseData && (
          // outer fixed full-width container holds the scrollbar at the viewport right;
          // horizontal overflow is visible so hovering cards can expand outside the centered content without creating a horizontal scrollbar
          <div className={`fixed top-[72px] left-0 right-0 bottom-[120px] z-20 overflow-y-auto overflow-x-visible results-scrollbar`}>
            <div className="w-full mx-auto px-4">
              {responseData.text && (
                <div className={`mt-6 mb-4 w-full results-scroll-padding`}>
                  <div
                    className="prose prose-invert text-lg text-gray-200 leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                    dangerouslySetInnerHTML={{ __html: formatDisplayedText(displayedText) }}
                  />
                </div>
              )}

              {responseData.cards && responseData.cards.length > 0 && (
                <>
                  {responseData.cardDirection === "horizontal" ? (
                    <div className="space-y-4 w-full">
                      {responseData.cards.map((card, index) => (
                        <Card
                          key={index}
                          className="hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl opacity-0"
                          style={{
                            background:
                              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.08) 60%, rgba(255, 255, 255, 0.02) 100%)",
                            borderRadius: "16px",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                            backdropFilter: "blur(4.4px)",
                            WebkitBackdropFilter: "blur(4.4px)",
                            border: "1px solid rgba(255, 255, 255, 0.14)",
                            animation: `slideInFromBottom 1s ease-out ${4 + index * 1}s forwards`,
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex gap-6 items-start">
                              <img
                                src={card.image || "/placeholder.svg"}
                                alt={card.title}
                                className="w-32 h-24 object-cover rounded shadow-md flex-shrink-0"
                              />
                              <div className="flex-1">
                                <h3
                                  className="text-xl font-semibold mb-3 text-white"
                                  style={{
                                    fontFamily: "var(--font-serif)",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {card.title}
                                </h3>
                                <p
                                  className="text-gray-200 mb-4 text-sm leading-relaxed"
                                  style={{ fontFamily: "var(--font-sans)" }}
                                >
                                  {card.description}
                                </p>
                                <a
                                  href={card.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-full"
                                  style={{
                                    fontFamily: "var(--font-sans)",
                                    background: "rgba(255, 255, 255, 0.15)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                  }}
                                >
                                  {card.linkText}
                                  <ArrowRight className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                      {responseData.cards.map((card, index) => (
                        <Card
                          key={index}
                          className="hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl h-80 opacity-0"
                          style={{
                            background:
                              "radial-gradient(circle at center, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.08) 60%, rgba(255, 255, 255, 0.02) 100%)",
                            borderRadius: "16px",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                            backdropFilter: "blur(4.4px)",
                            WebkitBackdropFilter: "blur(4.4px)",
                            border: "1px solid rgba(255, 255, 255, 0.14)",
                            animation: `slideInFromScreenRight 1s ease-out ${2 + index * 1}s forwards`,
                          }}
                        >
                          <CardContent className="p-4">
                            <img
                              src={card.image || "/placeholder.svg"}
                              alt={card.title}
                              className="w-full h-24 object-cover rounded mb-3 shadow-md"
                            />
                            <h3
                              className="text-lg font-semibold mb-2 text-white"
                              style={{
                                fontFamily: "var(--font-serif)",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {card.title}
                            </h3>
                            <p
                              className="text-gray-200 mb-3 text-sm leading-relaxed"
                              style={{ fontFamily: "var(--font-sans)" }}
                            >
                              {card.description}
                            </p>
                            <a
                              href={card.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-full"
                              style={{
                                fontFamily: "var(--font-sans)",
                                background: "rgba(255, 255, 255, 0.15)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                              }}
                            >
                              {card.linkText}
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
  )}
      </div>
    </div>
  )
}
