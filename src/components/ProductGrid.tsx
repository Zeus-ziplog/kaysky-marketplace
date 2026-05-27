import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Share2, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false })
      .then(({ data }) => setProducts(data ?? []));
  }, []);

  return (
    <section id="drops" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">All Drops</p>
            <h2 className="mt-2 font-display text-5xl md:text-7xl">The Catalog</h2>
          </div>
          <p className="max-w-md text-sm text-foreground/80">
            Each piece is a limited run — printed in Nairobi, wearable in the streets.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <Card key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

function Card({ p }: { p: any }) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/product/${p.id}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: p.name, text: p.tagline, url }); } catch {}
    } else if (typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(url); alert("Link copied");
    }
  };

  return (
    <Link to="/product/$id" params={{ id: p.id }} className="group">
      <article className="glass overflow-hidden rounded-2xl transition-transform duration-300 group-hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden">
          {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy"
               className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />}
          {p.stock === 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Sold out</span>
          )}
          <button onClick={handleShare} aria-label="Share"
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/60 backdrop-blur-md transition hover:bg-primary hover:text-primary-foreground">
            <Share2 className="size-4" />
          </button>
        </div>
        <div className="flex items-start justify-between gap-3 p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{p.category}</p>
            <h3 className="mt-1 font-display text-2xl leading-tight">{p.name}</h3>
            <p className="text-xs text-foreground/70">{p.tagline}</p>
            <p className="mt-2 text-sm font-bold">KES {Number(p.price).toLocaleString()}</p>
          </div>
          <span className="btn-neon mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full">
            <ShoppingBag className="size-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}
