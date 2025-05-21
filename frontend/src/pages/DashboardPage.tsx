
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary";
import { OverviewMetricsCards } from "@/components/dashboard/OverviewMetricsCards";
import { InstantlyMetricsCards, GoogleMetricsCards, MetaMetricsCards } from "@/components/dashboard/PlatformMetricsCards";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { marketingService } from "@/services/marketingService";
import { DashboardMetrics } from "@/types";
import { useToast } from "@/hooks/use-toast";

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await marketingService.getDashboardMetrics();
        
        if (response.success && response.data) {
          setMetrics(response.data);
        } else {
          throw new Error(response.error || "Failed to fetch dashboard data");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  return (
    <DashboardLayout title="Dashboard Overview" loading={loading}>
      <div className="space-y-8">
        <ErrorBoundary>
          <OverviewMetricsCards
            totalCampaigns={metrics?.totalCampaigns || 0}
            activeCampaigns={metrics?.activeCampaigns || 0}
            totalSpend={metrics?.totalSpend || 0}
            remainingBudget={metrics?.remainingBudget || 0}
            averageROI={metrics?.averageROI || 0}
            loading={loading}
          />
        </ErrorBoundary>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Instantly</h2>
          <ErrorBoundary>
            <InstantlyMetricsCards
              totalEmails={metrics?.campaignPerformance.instantly.totalEmails || 0}
              openRate={metrics?.campaignPerformance.instantly.openRate || 0}
              replyRate={metrics?.campaignPerformance.instantly.replyRate || 0}
              meetings={metrics?.campaignPerformance.instantly.meetings || 0}
              loading={loading}
            />
          </ErrorBoundary>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Google Ads</h2>
          <ErrorBoundary>
            <GoogleMetricsCards
              impressions={metrics?.campaignPerformance.google.impressions || 0}
              clicks={metrics?.campaignPerformance.google.clicks || 0}
              conversions={metrics?.campaignPerformance.google.conversions || 0}
              cpa={metrics?.campaignPerformance.google.cpa || 0}
              loading={loading}
            />
          </ErrorBoundary>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Meta Ads</h2>
          <ErrorBoundary>
            <MetaMetricsCards
              reach={metrics?.campaignPerformance.meta.reach || 0}
              engagement={metrics?.campaignPerformance.meta.engagement || 0}
              conversions={metrics?.campaignPerformance.meta.conversions || 0}
              cpm={metrics?.campaignPerformance.meta.cpm || 0}
              loading={loading}
            />
          </ErrorBoundary>
        </div>
        
        <div className="grid gap-6 grid-cols-1">
          <ErrorBoundary>
            <PerformanceChart 
              data={metrics?.performanceOverTime[0] || { dates: [], spend: [], results: [] }}
              loading={loading}
            />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <CampaignTable 
              campaigns={metrics?.recentCampaigns || []}
              loading={loading}
            />
          </ErrorBoundary>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
