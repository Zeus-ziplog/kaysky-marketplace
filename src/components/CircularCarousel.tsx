import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  category: string | null;
  price: number;
}

interface CircularCarouselProps {
  products: Product[];
}

export function CircularCarousel({ products }: CircularCarouselProps) {
  const [index, setIndex] = useState(0);
  const n = products.length;

  useEffect(() => {
    if (n === 0) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n]);

  const next = () => setIndex((i) => (i + 1) % n);
  const prev = () => setIndex((i) => (i - 1 + n) % n);

  if (n === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Featured</p>
            <h2 className="mt-2 font-display text-5xl md:text-7xl">Showroom</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={prev} aria-label="Previous" className="glass rounded-full p-3 hover:bg-white/20"><ChevronLeft className="size-5" /></button>
            <button onClick={next} aria-label="Next"     className="glass rounded-full p-3 hover:bg-white/20"><ChevronRight className="size-5" /></button>
          </div>
        </div>

        <div className="relative mx-auto h-[460px] w-full max-w-5xl md:h-[560px]" style={{ perspective: "1400px" }}>
          {products.map((p, i) => {
            let offset = i - index;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;

            const abs = Math.abs(offset);
            const isFront = offset === 0;
            const translateX = offset * 220;
            const translateZ = -abs * 220;
            const rotateY = offset * -18;
            const scale = isFront ? 1 : 0.82 - abs * 0.06;
            const opacity = abs > 2 ? 0 : 1 - abs * 0.25;
            const zIndex = 50 - abs;

            return (
              <button
                key={p.id}
                onClick={() => setIndex(i)}
                aria-label={`Show ${p.name}`}
                className="absolute left-1/2 top-1/2 transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{
                  transform: `translate(-50%, -50%) translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className={`glass-strong overflow-hidden rounded-3xl ${isFront ? "shadow-[var(--shadow-deep)] ring-2 ring-primary/60" : ""}`}>
                  <div className="relative h-[360px] w-[280px] md:h-[460px] md:w-[360px]">
                    <img
                      src={p.image_url || "/placeholder-image.jpg"}
                      alt={p.name}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{p.category || "Art"}</p>
                      <h3 className="mt-1 font-display text-2xl md:text-3xl">{p.name}</h3>
                      <p className="text-sm text-foreground/80">KES {p.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-10 bg-primary" : "w-4 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}