import { FormEvent, useEffect, useRef, useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import type { AiMessage } from '../types';
import { addMessage, clearMessages, getMessages } from '../lib/db';
import { getLocalLunaResponse } from '../lib/ai';
import { Button } from './Button';

export function AIChatBox() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getMessages()
      .then((saved) => {
        if (saved.length) setMessages(saved);
        else setMessages([{ id: 'welcome', role: 'assistant', content: 'Oi, eu sou a Luna AI local. Posso explicar ciclo, sintomas, cólicas, atraso, ovulação e período fértil de forma educativa.', createdAt: new Date().toISOString() }]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    const userMessage = await addMessage({ role: 'user', content: text });
    setMessages((current) => [...current, userMessage]);
    const answer = getLocalLunaResponse(text);
    const assistantMessage = await addMessage({ role: 'assistant', content: answer });
    setMessages((current) => [...current, assistantMessage]);
  }

  async function handleClear() {
    await clearMessages();
    setMessages([{ id: 'welcome', role: 'assistant', content: 'Conversa limpa. Como posso te ajudar hoje?', createdAt: new Date().toISOString() }]);
  }

  return (
    <div className="chat-box">
      <div className="chat-notice">
        A Luna AI local oferece orientações educativas. Para respostas com IA online, configure uma API segura no servidor. Ela não substitui médicos, exames ou tratamentos.
      </div>
      <div className="chat-messages">
        {loading ? <p>Carregando conversa...</p> : messages.map((message) => (
          <div key={message.id} className={`bubble ${message.role}`}>
            {message.content.split('\n').map((line, index) => <p key={index}>{line}</p>)}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pergunte sobre cólica, atraso, ciclo..." />
        <Button type="submit" aria-label="Enviar"><Send size={18} /></Button>
      </form>
      <button className="link-button danger-link" onClick={handleClear}><Trash2 size={15} /> Limpar conversa</button>
    </div>
  );
}
