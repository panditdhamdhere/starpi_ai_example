import WorkspaceAiChat from '@/components/workspace/workspace-ai-chat'
import { Code } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <WorkspaceAiChat
      mode="code"
      title="Code"
      badge="Code Assistant Gemini 2.5 flash"
      placeholder="Describe your coding problem or ask for code suggestions"
      emptyState={{
        icon: (
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Code className="size-6" />
          </span>
        ),
        title: "Pair on code with AI",
        description: "Get Refactor, reviews and debugging help",
      }}
    />
  )
}

export default page