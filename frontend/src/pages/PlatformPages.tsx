
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary";
import { InstantlyMetricsCards, GoogleMetricsCards, MetaMetricsCards } from "@/components/dashboard/PlatformMetricsCards";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { marketingService } from "@/services/marketingService";
import { Campaign } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const PlatformPage: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Validate platform parameter
  const validPlatform = platform === "instantly" || platform === "google" || platform === "meta";
  
  // Format platform name for display
  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case "instantly":
        return "Instantly";
      case "google":
        return "Google Ads";
      case "meta":
        return "Meta Ads";
      default:
        return platform;
    }
  };
  
  // Calculate platform metrics
  const calculateMetrics = (campaigns: Campaign[]) => {
    if (platform === "instantly") {
      const totalEmails = campaigns.reduce((sum, campaign: any) => sum + campaign.emailsSent, 0);
      const openRate = parseFloat((campaigns.reduce((sum, campaign: any) => sum + campaign.openRate, 0) / campaigns.length).toFixed(1));
      const replyRate = parseFloat((campaigns.reduce((sum, campaign: any) => sum + campaign.replyRate, 0) / campaigns.length).toFixed(1));
      const meetings = campaigns.reduce((sum, campaign: any) => sum + campaign.meetings, 0);
      
      return { totalEmails, openRate, replyRate, meetings };
    }
    
    if (platform === "google") {
      const impressions = campaigns.reduce((sum, campaign: any) => sum + campaign.impressions, 0);
      const clicks = campaigns.reduce((sum, campaign: any) => sum + campaign.clicks, 0);
      const conversions = campaigns.reduce((sum, campaign: any) => sum + campaign.conversions, 0);
      
      // Calculate weighted CPA
      const totalConversions = campaigns.reduce((sum, camp: any) => sum + camp.conversions, 0);
      const cpa = totalConversions === 0 ? 0 : 
        parseFloat((campaigns.reduce(
          (sum, camp: any) => sum + camp.costPerConversion * (camp.conversions / totalConversions), 0
        )).toFixed(2));
      
      return { impressions, clicks, conversions, cpa };
    }
    
    if (platform === "meta") {
      const reach = campaigns.reduce((sum, campaign: any) => sum + campaign.reach, 0);
      const engagement = campaigns.reduce((sum, campaign: any) => sum + campaign.engagement, 0);
      const conversions = campaigns.reduce((sum, campaign: any) => sum + campaign.conversions, 0);
      const cpm = parseFloat((campaigns.reduce((sum, campaign: any) => sum + campaign.cpm, 0) / campaigns.length).toFixed(2));
      
      return { reach, engagement, conversions, cpm };
    }
    
    return {};
  };
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      // Reset state when platform changes
      setCampaigns([]);
      setError(null);
      setLoading(true);
      
      if (!validPlatform) {
        setError(`Invalid platform: ${platform}`);
        setLoading(false);
        return;
      }
      
      try {
        const response = await marketingService.getCampaignsByPlatform(platform || "");
        
        if (response.success && response.data) {
          setCampaigns(response.data);
        } else {
          throw new Error(response.error || `Failed to fetch ${platform} campaigns`);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : `Failed to load ${platform} data`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [platform, toast, validPlatform]);
  
  // If platform is invalid, show error
  if (!validPlatform && !loading) {
    return (
      <DashboardLayout title="Platform Not Found">
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The platform "{platform}" does not exist or is not supported.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }
  
  // Platform-specific metrics
  const metrics = calculateMetrics(campaigns);
  
  return (
    <DashboardLayout title={`${getPlatformDisplayName(platform || "")} Dashboard`} loading={loading}>
      <div className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <ErrorBoundary>
          {platform === "instantly" && (
            <InstantlyMetricsCards 
              totalEmails={(metrics as any).totalEmails || 0}
              openRate={(metrics as any).openRate || 0}
              replyRate={(metrics as any).replyRate || 0}
              meetings={(metrics as any).meetings || 0}
              loading={loading}
            />
          )}
          
          {platform === "google" && (
            <GoogleMetricsCards 
              impressions={(metrics as any).impressions || 0}
              clicks={(metrics as any).clicks || 0}
              conversions={(metrics as any).conversions || 0}
              cpa={(metrics as any).cpa || 0}
              loading={loading}
            />
          )}
          
          {platform === "meta" && (
            <MetaMetricsCards 
              reach={(metrics as any).reach || 0}
              engagement={(metrics as any).engagement || 0}
              conversions={(metrics as any).conversions || 0}
              cpm={(metrics as any).cpm || 0}
              loading={loading}
            />
          )}
        </ErrorBoundary>
        
        <ErrorBoundary>
          <CampaignTable 
            campaigns={campaigns}
            loading={loading}
          />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};
