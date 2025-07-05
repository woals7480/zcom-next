type Props = {
  pageParam?: number;
};

export async function getFollowingPosts({ pageParam }: Props) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/followings?cursor=${pageParam}`,
    {
      next: {
        tags: ["posts", "followings"],
      },
      cache: "force-cache",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
