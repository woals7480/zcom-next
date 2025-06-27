import { Post } from "@/model/Post";
import { QueryFunction } from "@tanstack/react-query";
import { SearchParams } from "next/dist/server/request/search-params";

export const getSearchResult: QueryFunction<
  Post[],
  [_1: string, _2: string, SearchParams: { q: string; pf?: string; f?: string }]
> = async ({ queryKey }) => {
  const [_1, _2, searchParams] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/${
      searchParams.q
    }?${searchParams.toString()}`,
    {
      next: {
        tags: ["posts", "search", searchParams.q],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
