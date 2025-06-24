"use client";

import { useSession } from "next-auth/react";
import style from "./followRecommend.module.css";
import { useRouter } from "next/navigation";

export default function FollowRecommend() {
  const { data } = useSession();
  const router = useRouter();
  const onFollow = () => {
    if (!data?.user) {
      router.replace("/login");
    }
  };

  const user = {
    id: "elonmusk",
    nickname: "Elon Musk",
    image: "/yRsRRjGO.jpg",
  };

  return (
    <div className={style.container}>
      <div className={style.userLogoSection}>
        <div className={style.userLogo}>
          <img src={user.image} alt={user.id} />
        </div>
      </div>
      <div className={style.userInfo}>
        <div className={style.title}>{user.nickname}</div>
        <div className={style.count}>@{user.id}</div>
      </div>
      <div className={style.followButtonSection}>
        <button onClick={onFollow}>팔로우</button>
      </div>
    </div>
  );
}
