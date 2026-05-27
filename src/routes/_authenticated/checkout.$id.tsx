import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { initiateStkPush, getOrderStatus } from "@/lib/mpesa.functions";
import { ArrowLeft, Smartphone, ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/checkout/$id")({
  head: () => ({ meta: [{ title: "Checkout — KAYSKY" }] }),
  component: Checkout,
});

function Checkout() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("pending");

  const stk = useServerFn(initiateStkPush);
  const checkStatus = useServerFn(getOrderStatus);

  useEffect(() => {
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => setProduct(data));
  }, [id]);

  // poll status when order placed
  useEffect(() => {
    if (!orderId) return;
    const t = setInterval(async () => {
      try {
        const { order } = await checkStatus({ data: { orderId } });
        if (order) {
          setOrderStatus(order.status);
          if (order.status !== "pending") clearInterval(t);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(t);
  }, [orderId, checkStatus]);

  if (!product) return (
    <div className="min-h-screen"><Navbar /><div className="grid place-items-center py-24"><Loader2 className="size-8 animate-spin text-primary" /></div></div>
  );

  const total = Number(product.price) * qty;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await stk({ data: { productId: product.id, quantity: qty, phone, deliveryAddress: address } });
      setOrderId(res.orderId);
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.message || "Payment failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/product/$id" params={{ id: product.id }} className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-primary">
          <ArrowLeft className="size-4" /> Back to product
        </Link>

        <div className="grid gap-8 md:grid-cols-[1fr,1.2fr]">
          <div className="glass overflow-hidden rounded-3xl">
            {product.image_url && <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />}
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{product.category}</p>
              <h2 className="mt-1 font-display text-3xl">{product.name}</h2>
              <p className="text-sm text-foreground/70">{product.tagline}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span>Unit</span><span>KES {Number(product.price).toLocaleString()}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm"><span>Qty</span><span>{qty}</span></div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-display text-2xl text-primary">
                <span>Total</span><span>KES {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6">
            {!orderId ? (
              <>
                <h1 className="font-display text-4xl leading-none">Pay with M-Pesa</h1>
                <p className="mt-2 text-sm text-foreground/70">Enter your phone, we'll push a Safaricom STK prompt to your device.</p>

                <form onSubmit={submit} className="mt-6 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Quantity</label>
                    <input type="number" min={1} max={product.stock} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="mt-1 w-full rounded-full glass px-4 py-3 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">M-Pesa phone</label>
                    <div className="glass mt-1 flex items-center gap-3 rounded-full px-4 py-3">
                      <Smartphone className="size-4 text-primary" />
                      <input required placeholder="07XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Delivery address (optional)</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl glass px-4 py-3 text-sm outline-none" />
                  </div>
                  <button disabled={busy} className="btn-neon mt-4 w-full rounded-full px-6 py-3 text-sm disabled:opacity-50">
                    {busy ? <Loader2 className="mx-auto size-4 animate-spin" /> : `Pay KES ${total.toLocaleString()}`}
                  </button>
                  <p className="flex items-center gap-2 text-xs text-foreground/60"><ShieldCheck className="size-3 text-primary" /> Encrypted via Safaricom Daraja. We never store your PIN.</p>
                </form>
              </>
            ) : (
              <>
                {orderStatus === "paid" && (
                  <div className="grid place-items-center py-10 text-center">
                    <CheckCircle2 className="size-16 text-primary" />
                    <h2 className="mt-4 font-display text-4xl">Payment received</h2>
                    <p className="mt-2 text-sm text-foreground/70">Your order is confirmed. We'll ship within 48 hours.</p>
                    <button onClick={() => nav({ to: "/" })} className="btn-neon mt-6 rounded-full px-6 py-3 text-sm">Back to shop</button>
                  </div>
                )}
                {(orderStatus === "failed" || orderStatus === "canceled") && (
                  <div className="grid place-items-center py-10 text-center">
                    <XCircle className="size-16 text-destructive" />
                    <h2 className="mt-4 font-display text-4xl">Payment {orderStatus}</h2>
                    <p className="mt-2 text-sm text-foreground/70">Try again or contact support.</p>
                    <button onClick={() => location.reload()} className="btn-neon mt-6 rounded-full px-6 py-3 text-sm">Try again</button>
                  </div>
                )}
                {orderStatus !== "paid" && orderStatus !== "failed" && orderStatus !== "canceled" && (
                  <div className="grid place-items-center py-10 text-center">
                    <Loader2 className="size-16 animate-spin text-primary" />
                    <h2 className="mt-4 font-display text-3xl">Waiting for payment</h2>
                    <p className="mt-2 text-sm text-foreground/70">Check your phone and enter your M-Pesa PIN.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}