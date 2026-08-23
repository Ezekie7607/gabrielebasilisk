import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { LocaleProvider, useI18n } from "@/lib/locale";
import appCss from "../styles.css?url";

const APP_NAME = "BASILISK — Gabriele Leoni";
const SITE_URL = "https://gabrielebasilisk.vercel.app";
const DESCRIPTION =
  "Gabriele Leoni — web developer, designer, AI systems operator. I don't sell potential. I build machines that win.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#000000" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "BASILISK" },
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@BasiliskosLeo" },
      { name: "twitter:title", content: APP_NAME },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og.jpg` },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preload", href: "/fonts/switzer-400.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/switzer-900.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/tempting.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "canonical", href: SITE_URL },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <LocaleProvider>
      <Shell />
    </LocaleProvider>
  );
}

function Shell() {
  const { lang } = useI18n();
  return (
    <html lang={lang} className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg font-sans">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
