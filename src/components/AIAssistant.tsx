import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

const PRESETS = [
  { q: "How do I order?",            a: "Pick a product, tap the bag, sign in with Google, then check out with M-Pesa or card." },
  { q: "Do you ship outside Nairobi?", a: "Yes — countrywide. Delivery within Nairobi is free over KES 5,000." },
  { q: "Can I sell my art here?",     a: "Absolutely. Use the 'List your art' button on the homepage to apply as a seller." },
  { q: "How long is printing?",       a: "Most drops ship within 48 hours. Custom orders take 3–5 business days." },
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hey — I'm Sky, the Kaysky helper. Ask me anything about drops, delivery, or how to sell here." },
  ]);
  const [input, setInput] = useState("");

  const reply = (q: string) => {
    const hit = PRESETS.find((p) => p.q.toLowerCase() === q.toLowerCase());
    return hit?.a ?? "Good question — I'll loop in the team. Meanwhile, try the FAQ or message us on WhatsApp.";
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }, { role: "bot", text: reply(text) }]);
    setInput("");
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-neon)] hover:scale-105"
          aria-label="Open help assistant"
        >
          <Sparkles className="size-4" /> Help
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[92vw] max-w-sm overflow-hidden rounded-2xl glass-strong animate-pop-in">
          <div className="flex items-center justify-between border-b border-border bg-primary p-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              <p className="font-display text-lg">Sky · Help</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close"><X className="size-5" /></button>
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "glass"}`}>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
            {PRESETS.map((p) => (
              <button key={p.q} onClick={() => send(p.q)} className="rounded-full glass px-3 py-1 text-xs hover:bg-white/15">{p.q}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" aria-label="Send" className="btn-neon grid size-10 place-items-center rounded-full"><Send className="size-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
