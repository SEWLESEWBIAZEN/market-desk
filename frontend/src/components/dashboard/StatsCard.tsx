
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  changeLabel?: string;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  change,
  changeLabel,
  className,
  icon,
  loading = false,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            
            {loading ? (
              <div className="h-9 w-24 bg-muted/80 rounded animate-pulse mt-2" />
            ) : (
              <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
            )}
            
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            
            {(change !== undefined) && (
              <div className="flex items-center mt-2">
                {isPositive && (
                  <div className="flex items-center text-green-600 text-xs font-medium">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {Math.abs(change)}%
                  </div>
                )}
                
                {isNegative && (
                  <div className="flex items-center text-red-600 text-xs font-medium">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    {Math.abs(change)}%
                  </div>
                )}
                
                {!isPositive && !isNegative && change === 0 && (
                  <div className="text-gray-500 text-xs font-medium">0%</div>
                )}
                
                {changeLabel && (
                  <span className="text-xs text-muted-foreground ml-1">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
