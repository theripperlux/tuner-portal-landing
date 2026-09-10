'use client';
import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [msg, setMsg] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{message: string, isAdmin: boolean}[]>([]);

  const startChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/chat/start', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const data = await res.json();
      setChatId(data.id);
      setHasStarted(true);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || !chatId) return;

    // Optimistic UI updates
    setMessages(prev => [...prev, { message: msg, isAdmin: false }]);
    const toSend = msg;
    setMsg('');

    await fetch('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ chatId, message: toSend })
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#ef4444] hover:bg-red-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(232,25,44,0.4)] transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-[#161821] border border-white/10 w-80 h-96 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-[#0a0b10] border-b border-white/5 p-4 flex justify-between items-center">
            <h3 className="text-white font-bold text-sm tracking-wide">Live Support</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {!hasStarted ? (
              <form onSubmit={startChat} className="space-y-3">
                <p className="text-xs text-gray-400 mb-2 leading-relaxed">Bitte hinterlasse deine Daten, damit wir dich bei Verbindungsabbruch erreichen können.</p>
                <input required type="text" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 p-2 rounded text-white text-sm" />
                <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 p-2 rounded text-white text-sm" />
                <input type="text" placeholder="Handy (mit Vorwahl)" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 p-2 rounded text-white text-sm" />
                <button type="submit" className="w-full bg-[#ef4444] text-white p-2 rounded text-sm font-bold uppercase tracking-wider mt-2">Chat Starten</button>
              </form>
            ) : (
              <div className="space-y-3">
                {messages.length === 0 && <p className="text-xs text-gray-500 text-center">Ein Support-Mitarbeiter ist gleich für dich da...</p>}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-2 rounded max-w-[80%] text-sm ${m.isAdmin ? 'bg-red-500/20 text-white' : 'bg-[#ef4444] text-white'}`}>
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasStarted && (
            <form onSubmit={sendMessage} className="p-3 bg-[#0a0b10] border-t border-white/5 flex gap-2">
              <input type="text" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none" />
              <button type="submit" className="text-red-400 hover:text-white"><Send className="w-4 h-4" /></button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
