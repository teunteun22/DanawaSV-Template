import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, TrendingDown, Minus, Hash } from "lucide-react";
import type { RadarModelData } from "@shared/schema";

interface ModelCardProps {
  model: RadarModelData;
  rank: number;
}

export function ModelCard({ model, rank }: ModelCardProps) {
  const isPositive = model.momAbs > 0;
  const isNegative = model.momAbs < 0;
  const isNewEntry = model.prevSales === 0 || model.prevRank === null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ko-KR").format(num);
  };

  const formatPercent = (num: number) => {
    if (num === Infinity || num > 999) return "+999%+";
    return `${num >= 0 ? "+" : ""}${(num * 100).toFixed(1)}%`;
  };

  const formatChange = (num: number) => {
    if (num === 0) return "0";
    return `${num > 0 ? "+" : ""}${formatNumber(num)}`;
  };

  const getRankChangeText = () => {
    if (isNewEntry) return "NEW";
    if (model.rankChange === null || model.rankChange === 0) return "-";
    return model.rankChange > 0 ? `${model.rankChange}` : `${Math.abs(model.rankChange)}`;
  };

  const getRankChangeIcon = () => {
    if (isNewEntry) return null;
    if (model.rankChange === null || model.rankChange === 0) {
      return <Minus className="w-3.5 h-3.5" />;
    }
    if (model.rankChange > 0) {
      return <TrendingUp className="w-3.5 h-3.5" />;
    }
    return <TrendingDown className="w-3.5 h-3.5" />;
  };

  return (
    <Card className="hover-elevate active-elevate-2 transition-all duration-200" data-testid={`card-model-${model.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary" data-testid={`text-rank-${model.id}`}>
              {rank}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium" data-testid={`text-brand-${model.id}`}>
                  {model.brand}
                </p>
                <h3 className="font-semibold text-foreground truncate" data-testid={`text-model-name-${model.id}`}>
                  {model.modelName}
                </h3>
              </div>

              {isNewEntry && (
                <Badge variant="default" className="flex-shrink-0 text-xs" data-testid={`badge-new-${model.id}`}>
                  NEW
                </Badge>
              )}
            </div>

            <div className="mt-3 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">판매량</span>
                <span className="text-sm font-semibold" data-testid={`text-sales-${model.id}`}>
                  {formatNumber(model.sales)}대
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">전월대비</span>
                <span 
                  className={`text-sm font-semibold ${
                    isPositive ? "text-surge-up" : isNegative ? "text-surge-down" : "text-surge-neutral"
                  }`}
                  data-testid={`text-mom-abs-${model.id}`}
                >
                  {formatChange(model.momAbs)}대
                </span>
                <span 
                  className={`text-xs ${
                    isPositive ? "text-surge-up" : isNegative ? "text-surge-down" : "text-surge-neutral"
                  }`}
                  data-testid={`text-mom-pct-${model.id}`}
                >
                  ({formatPercent(model.momPct)})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">랭크</span>
                <span 
                  className={`text-sm font-semibold flex items-center gap-0.5 ${
                    isNewEntry || (model.rankChange !== null && model.rankChange > 0) 
                      ? "text-surge-up" 
                      : model.rankChange !== null && model.rankChange < 0 
                        ? "text-surge-down" 
                        : "text-surge-neutral"
                  }`}
                  data-testid={`text-rank-change-${model.id}`}
                >
                  {getRankChangeIcon()}
                  {getRankChangeText()}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            asChild
            data-testid={`button-danawa-link-${model.id}`}
          >
            <a href={model.danawaUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              원문
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
