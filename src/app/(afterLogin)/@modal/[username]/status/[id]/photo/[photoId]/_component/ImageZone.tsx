"use client";

import style from "@/app/(afterLogin)/@modal/[username]/status/[id]/photo/[photoId]/photoModal.module.css";
import { getSinglePost } from "@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePost";
import ActionButtons from "@/app/(afterLogin)/_component/ActionButtons";
import { Post as IPost } from "@/model/Post";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: string;
};

export default function ImageZone({ id }: Props) {
  const { data: post, error } = useQuery<
    IPost,
    Object,
    IPost,
    [_1: string, _2: string]
  >({
    queryKey: ["posts", id],
    queryFn: getSinglePost,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  return (
    <div className={style.imageZone}>
      <img src={post?.Images[0].link} alt={post?.content} />
      <div
        className={style.image}
        style={{ backgroundImage: `url(${post?.Images[0].link})` }}
      />
      <div className={style.buttonZone}>
        <div className={style.buttonInner}>
          <ActionButtons white />
        </div>
      </div>
    </div>
  );
}
