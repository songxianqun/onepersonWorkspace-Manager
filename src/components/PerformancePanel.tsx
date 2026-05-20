import { useState } from "react"
import { BarChart2, ChevronDown, ChevronUp } from "lucide-react"

export function PerformancePanel() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="px-8 pb-4 max-w-[1200px] mx-auto">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-4 group"
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="w-[18px] h-[18px] text-foreground" />
          <span className="text-base font-bold text-foreground">业绩与绩效</span>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <>
          {/* 业绩看板 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-success">¥4.82亿</div>
              <div className="text-xs text-muted-foreground mt-1">本月营收</div>
              <div className="text-xs text-success mt-1">↑ 12.3%</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">87.6%</div>
              <div className="text-xs text-muted-foreground mt-1">目标完成率</div>
              <div className="text-xs text-warning mt-1">距目标 12.4%</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">2,847</div>
              <div className="text-xs text-muted-foreground mt-1">活跃客户数</div>
              <div className="text-xs text-success mt-1">↑ 8.2%</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-warning">¥1.24亿</div>
              <div className="text-xs text-muted-foreground mt-1">预计绩效收入</div>
              <div className="text-xs text-muted-foreground mt-1">综合加权估算</div>
            </div>
          </div>

          {/* 条线分布 + 绩效分布 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm font-semibold text-foreground mb-3">条线业绩分布</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>资管条线</span>
                    <span className="text-success font-medium">¥2.1亿</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className="h-full w-[72%] bg-success rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>投行条线</span>
                    <span className="text-primary font-medium">¥1.6亿</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className="h-full w-[55%] bg-primary rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>零售条线</span>
                    <span className="text-warning font-medium">¥1.1亿</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className="h-full w-[38%] bg-warning rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm font-semibold text-foreground mb-3">绩效等级分布</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-success/10 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-success">68%</div>
                  <div className="text-[11px] text-muted-foreground">优秀及以上</div>
                </div>
                <div className="bg-primary/10 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-primary">24%</div>
                  <div className="text-[11px] text-muted-foreground">良好</div>
                </div>
                <div className="bg-warning/10 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-warning">6%</div>
                  <div className="text-[11px] text-muted-foreground">达标</div>
                </div>
                <div className="bg-destructive/10 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-destructive">2%</div>
                  <div className="text-[11px] text-muted-foreground">待改进</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
