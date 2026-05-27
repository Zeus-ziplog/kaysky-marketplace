import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

async function isAdminUser(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin");
  if (error) throw new Error(`Failed to check admin: ${error.message}`);
  return data && data.length > 0;
}

async function getUserIdFromRequest(): Promise<string> {
  const request = getRequest();
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing or invalid token");
  }
  const token = authHeader.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) throw new Error("Unauthorized: Invalid token");
  return data.user.id;
}

// ----------------------------------------------------------------------
// Claim Admin
// ----------------------------------------------------------------------

export const claimAdminIfFirst = createServerFn({ method: "POST" }).handler(async () => {
  const userId = await getUserIdFromRequest();
  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  if ((count ?? 0) > 0) return { claimed: false };
  const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
  if (error) throw new Error(error.message);
  return { claimed: true };
});

// ----------------------------------------------------------------------
// Dashboard Stats
// ----------------------------------------------------------------------

export const adminStats = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getUserIdFromRequest();
  const isAdmin = await isAdminUser(userId);
  if (!isAdmin) throw new Error("Admin only");

  const [orders, products, mpesa] = await Promise.all([
    supabaseAdmin.from("orders").select("id, status, total, created_at, product_name, quantity"),
    supabaseAdmin.from("products").select("id, name, stock, is_active, price"),
    supabaseAdmin.from("mpesa_transactions").select("id, status, amount, created_at"),
  ]);

  const ord = orders.data ?? [];
  const prods = products.data ?? [];
  const txns = mpesa.data ?? [];

  const revenue = ord.filter((o) => o.status === "paid").reduce((s, o) => s + Number(o.total), 0);
  const counts = {
    pending: ord.filter((o) => o.status === "pending").length,
    paid: ord.filter((o) => o.status === "paid").length,
    failed: ord.filter((o) => o.status === "failed").length,
    canceled: ord.filter((o) => o.status === "canceled").length,
  };
  const outOfStock = prods.filter((p) => p.stock === 0).length;

  // top sellers
  const map = new Map<string, number>();
  ord.filter((o) => o.status === "paid").forEach((o) => {
    map.set(o.product_name, (map.get(o.product_name) ?? 0) + o.quantity);
  });
  const topSellers = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

  // daily revenue (last 14 days)
  const days: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days[d.toISOString().slice(0, 10)] = 0;
  }
  ord.filter((o) => o.status === "paid").forEach((o) => {
    const d = (o.created_at as string).slice(0, 10);
    if (d in days) days[d] += Number(o.total);
  });
  const daily = Object.entries(days).map(([date, total]) => ({ date: date.slice(5), total }));

  return {
    revenue, counts, outOfStock,
    totalProducts: prods.length,
    totalOrders: ord.length,
    topSellers, daily,
    mpesaSuccess: txns.filter((t) => t.status === "success").length,
    mpesaPending: txns.filter((t) => t.status === "pending").length,
    mpesaFailed: txns.filter((t) => t.status === "failed").length,
  };
});

// ----------------------------------------------------------------------
// Products
// ----------------------------------------------------------------------

const ProductInput = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  tagline: z.string().max(300).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  price: z.number().min(0).max(1_000_000),
  category: z.string().max(80).optional().nullable(),
  stock: z.number().int().min(0).max(100000),
  image_url: z.string().max(2000).optional().nullable(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const upsertProduct = createServerFn({ method: "POST" })
  .inputValidator((d) => ProductInput.parse(d))
  .handler(async ({ data }) => {
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) throw new Error("Admin only");
    if (data.id) {
      const { error } = await supabaseAdmin.from("products").update(data).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    } else {
      const { data: row, error } = await supabaseAdmin.from("products").insert(data).select().single();
      if (error) throw new Error(error.message);
      return { ok: true, id: row.id };
    }
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) throw new Error("Admin only");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----------------------------------------------------------------------
// News
// ----------------------------------------------------------------------

export const postNews = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({
    message: z.string().min(1).max(500),
    link: z.string().url().max(2000).optional().nullable(),
  }).parse(d))
  .handler(async ({ data }) => {
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) throw new Error("Admin only");
    await supabaseAdmin.from("news").update({ is_active: false }).eq("is_active", true);
    const { error } = await supabaseAdmin.from("news").insert({ message: data.message, link: data.link ?? null });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----------------------------------------------------------------------
// Notifications
// ----------------------------------------------------------------------

export const broadcastNotification = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({
    title: z.string().min(1).max(200),
    body: z.string().max(1000).optional(),
  }).parse(d))
  .handler(async ({ data }) => {
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) throw new Error("Admin only");
    const { data: profs } = await supabaseAdmin.from("profiles").select("id");
    if (profs && profs.length) {
      const rows = profs.map((p: any) => ({ user_id: p.id, title: data.title, body: data.body ?? null }));
      const { error } = await supabaseAdmin.from("notifications").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { ok: true, sent: profs?.length ?? 0 };
  });

// ----------------------------------------------------------------------
// Hero Slides Management
// ----------------------------------------------------------------------

const SlideInput = z.object({
  id: z.string().uuid().optional(),
  image_url: z.string().url().min(1),
  title: z.string().max(100).optional().nullable(),
  tagline: z.string().max(100).optional().nullable(),
  link: z.string().max(500).optional().nullable(),   // removed .url() to allow relative paths
  order_index: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

export const getHeroSlides = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("hero_slides")
    .select("*")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return { slides: data ?? [] };
});

export const upsertSlide = createServerFn({ method: "POST" })
  .inputValidator((d) => SlideInput.parse(d))
  .handler(async ({ data }) => {
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) throw new Error("Admin only");

    if (data.id) {
      const { error } = await supabaseAdmin
        .from("hero_slides")
        .update({
          image_url: data.image_url,
          title: data.title ?? null,
          tagline: data.tagline ?? null,
          link: data.link ?? null,
          order_index: data.order_index ?? 0,
          is_active: data.is_active ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    } else {
      const { data: row, error } = await supabaseAdmin
        .from("hero_slides")
        .insert({
          image_url: data.image_url,
          title: data.title ?? null,
          tagline: data.tagline ?? null,
          link: data.link ?? null,
          order_index: data.order_index ?? 0,
          is_active: data.is_active ?? true,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, id: row.id };
    }
  });

export const deleteSlide = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) throw new Error("Admin only");

    const { error } = await supabaseAdmin.from("hero_slides").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderSlides = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ slides: z.array(z.object({ id: z.string().uuid(), order_index: z.number() })) }).parse(d))
  .handler(async ({ data }) => {
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) throw new Error("Admin only");

    for (const slide of data.slides) {
      await supabaseAdmin
        .from("hero_slides")
        .update({ order_index: slide.order_index })
        .eq("id", slide.id);
    }
    return { ok: true };
  });