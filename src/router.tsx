import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent, AppNotFoundComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    // Single-route site: anything that is not "/" is a dead path (stray backlinks, bot probes).
    // Without this the router falls back to a bare default and the response risks reading as a
    // soft 404 to crawlers.
    defaultNotFoundComponent: AppNotFoundComponent,
  });
}
