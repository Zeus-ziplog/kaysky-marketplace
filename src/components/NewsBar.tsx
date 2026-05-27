import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function NewsBar() {
  const [open, setOpen] = useState(true);
  const [msg, setMsg] = useState("New drop loading — sign up to be first");
  useEffect(() => {
    supabase.from("news").select("message").eq("is_active", true).order("created_at", { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setMsg(data[0].message); });
  }, []);
  if (!open) return null;
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs font-bold uppercase tracking-widest">
        <p className="truncate">{msg}</p>
        <button onClick={() => setOpen(false)} aria-label="Dismiss"><X className="size-4" /></button>
      </div>
    </div>
  );
}
