import heroImg from "@/assets/hero-models.jpg";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden noise">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-16 md:grid-cols-12 md:pb-20 md:pt-24">
        <div className="md:col-span-4 md:py-10">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-primary">The Expert Print Team</p>
          <div className="mb-8 h-px w-24 bg-primary" />
          <div className="space-y-6">
            <Stat n="496" label="Happy Clients" />
            <Stat n="124" label="Drops Released" />
            <Stat n="447" label="Designs Printed" />
          </div>
        </div>

        <div className="relative md:col-span-5">
          <img
            src={heroImg}
            width={1600}
            height={1200}
            alt="Two models wearing bold printed Kaysky shirts"
            className="relative z-10 mx-auto h-[420px] w-full rounded-2xl object-cover md:h-[600px]"
          />
          <h1 className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-center font-display leading-[0.82] tracking-tighter">
            <span className="outline-display text-[18vw] md:text-[10vw]">
              CREATIVE<br />MARKET
            </span>
          </h1>
        </div>

        <div className="flex flex-col justify-between md:col-span-3 md:py-10">
          <div>
            <p className="text-lg leading-snug text-foreground/90">
              Design that speaks. Print that stands out.
              <br />Wearable art straight from the studio.
            </p>
          </div>
          <a href="#drops" className="btn-neon mt-8 inline-flex items-center gap-2 self-start rounded-full px-6 py-3 text-sm">
            Shop the drop <ArrowRight className="size-4" />
          </a>
        </div>
      </div>

      {/* category marquee */}
      <div className="border-y border-border bg-cobalt-deep/30 py-4">
        <div className="marquee text-primary font-display text-3xl md:text-5xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10">
              <span>TEES</span><Dot /><span>HOODIES</span><Dot /><span>PRINTS</span><Dot /><span>ACCESSORIES</span><Dot /><span>LIMITED</span><Dot /><span>STREET ART</span><Dot />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="flex items-end gap-2 font-display text-5xl leading-none">
        {n}<span className="text-primary text-3xl">+</span>
      </div>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-foreground/70">{label}</p>
    </div>
  );
}

function Dot() {
  return <span className="inline-block size-2 rounded-full bg-primary" />;
}
