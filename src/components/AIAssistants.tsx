import {
  FileText,
  BarChart3,
  ShieldAlert,
  Users,
  Siren,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useChatContext } from "@/App"

const assistants = [
  {
    id: "approval",
    name: "审批助手",
    image: "/images/agent-approval.png",
    icon: FileText,
    title: "请示事项",
    desc: "审批待办、请示流转、签署确认",
    stat: "8项待处理",
    statVariant: "destructive" as const,
    chatPrompt: "帮我总结当前所有待处理的请示审批事项，按紧急程度排序，并给出处理建议。",
    accent: "from-[hsl(28,85%,55%)] to-[hsl(38,90%,60%)]",
  },
  {
    id: "business",
    name: "经营分析助手",
    image: "/images/agent-business.png",
    icon: BarChart3,
    title: "经营看板",
    desc: "经营指标、业绩趋势、目标达成",
    stat: "营收+12.3%",
    statVariant: "success" as const,
    chatPrompt: "帮我总结本月经营核心指标（营收、利润、客户量、目标完成率），分析各分支机构业绩表现，并给出经营决策建议。",
    accent: "from-[hsl(152,60%,42%)] to-[hsl(165,55%,48%)]",
  },
  {
    id: "risk",
    name: "风控合规助手",
    image: "/images/agent-risk.png",
    icon: ShieldAlert,
    title: "风险提示",
    desc: "合规风险、操作风险、市场风险预警",
    stat: "3项高风险",
    statVariant: "destructive" as const,
    chatPrompt: "帮我总结当前所有风险事项，按风险等级排序，说明每项风险的影响范围和建议的处置措施。",
    accent: "from-[hsl(0,72%,55%)] to-[hsl(15,80%,55%)]",
  },
  {
    id: "team",
    name: "人才管理助手",
    image: "/images/agent-talent.png",
    icon: Users,
    title: "队伍状况",
    desc: "人员变动、绩效分布、核心骨干",
    stat: "5人变动",
    statVariant: "warning" as const,
    chatPrompt: "帮我总结当前队伍状况，包括人员变动、出勤率、绩效分布情况，以及核心骨干的状态，给出队伍管理建议。",
    accent: "from-[hsl(250,55%,55%)] to-[hsl(270,50%,60%)]",
  },
  {
    id: "emergency",
    name: "应急指挥助手",
    image: "/images/agent-emergency.png",
    icon: Siren,
    title: "应急组织",
    desc: "应急预案、突发事件、演练状态",
    stat: "运行正常",
    statVariant: "success" as const,
    chatPrompt: "帮我总结应急组织的当前状态，包括预案数量、近期演练情况、待处理事件，以及需要我关注的事项和建议。",
    accent: "from-[hsl(200,70%,50%)] to-[hsl(215,65%,55%)]",
  },
]

export function AIAssistants() {
  const { openChat } = useChatContext()

  const handleClick = (item: (typeof assistants)[number]) => {
    openChat({ name: item.name, image: item.image }, item.chatPrompt)
  }

  return (
    <div className="px-8 pb-32 max-w-[1200px] mx-auto">
      <div className="section-title mb-5">
        <div className="badge-dot" />
        AI 团队
      </div>

      {/* Row 1: 3 cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {assistants.slice(0, 3).map((item, i) => (
          <AssistantCard key={item.id} item={item} index={i} onClick={() => handleClick(item)} />
        ))}
      </div>

      {/* Row 2: 2 cards centered, bridging the gaps of row 1 */}
      <div className="flex justify-center gap-4 px-[calc(100%/6)]">
        {assistants.slice(3).map((item, i) => (
          <AssistantCard key={item.id} item={item} index={i + 3} onClick={() => handleClick(item)} className="flex-1" />
        ))}
      </div>
    </div>
  )
}

interface AssistantCardProps {
  item: (typeof assistants)[number]
  index: number
  onClick: () => void
  className?: string
}

function AssistantCard({ item, index, onClick, className = "" }: AssistantCardProps) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      className={`group relative bg-card border border-border rounded-2xl p-5 text-left cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 overflow-hidden animate-fade-in ${className}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Accent top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${item.accent} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-center gap-4">
        {/* Avatar with icon badge */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110 shadow-card">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-gradient-to-br ${item.accent} flex items-center justify-center shadow-sm`}>
            <Icon className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.title}
            </span>
            <Badge variant={item.statVariant} className="text-[10px]">
              {item.stat}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">{item.desc}</div>
        </div>

        {/* Arrow indicator */}
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
      </div>
    </button>
  )
}
