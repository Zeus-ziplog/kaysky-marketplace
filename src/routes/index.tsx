import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewsBar } from "@/components/NewsBar";
import { Hero } from "@/components/Hero";
import { CircularCarousel } from "@/components/CircularCarousel";
import { ProductGrid } from "@/components/ProductGrid";
import { AdvertBanner } from "@/components/AdvertBanner";
import { AIAssistant } from "@/components/AIAssistant";
import { CookieBar } from "@/components/CookieBar";
import { FeaturedPopup } from "@/components/FeaturedPopup";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KAYSKY Market — Wearable Art. Printed in Nairobi." },
      { name: "description", content: "Shop limited printed tees, hoodies and accessories from KAYSKY." },
    ],
  }),
  component: Home,
});

function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setProducts(data || []));
  }, []);

  return (
    <>
      <NewsBar />
      <Navbar />
      <main>
        <Hero />
        {products.length > 0 && <CircularCarousel products={products} />}
        <ProductGrid />
        <AdvertBanner />
      </main>
      <Footer />
      <AIAssistant />
      <CookieBar />
      <FeaturedPopup />
    </>
  );
}