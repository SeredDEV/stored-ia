
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente de Echo. ¿En qué puedo ayudarte hoy con el panel administrativo?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '';
      if (!apiKey) {
        throw new Error('API key de Google AI no configurada');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: "Eres un asistente amable para administradores. Los colores de la marca son el Azul Echo (#0FA6D1) y el Cyan brillante (#4DE2E5). Tu tono es profesional pero cercano."
      });

      const prompt = `Actúa como un asistente administrativo experto para el portal "Echo". Responde de forma amable y concisa en español. Contexto: El usuario está en el dashboard principal. Pregunta: ${userMsg}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiContent = response.text() || 'Lo siento, no pude procesar tu solicitud.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Hubo un error al conectar con mi cerebro digital. Por favor intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-echo-blue p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <span className="font-bold">Asistente Echo</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-echo-beige/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-echo-blue text-white rounded-tr-none shadow-md shadow-echo-blue/10' 
                    : 'bg-white text-echo-black border border-gray-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                  <div className="w-2 h-2 bg-echo-gray/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-echo-gray/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-echo-gray/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu duda..."
              className="flex-1 bg-echo-beige/50 border-none rounded-xl text-sm px-4 focus:ring-2 focus:ring-echo-blue/20"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="w-10 h-10 bg-echo-blue text-white rounded-xl flex items-center justify-center hover:bg-echo-light-blue transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-echo-blue text-white rounded-full shadow-2xl shadow-echo-blue/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">smart_toy</span>
        </button>
      )}
    </div>
  );
};

export default Assistant;
