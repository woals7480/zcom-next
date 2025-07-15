type Props = {
  pageParam?: number;
  queryKey: [string, string, string];
};

export const getUserPosts = async ({ pageParam, queryKey }: Props) => {
  const [_1, _2, username] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/posts?cursor=${pageParam}`,
    {
      next: {
        tags: ["posts", "users", username],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
