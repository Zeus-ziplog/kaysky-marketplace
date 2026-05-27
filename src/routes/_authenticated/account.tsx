import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Package, Bell } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "My account — KAYSKY" }] }),
  component: Account,
});

function Account() {
  const [orders, setOrders] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
    supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(10).then(({ data }) => setNotifs(data ?? []));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-6xl leading-none">My account</h1>

        <section className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl"><Package className="size-5 text-primary" /> Orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-foreground/70">No orders yet. <Link to="/" className="text-primary underline">Shop the drop</Link>.</p>
          ) : (
            <div className="grid gap-3">
              {orders.map((o) => (
                <div key={o.id} className="glass flex items-center justify-between gap-4 rounded-2xl p-4">
                  <div>
                    <p className="font-bold">{o.product_name} × {o.quantity}</p>
                    <p className="text-xs text-foreground/60">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl">KES {Number(o.total).toLocaleString()}</p>
                    <StatusPill s={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl"><Bell className="size-5 text-primary" /> Notifications</h2>
          {notifs.length === 0 ? <p className="text-sm text-foreground/70">No notifications.</p> : (
            <div className="grid gap-3">
              {notifs.map((n) => (
                <div key={n.id} className="glass rounded-2xl p-4">
                  <p className="font-bold">{n.title}</p>
                  {n.body && <p className="text-sm text-foreground/80">{n.body}</p>}
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-foreground/50">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    paid: "bg-primary text-primary-foreground",
    pending: "bg-yellow-500/30 text-yellow-100",
    failed: "bg-destructive text-destructive-foreground",
    canceled: "bg-white/20 text-foreground",
  };
  return <span className={`inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest ${map[s] ?? "bg-white/10"}`}>{s}</span>;
}
