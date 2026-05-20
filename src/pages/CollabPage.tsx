import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  MessageSquare,
  BarChart2,
  AlertTriangle,
  Users,
  Shield,
  ChevronDown,
  ChevronUp,
  Bot,
  Send,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  User,
} from "lucide-react"
import { PerformancePanel } from "@/components/PerformancePanel"

// ────── 导航卡片数据 ──────
const navCards = [
  {
    id: "agenda",
    label: "请示事项",
    icon: MessageSquare,
    count: 8,
    countClass: "bg-destructive/10 text-destructive",
    accent: "border-destructive/30",
  },
  {
    id: "business",
    label: "经营看板",
    icon: BarChart2,
    count: null,
    countClass: "",
    accent: "border-primary/30",
  },
  {
    id: "risk",
    label: "风险提示",
    icon: AlertTriangle,
    count: 5,
    countClass: "bg-warning/10 text-warning",
    accent: "border-warning/30",
  },
  {
    id: "team",
    label: "队伍状况",
    icon: Users,
    count: null,
    countClass: "",
    accent: "border-primary/20",
  },
  {
    id: "emergency",
    label: "应急组织",
    icon: Shield,
    count: null,
    countClass: "",
    accent: "border-muted",
  },
]

// ────── 请示事项数据 ──────
const agendaItems = [
  {
    id: 1,
    urgent: true,
    tag: "资管条线",
    title: "华创-XX项目现金流异常处置意见请示",
    summary: "连续3期净流出，AI建议立即复核，请指示处置方向",
    from: "资管支持中心 · 张敏",
    time: "今日 09:30",
    status: "pending" as const,
    aiSuggest: "建议上报合规委员会",
  },
  {
    id: 2,
    urgent: false,
    tag: "投行条线",
    title: "某科技公司A轮IPO跨条线准入决策请示",
    summary: "涉及投行与资管条线客户冲突，无法在支持端独立决策",
    from: "投行支持中心 · 李建华",
    time: "今日 10:45",
    status: "processing" as const,
    aiSuggest: "建议召集条线负责人协商",
  },
  {
    id: 3,
    urgent: false,
    tag: "零售条线",
    title: "新产品定价方案审批授权申请",
    summary: "超出支持端审批权限，需总经理层审批",
    from: "零售支持中心 · 王芳",
    time: "昨日 16:20",
    status: "pending" as const,
    aiSuggest: "建议走标准审批流程",
  },
]

// ────── 风险数据 ──────
const riskItems = [
  {
    id: 1,
    level: "high" as const,
    title: "IPO项目现金流异常：连续3期净流出",
    desc: "华创-XX项目连续3个季度净现金流为负，与历史基准偏差超过2σ，建议立即干预",
    module: "资管监控",
    time: "今日 09:30",
  },
  {
    id: 2,
    level: "medium" as const,
    title: "某分支机构客户投诉率上升 12%",
    desc: "近30日投诉量较上月同期增长明显，已触发合规预警阈值",
    module: "合规预警",
    time: "今日 11:00",
  },
  {
    id: 3,
    level: "medium" as const,
    title: "资管条线数据权限申请超期 5 项",
    desc: "跨条线数据访问权限申请超48小时未处理，存在合规风险",
    module: "权限管理",
    time: "昨日 16:00",
  },
  {
    id: 4,
    level: "low" as const,
    title: "市场波动率指标高于基准线",
    desc: "近5个交易日波动率持续偏高，建议关注资管持仓风险敞口",
    module: "市场监控",
    time: "今日 08:15",
  },
  {
    id: 5,
    level: "low" as const,
    title: "合规培训完成率低于目标",
    desc: "本季度合规培训完成率78%，低于要求的90%，需督促相关人员完成",
    module: "合规管理",
    time: "本周一",
  },
]

const riskConfig = {
  high: { bg: "bg-destructive/8", border: "border-l-destructive", label: "高风险", labelClass: "bg-destructive/10 text-destructive", icon: "text-destructive" },
  medium: { bg: "bg-warning/8", border: "border-l-warning", label: "中风险", labelClass: "bg-warning/10 text-warning", icon: "text-warning" },
  low: { bg: "bg-primary/5", border: "border-l-primary/50", label: "关注", labelClass: "bg-primary/10 text-primary", icon: "text-primary" },
}

// ────── 队伍状况数据 ──────
const teamMembers = [
  {
    name: "张敏",
    role: "资管支持经理",
    status: "online" as const,
    kpi: 94,
    trend: "up" as const,
    tasks: 5,
    location: "上海·资管大厦",
  },
  {
    name: "李建华",
    role: "投行支持专员",
    status: "busy" as const,
    kpi: 87,
    trend: "stable" as const,
    tasks: 8,
    location: "北京·金融街",
  },
  {
    name: "王芳",
    role: "零售支持专员",
    status: "online" as const,
    kpi: 91,
    trend: "up" as const,
    tasks: 3,
    location: "深圳·福田",
  },
  {
    name: "陈志远",
    role: "合规风控专员",
    status: "offline" as const,
    kpi: 78,
    trend: "down" as const,
    tasks: 2,
    location: "上海·浦东",
  },
  {
    name: "刘洋",
    role: "审批流程专员",
    status: "online" as const,
    kpi: 96,
    trend: "up" as const,
    tasks: 4,
    location: "北京·朝阳",
  },
]

const statusConfig = {
  online: { dot: "bg-success", label: "在线" },
  busy: { dot: "bg-warning", label: "忙碌" },
  offline: { dot: "bg-muted-foreground/40", label: "离线" },
}

// ────── 应急组织数据 ──────
const emergencyContacts = [
  { role: "首席风险官", name: "郭明远", phone: "138****0001", available: true },
  { role: "合规总监", name: "林晓华", phone: "139****0002", available: true },
  { role: "技术应急响应", name: "赵俊峰", phone: "136****0003", available: false },
  { role: "客户投诉专线", name: "应急热线", phone: "400-888-8888", available: true },
]

// ────── 子区块组件 ──────

function AgendaSection() {
  const [expanded, setExpanded] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {agendaItems.map((item) => (
        <div
          key={item.id}
          className={cn(
            "bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-card",
            item.urgent && "border-l-4 border-l-destructive"
          )}
        >
          <div
            className="flex items-start gap-3 p-4 cursor-pointer"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {item.urgent && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">
                    紧急
                  </span>
                )}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {item.tag}
                </span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                    item.status === "pending"
                      ? "bg-primary/10 text-primary"
                      : "bg-success/10 text-success"
                  )}
                >
                  {item.status === "pending" ? "待批示" : "处理中"}
                </span>
                <span className="text-[10px] text-muted-foreground ml-auto">{item.time}</span>
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.summary}</div>
              <div className="text-[11px] text-muted-foreground mt-1">来自：{item.from}</div>
            </div>
            <div className="shrink-0 ml-2">
              {expanded === item.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {expanded === item.id && (
            <div className="px-4 pb-4 border-t border-border pt-3">
              <div className="flex items-center gap-2 mb-3 p-3 bg-primary/5 border border-primary/15 rounded-lg">
                <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-foreground">
                  <span className="font-semibold text-primary">AI建议：</span>
                  {item.aiSuggest}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-semibold">
                  批准执行
                </button>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-semibold">
                  驳回
                </button>
                <button className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                  转交
                </button>
                <button className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                  批注意见
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function BusinessSection() {
  return (
    <div className="space-y-4">
      {/* KPI 看板 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "本月营收", value: "¥4.82亿", sub: "↑ 12.3%", color: "text-success", subColor: "text-success" },
          { label: "目标完成率", value: "87.6%", sub: "距目标 12.4%", color: "text-foreground", subColor: "text-warning" },
          { label: "活跃客户数", value: "2,847", sub: "↑ 8.2%", color: "text-primary", subColor: "text-success" },
          { label: "在执行项目", value: "126", sub: "新增 5", color: "text-foreground", subColor: "text-primary" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={cn("text-2xl font-bold", kpi.color)}>{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
            <div className={cn("text-xs mt-1 font-medium", kpi.subColor)}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* 条线业绩分布 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-semibold text-foreground mb-4">各条线业绩进度</div>
        <div className="space-y-3">
          {[
            { name: "资管条线", value: "¥2.1亿", pct: 72, color: "bg-success" },
            { name: "投行条线", value: "¥1.6亿", pct: 55, color: "bg-primary" },
            { name: "零售条线", value: "¥1.1亿", pct: 38, color: "bg-warning" },
          ].map((line) => (
            <div key={line.name}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-foreground">{line.name}</span>
                <span className="font-medium">{line.value}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", line.color)}
                  style={{ width: `${line.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 近期动态 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-semibold text-foreground mb-3">近期经营动态</div>
        <div className="space-y-2">
          {[
            { dot: "bg-success", text: "资管团队完成Q3目标的87%，超预期进展" },
            { dot: "bg-primary", text: "投行线新增3个IPO储备项目，进入尽调阶段" },
            { dot: "bg-warning", text: "零售合规培训完成率78%，低于90%目标" },
            { dot: "bg-muted-foreground/40", text: "新客户准入流程优化方案已提报审批" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", item.dot)} />
              <span className="text-xs text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskSection() {
  return (
    <div className="space-y-3">
      {riskItems.map((r) => {
        const cfg = riskConfig[r.level]
        return (
          <div
            key={r.id}
            className={cn(
              "border border-border rounded-xl p-4 border-l-4 flex items-start gap-3",
              cfg.bg,
              cfg.border
            )}
          >
            <AlertTriangle className={cn("w-4 h-4 mt-0.5 shrink-0", cfg.icon)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-semibold text-foreground">{r.title}</span>
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", cfg.labelClass)}>
                  {cfg.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {r.module}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">{r.time}</span>
            </div>
            <div className="shrink-0 flex flex-col gap-1.5">
              <button className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium whitespace-nowrap">
                干预处置
              </button>
              <button className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors whitespace-nowrap">
                已知晓
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TeamSection() {
  return (
    <div className="space-y-3">
      {/* 汇总统计 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-success">4</div>
          <div className="text-xs text-muted-foreground mt-0.5">在线</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-warning">1</div>
          <div className="text-xs text-muted-foreground mt-0.5">忙碌</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-muted-foreground">1</div>
          <div className="text-xs text-muted-foreground mt-0.5">离线</div>
        </div>
      </div>

      {/* 成员列表 */}
      <div className="space-y-2">
        {teamMembers.map((member) => {
          const sc = statusConfig[member.status]
          return (
            <div key={member.name} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
              {/* 头像/状态点 */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">
                  {member.name[0]}
                </div>
                <div className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card", sc.dot)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{member.name}</span>
                  <span className="text-xs text-muted-foreground">{member.role}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {member.location}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" /> 处理中 {member.tasks} 项
                  </span>
                </div>
              </div>

              {/* KPI + 趋势 */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-sm font-bold text-foreground">{member.kpi}</span>
                  {member.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-success" />}
                  {member.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                  {member.trend === "stable" && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <div className="text-[10px] text-muted-foreground">KPI分</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EmergencySection() {
  return (
    <div className="space-y-4">
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-3">
        <div className="flex items-center gap-2 text-warning text-sm font-semibold">
          <AlertCircle className="w-4 h-4" />
          应急预案已激活 · 当前级别：橙色预案
        </div>
        <div className="text-xs text-muted-foreground mt-1 ml-6">
          触发条件：市场波动率超标 + 多项合规预警同时存在
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-semibold text-foreground mb-3">应急联系人</div>
        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div key={contact.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    contact.available ? "bg-success/10" : "bg-muted"
                  )}
                >
                  <User className={cn("w-3.5 h-3.5", contact.available ? "text-success" : "text-muted-foreground")} />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">{contact.name}</div>
                  <div className="text-[10px] text-muted-foreground">{contact.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">{contact.phone}</span>
                <button
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                    contact.available
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                  disabled={!contact.available}
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 应急流程进度 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-semibold text-foreground mb-3">应急响应进度</div>
        <div className="space-y-2">
          {[
            { step: "初步评估", done: true },
            { step: "风险隔离", done: true },
            { step: "通知相关方", done: false },
            { step: "启动处置流程", done: false },
            { step: "事后复盘", done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold",
                  item.done ? "bg-success text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {item.done ? "✓" : i + 1}
              </div>
              <span className={cn("text-xs", item.done ? "text-success font-medium" : "text-muted-foreground")}>
                {item.step}
              </span>
              {i === 2 && !item.done && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/10 text-warning font-medium ml-auto">
                  进行中
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ────── AI 快捷提问 ──────
const quickPrompts = [
  "今日最紧急的事项是什么？",
  "当前有哪些高风险需要我关注？",
  "帮我生成今日经营简报",
  "团队整体状态怎么样？",
]

function PageChatBar() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([])
  const [showChat, setShowChat] = useState(false)

  const sendMessage = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setMessages((prev) => [
      ...prev,
      { role: "user", text: msg },
      { role: "ai", text: "正在为您分析协同端数据，请稍候…（模拟响应）" },
    ])
    setInput("")
    setShowChat(true)
  }

  return (
    <div className="border-t border-border bg-card shrink-0">
      {showChat && messages.length > 0 && (
        <div className="px-5 py-3 max-h-[200px] overflow-y-auto space-y-2 border-b border-border">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "ai" && (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "text-xs px-3 py-2 rounded-xl max-w-[80%]",
                  m.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 快捷提问 */}
      {!showChat && (
        <div className="flex gap-2 px-5 py-2 overflow-x-auto">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/30 whitespace-nowrap transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 输入框 */}
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex-1 flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2">
          <Bot className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="向协同端 AI 提问或下达指令…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <button
          onClick={() => sendMessage()}
          className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ────── 主页面组件 ──────
export function CollabPage() {
  const [activeSection, setActiveSection] = useState<string>("agenda")

  const activeNav = navCards.find((c) => c.id === activeSection)
  const ActiveIcon = activeNav?.icon || MessageSquare

  return (
    <div className="flex flex-col bg-background" style={{ minHeight: "100vh" }}>
      {/* 导航卡片栏 */}
      <div className="border-b border-border bg-card px-5 py-3 shrink-0">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {navCards.map((card) => {
            const Icon = card.icon
            const isActive = activeSection === card.id
            return (
              <button
                key={card.id}
                onClick={() => setActiveSection(card.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all shrink-0",
                  isActive
                    ? cn("bg-primary/8 border-primary/25 text-primary", card.accent)
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{card.label}</span>
                {card.count !== null && (
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", isActive ? card.countClass : "bg-muted text-muted-foreground")}>
                    {card.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 内容区（自然页面滚动） */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-5 py-5">
          {/* 区块标题 */}
          <div className="flex items-center gap-2 mb-5">
            <ActiveIcon className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">{activeNav?.label}</h2>
            {activeNav?.count !== null && (
              <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", activeNav?.countClass)}>
                {activeNav?.count}
              </span>
            )}
          </div>

          {/* 各区块内容 */}
          {activeSection === "agenda" && <AgendaSection />}
          {activeSection === "business" && <BusinessSection />}
          {activeSection === "risk" && <RiskSection />}
          {activeSection === "team" && <TeamSection />}
          {activeSection === "emergency" && <EmergencySection />}

          {/* 业绩与绩效（协同端底部统一展示，可折叠） */}
          {activeSection === "business" && (
            <div className="mt-6">
              <PerformancePanel />
            </div>
          )}
        </div>
      </div>

      {/* 底部 AI 对话栏 */}
      <PageChatBar />
    </div>
  )
}
