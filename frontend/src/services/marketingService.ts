
import { fetchInstantlyCampaigns } from "@/api/getInstantlyCampaign";
import { 
  Campaign, 
  InstantlyCampaign, 
  GoogleAdsCampaign, 
  MetaAdsCampaign, 
  DashboardMetrics,
  ApiResponse 
} from "../types";
import { fetchGoogleCampaigns } from "@/api/getGoogleCampains";
import { fetchMetaCampaigns } from "@/api/getMetaCampaign";

type MockData={  
  instantly: InstantlyCampaign[],
  google: GoogleAdsCampaign[],
  meta: MetaAdsCampaign[]
}


// Generate mock data for testing and development
async function generateMockData():Promise<MockData>  {
  // Helper to generate a date string in the past
  const pastDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  
  // Helper to generate a percentage
  const percentage = (max = 100) => Math.round(Math.random() * max * 10) / 10;
  
  // Helper to generate a monetary value
  const money = (min = 500, max = 10000) => Math.round(Math.random() * (max - min) + min);
  
  // Generate Instantly campaigns
  const instantlyCampaigns: InstantlyCampaign[] = await fetchInstantlyCampaigns()
 
  const googleAdsCampaigns: GoogleAdsCampaign[] = await fetchGoogleCampaigns() 
  
  const metaAdsCampaigns: MetaAdsCampaign[] = await fetchMetaCampaigns()
  
 
  return {
    instantly: instantlyCampaigns,
    google: googleAdsCampaigns,
    meta: metaAdsCampaigns,
  };
};

// Mock data store
const mockData = await generateMockData();

// Marketing data service class
class MarketingService {
  async getAllCampaigns(): Promise<ApiResponse<Campaign[]>> {
    await this.simulateApiDelay();
    
    const allCampaigns: Campaign[] = [
      ...mockData.instantly,
      ...mockData.google,
      ...mockData.meta,
    ];
    
    return {
      success: true,
      data: allCampaigns,
      timestamp: new Date().toISOString(),
    };
  }
  
  async getCampaignsByPlatform(platform: string): Promise<ApiResponse<Campaign[]>> {
    await this.simulateApiDelay();
    
    let campaigns: Campaign[] = [];
    
    switch (platform) {
      case "instantly":
        campaigns = mockData.instantly;
        break;
      case "google":
        campaigns = mockData.google;
        break;
      case "meta":
        campaigns = mockData.meta;
        break;
      default:
        return {
          success: false,
          error: "Invalid platform",
          timestamp: new Date().toISOString(),
        };
    }
    
    return {
      success: true,
      data: campaigns,
      timestamp: new Date().toISOString(),
    };
  }
  
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    await this.simulateApiDelay();
    
    // Combine all campaigns
    const allCampaigns = [
      ...mockData.instantly,
      ...mockData.google,
      ...mockData.meta,
    ];
    
    // Calculate metrics
    const totalCampaigns = allCampaigns.length;
    const activeCampaigns = allCampaigns.filter(c => c.status === "active").length;
    const totalSpend = allCampaigns.reduce((sum, camp) => sum + camp.spend, 0);
    const totalBudget = allCampaigns.reduce((sum, camp) => sum + camp.budget, 0);
    const remainingBudget = totalBudget - totalSpend;
    
    // Calculate platform-specific metrics
    const instantlyData = mockData.instantly;
    const googleData = mockData.google;
    const metaData = mockData.meta;
    
    // Calculate performance over time (last 30 days)
    const dates = Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });
    
    // Generate spend data
    const spend = dates.map(() => Math.round(Math.random() * 500 + 100));
    const results = dates.map(() => Math.round(Math.random() * 30 + 5));
    
    // Get recent campaigns (sorted by start date)
    const recentCampaigns = [...allCampaigns]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 5);
    
    // Return dashboard metrics
    return {
      success: true,
      data: {
        totalCampaigns,
        activeCampaigns,
        totalSpend,
        remainingBudget,
        averageROI: 3.2,
        campaignPerformance: {
          instantly: {
            totalEmails: instantlyData.reduce((sum, camp) => sum + camp.emailsSent, 0),
            openRate: this.calculateAverage(instantlyData, "openRate"),
            replyRate: this.calculateAverage(instantlyData, "replyRate"),
            meetings: instantlyData.reduce((sum, camp) => sum + camp.meetings, 0),
          },
          google: {
            impressions: googleData.reduce((sum, camp) => sum + camp.impressions, 0),
            clicks: googleData.reduce((sum, camp) => sum + camp.clicks, 0),
            conversions: googleData.reduce((sum, camp) => sum + camp.conversions, 0),
            cpa: this.calculateWeightedCPA(googleData),
          },
          meta: {
            reach: metaData.reduce((sum, camp) => sum + camp.reach, 0),
            engagement: metaData.reduce((sum, camp) => sum + camp.engagement, 0),
            conversions: metaData.reduce((sum, camp) => sum + camp.conversions, 0),
            cpm: this.calculateAverage(metaData, "cpm"),
          },
        },
        recentCampaigns,
        performanceOverTime: [
          {
            dates,
            spend,
            results,
          },
        ],
      },
      timestamp: new Date().toISOString(),
    };
  }
  
  // Calculate weighted average for CPA
  private calculateWeightedCPA(campaigns: GoogleAdsCampaign[]): number {
    const totalConversions = campaigns.reduce((sum, camp) => sum + camp.conversions, 0);
    if (totalConversions === 0) return 0;
    
    const weightedCPA = campaigns.reduce(
      (sum, camp) => sum + camp.costPerConversion * (camp.conversions / totalConversions),
      0
    );
    
    return parseFloat(weightedCPA.toFixed(2));
  }
  
  // Calculate average for a specific property
  private calculateAverage(campaigns: any[], property: string): number {
    if (campaigns.length === 0) return 0;
    
    const sum = campaigns.reduce((acc, camp) => acc + camp[property], 0);
    return parseFloat((sum / campaigns.length).toFixed(2));
  }
  
  // Simulate API delay (200-800ms)
  private async simulateApiDelay(): Promise<void> {
    const delay = Math.random() * 600 + 200;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const marketingService = new MarketingService();
export default marketingService;
