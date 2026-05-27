## Kaysky Market — build plan

A marketplace for Kaysky's printed shirts & creative products, with admin tools, Google login, M-Pesa + card payments, and an AI helper. Visual language mirrors kaysky.co.ke: **electric cobalt blue** background, **neon lime-green** display type, oversized bold typography, streetwear energy, with **glassmorphism** layered on top for a modern art-gallery feel.

### Phase 1 — Storefront foundation (this turn)
What you'll see live after this phase:
- Design system locked to Kaysky colors (cobalt blue, neon lime, off-white, deep ink) with display + body font pairing
- Landing page with:
  - Bold hero (huge outlined display type over product imagery, marquee of categories)
  - **Circular glassmorphism product carousel** (PowerPoint-style — front card large, side cards recede on a circular arc)
  - Featured products grid with share button on each card
  - Advert banner / showcase strip
  - Cookies bar + dismissible news/notification bar at top
  - Footer
- Product detail page (gallery, description, share buttons, "Login to buy" gate)
- Floating AI help assistant (simple chat bubble, friendly tone)
- Popup featured-product modal on first visit
- Fully responsive, smooth animations

### Phase 2 — Auth + Cloud backend
- Enable Lovable Cloud
- Google sign-in (required before checkout) + email/password fallback
- `profiles`, `products`, `orders`, `notifications`, `user_roles` tables with RLS
- Admin role gate
- Seed a few sample products

### Phase 3 — Admin dashboard
- `/admin` login-gated by admin role
- Dashboard with stats: revenue, orders, pending/canceled/succeeded payments, top sellers, out-of-stock
- Product CRUD: add / edit / delete, price change, upload images from phone or file
- Notifications & news manager
- Live order/payment feed (admin gets a notification when payment is received)

### Phase 4 — Payments
- M-Pesa STK Push (Daraja API — needs your Consumer Key, Consumer Secret, Shortcode, Passkey)
- Card payments via Stripe (Lovable's seamless Stripe) **or** Paddle — I'll run the eligibility check
- Webhook → mark order paid → notify admin
- Payment statuses: pending / succeeded / canceled, visible in admin

### Phase 5 — Polish
- Newsletter, share-to-social with og:image, SEO meta per route, sitemap/robots, security review

### Technical notes
- TanStack Start + Tailwind v4 + shadcn (heavily customized)
- Glass carousel: custom component using transforms on a circular arc (no heavy 3D libs)
- All colors as oklch tokens in `src/styles.css` — no hardcoded colors in components
- Payments and admin features require Lovable Cloud (Phase 2 unlocks them)

### Questions before I start Phase 1
1. **Card payments**: Stripe (global, cards) or Paddle (handles tax for you)? I'll recommend after eligibility check in Phase 4 — fine to defer.
2. **Logo**: should I use a styled "KAYSKY" wordmark in neon lime, or do you want to upload the real logo later? (I'll use a wordmark now and you can swap.)
3. **Product images for Phase 1**: I'll generate placeholder printed-shirt visuals in the Kaysky style so the storefront looks real out of the gate. OK?

If you're happy with this plan, I'll start building Phase 1 immediately. You can also just say "go" and I'll assume yes to all three.