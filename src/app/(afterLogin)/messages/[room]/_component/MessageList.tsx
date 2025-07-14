"use client";

import style from "@/app/(afterLogin)/messages/[room]/chatRoom.module.css";
import cx from "classnames";
import dayjs from "dayjs";
import {
  DefaultError,
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getMessages } from "../_lib/getMessages";
import { Message } from "@/model/Message";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useMessageStore } from "@/store/message";
import useSocket from "../_lib/useSocket";

interface Props {
  id: string;
}

export default function MessageList({ id }: Props) {
  const { data: session } = useSession();
  const [socket] = useSocket();
  const queryClient = useQueryClient();
  const [pageRendered, setPageRendered] = useState(false);
  const [adjustingScroll, setAdjustingScroll] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const shouldGoDown = useMessageStore().shouldGoDown;
  const setGoDown = useMessageStore().setGoDown;
  const {
    data: messages,
    isFetching,
    hasPreviousPage,
    fetchPreviousPage,
  } = useInfiniteQuery<
    Message[],
    DefaultError,
    InfiniteData<Message[]>,
    [string, { senderId: string; receiverId: string }, string],
    number
  >({
    queryKey: [
      "rooms",
      { senderId: session?.user?.email!, receiverId: id },
      "messages",
    ],
    queryFn: getMessages,
    initialPageParam: 0,
    enabled: !!(session?.user?.email && id),
    getPreviousPageParam: (firstPage) => firstPage.at(0)?.messageId,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.messageId,
  });
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      if (!isFetching && hasPreviousPage && !adjustingScroll) {
        const prevHeight = listRef.current?.scrollHeight || 0;
        fetchPreviousPage().then(() => {
          setAdjustingScroll(true);
          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollTop =
                listRef.current.scrollHeight - prevHeight;
            }
          }, 0);
          setAdjustingScroll(false);
        });
      }
    }
  }, [inView, isFetching, hasPreviousPage, fetchPreviousPage, adjustingScroll]);

  let hasMessages = !!messages;
  useEffect(() => {
    if (hasMessages) {
      setPageRendered(true);
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }
  }, [hasMessages]);

  useEffect(() => {
    if (shouldGoDown) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
        setGoDown(false);
      }
    }
  }, [shouldGoDown, setGoDown]);

  useEffect(() => {
    socket?.on("receiveMessage", (data) => {
      console.log("data", data);
      // 리액트 쿼리 데이터에 추가
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
        newLastPage.push(data);
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
    });
    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket]);

  return (
    <div className={style.list} ref={listRef}>
      {!adjustingScroll && pageRendered && (
        <div ref={ref} style={{ height: 1 }} />
      )}
      {messages?.pages.flat().map((m) => {
        if (m.senderId === session?.user?.email) {
          // 내 메시지면
          return (
            <div
              key={m.messageId}
              className={cx(style.message, style.myMessage)}
            >
              <div className={style.content}>{m.content}</div>
              <div className={style.date}>
                {dayjs(m.createdAt).format("YYYY년 MM월 DD일 A HH시 mm분")}
              </div>
            </div>
          );
        }
        return (
          <div
            key={m.messageId}
            className={cx(style.message, style.yourMessage)}
          >
            <div className={style.content}>{m.content}</div>
            <div className={style.date}>
              {dayjs(m.createdAt).format("YYYY년 MM월 DD일 A HH시 mm분")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
