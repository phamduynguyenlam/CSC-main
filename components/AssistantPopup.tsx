import React, { useState, useRef, useEffect } from 'react';
import { LightbulbIcon, LogoIcon } from './icons/Icons';
import { getAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

// The type for chat history expected by the Gemini API
type Content = {
    role: 'user' | 'model';
    parts: { text: string }[];
};

const AssistantPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            sender: 'ai',
            text: "Hello! I'm Insight, your CX assistant. Ask me to generate a SWOT analysis, summarize feedback, or explain market trends."
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Convert message history to API format
        const apiHistory: Content[] = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
        const companyContext = {
            policies: [
                "Refunds are issued only for missing or damaged items verified within 24 hours of delivery.",
                "Customers can update or cancel an order up to one hour before the shopper begins shopping.",
                "Substitutions must be approved by the customer via the app before checkout.",
                "Instacart support representatives should prioritize polite acknowledgment and quick resolution of shopper-related issues.",
                "Delivery delays over 30 minutes require proactive customer communication.",
                "Never share shopper or customer personal information outside the chat system."
            ],
            products: [
                "Groceries",
                "Fresh produce",
                "Beverages",
                "Household essentials",
                "Personal care items",
                "Pharmacy products",
                "Pet supplies",
                "Same-day delivery service"
            ],
            commonIssues: [
                "Missing or substituted items",
                "Late or delayed delivery",
                "Refund or credit requests",
                "Rude shopper or poor communication",
                "Wrong address or delivery mix-ups",
                "App not updating order status",
                "Customer confused about tip or fees",
                "Payment declined or double-charged"
            ]
        };

        const responseText = await getAssistantResponse("Provide 3 suggestions for a call agent to respond to this customer based on what they are saying and what the company is and what it's policies are.", apiHistory, companyContext);
        const aiMessage: ChatMessage = { sender: 'ai', text: responseText };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };
    
    const renderMessageContent = (text: string) => {
        const parseInlineMarkdown = (inlineText: string) => {
            // Regex to find **bold**, *italic*, ~~strikethrough~~, or `code`.
            // Non-greedy and avoids nesting issues for this simple parser.
            const markdownRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|`[^`]+`)/g;
            const parts = inlineText.split(markdownRegex).filter(Boolean);

            return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i}>{part.slice(1, -1)}</em>;
                }
                if (part.startsWith('~~') && part.endsWith('~~')) {
                    return <del key={i}>{part.slice(2, -2)}</del>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={i} className="bg-bg-tertiary text-accent-teal px-1 py-0.5 rounded text-sm">{part.slice(1, -1)}</code>;
                }
                return part;
            });
        };

        const lines = text.split('\n');
        const elements = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();
            const orderedListRegex = /^\d+\.\s/;
            const unorderedListRegex = /^[-*]\s/;

            if (unorderedListRegex.test(line)) {
                const listItems = [];
                // Group consecutive unordered list items
                while (i < lines.length && unorderedListRegex.test(lines[i].trim())) {
                    const content = lines[i].trim().substring(2);
                    listItems.push(<li key={i} className="ml-5 list-disc">{parseInlineMarkdown(content)}</li>);
                    i++;
                }
                elements.push(<ul key={`ul-${i}`} className="my-2 space-y-1">{listItems}</ul>);
                continue;
            }

            if (orderedListRegex.test(line)) {
                const listItems = [];
                // Group consecutive ordered list items
                while (i < lines.length && orderedListRegex.test(lines[i].trim())) {
                    const content = lines[i].trim().replace(orderedListRegex, '');
                    listItems.push(<li key={i} className="ml-5 list-decimal">{parseInlineMarkdown(content)}</li>);
                    i++;
                }
                elements.push(<ol key={`ol-${i}`} className="my-2 space-y-1">{listItems}</ol>);
                continue;
            }

            // Handle headings (full-line bold)
            if (line.startsWith('**') && line.endsWith('**')) {
                const cleanText = line.slice(2, -2).trim();
                elements.push(<p key={i} className="font-bold my-2">{cleanText}</p>);
            } else if (line !== '') { // Handle paragraphs
                elements.push(<p key={i} className="my-1">{parseInlineMarkdown(line)}</p>);
            }
            
            i++;
        }

        return elements;
    };


    const popupClasses = `
        fixed bottom-20 right-4 md:right-8
        w-[calc(100%-2rem)] max-w-md
        h-[70vh] max-h-[500px]
        bg-bg-secondary border border-bg-tertiary/50 rounded-2xl shadow-xl
        flex flex-col
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
    `;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 md:right-8 z-50 w-14 h-14 bg-brand-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-brand-secondary transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-brand-primary/50"
                aria-label="Toggle AI Assistant"
            >
                <LightbulbIcon className="w-7 h-7" />
            </button>

            <div className={popupClasses} style={{ zIndex: 40 }}>
                {/* Header */}
                <div className="flex items-center p-4 border-b border-bg-tertiary/50 flex-shrink-0">
                    <LogoIcon className="w-6 h-6 text-brand-secondary" />
                    <h3 className="ml-3 text-lg font-bold text-text-primary">Insight Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="ml-auto text-text-secondary hover:text-text-primary text-2xl font-bold">&times;</button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center flex-shrink-0"><LogoIcon className="w-5 h-5 text-brand-secondary"/></div>}
                            <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-bg-tertiary text-text-primary rounded-bl-none'}`}>
                                {renderMessageContent(msg.text)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center flex-shrink-0"><LogoIcon className="w-5 h-5 text-brand-secondary"/></div>
                            <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-bg-tertiary text-text-primary rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-bg-tertiary/50 flex-shrink-0">
                    <div className="flex items-center bg-bg-tertiary rounded-lg">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-transparent px-4 py-2 focus:outline-none text-text-primary"
                            disabled={isLoading}
                        />
                        <button type="submit" className="p-2 text-brand-primary disabled:text-text-secondary/50" disabled={isLoading || !input.trim()}>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AssistantPopup;