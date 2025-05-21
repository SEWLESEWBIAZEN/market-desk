
import React from "react";
import { StatsCard } from "./StatsCard";

interface OverviewMetricsCardsProps {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  remainingBudget: number;
  averageROI: number;
  loading?: boolean;
}

export const OverviewMetricsCards: React.FC<OverviewMetricsCardsProps> = ({
  totalCampaigns,
  activeCampaigns,
  totalSpend,
  remainingBudget,
  averageROI,
  loading = false,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
      <StatsCard
        title="Total Campaigns"
        value={totalCampaigns}
        loading={loading}
      />
      <StatsCard
        title="Active Campaigns"
        value={activeCampaigns}
        description={`${Math.round((activeCampaigns / totalCampaigns) * 100)}% of total`}
        loading={loading}
      />
      <StatsCard
        title="Total Spend"
        value={formatCurrency(totalSpend)}
        change={2.5}
        changeLabel="vs. last month"
        loading={loading}
      />
      <StatsCard
        title="Remaining Budget"
        value={formatCurrency(remainingBudget)}
        description="Across all campaigns"
        loading={loading}
      />
      <StatsCard
        title="Average ROI"
        value={`${averageROI}x`}
        change={0.3}
        changeLabel="vs. last month"
        loading={loading}
      />
    </div>
  );
};
