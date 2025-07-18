import style from "./profile.module.css";
import {
  dehydrate,
  HydrationBoundary,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import { getUserPosts } from "./_lib/getUserPosts";
import UserPosts from "./_component/UserPosts";
import UserInfo from "./_component/UserInfo";
import { getUserServer } from "./_lib/getUserServer";
import { auth } from "@/auth";
import { User } from "@/model/User";
import { Metadata } from "next";
import { Post } from "@/model/Post";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user: User = await getUserServer({ queryKey: ["users", username] });

  return {
    title: `${user.nickname} (${user.id}) / Z`,
    description: `${user.nickname} (${user.id}) 프로필`,
  };
}

export default async function Profile(props: Props) {
  const { username } = await props.params;
  const session = await auth();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users", username],
    queryFn: getUserServer,
  });
  await queryClient.prefetchInfiniteQuery<
    Post[],
    Object,
    InfiniteData<Post[]>,
    [string, string, string],
    number
  >({
    queryKey: ["posts", "users", username],
    queryFn: getUserPosts,
    initialPageParam: 0,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={style.main}>
      <HydrationBoundary state={dehydratedState}>
        <UserInfo username={username} session={session} />
        <div>
          <UserPosts username={username} />
        </div>
      </HydrationBoundary>
    </main>
  );
}
