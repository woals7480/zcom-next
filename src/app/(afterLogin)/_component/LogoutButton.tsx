"use client";

import { signOut, useSession } from "next-auth/react";
import style from "./logoutButton.module.css";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

type Props = {
  me: Session | null;
};

export default function LogoutButton({ me }: Props) {
  const router = useRouter();

  const onLogout = () => {
    signOut({ redirect: false }).then(() => {
      router.replace("/");
    });
  };

  if (!me?.user) {
    return null;
  }

  return (
    <button className={style.logOutButton} onClick={onLogout}>
      <div className={style.logOutUserImage}>
        <img src={me.user?.image as string} alt={me.user?.email as string} />
      </div>
      <div className={style.logOutUserName}>
        <div>{me.user?.name}</div>
        <div>@{me.user?.email}</div>
      </div>
    </button>
  );
}
