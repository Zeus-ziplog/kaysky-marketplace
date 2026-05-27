import { Link } from "@tanstack/react-router";
import { ShoppingBag, User, Search, Menu, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30">
      <div className="glass-strong border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-3xl tracking-tight">
              <span className="text-primary">K</span>AYSKY
            </span>
            <span className="hidden rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground sm:inline-block">market</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-widest md:flex">
            <Link to="/" className="hover:text-primary">Shop</Link>
            <a href="#drops" className="hover:text-primary">Drops</a>
            {isAdmin && <Link to="/admin" className="text-primary hover:underline">Admin</Link>}
          </nav>
          <div className="relative flex items-center gap-2">
            <button aria-label="Search" className="rounded-full p-2 hover:bg-white/10"><Search className="size-5" /></button>
            {user ? (
              <button onClick={() => setMenu(!menu)} aria-label="Account" className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase">
                {(user.email ?? "U")[0]}
              </button>
            ) : (
              <Link to="/login" className="btn-neon rounded-full px-4 py-2 text-xs">Sign in</Link>
            )}
            <button aria-label="Bag" className="relative rounded-full p-2 hover:bg-white/10">
              <ShoppingBag className="size-5" />
            </button>
            <button aria-label="Menu" onClick={() => setOpen(!open)} className="rounded-full p-2 hover:bg-white/10 md:hidden">
              <Menu className="size-5" />
            </button>

            {menu && user && (
              <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl glass-strong p-2 text-sm">
                <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-foreground/60 truncate">{user.email}</p>
                <Link to="/account" onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/10"><User className="size-4" /> My account</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/10"><ShieldCheck className="size-4 text-primary" /> Admin</Link>}
                <button onClick={() => { setMenu(false); signOut(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-white/10"><LogOut className="size-4" /> Sign out</button>
              </div>
            )}
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-3 border-t border-border px-4 py-4 text-sm font-bold uppercase tracking-widest md:hidden">
            <Link to="/" onClick={() => setOpen(false)}>Shop</Link>
            <a href="#drops" onClick={() => setOpen(false)}>Drops</a>
            {user && <Link to="/account" onClick={() => setOpen(false)}>My account</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
            {!user && <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>}
          </nav>
        )}
      </div>
    </header>
  );
}
