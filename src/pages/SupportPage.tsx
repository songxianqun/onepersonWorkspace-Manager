import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  AlertCircle, Clock, Eye, CheckCircle2, ChevronRight, Zap, ArrowUpRight,
  Bell, Filter, LayoutGrid, Bot, ChevronLeft, AlertTriangle,
} from "lucide-react"
import { useChatContext } from "@/App"

const supportAgents = [
  { name: "投行业务助理", image: "/images/avatar-invest-banking.png" },
  { name: "资管业务助理", image: "/images/avatar-asset-mgmt.png" },
  { name: "零售业务助理", image: "/images/avatar-invest-banking.png" },
  { name: "合规风控助理", image: "/images/avatar-crosscheck.png" },
  { name: "审批流程助理", image: "/images/avatar-institution.png" },
  { name: "经营分析助理", image: "/images/avatar-asset-mgmt.png" },
  { name: "客户服务助理", image: "/images/avatar-crosscheck.png" },
]

const riskLevelConfig = {
  high: {
    bg: "bg-destructive/8",
    border: "border-destructive/20",
    icon: "text-destructive",
    label: "高风险",
    labelClass: "bg-destructive/10 text-destructive",
  },
  medium: {
    bg: "bg-warning/8",
    border: "border-warning/20",
    icon: "text-warning",
    label: "中风险",
    labelClass: "bg-warning/10 text-warning",
  },
  low: {
    bg: "bg-primary/5",
    border: "border-primary/15",
    icon: "text-primary",
    label: "关注",
    labelClass: "bg-primary/10 text-primary",
  },
}

const risks = [
  {
    id: 1,
    level: "high" as const,
    title: "IPO项目现金流异常：连续3期净流出",
    desc: "华创-XX项目连续3个季度净现金流为负，与历史基准偏差超过2σ，AI已自动标记，建议立即复核",
    time: "今日 09:30",
  },
  {
    id: 2,
    level: "medium" as const,
    title: "某分支机构客户投诉率上升12%",
    desc: "近30日该机构投诉量较上月同期增长明显，已触发合规预警阈值，建议安排核查",
    time: "今日 10:15",
  },
  {
    id: 3,
    level: "low" as const,
    title: "资管条线数据权限申请超期未处理（5项）",
    desc: "5项跨条线数据访问权限申请已超48小时未处理，建议关注推进",
    time: "昨日 16:00",
  },
]

const workItems = [
  {
    id: 1,
    priority: "urgent" as const,
    tag: "资管监控",
    subject: {
      object: "华创证券资管条线-刘韵 与 中信银行贵阳分行-财务总监王某",
      action: "提交债券投资方案复核",
      result: "方案现金流数据缺失，待补录后重新提交",
    },
    aiSuggest: "建议补录",
    aiDetail: "现金流数据缺失；相似案例匹配度 87%",
    time: "10分钟前",
    status: "pending" as const,
  },
  {
    id: 2,
    priority: "normal" as const,
    tag: "资管复核",
    subject: {
      object: "上市公司定增方案 — 贵州茅台（资管客户分析阶段）",
      action: "定增投资方案合规性复核",
      result: "待复核，客户分析阶段",
    },
    aiSuggest: "建议通过",
    aiDetail: "资产负债率偏高，需人工核查；主要指标合规",
    time: "35分钟前",
    status: "processing" as const,
  },
  {
    id: 3,
    priority: "notice" as const,
    tag: "新客户合规",
    subject: {
      object: "新客户合同录入异常检测（系统自动触发）",
      action: "合同入库异常检测",
      result: "3份合同模板不匹配，待人工确认",
    },
    aiSuggest: "建议介入",
    aiDetail: "3份合同模板不匹配最新规范",
    time: "1小时前",
    status: "pending" as const,
  },
  {
    id: 4,
    priority: "urgent" as const,
    tag: "投行复核",
    subject: {
      object: "某科技公司 A 轮 IPO 准入申请",
      action: "跨条线准入复核",
      result: "涉及跨条线客户冲突，资管与投行口径不一致",
    },
    aiSuggest: "建议协同",
    aiDetail: "跨条线客户口径冲突，支持端无法独立决策",
    time: "2小时前",
    status: "pending" as const,
  },
]

const priorityConfig = {
  urgent: { label: "紧急", class: "bg-destructive/10 text-destructive", border: "border-l-destructive" },
  normal: { label: "普通", class: "bg-primary/10 text-primary", border: "border-l-primary" },
  notice: { label: "规则知会", class: "bg-warning/10 text-warning", border: "border-l-warning" },
}

const aiActionConfig: Record<string, { label: string; btnClass: string }> = {
  "建议补录": { label: "一键打回补录", btnClass: "bg-destructive text-white hover:bg-destructive/90" },
  "建议通过": { label: "一键复核通过", btnClass: "bg-success text-white hover:bg-success/90" },
  "建议介入": { label: "一键主动介入", btnClass: "bg-primary text-white hover:bg-primary/90" },
  "建议协同": { label: "一键提请协同", btnClass: "bg-destructive text-white hover:bg-destructive/90" },
}

function TabBtn({
  active, label, count, countColor, onClick,
}: {
  active: boolean; label: string; count?: number; countColor?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px",
        active
          ? "text-primary border-primary"
          : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full font-semibold",
          active
            ? countColor
              ? `${countColor} bg-current/10`
              : "text-primary bg-primary/10"
            : "text-muted-foreground bg-muted"
        )}>
          {count}
        </span>
      )}
    </button>
  )
}

export function SupportPage() {
  const { openChat } = useChatContext()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [mainTab, setMainTab] = useState<"risk" | "items">("items")
  const [filterStatus, setFilterStatus] = useState<"all" | "urgent" | "pending" | "watching">("all")

  const visibleRisks = risks
  const filteredItems = workItems.filter((item) => {
    if (filterStatus === "all") return true
    if (filterStatus === "urgent") return item.priority === "urgent"
    if (filterStatus === "pending") return item.status === "pending"
    if (filterStatus === "watching") return item.priority === "notice"
    return true
  })

  const openChatWithAgent = (agent: { name: string; image: string }) => {
    openChat(agent)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 顶部智能体入口行 */}
      <div className="border-b border-border bg-card px-5 py-3 shrink-0">
        <div className="flex items-center gap-5 overflow-x-auto pb-1">
          {supportAgents.map((agent) => (
            <button
              key={agent.name}
              onClick={() => openChatWithAgent(agent)}
              className="flex flex-col items-center gap-1.5 group shrink-0"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border bg-card group-hover:border-primary/40 group-hover:scale-105 transition-all duration-300 shadow-sm">
                <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                {agent.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 主体：左侧队列 + 右侧内容 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧工作队列（可收起） */}
        <div
          className={cn(
            "flex flex-col border-r border-border bg-card transition-all duration-300 shrink-0",
            sidebarCollapsed ? "w-14" : "w-52"
          )}
        >
          {/* 收起/展开按钮 */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-between px-3 py-3 border-b border-border hover:bg-muted/50 transition-colors"
          >
            {!sidebarCollapsed && (
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                工作队列
              </span>
            )}
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground ml-auto">
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </div>
          </button>

          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto py-2">
              {[
                { label: "资管监控", sub: "资营支持中心", badge: "紧急 3", badgeClass: "text-destructive bg-destructive/10" },
                { label: "投行复核", sub: "投行支持中心", badge: "动态 5", badgeClass: "text-warning bg-warning/10" },
                { label: "零售审核", sub: "零售支持中心", badge: "关注 2", badgeClass: "text-primary bg-primary/10" },
                { label: "已完成", sub: "本日处理完毕", badge: "今日 12", badgeClass: "text-success bg-success/10" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors",
                    i === 0 ? "bg-primary/8 text-primary" : "hover:bg-muted/50 text-foreground"
                  )}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{item.sub}</div>
                  </div>
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-1 shrink-0", item.badgeClass)}>
                    {item.badge}
                  </span>
                </div>
              ))}

              <div className="px-3 py-2 mt-2">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">规则触达</div>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div>
                  <div className="text-xs font-medium">自动监控</div>
                  <div className="text-[10px] text-muted-foreground">规则触发</div>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-warning/10 text-warning ml-1 shrink-0">
                  关注 7
                </span>
              </div>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="flex-1 flex flex-col items-center gap-3 py-3">
              {[
                { icon: LayoutGrid, color: "text-destructive", title: "资管" },
                { icon: Zap, color: "text-warning", title: "投行" },
                { icon: Eye, color: "text-primary", title: "零售" },
                { icon: CheckCircle2, color: "text-success", title: "完成" },
              ].map((item, i) => (
                <button
                  key={i}
                  title={item.title}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    i === 0 ? "bg-primary/10" : "hover:bg-muted"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", item.color)} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 右侧主内容 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 概览统计 */}
          <div className="shrink-0 border-b border-border bg-card px-5 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">业务概览 — 资管支持中心</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-destructive font-medium">
                    <AlertCircle className="w-3 h-3" /> 紧急 <strong>3</strong>
                  </span>
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Clock className="w-3 h-3" /> 待处理 <strong>8</strong>
                  </span>
                  <span className="flex items-center gap-1 text-warning font-medium">
                    <Bell className="w-3 h-3" /> 关注中 <strong>7</strong>
                  </span>
                  <span className="flex items-center gap-1 text-success font-medium">
                    <CheckCircle2 className="w-3 h-3" /> 今日完成 <strong>12</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 实时刷新
              </span>
            </div>
          </div>

          {/* Tab 栏 */}
          <div className="px-5 shrink-0 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex items-center gap-0">
              <TabBtn
                active={mainTab === "risk"}
                label="风险提示"
                count={visibleRisks.length}
                countColor={visibleRisks.filter((r) => r.level === "high").length > 0 ? "text-destructive" : "text-warning"}
                onClick={() => setMainTab("risk")}
              />
              <TabBtn
                active={mainTab === "items"}
                label="事项列表"
                count={filteredItems.length}
                onClick={() => setMainTab("items")}
              />
              {mainTab === "items" && (
                <div className="ml-auto flex items-center gap-1.5 pb-1">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  {(["all", "urgent", "pending", "watching"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-md transition-colors",
                        filterStatus === f
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {{ all: "全部", urgent: "紧急", pending: "待处理", watching: "关注中" }[f]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {mainTab === "risk" && visibleRisks.map((r) => {
              const cfg = riskLevelConfig[r.level]
              return (
                <div key={r.id} className={cn("flex items-start gap-3 p-4 rounded-xl border", cfg.bg, cfg.border)}>
                  <AlertTriangle className={cn("w-4 h-4 mt-0.5 shrink-0", cfg.icon)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{r.title}</span>
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", cfg.labelClass)}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{r.time}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium">
                      提请协同
                    </button>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                      已知晓
                    </button>
                  </div>
                </div>
              )
            })}

            {mainTab === "items" && filteredItems.map((item) => {
              const pcfg = priorityConfig[item.priority]
              const aiAction = aiActionConfig[item.aiSuggest]
              return (
                <div
                  key={item.id}
                  className={cn(
                    "bg-card border border-border rounded-xl p-4 border-l-4 transition-all hover:shadow-card",
                    pcfg.border
                  )}
                >
                  {/* 头部 */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", pcfg.class)}>
                      {pcfg.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{item.time}</span>
                  </div>

                  {/* 事项三层结构 */}
                  <div className="bg-muted/40 rounded-lg p-3 mb-3 text-xs space-y-1">
                    <div className="text-muted-foreground">对象：{item.subject.object}</div>
                    <div className="font-semibold text-foreground">动作：{item.subject.action}</div>
                    <div className="text-foreground">结果：{item.subject.result}</div>
                  </div>

                  {/* AI 一键采纳 */}
                  <div className="flex items-center justify-between gap-3 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs text-foreground">
                        <span className="font-semibold text-primary">{item.aiSuggest}</span>
                        {" · "}{item.aiDetail}
                      </span>
                    </div>
                    <button
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors",
                        aiAction.btnClass
                      )}
                    >
                      {aiAction.label}
                    </button>
                  </div>

                  {/* 次要操作 */}
                  <div className="flex gap-2 mt-3 justify-end">
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
                      查看详情
                    </button>
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                      补充备注
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
