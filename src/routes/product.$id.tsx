import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Share2, ShoppingBag, ArrowLeft, Shield, Truck, Lock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState<any>(null);

  useEffect(() => {
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => setP(data));
  }, [id]);

  if (!p) return <div className="min-h-screen"><Navbar /><div className="grid place-items-center py-24"><Loader2 className="size-8 animate-spin text-primary" /></div></div>;

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: p.name, text: p.tagline, url }); } catch {}
    } else if (typeof navigator !== "undefined") { await navigator.clipboard.writeText(url); alert("Link copied"); }
  };

  const buy = () => {
    if (!user) nav({ to: "/login", search: { redirect: `/checkout/${p.id}` } as any });
    else nav({ to: "/checkout/$id", params: { id: p.id } });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-primary">
          <ArrowLeft className="size-4" /> Back to shop
        </Link>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="glass overflow-hidden rounded-3xl">
            {p.image_url && <img src={p.image_url} alt={p.name} className="aspect-square w-full object-cover" />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{p.category}</p>
            <h1 className="mt-3 font-display text-5xl leading-[0.95] md:text-7xl">{p.name}</h1>
            <p className="mt-3 text-lg text-foreground/80">{p.tagline}</p>
            <p className="mt-6 font-display text-4xl text-primary">KES {Number(p.price).toLocaleString()}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button disabled={p.stock === 0} onClick={buy}
                className="btn-neon inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm disabled:opacity-50">
                <ShoppingBag className="size-4" /> {p.stock === 0 ? "Sold out" : user ? "Buy with M-Pesa" : "Sign in to buy"}
              </button>
              <button onClick={share} className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white/15">
                <Share2 className="size-4" /> Share
              </button>
            </div>
            <div className="mt-10 grid gap-3 text-sm">
              <Row icon={<Lock className="size-4 text-primary" />} text="Google sign-in required at checkout — secure & private" />
              <Row icon={<Shield className="size-4 text-primary" />} text="M-Pesa STK Push — encrypted via Safaricom Daraja" />
              <Row icon={<Truck className="size-4 text-primary" />} text="Ships from Nairobi within 48 hours" />
            </div>
            {p.description && <p className="mt-8 whitespace-pre-line text-sm text-foreground/80">{p.description}</p>}
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/60">In stock</p>
              <p className="font-display text-2xl">{p.stock} pieces</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-center gap-3 rounded-xl glass px-4 py-3">{icon}<span>{text}</span></div>;
}
