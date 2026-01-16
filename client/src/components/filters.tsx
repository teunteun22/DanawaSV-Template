import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react";

interface FiltersProps {
  minSales: number;
  onMinSalesChange: (value: number) => void;
  excludeNewEntries: boolean;
  onExcludeNewEntriesChange: (value: boolean) => void;
}

export function Filters({
  minSales,
  onMinSalesChange,
  excludeNewEntries,
  onExcludeNewEntriesChange,
}: FiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">필터</span>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="min-sales" className="text-sm">
                최소 판매량
              </Label>
              <span className="text-sm font-medium text-muted-foreground" data-testid="text-min-sales-value">
                {minSales.toLocaleString()}대 이상
              </span>
            </div>
            <Slider
              id="min-sales"
              min={0}
              max={1000}
              step={50}
              value={[minSales]}
              onValueChange={([value]) => onMinSalesChange(value)}
              data-testid="slider-min-sales"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>500</span>
              <span>1,000</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-0.5">
              <Label htmlFor="exclude-new" className="text-sm">
                신규 진입 제외
              </Label>
              <p className="text-xs text-muted-foreground">
                전월 판매량 0인 모델 제외
              </p>
            </div>
            <Switch
              id="exclude-new"
              checked={excludeNewEntries}
              onCheckedChange={onExcludeNewEntriesChange}
              data-testid="switch-exclude-new"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
