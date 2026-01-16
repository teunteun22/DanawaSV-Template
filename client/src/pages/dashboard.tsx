import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { ModelCard } from "@/components/model-card";
import { ModelCardSkeletonList } from "@/components/model-card-skeleton";
import { Filters } from "@/components/filters";
import { EmptyState, ErrorState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calendar, RefreshCw, Building2, Globe } from "lucide-react";
import type { RadarModelData } from "@shared/schema";

type Nation = "domestic" | "import";

function getAvailableMonths(): string[] {
  const months: string[] = [];
  const now = new Date();
  
  for (let i = 1; i <= 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}-00`);
  }
  
  return months;
}

function formatMonthDisplay(month: string): string {
  const [year, m] = month.split("-");
  return `${year}년 ${parseInt(m)}월`;
}

export default function Dashboard() {
  const availableMonths = useMemo(() => getAvailableMonths(), []);
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0]);
  const [nation, setNation] = useState<Nation>("domestic");
  const [minSales, setMinSales] = useState(300);
  const [excludeNewEntries, setExcludeNewEntries] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: models, isLoading, isError, refetch, isFetching } = useQuery<RadarModelData[]>({
    queryKey: ["/api/radar", selectedMonth, nation],
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refetch]);

  const showSpinner = isRefreshing || isFetching;

  const filteredModels = useMemo(() => {
    if (!models) return [];
    
    return models.filter((model) => {
      if (model.sales < minSales) return false;
      if (excludeNewEntries && model.prevSales === 0) return false;
      return true;
    });
  }, [models, minSales, excludeNewEntries]);

  const stats = useMemo(() => {
    if (!filteredModels.length) {
      return { totalModels: 0, avgChange: 0, topGainer: null };
    }
    
    const totalModels = filteredModels.length;
    const avgChange = filteredModels.reduce((acc, m) => acc + m.momAbs, 0) / totalModels;
    const topGainer = filteredModels[0] || null;
    
    return { totalModels, avgChange, topGainer };
  }, [filteredModels]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 space-y-4 flex-shrink-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>기준 월</span>
              </div>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger data-testid="select-month">
                  <SelectValue placeholder="월 선택" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month} data-testid={`menu-item-month-${month}`}>
                      {formatMonthDisplay(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>시장</span>
              </div>
              <Tabs value={nation} onValueChange={(v) => setNation(v as Nation)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="domestic" data-testid="tab-domestic">
                    <Building2 className="w-4 h-4 mr-1.5" />
                    국산
                  </TabsTrigger>
                  <TabsTrigger value="import" data-testid="tab-import">
                    <Globe className="w-4 h-4 mr-1.5" />
                    수입
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Filters
              minSales={minSales}
              onMinSalesChange={setMinSales}
              excludeNewEntries={excludeNewEntries}
              onExcludeNewEntriesChange={setExcludeNewEntries}
            />

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleRefresh}
              disabled={showSpinner}
              data-testid="button-refresh"
              data-loading={showSpinner ? "true" : "false"}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${showSpinner ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  Top 20 급상승
                </h2>
                <Badge variant="secondary" data-testid="badge-nation">
                  {nation === "domestic" ? "국산" : "수입"}
                </Badge>
              </div>
              
              {!isLoading && !isError && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span data-testid="text-total-models">
                    총 <strong className="text-foreground">{stats.totalModels}</strong>개 모델
                  </span>
                  {stats.avgChange !== 0 && (
                    <span data-testid="text-avg-change">
                      평균 
                      <strong className={`ml-1 ${stats.avgChange > 0 ? "text-surge-up" : "text-surge-down"}`}>
                        {stats.avgChange > 0 ? "+" : ""}{Math.round(stats.avgChange).toLocaleString()}대
                      </strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <ModelCardSkeletonList count={8} />
            ) : isError ? (
              <ErrorState />
            ) : filteredModels.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3" data-testid="model-list">
                {filteredModels.slice(0, 20).map((model, index) => (
                  <ModelCard key={model.id} model={model} rank={index + 1} />
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            본 서비스는 다나와 자동차 판매실적 데이터를 기반으로 급상승 모델을 분석합니다.
          </p>
          <p className="mt-1">
            원본 데이터는 KAMA/KAIDA 공식 자료 기반이며, 무단 복제 및 가공을 금합니다.
          </p>
        </footer>
      </main>
    </div>
  );
}
