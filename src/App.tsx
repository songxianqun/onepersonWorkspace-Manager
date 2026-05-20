import { useState, useRef, createContext, useContext, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Header } from "@/components/Header"
import { WorkTips } from "@/components/WorkTips"
import { AIAssistants } from "@/components/AIAssistants"
import { AIChatInline } from "@/components/AIChatInline"
import { AIChatInput } from "@/components/AIChatInput"
import { SupportPage } from "@/pages/SupportPage"
import { CollabPage } from "@/pages/CollabPage"
import { ArrowUp, Briefcase, HeadphonesIcon, Users2 } from "lucide-react"

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

type EndTab = "employee" | "support" | "collab"

const endTabs: Array<{ id: EndTab; label: string; sub: string; icon: typeof Briefcase }> = [
  { id: "employee", label: "员工端", sub: "个人工作台", icon: Briefcase },
  { id: "support", label: "业务支持端", sub: "支持中心", icon: HeadphonesIcon },
  { id: "collab", label: "协同端", sub: "经营协同", icon: Users2 },
]

function App() {
  const [activeEnd, setActiveEnd] = useState<EndTab>("employee")
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
      <div className="min-h-screen bg-background flex flex-col">
        <div ref={topRef} />

        {/* 三端切换 Tab（顶部全局导航） */}
        {!chatState.isInChat && (
          <div className="border-b border-border bg-card shrink-0">
            <div className="max-w-[1200px] mx-auto px-8 flex items-center gap-0">
              {endTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeEnd === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEnd(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all -mb-px",
                      isActive
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className="text-[10px] text-muted-foreground hidden sm:inline">
                      {tab.sub}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 员工端 */}
        {!chatState.isInChat && activeEnd === "employee" && (
          <div className="flex-1">
            <Header />
            <WorkTips />
            <AIAssistants />
            <AIChatInput />
          </div>
        )}

        {/* 业务支持端 */}
        {!chatState.isInChat && activeEnd === "support" && (
          <div className="flex-1 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 57px)" }}>
            <SupportPage />
          </div>
        )}

        {/* 协同端 */}
        {!chatState.isInChat && activeEnd === "collab" && (
          <div className="flex-1">
            <CollabPage />
          </div>
        )}

        {/* Inline chat view */}
        {chatState.isInChat && (
          <div ref={chatRef} className="flex-1">
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
