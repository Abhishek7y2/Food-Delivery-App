import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../service/aiService";
import "./ChatBot.css";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "👋 Hi! I'm Foodie Bot — your personal food & health assistant!\n\nTell me your mood, health goal, or craving and I'll suggest the perfect dish from our menu! 🍛",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (overrideText) => {
        const userMessage = (overrideText || input).trim();
        if (!userMessage || loading) return;

        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setInput("");
        setLoading(true);

        try {
            const data = await sendChatMessage(userMessage);

            // Main AI reply
            let botText = data?.reply || "🍽️ Let me check our menu for you!";

            // Append recommended food chips if present
            if (data?.recommendedFoods?.length > 0) {
                botText +=
                    "\n\n🍴 Available on our menu:\n" +
                    data.recommendedFoods.map((f) => `• ${f}`).join("\n");
            }

            setMessages((prev) => [...prev, { role: "bot", text: botText }]);
        } catch (error) {
            console.error("Foodie Bot Error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Unknown error";
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: `⚠️ Oops! I ran into an issue: ${errorMsg}`,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    const clearChat = () => {
        setMessages([
            {
                role: "bot",
                text: "👋 Chat cleared! What are you craving today? 🍽️",
            },
        ]);
    };

    const suggestions = [
        "What should I eat today?",
        "Low calorie meals 🥗",
        "High protein food 💪",
        "Something spicy 🌶️",
        "Veg food under ₹200",
        "Best for weight loss",
    ];

    return (
        <>
            {/* Floating Action Button */}
            <div
                className={`chatbot-fab ${isOpen ? "chatbot-fab--active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <span className="chatbot-fab__close">✕</span>
                ) : (
                    <span className="chatbot-fab__icon">🍽️</span>
                )}
                {!isOpen && <span className="chatbot-fab__pulse"></span>}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">

                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header__info">
                            <div className="chatbot-header__avatar">🤖</div>
                            <div>
                                <p className="chatbot-header__name">Foodie Bot 🍴</p>
                                <p className="chatbot-header__status">
                                    ● Powered by Gemini
                                </p>
                            </div>
                        </div>
                        <div className="chatbot-header__actions">
                            <button
                                className="chatbot-header__btn"
                                onClick={clearChat}
                                title="Clear chat"
                            >
                                🗑️
                            </button>
                            <button
                                className="chatbot-header__btn"
                                onClick={() => setIsOpen(false)}
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Suggestion Pills */}
                    <div className="chatbot-suggestions">
                        {suggestions.map((item) => (
                            <button
                                key={item}
                                className="chatbot-pill"
                                onClick={() => sendMessage(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chatbot-msg chatbot-msg--${msg.role}`}
                            >
                                {msg.role === "bot" && (
                                    <span className="chatbot-msg__avatar">🤖</span>
                                )}
                                <div
                                    className="chatbot-msg__bubble"
                                    dangerouslySetInnerHTML={{
                                        __html: msg.text
                                            .replace(/\n/g, "<br>")
                                            .replace(
                                                /\*\*(.*?)\*\*/g,
                                                "<strong>$1</strong>"
                                            )
                                            .replace(
                                                /\*(.*?)\*/g,
                                                "<em>$1</em>"
                                            ),
                                    }}
                                />
                                {msg.role === "user" && (
                                    <span className="chatbot-msg__avatar">👤</span>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {loading && (
                            <div className="chatbot-msg chatbot-msg--bot">
                                <span className="chatbot-msg__avatar">🤖</span>
                                <div className="chatbot-msg__bubble chatbot-msg__bubble--typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef}></div>
                    </div>

                    {/* Input Area */}
                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Ask about food or health..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="chatbot-input__field"
                            disabled={loading}
                        />
                        <button
                            className="chatbot-input__send"
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                        >
                            {loading ? "..." : "➤"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;










// import React, { useState, useRef, useEffect } from "react";
// import "./ChatBot.css";

// const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
// const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";
// const API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

// const SYSTEM_PROMPT = `You are Foodie Bot, a friendly food and health assistant for "Foodies" — a popular Indian food delivery app.
// Help users decide what to eat based on their health goals, mood, or cravings.
// Always suggest from these categories: Biryani, Burger, Pizza, Salad, Rolls, Cake, Ice Cream, Thali, Dosa, Noodles.
// Keep answers short (2-3 sentences), warm, and fun with emojis 🍛🥗🍕.
// Always end with: "Want to explore our menu? 😊"
// Never suggest alcohol or tobacco.`;

// const buildPrompt = (history, userMessage) => {
//     let prompt = `<s>[INST] ${SYSTEM_PROMPT} [/INST] Sure! I'm Foodie Bot, happy to help you find the perfect meal! 😊 </s>`;
    
//     history.forEach(({ role, content }) => {
//         if (role === "user") {
//             prompt += `[INST] ${content} [/INST] `;
//         } else {
//             prompt += `${content} </s>`;
//         }
//     });

//     prompt += `[INST] ${userMessage} [/INST]`;
//     return prompt;
// };

// const ChatBot = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([
//         {
//             role: "bot",
//             text: "👋 Hi! I'm Foodie Bot — your personal food & health assistant!\n\nTell me your mood, health goal, or craving and I'll suggest the perfect dish! 🍛",
//         },
//     ]);
//     const [conversationHistory, setConversationHistory] = useState([]);
//     const [input, setInput] = useState("");
//     const [loading, setLoading] = useState(false);
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const sendMessage = async (overrideText) => {
//         const userMessage = (overrideText || input).trim();
//         if (!userMessage || loading) return;

//         const newHistory = [
//             ...conversationHistory,
//             { role: "user", content: userMessage },
//         ];

//         setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
//         setConversationHistory(newHistory);
//         setInput("");
//         setLoading(true);

//         try {
//             const prompt = buildPrompt(conversationHistory, userMessage);

//             const response = await fetch(API_URL, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${HF_TOKEN}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     inputs: prompt,
//                     parameters: {
//                         max_new_tokens: 200,
//                         temperature: 0.7,
//                         top_p: 0.95,
//                         do_sample: true,
//                         return_full_text: false,
//                         stop: ["[INST]", "</s>"],
//                     },
//                 }),
//             });

//             // Handle model loading (cold start)
//             if (response.status === 503) {
//                 const errData = await response.json();
//                 if (errData?.error?.includes("loading")) {
//                     setMessages((prev) => [
//                         ...prev,
//                         {
//                             role: "bot",
//                             text: "⏳ The AI is warming up (first load takes ~20 seconds). Please try again in a moment!",
//                         },
//                     ]);
//                     setLoading(false);
//                     return;
//                 }
//             }

//             if (!response.ok) {
//                 const errData = await response.json();
//                 throw new Error(errData?.error || `HTTP ${response.status}`);
//             }

//             const data = await response.json();
//             let botReply =
//                 data?.[0]?.generated_text ||
//                 "⚠️ I couldn't think of a response. Please try again!";

//             // Clean up any leftover prompt artifacts
//             botReply = botReply
//                 .replace(/\[INST\].*?\[\/INST\]/gs, "")
//                 .replace(/<\/s>/g, "")
//                 .replace(/^\s+/, "")
//                 .trim();

//             if (!botReply) {
//                 botReply = "🍽️ Hmm, let me think... Could you rephrase that? I want to give you the best food suggestion!";
//             }

//             setConversationHistory([
//                 ...newHistory,
//                 { role: "assistant", content: botReply },
//             ]);
//             setMessages((prev) => [...prev, { role: "bot", text: botReply }]);

//         } catch (error) {
//             console.error("HuggingFace API Error:", error);
//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     role: "bot",
//                     text: `⚠️ Error: ${error.message}. Please check your HF token in .env file.`,
//                 },
//             ]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") sendMessage();
//     };

//     const clearChat = () => {
//         setConversationHistory([]);
//         setMessages([
//             {
//                 role: "bot",
//                 text: "👋 Chat cleared! What are you craving today? 🍽️",
//             },
//         ]);
//     };

//     const suggestions = [
//         "What should I eat today?",
//         "Low calorie meals 🥗",
//         "High protein food 💪",
//         "Something spicy 🌶️",
//         "Best for weight loss",
//     ];

//     return (
//         <>
//             {/* Floating Action Button */}
//             <div
//                 className={`chatbot-fab ${isOpen ? "chatbot-fab--active" : ""}`}
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 {isOpen ? (
//                     <span className="chatbot-fab__close">✕</span>
//                 ) : (
//                     <span className="chatbot-fab__icon">🍽️</span>
//                 )}
//                 {!isOpen && <span className="chatbot-fab__pulse"></span>}
//             </div>

//             {/* Chat Window */}
//             {isOpen && (
//                 <div className="chatbot-window">

//                     {/* Header */}
//                     <div className="chatbot-header">
//                         <div className="chatbot-header__info">
//                             <div className="chatbot-header__avatar">🤖</div>
//                             <div>
//                                 <p className="chatbot-header__name">Foodie Bot 🍴</p>
//                                 <p className="chatbot-header__status">● Powered by Mistral AI</p>
//                             </div>
//                         </div>
//                         <div className="chatbot-header__actions">
//                             <button
//                                 className="chatbot-header__btn"
//                                 onClick={clearChat}
//                                 title="Clear chat"
//                             >
//                                 🗑️
//                             </button>
//                             <button
//                                 className="chatbot-header__btn"
//                                 onClick={() => setIsOpen(false)}
//                                 title="Close"
//                             >
//                                 ✕
//                             </button>
//                         </div>
//                     </div>

//                     {/* Suggestion Pills */}
//                     <div className="chatbot-suggestions">
//                         {suggestions.map((item) => (
//                             <button
//                                 key={item}
//                                 className="chatbot-pill"
//                                 onClick={() => sendMessage(item)}
//                             >
//                                 {item}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Messages */}
//                     <div className="chatbot-messages">
//                         {messages.map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`chatbot-msg chatbot-msg--${msg.role}`}
//                             >
//                                 {msg.role === "bot" && (
//                                     <span className="chatbot-msg__avatar">🤖</span>
//                                 )}
//                                 <div
//                                     className="chatbot-msg__bubble"
//                                     dangerouslySetInnerHTML={{
//                                         __html: msg.text
//                                             .replace(/\n/g, "<br>")
//                                             .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//                                             .replace(/\*(.*?)\*/g, "<em>$1</em>"),
//                                     }}
//                                 />
//                                 {msg.role === "user" && (
//                                     <span className="chatbot-msg__avatar">👤</span>
//                                 )}
//                             </div>
//                         ))}

//                         {/* Typing Indicator */}
//                         {loading && (
//                             <div className="chatbot-msg chatbot-msg--bot">
//                                 <span className="chatbot-msg__avatar">🤖</span>
//                                 <div className="chatbot-msg__bubble chatbot-msg__bubble--typing">
//                                     <span></span>
//                                     <span></span>
//                                     <span></span>
//                                 </div>
//                             </div>
//                         )}

//                         <div ref={messagesEndRef}></div>
//                     </div>

//                     {/* Input Area */}
//                     <div className="chatbot-input">
//                         <input
//                             type="text"
//                             placeholder="Ask about food or health..."
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             className="chatbot-input__field"
//                             disabled={loading}
//                         />
//                         <button
//                             className="chatbot-input__send"
//                             onClick={() => sendMessage()}
//                             disabled={loading || !input.trim()}
//                         >
//                             {loading ? "..." : "➤"}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ChatBot;







// import React, { useState, useRef, useEffect } from "react";
// import { sendChatMessage } from "../services/aiService";
// import "./ChatBot.css";


// const ChatBot = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([
//         {
//             role: "bot",
//             text: "👋 Hi! I'm Foodie Bot — your personal food & health assistant!\n\nTell me your mood, health goal, or craving and I'll suggest the perfect dish from our menu! 🍛",
//         },
//     ]);
//     const [input, setInput] = useState("");
//     const [loading, setLoading] = useState(false);
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const sendMessage = async (overrideText) => {
//         const userMessage = (overrideText || input).trim();
//         if (!userMessage || loading) return;

//         setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
//         setInput("");
//         setLoading(true);

//         try {
//             const data = await sendChatMessage(userMessage);

//             // Main AI reply
//             let botText = data?.reply || "🍽️ Let me check our menu for you!";

//             // Append recommended food chips if present
//             if (data?.recommendedFoods?.length > 0) {
//                 botText +=
//                     "\n\n🍴 Available on our menu:\n" +
//                     data.recommendedFoods.map((f) => `• ${f}`).join("\n");
//             }

//             setMessages((prev) => [...prev, { role: "bot", text: botText }]);
//         } catch (error) {
//             console.error("Foodie Bot Error:", error);
//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     role: "bot",
//                     text: "⚠️ Sorry, I'm unable to connect to the server right now. Please make sure the backend is running on port 8080!",
//                 },
//             ]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") sendMessage();
//     };

//     const clearChat = () => {
//         setMessages([
//             {
//                 role: "bot",
//                 text: "👋 Chat cleared! What are you craving today? 🍽️",
//             },
//         ]);
//     };

//     const suggestions = [
//         "What should I eat today?",
//         "Low calorie meals 🥗",
//         "High protein food 💪",
//         "Something spicy 🌶️",
//         "Veg food under ₹200",
//         "Best for weight loss",
//     ];

//     return (
//         <>
//             {/* Floating Action Button */}
//             <div
//                 className={`chatbot-fab ${isOpen ? "chatbot-fab--active" : ""}`}
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 {isOpen ? (
//                     <span className="chatbot-fab__close">✕</span>
//                 ) : (
//                     <span className="chatbot-fab__icon">🍽️</span>
//                 )}
//                 {!isOpen && <span className="chatbot-fab__pulse"></span>}
//             </div>

//             {/* Chat Window */}
//             {isOpen && (
//                 <div className="chatbot-window">

//                     {/* Header */}
//                     <div className="chatbot-header">
//                         <div className="chatbot-header__info">
//                             <div className="chatbot-header__avatar">🤖</div>
//                             <div>
//                                 <p className="chatbot-header__name">Foodie Bot 🍴</p>
//                                 <p className="chatbot-header__status">
//                                     ● Powered by Llama 3.2
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="chatbot-header__actions">
//                             <button
//                                 className="chatbot-header__btn"
//                                 onClick={clearChat}
//                                 title="Clear chat"
//                             >
//                                 🗑️
//                             </button>
//                             <button
//                                 className="chatbot-header__btn"
//                                 onClick={() => setIsOpen(false)}
//                                 title="Close"
//                             >
//                                 ✕
//                             </button>
//                         </div>
//                     </div>

//                     {/* Suggestion Pills */}
//                     <div className="chatbot-suggestions">
//                         {suggestions.map((item) => (
//                             <button
//                                 key={item}
//                                 className="chatbot-pill"
//                                 onClick={() => sendMessage(item)}
//                             >
//                                 {item}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Messages */}
//                     <div className="chatbot-messages">
//                         {messages.map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`chatbot-msg chatbot-msg--${msg.role}`}
//                             >
//                                 {msg.role === "bot" && (
//                                     <span className="chatbot-msg__avatar">🤖</span>
//                                 )}
//                                 <div
//                                     className="chatbot-msg__bubble"
//                                     dangerouslySetInnerHTML={{
//                                         __html: msg.text
//                                             .replace(/\n/g, "<br>")
//                                             .replace(
//                                                 /\*\*(.*?)\*\*/g,
//                                                 "<strong>$1</strong>"
//                                             )
//                                             .replace(
//                                                 /\*(.*?)\*/g,
//                                                 "<em>$1</em>"
//                                             ),
//                                     }}
//                                 />
//                                 {msg.role === "user" && (
//                                     <span className="chatbot-msg__avatar">👤</span>
//                                 )}
//                             </div>
//                         ))}

//                         {/* Typing Indicator */}
//                         {loading && (
//                             <div className="chatbot-msg chatbot-msg--bot">
//                                 <span className="chatbot-msg__avatar">🤖</span>
//                                 <div className="chatbot-msg__bubble chatbot-msg__bubble--typing">
//                                     <span></span>
//                                     <span></span>
//                                     <span></span>
//                                 </div>
//                             </div>
//                         )}

//                         <div ref={messagesEndRef}></div>
//                     </div>

//                     {/* Input Area */}
//                     <div className="chatbot-input">
//                         <input
//                             type="text"
//                             placeholder="Ask about food or health..."
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             className="chatbot-input__field"
//                             disabled={loading}
//                         />
//                         <button
//                             className="chatbot-input__send"
//                             onClick={() => sendMessage()}
//                             disabled={loading || !input.trim()}
//                         >
//                             {loading ? "..." : "➤"}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ChatBot;










// import React, { useState, useRef, useEffect } from "react";
// import "./ChatBot.css";

// const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
// const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";
// const API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

// const SYSTEM_PROMPT = `You are Foodie Bot, a friendly food and health assistant for "Foodies" — a popular Indian food delivery app.
// Help users decide what to eat based on their health goals, mood, or cravings.
// Always suggest from these categories: Biryani, Burger, Pizza, Salad, Rolls, Cake, Ice Cream, Thali, Dosa, Noodles.
// Keep answers short (2-3 sentences), warm, and fun with emojis 🍛🥗🍕.
// Always end with: "Want to explore our menu? 😊"
// Never suggest alcohol or tobacco.`;

// const buildPrompt = (history, userMessage) => {
//     let prompt = `<s>[INST] ${SYSTEM_PROMPT} [/INST] Sure! I'm Foodie Bot, happy to help you find the perfect meal! 😊 </s>`;
    
//     history.forEach(({ role, content }) => {
//         if (role === "user") {
//             prompt += `[INST] ${content} [/INST] `;
//         } else {
//             prompt += `${content} </s>`;
//         }
//     });

//     prompt += `[INST] ${userMessage} [/INST]`;
//     return prompt;
// };

// const ChatBot = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([
//         {
//             role: "bot",
//             text: "👋 Hi! I'm Foodie Bot — your personal food & health assistant!\n\nTell me your mood, health goal, or craving and I'll suggest the perfect dish! 🍛",
//         },
//     ]);
//     const [conversationHistory, setConversationHistory] = useState([]);
//     const [input, setInput] = useState("");
//     const [loading, setLoading] = useState(false);
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const sendMessage = async (overrideText) => {
//         const userMessage = (overrideText || input).trim();
//         if (!userMessage || loading) return;

//         const newHistory = [
//             ...conversationHistory,
//             { role: "user", content: userMessage },
//         ];

//         setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
//         setConversationHistory(newHistory);
//         setInput("");
//         setLoading(true);

//         try {
//             const prompt = buildPrompt(conversationHistory, userMessage);

//             const response = await fetch(API_URL, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${HF_TOKEN}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     inputs: prompt,
//                     parameters: {
//                         max_new_tokens: 200,
//                         temperature: 0.7,
//                         top_p: 0.95,
//                         do_sample: true,
//                         return_full_text: false,
//                         stop: ["[INST]", "</s>"],
//                     },
//                 }),
//             });

//             // Handle model loading (cold start)
//             if (response.status === 503) {
//                 const errData = await response.json();
//                 if (errData?.error?.includes("loading")) {
//                     setMessages((prev) => [
//                         ...prev,
//                         {
//                             role: "bot",
//                             text: "⏳ The AI is warming up (first load takes ~20 seconds). Please try again in a moment!",
//                         },
//                     ]);
//                     setLoading(false);
//                     return;
//                 }
//             }

//             if (!response.ok) {
//                 const errData = await response.json();
//                 throw new Error(errData?.error || `HTTP ${response.status}`);
//             }

//             const data = await response.json();
//             let botReply =
//                 data?.[0]?.generated_text ||
//                 "⚠️ I couldn't think of a response. Please try again!";

//             // Clean up any leftover prompt artifacts
//             botReply = botReply
//                 .replace(/\[INST\].*?\[\/INST\]/gs, "")
//                 .replace(/<\/s>/g, "")
//                 .replace(/^\s+/, "")
//                 .trim();

//             if (!botReply) {
//                 botReply = "🍽️ Hmm, let me think... Could you rephrase that? I want to give you the best food suggestion!";
//             }

//             setConversationHistory([
//                 ...newHistory,
//                 { role: "assistant", content: botReply },
//             ]);
//             setMessages((prev) => [...prev, { role: "bot", text: botReply }]);

//         } catch (error) {
//             console.error("HuggingFace API Error:", error);
//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     role: "bot",
//                     text: `⚠️ Error: ${error.message}. Please check your HF token in .env file.`,
//                 },
//             ]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") sendMessage();
//     };

//     const clearChat = () => {
//         setConversationHistory([]);
//         setMessages([
//             {
//                 role: "bot",
//                 text: "👋 Chat cleared! What are you craving today? 🍽️",
//             },
//         ]);
//     };

//     const suggestions = [
//         "What should I eat today?",
//         "Low calorie meals 🥗",
//         "High protein food 💪",
//         "Something spicy 🌶️",
//         "Best for weight loss",
//     ];

//     return (
//         <>
//             {/* Floating Action Button */}
//             <div
//                 className={`chatbot-fab ${isOpen ? "chatbot-fab--active" : ""}`}
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 {isOpen ? (
//                     <span className="chatbot-fab__close">✕</span>
//                 ) : (
//                     <span className="chatbot-fab__icon">🍽️</span>
//                 )}
//                 {!isOpen && <span className="chatbot-fab__pulse"></span>}
//             </div>

//             {/* Chat Window */}
//             {isOpen && (
//                 <div className="chatbot-window">

//                     {/* Header */}
//                     <div className="chatbot-header">
//                         <div className="chatbot-header__info">
//                             <div className="chatbot-header__avatar">🤖</div>
//                             <div>
//                                 <p className="chatbot-header__name">Foodie Bot 🍴</p>
//                                 <p className="chatbot-header__status">● Powered by Mistral AI</p>
//                             </div>
//                         </div>
//                         <div className="chatbot-header__actions">
//                             <button
//                                 className="chatbot-header__btn"
//                                 onClick={clearChat}
//                                 title="Clear chat"
//                             >
//                                 🗑️
//                             </button>
//                             <button
//                                 className="chatbot-header__btn"
//                                 onClick={() => setIsOpen(false)}
//                                 title="Close"
//                             >
//                                 ✕
//                             </button>
//                         </div>
//                     </div>

//                     {/* Suggestion Pills */}
//                     <div className="chatbot-suggestions">
//                         {suggestions.map((item) => (
//                             <button
//                                 key={item}
//                                 className="chatbot-pill"
//                                 onClick={() => sendMessage(item)}
//                             >
//                                 {item}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Messages */}
//                     <div className="chatbot-messages">
//                         {messages.map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`chatbot-msg chatbot-msg--${msg.role}`}
//                             >
//                                 {msg.role === "bot" && (
//                                     <span className="chatbot-msg__avatar">🤖</span>
//                                 )}
//                                 <div
//                                     className="chatbot-msg__bubble"
//                                     dangerouslySetInnerHTML={{
//                                         __html: msg.text
//                                             .replace(/\n/g, "<br>")
//                                             .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//                                             .replace(/\*(.*?)\*/g, "<em>$1</em>"),
//                                     }}
//                                 />
//                                 {msg.role === "user" && (
//                                     <span className="chatbot-msg__avatar">👤</span>
//                                 )}
//                             </div>
//                         ))}

//                         {/* Typing Indicator */}
//                         {loading && (
//                             <div className="chatbot-msg chatbot-msg--bot">
//                                 <span className="chatbot-msg__avatar">🤖</span>
//                                 <div className="chatbot-msg__bubble chatbot-msg__bubble--typing">
//                                     <span></span>
//                                     <span></span>
//                                     <span></span>
//                                 </div>
//                             </div>
//                         )}

//                         <div ref={messagesEndRef}></div>
//                     </div>

//                     {/* Input Area */}
//                     <div className="chatbot-input">
//                         <input
//                             type="text"
//                             placeholder="Ask about food or health..."
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             className="chatbot-input__field"
//                             disabled={loading}
//                         />
//                         <button
//                             className="chatbot-input__send"
//                             onClick={() => sendMessage()}
//                             disabled={loading || !input.trim()}
//                         >
//                             {loading ? "..." : "➤"}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ChatBot;