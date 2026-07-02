import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {

    const [isOpen, setIsOpen]       = useState(false);
    const [messages, setMessages]   = useState([
        {
            role: 'bot',
            text: '👋 Hi! I am your Food & Health Assistant. Ask me what you should eat today, or tell me your health goal!'
        }
    ]);
    const [input, setInput]         = useState('');
    const [loading, setLoading]     = useState(false);
    const messagesEndRef            = useRef(null);

    // ✅ IMPORTANT: Replace with your NEW API key (never hardcode in production — use .env)
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are a friendly food and health advisor for a food delivery app called Foodies. 
                                    Help users decide what to eat based on their health goals, dietary preferences, or mood.
                                    Keep answers short, friendly, and practical. 
                                    Suggest food categories like Biryani, Burger, Pizza, Salad, Rolls, Cake, Ice Cream if relevant.
                                    User's question: ${userMessage}`
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand. Please try again!';

            setMessages(prev => [...prev, { role: 'bot', text: botReply }]);

        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: '⚠️ Something went wrong. Please check your internet connection and try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    const clearChat = () => {
        setMessages([{
            role: 'bot',
            text: '👋 Hi! I am your Food & Health Assistant. Ask me what you should eat today, or tell me your health goal!'
        }]);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <div
                className={`chatbot-fab ${isOpen ? 'chatbot-fab--active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Food & Health Assistant"
            >
                {isOpen
                    ? <span className="chatbot-fab__close">✕</span>
                    : <span className="chatbot-fab__icon">🍽️</span>
                }
                {!isOpen && <span className="chatbot-fab__pulse" />}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">

                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header__info">
                            <div className="chatbot-header__avatar">🤖</div>
                            <div>
                                <p className="chatbot-header__name">Food & Health AI</p>
                                <p className="chatbot-header__status">● Online</p>
                            </div>
                        </div>
                        <div className="chatbot-header__actions">
                            <button onClick={clearChat} title="Clear chat" className="chatbot-header__btn">🗑️</button>
                            <button onClick={() => setIsOpen(false)} className="chatbot-header__btn">✕</button>
                        </div>
                    </div>

                    {/* Suggestion Pills */}
                    <div className="chatbot-suggestions">
                        {['What should I eat today?', 'Low calorie meals', 'High protein food', 'I want something spicy'].map((s) => (
                            <button
                                key={s}
                                className="chatbot-pill"
                                onClick={() => { setInput(s); }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`chatbot-msg chatbot-msg--${msg.role}`}
                            >
                                {msg.role === 'bot' && <span className="chatbot-msg__avatar">🤖</span>}
                                <div className="chatbot-msg__bubble">
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && <span className="chatbot-msg__avatar">👤</span>}
                            </div>
                        ))}

                        {loading && (
                            <div className="chatbot-msg chatbot-msg--bot">
                                <span className="chatbot-msg__avatar">🤖</span>
                                <div className="chatbot-msg__bubble chatbot-msg__bubble--typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
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
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="chatbot-input__send"
                        >
                            {loading ? '...' : '➤'}
                        </button>
                    </div>

                </div>
            )}
        </>
    );
};

export default ChatBot;
