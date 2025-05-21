
import * as React from "react";
import { Campaign } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CampaignTableProps {
  campaigns: Campaign[];
  loading?: boolean;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ 
  campaigns,
  loading = false
}) => {
  // Format date to MMM DD, YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600";
      case "paused":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "completed":
        return "bg-blue-500 hover:bg-blue-600";
      case "draft":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  // Get platform color
  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case "instantly":
        return "bg-instantly text-white";
      case "google":
        return "bg-google text-white";
      case "meta":
        return "bg-meta text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  // Calculate spend percentage
  const calculateSpendPercentage = (spent: number, budget: number): number => {
    return Math.min(Math.round((spent / budget) * 100), 100);
  };
  
  // Get primary KPI for the campaign
  const getPrimaryKPI = (campaign: Campaign): string => {
    switch (campaign.platform) {
      case "instantly":
        return `${(campaign as any).replyRate}% reply rate`;
      case "google":
        return `${(campaign as any).conversions} conversions`;
      case "meta":
        return `${(campaign as any).conversions} conversions`;
      default:
        return "";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="text-right">Results</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton loading state
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-28 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getPlatformColor(campaign.platform)}>
                        {campaign.platform}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(campaign.startDate)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {formatCurrency(campaign.spend)} / {formatCurrency(campaign.budget)}
                        </p>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${calculateSpendPercentage(campaign.spend, campaign.budget)}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{getPrimaryKPI(campaign)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
