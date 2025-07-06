import Link from "next/link";
import style from "./trend.module.css";
import { Hashtag } from "@/model/Hashtag";

type Props = {
  trend: Hashtag;
};

export default function Trend({ trend }: Props) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(trend.title)}`}
      className={style.container}
    >
      <div className={style.count}>{trend.tagId}</div>
      <div className={style.title}>{trend.title}</div>
      <div
        className={style.count}
      >{`${trend.count.toLocaleString()} posts`}</div>
    </Link>
  );
}
