import { useState, useRef, createContext, useContext, useCallback } from "react"
import { Header } from "@/components/Header"
import { WorkTips } from "@/components/WorkTips"
import { AIAssistants } from "@/components/AIAssistants"
import { AIChatInline } from "@/components/AIChatInline"
import { AIChatInput } from "@/components/AIChatInput"
import { ArrowUp } from "lucide-react"

interface ChatContextType {
  isInChat: boolean
  agentName: string
  agentImage: string
  initialMessage: string
  openChat: (agent: { name: string; image: string }, message?: string) => void
  exitChat: () => void
}

export const ChatContext = createContext<ChatContextType>({
  isInChat: false,
  agentName: "",
  agentImage: "",
  initialMessage: "",
  openChat: () => {},
  exitChat: () => {},
})

export function useChatContext() {
  return useContext(ChatContext)
}

function App() {
  const [chatState, setChatState] = useState({
    isInChat: false,
    agentName: "",
    agentImage: "",
    initialMessage: "",
  })
  const topRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const openChat = useCallback(
    (agent: { name: string; image: string }, message?: string) => {
      setChatState({
        isInChat: true,
        agentName: agent.name,
        agentImage: agent.image,
        initialMessage: message || "",
      })
      setTimeout(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    },
    []
  )

  const exitChat = useCallback(() => {
    setChatState((s) => ({ ...s, isInChat: false }))
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }, [])

  return (
    <ChatContext.Provider value={{ ...chatState, openChat, exitChat }}>
      <div className="min-h-screen bg-background">
        <div ref={topRef} />

        {/* Workbench content */}
        <div className={chatState.isInChat ? "hidden" : ""}>
          <Header />
          <WorkTips />
          <AIAssistants />
          <AIChatInput />
        </div>

        {/* Inline chat view */}
        {chatState.isInChat && (
          <div ref={chatRef}>
            <AIChatInline />
          </div>
        )}

        {/* Back to top */}
        {chatState.isInChat && (
          <button
            onClick={exitChat}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-card border border-border shadow-elevated flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
            title="返回工作台"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </ChatContext.Provider>
  )
}

export default App
