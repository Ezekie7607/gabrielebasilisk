import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-primary" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-lg font-medium">Something went wrong</h1>
      <p className="max-w-md font-sans text-sm break-words text-muted">
        {error.message || "An unexpected error occurred. Try reloading the page."}
      </p>
    </main>
  );
}

export function AppNotFoundComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <h1 className="font-display text-lg">Pagina non trovata</h1>
      <p className="max-w-md font-sans text-sm text-muted">
        Questo indirizzo non esiste. Il sito è una pagina sola.
      </p>
      <a href="/" className="font-pixel text-label tracking-widest text-fg underline underline-offset-4">
        Torna alla pagina
      </a>
    </main>
  );
}
