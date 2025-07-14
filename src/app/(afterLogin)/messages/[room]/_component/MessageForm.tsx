"use client";

import TextareaAutosize from "react-textarea-autosize";
import style from "./MessageForm.module.css";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import useSocket from "../_lib/useSocket";
import { useSession } from "next-auth/react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/model/Message";
import { useMessageStore } from "@/store/message";

interface Props {
  id: string;
}

export default function MessageForm({ id }: Props) {
  const [content, setContent] = useState("");
  const [socket, disconnect] = useSocket();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const setGoDown = useMessageStore().setGoDown;

  const onChangeContent: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!session?.user?.email) {
      return;
    }

    //소켓 사용
    socket?.emit("sendMessage", {
      senderId: session?.user?.email,
      receiverId: id,
      content,
    });

    // 리액트 쿼리 데이터 추가
    const ids = [session?.user?.email, id];
    ids.sort();
    const exMessages = queryClient.getQueryData([
      "rooms",
      {
        senderId: session?.user?.email,
        receiverId: id,
      },
      "messages",
    ]) as InfiniteData<Message[]>;
    if (exMessages && typeof exMessages === "object") {
      const newMessages = {
        ...exMessages,
        pages: [...exMessages.pages],
      };
      const lastPage = newMessages.pages.at(-1);
      const newLastPage = lastPage ? [...lastPage] : [];
      let lastMessageId = lastPage?.at(-1)?.messageId;
      newLastPage.push({
        senderId: session?.user?.email,
        receiverId: id,
        content,
        room: ids.join("-"),
        messageId: lastMessageId ? lastMessageId + 1 : 1,
        createdAt: new Date(),
      });
      newMessages.pages[newMessages.pages.length - 1] = newLastPage;
      queryClient.setQueryData(
        [
          "rooms",
          { senderId: session?.user?.email, receiverId: id },
          "messages",
        ],
        newMessages
      );
      setGoDown(true);
    }

    setContent("");
  };

  return (
    <div className={style.formZone}>
      <form className={style.form} onSubmit={onSubmit}>
        <TextareaAutosize
          placeholder="새 쪽지 작성하기"
          onChange={onChangeContent}
          value={content}
        />
        <button
          className={style.submitButton}
          type="submit"
          disabled={!content?.trim()}
        >
          <svg
            viewBox="0 0 24 24"
            width={18}
            aria-hidden="true"
            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
          >
            <g>
              <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
}
