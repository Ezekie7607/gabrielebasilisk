import { profile } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/60 text-fg">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="font-pixel text-micro tracking-widest text-muted">
          © 2026 {profile.name} · {profile.brand}
        </p>
      </div>
    </footer>
  );
}
