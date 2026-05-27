import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

export function CookieBar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("kaysky-cookies")) setOpen(true);
  }, []);
  const accept = () => { localStorage.setItem("kaysky-cookies", "1"); setOpen(false); };
  if (!open) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-2xl rounded-2xl glass-strong p-4 shadow-[var(--shadow-deep)] animate-pop-in md:inset-x-auto md:left-1/2 md:-translate-x-1/2">
      <div className="flex flex-col items-center gap-3 text-sm md:flex-row md:text-left">
        <Cookie className="size-6 shrink-0 text-primary" />
        <p className="flex-1">We use cookies to keep your bag in sync and improve your shopping. By using KAYSKY Market you agree to our cookie policy.</p>
        <div className="flex gap-2">
          <button onClick={accept} className="btn-neon rounded-full px-4 py-2 text-xs">Accept</button>
          <button onClick={() => setOpen(false)} className="rounded-full glass px-4 py-2 text-xs hover:bg-white/15">Dismiss</button>
        </div>
      </div>
    </div>
  );
}
