import { Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="relative mt-10 border-t border-border bg-cobalt-deep/40">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-5xl"><span className="text-primary">K</span>AYSKY</p>
            <p className="mt-3 max-w-sm text-sm text-foreground/80">
              Design that speaks. Print that stands out. Nairobi-based, worldwide-shipped.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed — welcome!"); }} className="mt-6 flex max-w-sm gap-2">
              <input type="email" required placeholder="Your email" className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary" />
              <button className="btn-neon rounded-full px-5 text-xs">Subscribe</button>
            </form>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Shop</p>
            <ul className="space-y-2 text-sm">
              <li>Tees</li><li>Hoodies</li><li>Accessories</li><li>Limited</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>+254 700 333 459</li>
              <li>hello@kaysky.co.ke</li>
              <li>Nairobi, Kenya</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a aria-label="Instagram" className="grid size-10 place-items-center rounded-full glass hover:bg-primary hover:text-primary-foreground" href="#"><Instagram className="size-4" /></a>
              <a aria-label="Twitter"   className="grid size-10 place-items-center rounded-full glass hover:bg-primary hover:text-primary-foreground" href="#"><Twitter className="size-4" /></a>
              <a aria-label="Facebook"  className="grid size-10 place-items-center rounded-full glass hover:bg-primary hover:text-primary-foreground" href="#"><Facebook className="size-4" /></a>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-foreground/60">
          © {new Date().getFullYear()} KAYSKY Market. All wearable art reserved.
        </p>
      </div>
    </footer>
  );
}
