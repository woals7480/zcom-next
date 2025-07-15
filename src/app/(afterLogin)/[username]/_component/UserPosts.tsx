"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUserPosts } from "../_lib/getUserPosts";
import Post from "@/app/(afterLogin)/_component/Post";
import { Post as IPost } from "@/model/Post";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

type Props = {
  username: string;
};
export default function UserPosts({ username }: Props) {
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [string, string, string],
    number
  >({
    queryKey: ["posts", "users", username],
    queryFn: getUserPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetching]);

  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["users", username]);
  if (user) {
    return (
      <>
        {data?.pages.flat().map((post) => (
          <Post key={post.postId} post={post} />
        ))}
        {!isFetching && (
          <div ref={ref} style={{ height: 1, backgroundColor: "red" }} />
        )}
      </>
    );
  }

  return null;
}
