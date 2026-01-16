import { Car, SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ 
  title = "결과 없음", 
  description = "조건에 맞는 모델이 없습니다. 필터를 조정해 보세요." 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-empty-title">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm" data-testid="text-empty-description">
        {description}
      </p>
    </div>
  );
}

export function ErrorState({ 
  title = "오류 발생", 
  description = "데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요." 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <Car className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-error-title">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm" data-testid="text-error-description">
        {description}
      </p>
    </div>
  );
}
