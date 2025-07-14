import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import MessageForm from "./_component/MessageForm";
import { auth } from "@/auth";
import { QueryClient } from "@tanstack/react-query";
import { getUserServer } from "../../[username]/_lib/getUserServer";
import { UserInfo } from "./_component/UserInfo";
import WebSocketComponent from "./_component/WebSocketComponent";
import style from "./chatRoom.module.css";
import MessageList from "./_component/MessageList";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  params: {
    room: string;
  };
};

export default async function ChatRoom({ params }: Props) {
  const session = await auth();
  const rooms = await params;
  const ids = rooms.room.split("-").filter((v) => v !== session?.user?.email);
  if (!ids) {
    return null;
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user", ids[0]],
    queryFn: getUserServer,
  });
  const messages = [
    {
      messageId: 1,
      roomId: 123,
      id: "zerohch0",
      content: "안녕하세요.",
      createdAt: new Date(),
    },
    {
      messageId: 2,
      roomId: 123,
      id: "hero",
      content: "안녕히가세요.",
      createdAt: new Date(),
    },
  ];

  return (
    <main className={style.main}>
      <UserInfo id={ids[0]} />
      <WebSocketComponent />
      <MessageList id={ids[0]} />
      <MessageForm id={ids[0]} />
    </main>
  );
}
