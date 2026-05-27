export function AdvertBanner() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 md:p-16">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-cobalt/40 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Print on demand</p>
              <h3 className="mt-3 font-display text-4xl leading-[0.95] md:text-6xl">
                Your art.<br />Our press.<br /><span className="neon-text">Stocked here.</span>
              </h3>
              <p className="mt-5 max-w-md text-foreground/80">
                Artists, sell your printed work on KAYSKY Market. Upload designs from your phone,
                we handle the print, the checkout, and the delivery.
              </p>
              <button className="btn-neon mt-6 rounded-full px-7 py-3 text-sm">List your art</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["GRAPHIC", "POSTER", "TEE", "TOTE", "HOODIE", "VINYL", "PRINT", "STICKER", "ZINE"].map((t) => (
                <div key={t} className="glass grid aspect-square place-items-center rounded-2xl font-display text-sm md:text-base">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
