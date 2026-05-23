import WorkspaceAiChat from "@/components/workspace/workspace-ai-chat";
import { MessageCircle } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <WorkspaceAiChat
      mode="chat"
      title="Chat"
      badge="Powered by Gemini 2.5 flash"
      placeholder="Send a mesaage..."
      emptyState={{
        icon: (
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageCircle className="size-6" />
          </span>
        ),
        title: "start a conversation",
        description: "Ask anythig -- answer stream in as the model thinks",
      }}
    />
  );
};

export default page;
