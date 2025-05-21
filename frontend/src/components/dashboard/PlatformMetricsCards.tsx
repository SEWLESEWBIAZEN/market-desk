
import React from "react";
import { StatsCard } from "./StatsCard";

interface InstantlyMetricsProps {
  totalEmails: number;
  openRate: number;
  replyRate: number;
  meetings: number;
  loading?: boolean;
}

export const InstantlyMetricsCards: React.FC<InstantlyMetricsProps> = ({
  totalEmails,
  openRate,
  replyRate,
  meetings,
  loading = false,
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Emails"
        value={totalEmails.toLocaleString()}
        loading={loading}
        className="border-l-4 border-instantly"
      />
      <StatsCard
        title="Open Rate"
        value={`${openRate}%`}
        change={1.2}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-instantly"
      />
      <StatsCard
        title="Reply Rate"
        value={`${replyRate}%`}
        change={0.5}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-instantly"
      />
      <StatsCard
        title="Meetings Booked"
        value={meetings}
        change={2.3}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-instantly"
      />
    </div>
  );
};

interface GoogleMetricsProps {
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  loading?: boolean;
}

export const GoogleMetricsCards: React.FC<GoogleMetricsProps> = ({
  impressions,
  clicks,
  conversions,
  cpa,
  loading = false,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Impressions"
        value={formatNumber(impressions)}
        loading={loading}
        className="border-l-4 border-google"
      />
      <StatsCard
        title="Clicks"
        value={formatNumber(clicks)}
        change={1.8}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-google"
      />
      <StatsCard
        title="Conversions"
        value={formatNumber(conversions)}
        change={-0.3}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-google"
      />
      <StatsCard
        title="Cost per Acquisition"
        value={`$${cpa.toFixed(2)}`}
        change={-2.1}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-google"
      />
    </div>
  );
};

interface MetaMetricsProps {
  reach: number;
  engagement: number;
  conversions: number;
  cpm: number;
  loading?: boolean;
}

export const MetaMetricsCards: React.FC<MetaMetricsProps> = ({
  reach,
  engagement,
  conversions,
  cpm,
  loading = false,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Reach"
        value={formatNumber(reach)}
        loading={loading}
        className="border-l-4 border-meta"
      />
      <StatsCard
        title="Engagements"
        value={formatNumber(engagement)}
        change={3.2}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-meta"
      />
      <StatsCard
        title="Conversions"
        value={formatNumber(conversions)}
        change={1.4}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-meta"
      />
      <StatsCard
        title="CPM"
        value={`$${cpm.toFixed(2)}`}
        change={-0.8}
        changeLabel="vs. prev. period"
        loading={loading}
        className="border-l-4 border-meta"
      />
    </div>
  );
};
