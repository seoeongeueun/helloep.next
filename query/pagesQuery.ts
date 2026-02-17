import { getPages } from "@/actions";
import { queryOptions } from "@tanstack/react-query";
import type { SidebarSlug } from "@/types";

const pagesKey = {
  all: ["pages"] as const,
  bySlug: (slug: SidebarSlug) => [...pagesKey.all, "slug", slug] as const,
};

export const pagesQueries = {
  bySlug: (slug: SidebarSlug) => {
    return queryOptions({
      queryKey: pagesKey.bySlug(slug),
      queryFn: async () => getPages({ slug }),
    });
  },
};
