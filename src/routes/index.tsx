import { createFileRoute } from "@tanstack/react-router";
import { Arsenal } from "@/components/arsenal";
import { ContactBlock } from "@/components/contact-block";
import { Doctrine } from "@/components/doctrine";
import { Hero } from "@/components/hero";
import PixelField from "@/components/pixel-field";
import { ScrollRoot } from "@/components/scroll-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { MotionGallery } from "@/components/motion-gallery";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="relative">
      <ScrollRoot />
      <PixelField />
      <div className="pixel-grid pointer-events-none fixed inset-0 z-[1] opacity-15" />
      <div className="grain-layer pointer-events-none fixed inset-0 z-50 mix-blend-overlay" />
      <SiteNav />
      <main className="relative z-10 text-fg">
        <Hero />
        <MotionGallery />
        <Doctrine />
        <Arsenal />
        <ContactBlock />
      </main>
      <SiteFooter />
    </div>
  );
}
