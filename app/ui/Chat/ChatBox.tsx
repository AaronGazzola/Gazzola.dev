"use client";
import Message from "./Message";
import Editor, { OnEditorChange } from "./Editor/Editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as idGen } from "uuid";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $isParagraphNode, LexicalNode } from "lexical";
import { Method, Question, Role } from "@/app/lib/constants";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import useScreenHeight from "@/app/hooks/useScreenHeight";
import Image from "next/image";

// TODO:
// - Handle read stream
// - Remove lexical?

type Message = {
  id: string;
  message: string;
  isUser: boolean;
  isNew?: boolean;
};

const theme = {};

function onError(error: any) {
  console.error(error);
}

const initialConfig = {
  namespace: "MyEditor",
  theme,
  onError,
};

const ChatBox = () => {
  useScreenHeight();
  return (
    <div className="flex flex-col w-full h-screen px-5 sm:px-10 items-center relative overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <Chat />
      </LexicalComposer>

      <div className="absolute inset-0 -z-10 overflow-hidden flex items-center justify-center ">
        <div className="absolute inset-0 bg-black z-10 bg-overlay" />
        <div className="absolute top-0 right-0 left-0 h-36 z-10 top-vignette" />
        <Image
          className="object-cover object-center h-full w-full"
          src="/Astronaut in code with moon.png"
          alt="Astronaut in cyberspace background image"
          width={1456}
          height={832}
        />
      </div>
    </div>
  );
};

const Chat = () => {
  // TODO: replace background is loaded with scroll trigger
  const bgIsLoaded = true;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      isUser: false,
      message:
        "Hello, please select or type a question to learn about Aaron and his work.",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, seIstLoading] = useState(false);
  const [editorWillBlurNextUpdate, setEditorWillBlurNextUpdate] =
    useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [editor] = useLexicalComposerContext();

  const onEmit = useCallback(
    async (messageArg = "") => {
      const messageVar = messageArg || message;
      seIstLoading(true);
      setMessages((prev) => [
        ...prev,
        { id: idGen(), isUser: true, message: messageVar },
      ]);
      setMessage("");
      editor.update(() => {
        $getRoot().clear();
      });
      setEditorWillBlurNextUpdate(true);
      try {
        const res = await fetch("/api/chat", {
          method: Method.Post,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageVar,
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: idGen(),
            isUser: false,
            message: data.message,
            isNew: true,
          },
        ]);
      } catch (err: any) {
        // TODO: handle error
        console.error(err.response?.data.message);
      } finally {
        seIstLoading(false);
      }
    },
    [editor, message]
  );

  // TODO: remove?
  // function updateScroll() {
  //   var element = scrollRef.current;
  //   if (!element) return;
  //   element.scrollTop = element.scrollHeight;
  //   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  // }

  const onEditorChange: OnEditorChange = (editorState) => {
    let messageText = "";
    editorState.read(() => {
      const root = $getRoot();
      messageText = root
        .getChildren()
        .reduce((arr: string[], child: LexicalNode) => {
          if ($isParagraphNode(child)) arr.push(child.getTextContent());
          return arr;
        }, [])
        .join("\n");
    });
    setMessage(messageText);
  };

  const onSelectQuestion = (question: Question) => {
    switch (question) {
      case Question.About:
        return onEmit("Who is this Aaron guy and why should I hire him??");
      case Question.Porfiolio:
        return onEmit(
          "Did he make This web app (Gazzola.dev)? What else has he made? Give me some links!"
        );
      case Question.Availability:
        return onEmit("When is he available to hire?");
      case Question.Reviews:
        return onEmit("Show me some reviews!");
      case Question.Contact:
        return onEmit("How can I contact him?");
    }
  };

  // useEffect(updateScroll, [messages]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      if (editorWillBlurNextUpdate) {
        editor.blur();
        setEditorWillBlurNextUpdate(false);
      }
    });
  });
  // TODO: use clsx
  return (
    <div className="absolute inset-5 flex flex-col items-center">
      <div
        className={[
          "grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 opacity-0 w-full flex flex-col items-center pr-3 pt-4 max-w-[650px] h-full",
          bgIsLoaded ? "expand" : "",
        ].join(" ")}
      >
        <div
          className={[
            "w-full h-full flex flex-col items-left opacity-0",
            bgIsLoaded ? "fade-in-content" : "",
          ].join(" ")}
        >
          <div
            ref={scrollRef}
            className="grow scrollbar scrollbar-track scrollbar-thumb overflow-y-scroll pr-7 sm:pr-10 pt-3"
          >
            {messages.map((message) => (
              <Message
                key={message.id}
                role={message.isUser ? Role.User : Role.AI}
                message={message.message}
                isNew={message.isNew}
                isInitial={message.id === "init"}
                onSelectQuestion={onSelectQuestion}
              />
            ))}
            <Message isLoading={isLoading} />
          </div>
          <Editor onChange={onEditorChange} onEmit={onEmit} message={message} />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
