import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  LayoutDashboard, Package, Bell, Newspaper, ShoppingBag, Plus, Trash2, Edit3,
  TrendingUp, DollarSign, AlertTriangle, CheckCircle2, Clock, XCircle, Upload, ShieldCheck,
  LogOut, Search, User, Layers, Activity, ImageIcon, ArrowUp, ArrowDown
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { adminStats, upsertProduct, deleteProduct, postNews, broadcastNotification, claimAdminIfFirst, getHeroSlides, upsertSlide, deleteSlide, reorderSlides } from "@/lib/admin.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: location.href } as any });
  },
  head: () => ({ meta: [{ title: "Admin — KAYSKY Command" }] }),
  component: Admin,
});

type Tab = "dash" | "products" | "orders" | "news" | "notif" | "carousel";

function Admin() {
  const { isAdmin, user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("dash");
  const [claiming, setClaiming] = useState(false);
  const claim = useServerFn(claimAdminIfFirst);

  const claimFn = async () => {
    setClaiming(true);
    try {
      const r = await claim({});
      if (r.claimed) { toast.success("Admin granted. Refresh to continue."); location.reload(); }
      else toast.error("An admin already exists. Ask them to grant you access.");
    } catch (e: any) { toast.error(e.message); }
    finally { setClaiming(false); }
  };

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#070b12] px-4">
        <div className="max-w-md w-full rounded-2xl p-8 text-center border border-white/10 bg-[#0e1626] shadow-2xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">Access Restricted</h1>
          <p className="mt-2 text-sm text-zinc-400">Signed in as <span className="text-white font-medium">{user?.email}</span>. This command deck requires administrative authorization clearance.</p>
          <button disabled={claiming} onClick={claimFn} className="btn-neon mt-6 w-full rounded-xl py-3 text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50">
            Claim Core Admin
          </button>
          <Link to="/" className="mt-4 block text-xs text-zinc-500 hover:text-primary underline transition-colors">Return to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b12] text-zinc-100 antialiased font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 flex flex-col justify-between border-r border-white/10 bg-[#0a101f] p-5 z-20 shrink-0">
        <div className="space-y-8">
          <Link to="/" className="block px-2">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded bg-primary flex items-center justify-center font-sans font-black text-black text-sm">K</div>
              <span className="text-xl font-black tracking-tight text-white">KAYSKY</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mt-1.5 pl-9">Command Platform</p>
          </Link>

          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Management Core</p>
            {([
              ["dash", "Overview", LayoutDashboard],
              ["products", "Inventory", Package],
              ["orders", "Orders & Ledger", ShoppingBag],
              ["news", "Broadcast Banner", Newspaper],
              ["notif", "Push Systems", Bell],
              ["carousel", "Carousel", ImageIcon],
            ] as const).map(([k, label, Icon]) => (
              <button key={k} onClick={() => setTab(k as Tab)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left font-bold text-xs tracking-wide transition-all relative ${
                  tab === k 
                    ? "bg-primary text-black shadow-lg" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}>
                <Icon className="size-4 shrink-0" />
                {label}
                {tab === k && <span className="absolute right-3 size-1.5 rounded-full bg-black" />}
              </button>
            ))}
          </nav>
        </div>

        {/* USER CONFIG PROFILE */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
              <User className="size-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-white">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] uppercase font-bold text-primary tracking-wider">System Director</p>
            </div>
          </div>
          <button onClick={() => signOut()} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <LogOut className="size-3.5" /> Core Terminate
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT FRAMEWORK */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* GLOBAL EXECUTIVE HEADER */}
        <header className="h-16 border-b border-white/10 bg-[#0a101f] px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3 w-96 bg-[#111a2e] rounded-xl px-4 py-2 border border-white/5">
            <Search className="size-4 text-zinc-400" />
            <input type="text" placeholder="Global interface lookup..." className="bg-transparent text-xs outline-none w-full placeholder:text-zinc-500 text-white" disabled />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
              <span className="size-2 rounded-full bg-emerald-500" />
              Nairobi Node Secure
            </div>
          </div>
        </header>

        {/* DYNAMIC HUB CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#070b12] p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {tab === "dash" && <Dashboard />}
            {tab === "products" && <ProductsTab />}
            {tab === "orders" && <OrdersTab />}
            {tab === "news" && <NewsTab />}
            {tab === "notif" && <NotifTab />}
            {tab === "carousel" && <CarouselSlidesTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============ VISUAL DASHBOARD CORE ============ */
function Dashboard() {
  const [s, setS] = useState<any>(null);
  const stats = useServerFn(adminStats);
  useEffect(() => { stats({}).then(setS).catch((e) => toast.error(e.message)); }, [stats]);
  if (!s) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Activity className="size-6 text-primary animate-spin" />
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Synchronizing Command Matrices...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">System Monitoring Telemetry</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">Command Center</h1>
        </div>
        <p className="text-xs text-zinc-400 font-mono">Cycle Reference: {new Date().toLocaleDateString()}</p>
      </div>

      {/* METRICS LAYER 01 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Paid Gross" value={`KES ${s.revenue.toLocaleString()}`} icon={<DollarSign />} trend="+14.2% MoM" accent />
        <Stat label="Orders Ledger" value={s.totalOrders} icon={<ShoppingBag />} trend="Active pool" />
        <Stat label="Configured SKUs" value={s.totalProducts} icon={<Layers />} trend="Active items" />
        <Stat label="Depleted Stores" value={s.outOfStock} icon={<AlertTriangle />} trend="Requires action" warn={s.outOfStock > 0} />
      </div>

      {/* METRICS LAYER 02: DISPATCH MATRIX */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Fulfillment Channels</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Status: Settled" value={s.counts.paid} icon={<CheckCircle2 />} isMini />
          <Stat label="Status: Hold / Pipeline" value={s.counts.pending} icon={<Clock />} isMini />
          <Stat label="Status: Terminal Drop" value={s.counts.failed} icon={<XCircle />} isMini />
          <Stat label="Status: Voided" value={s.counts.canceled} icon={<XCircle />} isMini />
        </div>
      </div>

      {/* CHARTS GRAPH COMPONENT */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="border border-white/10 rounded-xl p-6 lg:col-span-3 bg-[#0a101f] shadow-xl">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Velocity Engine</p>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5"><TrendingUp className="size-4 text-primary" /> Financial Stream · 14d Chart</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(212, 255, 0, 0.15)"/>
                    <stop offset="95%" stopColor="rgba(212, 255, 0, 0)"/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0e1626", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12, color: "#fff" }} />
                <Area type="monotone" dataKey="total" stroke="#d4ff00" strokeWidth={2} fillOpacity={1} fill="url(#revenueGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-white/10 rounded-xl p-6 lg:col-span-2 bg-[#0a101f] shadow-xl">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Volume Distribution</p>
            <h3 className="text-lg font-bold text-white mt-0.5">Top Capital Drivers</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.topSellers} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0e1626", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12, color: "#fff" }} />
                <Bar dataKey="qty" fill="#d4ff00" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* M-PESA GATEWAY INFRASTRUCTURE TELEMETRY */}
      <div className="border border-white/10 rounded-xl p-6 bg-[#0a101f] shadow-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">M-Pesa API Integrations Node</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-[#121b2d] rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div><p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">API Success Callbacks</p><p className="text-2xl font-mono font-bold mt-1 text-emerald-400">{s.mpesaSuccess}</p></div>
            <CheckCircle2 className="size-5 text-emerald-400/60" />
          </div>
          <div className="bg-[#121b2d] rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div><p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Awaiting STK Push Response</p><p className="text-2xl font-mono font-bold mt-1 text-yellow-400">{s.mpesaPending}</p></div>
            <Clock className="size-5 text-yellow-400/60" />
          </div>
          <div className="bg-[#121b2d] rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div><p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Rejected / Timeout Faults</p><p className="text-2xl font-mono font-bold mt-1 text-red-400">{s.mpesaFailed}</p></div>
            <XCircle className="size-5 text-red-400/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, trend, accent, warn, isMini }: { label: string; value: any; icon: React.ReactNode; trend?: string; accent?: boolean; warn?: boolean; isMini?: boolean }) {
  return (
    <div className={`rounded-xl border transition-all bg-[#0a101f] ${
      accent ? "border-primary/40 shadow-md" : "border-white/10"
    } ${warn ? "border-red-500/40 bg-red-950/10" : ""} ${isMini ? "p-4" : "p-5"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
        <span className={`${accent ? "text-primary" : "text-zinc-400"} [&>svg]:size-4`}>{icon}</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <p className={`font-mono font-bold tracking-tight text-white ${isMini ? "text-xl" : "text-2xl"}`}>{value}</p>
        {trend && <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">{trend}</span>}
      </div>
    </div>
  );
}

/* ============ PRODUCT DESIGN LEDGER ============ */
function ProductsTab() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const upsert = useServerFn(upsertProduct);
  const del = useServerFn(deleteProduct);

  const load = () => supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);

  const save = async (p: any) => {
    try {
      await upsert({ data: {
        id: p.id, name: p.name, slug: p.slug, tagline: p.tagline, description: p.description,
        price: Number(p.price), category: p.category, stock: Number(p.stock),
        image_url: p.image_url, is_featured: !!p.is_featured, is_active: p.is_active !== false,
      }});
      toast.success("Product updated inside system state");
      setEditing(null); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to completely remove this SKU asset?")) return;
    try { await del({ data: { id } }); toast.success("Asset wiped from database"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Warehouse Asset Registers</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">Product Grid</h1>
        </div>
        <button onClick={() => setEditing({ name: "", slug: "", price: 0, stock: 0, is_active: true })} className="btn-neon flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider">
          <Plus className="size-4" /> Inject New SKU
        </button>
      </div>

      <div className="grid gap-3">
        {list.map((p) => (
          <div key={p.id} className="border border-white/10 flex items-center gap-4 rounded-xl p-4 bg-[#0a101f] hover:bg-[#121b2d] transition-all group">
            {p.image_url ? (
              <img src={p.image_url} className="size-14 rounded-lg object-cover border border-white/10" alt="" />
            ) : (
              <div className="size-14 rounded-lg bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-zinc-500 text-xs">Null</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white truncate">{p.name}</p>
              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                <span className="font-mono text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-zinc-300">{p.category || "Unassigned"}</span>
                <span>·</span>
                <span>{p.stock === 0 ? <span className="text-red-400 font-bold tracking-wide text-[10px]">DEPLETED</span> : `${p.stock} units`}</span>
                <span>·</span>
                <span className={p.is_active ? "text-emerald-400" : "text-zinc-500"}>{p.is_active ? "Active Shopfront" : "Staged Hidden"}</span>
              </div>
            </div>
            <div className="text-right pr-2">
              <p className="font-mono text-base font-bold text-primary">KES {Number(p.price).toLocaleString()}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Base Registry Unit</p>
            </div>
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <button onClick={() => setEditing(p)} className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10 transition-colors text-zinc-300 hover:text-white"><Edit3 className="size-4" /></button>
              <button onClick={() => remove(p.id)} className="rounded-xl border border-red-500/20 bg-red-500/5 p-2.5 hover:bg-red-500/20 transition-colors text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && <ProductModal product={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ProductModal({ product, onSave, onClose }: any) {
  const [p, setP] = useState(product);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setP({ ...p, image_url: data.publicUrl });
      toast.success("Image asset linked successfully");
    } catch (e: any) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 p-6 shadow-2xl bg-[#0a101f] text-zinc-100" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-white/10 pb-4 mb-5">
          <h2 className="text-xl font-bold tracking-tight text-white">{p.id ? "Modify System Asset" : "Deploy Asset Blueprint"}</h2>
          <p className="text-xs text-zinc-400 mt-1">Review pricing architecture and availability thresholds carefully.</p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Asset Public Name" value={p.name} onChange={(v) => setP({ ...p, name: v })} />
          <Input label="URL Route Slug" value={p.slug} onChange={(v) => setP({ ...p, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
          <Input label="Subheader Tagline" value={p.tagline ?? ""} onChange={(v) => setP({ ...p, tagline: v })} />
          <Input label="Category Namespace" value={p.category ?? ""} onChange={(v) => setP({ ...p, category: v })} />
          <Input label="Valuation Price (KES)" type="number" value={p.price} onChange={(v) => setP({ ...p, price: v })} />
          <Input label="Staged Inventory Stock" type="number" value={p.stock} onChange={(v) => setP({ ...p, stock: v })} />
        </div>
        
        <div className="mt-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Comprehensive Description</label>
          <textarea value={p.description ?? ""} onChange={(e) => setP({ ...p, description: e.target.value })} rows={3} className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#121b2d] px-4 py-3 text-sm text-white outline-none focus:border-primary/40 transition-colors resize-none" />
        </div>

        <div className="mt-5 bg-[#121b2d] rounded-xl p-4 border border-white/10">
          <label className="text-[10px] font-bold uppercase tracking-wider text-primary">Media Engine Assets</label>
          <div className="mt-3 flex items-center gap-4">
            {p.image_url && <img src={p.image_url} className="size-20 rounded-xl object-cover border border-white/10" alt="" />}
            <div className="flex-1 space-y-3">
              <label className="btn-neon flex cursor-pointer w-max items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wide">
                <Upload className="size-3.5" /> {uploading ? "Broadcasting Stream…" : "Upload Source Asset"}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              </label>
              <Input label="Explicit URL Direct Override" value={p.image_url ?? ""} onChange={(v) => setP({ ...p, image_url: v })} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-6 text-xs font-bold px-1">
          <label className="flex items-center gap-2.5 cursor-pointer text-zinc-300 hover:text-white"><input type="checkbox" checked={!!p.is_featured} onChange={(e) => setP({ ...p, is_featured: e.target.checked })} className="rounded accent-primary size-4" /> Feature at Core Center</label>
          <label className="flex items-center gap-2.5 cursor-pointer text-zinc-300 hover:text-white"><input type="checkbox" checked={p.is_active !== false} onChange={(e) => setP({ ...p, is_active: e.target.checked })} className="rounded accent-primary size-4" /> Active Broadcast Visibility</label>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-4">
          <button onClick={onClose} className="rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">Abort</button>
          <button onClick={() => onSave(p)} className="btn-neon rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest">Commit Database Block</button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="w-full">
      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#121b2d] px-4 py-3 text-sm text-white outline-none focus:border-primary/40 transition-colors" />
    </div>
  );
}

/* ============ LEDGER REAL-TIME TABLES ============ */
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => setOrders(data ?? []));
      supabase.from("mpesa_transactions").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => setTxns(data ?? []));
    };
    load();
    const ch = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "mpesa_transactions" }, load)
      .subscribe();
    return () => { ch.unsubscribe(); };
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <div className="border-b border-white/10 pb-5 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Inbound Consumer Requests Stream</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">Order Pipeline Ledger</h1>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a101f] shadow-2xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#121b2d] text-[10px] font-bold uppercase tracking-widest text-zinc-300 border-b border-white/10">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Target Product SKU</th>
                <th className="p-4 text-center">Volume</th>
                <th className="p-4">Settlement Valuation</th>
                <th className="p-4">MSISDN Phone</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4">M-Pesa Receipt Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-200">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4 text-xs font-mono text-zinc-400">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-4 font-bold text-white">{o.product_name}</td>
                  <td className="p-4 text-center font-mono text-zinc-300">{o.quantity}</td>
                  <td className="p-4 font-mono font-bold text-primary">KES {Number(o.total).toLocaleString()}</td>
                  <td className="p-4 text-xs font-mono text-zinc-300">{o.phone}</td>
                  <td className="p-4"><Pill s={o.status} /></td>
                  <td className="p-4 text-xs font-mono font-bold tracking-wider text-zinc-300">{o.mpesa_receipt ?? "—"}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    No active pipeline instances available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="border-b border-white/10 pb-5 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Safaricom API Processing Gateways</p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">Real-Time M-Pesa Callbacks</h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a101f] shadow-2xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#121b2d] text-[10px] font-bold uppercase tracking-widest text-zinc-300 border-b border-white/10">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Origin MSISDN</th>
                <th className="p-4">Gross Transacted</th>
                <th className="p-4">Node State</th>
                <th className="p-4">Receipt Identifier</th>
                <th className="p-4">Safaricom System Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-200">
              {txns.map((t) => (
                <tr key={t.id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4 text-xs font-mono text-zinc-400">{new Date(t.created_at).toLocaleString()}</td>
                  <td className="p-4 text-xs font-mono text-zinc-300">{t.phone}</td>
                  <td className="p-4 font-mono font-bold text-white">KES {Number(t.amount).toLocaleString()}</td>
                  <td className="p-4"><Pill s={t.status} /></td>
                  <td className="p-4 text-xs font-mono font-black tracking-wider text-primary">{t.mpesa_receipt ?? "—"}</td>
                  <td className="p-4 text-xs text-zinc-400 max-w-xs truncate">{t.result_desc ?? "—"}</td>
                </tr>
              ))}
              {txns.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    No direct callback transactions mapped yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Pill({ s }: { s: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", 
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    canceled: "bg-white/5 text-zinc-400 border-white/10",
  };
  return (
    <span className={`inline-block rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono shadow-sm ${map[s] ?? "bg-white/5 border-white/5 text-zinc-300"}`}>
      {s}
    </span>
  );
}

/* ============ STORE BANNERS & NOTIFICATIONS ============ */
function NewsTab() {
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [current, setCurrent] = useState<any[]>([]);
  const post = useServerFn(postNews);

  const load = () => supabase.from("news").select("*").order("created_at", { ascending: false }).limit(10).then(({ data }) => setCurrent(data ?? []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!message.trim()) return;
    try { await post({ data: { message, link: link || null } }); toast.success("News strip appended to shopfront stack"); setMessage(""); setLink(""); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Global Marketing Layout</p>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">Broadcast Ticker Banner</h1>
      </div>
      
      <div className="border border-white/10 rounded-xl p-6 bg-[#0a101f] shadow-xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Ticker Stream Message Text" value={message} onChange={setMessage} />
          <Input label="Action Navigation Anchor Link (Optional URL)" value={link} onChange={setLink} />
        </div>
        <button onClick={save} className="btn-neon mt-5 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider">
          Publish Live Ticker Instance
        </button>
      </div>
      
      <h2 className="mt-10 text-xl font-bold tracking-tight text-white">Active Historic Stack</h2>
      <div className="grid gap-3">
        {current.map((n) => (
          <div key={n.id} className="border border-white/10 flex items-center justify-between rounded-xl p-4 bg-[#0a101f]">
            <p className="text-sm font-medium text-zinc-200">{n.message}</p>
            <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono ${n.is_active ? "bg-primary/10 text-primary border border-primary/20" : "bg-white/5 text-zinc-500"}`}>{n.is_active ? "Live Pipeline" : "Archived Stack"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotifTab() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const send = useServerFn(broadcastNotification);
  
  const submit = async () => {
    try { const r = await send({ data: { title, body } }); toast.success(`Payload broadcasted successfully to ${r.sent} node devices.`); setTitle(""); setBody(""); }
    catch (e: any) { toast.error(e.message); }
  };
  
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">In-App Live Socket Push</p>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">Global Signal Broadcast</h1>
      </div>
      
      <div className="border border-white/10 rounded-xl p-6 bg-[#0a101f] shadow-xl">
        <div className="space-y-4">
          <Input label="Signal Title Header" value={title} onChange={setTitle} />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Push Body Content Text Payload</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#121b2d] px-4 py-3 text-sm text-white outline-none focus:border-primary/40 transition-colors resize-none" />
          </div>
        </div>
        <button onClick={submit} className="btn-neon mt-5 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider">
          Initiate Device Blast Broadcast
        </button>
      </div>
    </div>
  );
}

/* ============ CAROUSEL SLIDES MANAGEMENT ============ */
function CarouselSlidesTab() {
  const [slides, setSlides] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const upsert = useServerFn(upsertSlide);
  const del = useServerFn(deleteSlide);
  const reorder = useServerFn(reorderSlides);
  const fetchSlides = useServerFn(getHeroSlides);

  const load = async () => {
    setLoading(true);
    const { slides: data } = await fetchSlides({});
    setSlides(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (slide: any) => {
    try {
      await upsert({ data: slide });
      toast.success("Slide saved");
      setEditing(null);
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    try {
      await del({ data: { id } });
      toast.success("Deleted");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const moveSlide = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    const newSlides = [...slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    const updates = newSlides.map((s, idx) => ({ id: s.id, order_index: idx }));
    try {
      await reorder({ data: { slides: updates } });
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  if (loading) return <div className="text-center py-10 text-zinc-400">Loading slides...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Hero Canvas</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">Carousel Manager</h1>
        </div>
        <button onClick={() => setEditing({ image_url: "", title: "", tagline: "", link: "", is_active: true, order_index: slides.length })} className="btn-neon flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider">
          <Plus className="size-4" /> Add New Slide
        </button>
      </div>

      <div className="grid gap-4">
        {slides.map((slide, idx) => (
          <div key={slide.id} className="border border-white/10 rounded-xl p-4 bg-[#0a101f] flex items-center gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white truncate">{slide.title || "Untitled"}</p>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${slide.is_active ? "bg-primary/20 text-primary" : "bg-white/5 text-zinc-400"}`}>
                  {slide.is_active ? "Active" : "Hidden"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate">{slide.tagline || "—"}</p>
              <p className="text-xs text-zinc-500 font-mono truncate">Order: {slide.order_index}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => moveSlide(idx, "up")} disabled={idx === 0} className="rounded-lg border border-white/10 p-2 hover:bg-white/5 disabled:opacity-30"><ArrowUp className="size-4" /></button>
              <button onClick={() => moveSlide(idx, "down")} disabled={idx === slides.length-1} className="rounded-lg border border-white/10 p-2 hover:bg-white/5 disabled:opacity-30"><ArrowDown className="size-4" /></button>
              <button onClick={() => setEditing(slide)} className="rounded-lg border border-white/10 p-2 hover:bg-white/5"><Edit3 className="size-4" /></button>
              <button onClick={() => remove(slide.id)} className="rounded-lg border border-red-500/20 p-2 hover:bg-red-500/10 text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        {slides.length === 0 && <div className="text-center py-10 text-zinc-500">No slides yet. Add one to populate the carousel.</div>}
      </div>

      {editing && <SlideModal slide={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

function SlideModal({ slide, onSave, onClose }: any) {
  const [s, setS] = useState(slide);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `hero-${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setS({ ...s, image_url: data.publicUrl });
      toast.success("Image uploaded");
    } catch (e: any) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 p-6 bg-[#0a101f]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">{s.id ? "Edit Slide" : "New Slide"}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Image URL</label>
            <div className="mt-1 flex gap-2">
              <input value={s.image_url} onChange={(e) => setS({ ...s, image_url: e.target.value })} className="flex-1 rounded-xl border border-white/10 bg-[#121b2d] px-4 py-3 text-sm text-white outline-none" placeholder="https://..." />
              <label className="btn-neon cursor-pointer rounded-xl px-4 py-2 text-xs">Upload
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              </label>
            </div>
          </div>
          <Input label="Title (optional)" value={s.title ?? ""} onChange={(v) => setS({ ...s, title: v })} />
          <Input label="Tagline (optional)" value={s.tagline ?? ""} onChange={(v) => setS({ ...s, tagline: v })} />
          <Input label="Link (optional, e.g., /product/...)" value={s.link ?? ""} onChange={(v) => setS({ ...s, link: v })} />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={s.is_active} onChange={(e) => setS({ ...s, is_active: e.target.checked })} className="rounded accent-primary" />
              Active
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-xs text-zinc-300">Cancel</button>
          <button onClick={() => onSave(s)} className="btn-neon rounded-xl px-6 py-3 text-xs">Save Slide</button>
        </div>
      </div>
    </div>
  );
}