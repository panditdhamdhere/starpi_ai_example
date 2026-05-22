import React from "react";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "../ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "../ai-elements/message";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "../ai-elements/prompt-input";
// import { m } from "motion/react";

export type WorkspaceChatMode = "chat" | "code";

type ChatMessageMetadata = {
  conversationId?: string;
};

type WorkspaceAiChatProps = {
  title: string;
  badge: string;
  mode: WorkspaceChatMode;
  emptyState: {
    icon: ReactNode;
    title: string;
    description: string;
  };
  placeholder: string;
};

const WorkspaceAiChat = ({
  title,
  badge,
  mode,
  emptyState,
  placeholder,
}: WorkspaceAiChatProps) => {
  const [input, setInput] = useState("");
  const conversationIdRef = useRef<string | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            conversationId: conversationIdRef.current ?? undefined,
            mode,
          },
        }),
      }),
    [mode],
  );

  const { messages, sendMessage, status, stop } = useChat({
    transport,
    onFinish: ({ message }) => {
      const meta = message.metadata as ChatMessageMetadata;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text) return;

    sendMessage({ text });
    setInput("");
  };

  const isBusy = status === "streaming" || status === "submitted";

  return (
    <div className="mx-auto flex h-[calc(100dvh-7rem)] max-w-3xl flex-col gap-3 md:h-[calc(100dvh-4rem)] md:gap-4 ">
      <header className="shrink-0">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>
        <div className="mt-2 flex items-center justify-between gap-3 ">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <span className="text-xs text-muted-foreground">{badge}</span>
        </div>
      </header>
      <Conversation className="min-h-0 flex-1 rounded-lg border border-border/60 bg-card/30">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={emptyState.icon}
              title={emptyState.title}
              description={emptyState.description}
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <MessageResponse key={`${message.id}-${i}`}>
                          {part.text}
                        </MessageResponse>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={handleSubmit}
        className="relative shrink-0 rounded-2xl"
      >
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="pr-12"
        />

        <PromptInputSubmit
          status={status}
          onStop={stop}
          disabled={!isBusy && !input.trim()}
          className="absolute right-2 bottom-2"
        />
      </PromptInput>
    </div>
  );
};

export default WorkspaceAiChat;
