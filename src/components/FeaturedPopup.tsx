import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { products } from "@/lib/products";
import { Link } from "@tanstack/react-router";

export function FeaturedPopup() {
  const [open, setOpen] = useState(false);
  const p = products[2]; // Face Study

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("kaysky-popup")) return;
    const t = setTimeout(() => { setOpen(true); sessionStorage.setItem("kaysky-popup", "1"); }, 2200);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-pop-in">
      <div className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl glass-strong md:grid-cols-2">
        <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/40 hover:bg-black/60">
          <X className="size-4" />
        </button>
        <img src={p.image} alt={p.name} className="h-72 w-full object-cover md:h-full" width={800} height={800} />
        <div className="p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">New drop</p>
          <h3 className="mt-2 font-display text-4xl leading-tight md:text-5xl">{p.name}</h3>
          <p className="mt-3 text-foreground/80">{p.tagline}. Limited print run — once they're gone, they're gone.</p>
          <p className="mt-4 font-display text-3xl text-primary">KES {p.price.toLocaleString()}</p>
          <Link to="/product/$id" params={{ id: p.id }} onClick={() => setOpen(false)} className="btn-neon mt-6 inline-block rounded-full px-6 py-3 text-sm">
            See the piece
          </Link>
        </div>
      </div>
    </div>
  );
}
