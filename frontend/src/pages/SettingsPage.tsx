
import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const SettingsPage: React.FC = () => {
  const { user, refreshSession, logout } = useAuth();
  const { toast } = useToast();
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [apiKeys, setApiKeys] = useState({
    instantly: "••••••••••••••••••••••••••",
    google: "••••••••••••••••••••••••••",
    meta: "••••••••••••••••••••••••••",
  });
  
  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    
    toast({
      title: "Two-Factor Authentication",
      description: !twoFactorEnabled 
        ? "Two-factor authentication has been enabled." 
        : "Two-factor authentication has been disabled.",
    });
  };
  
  const handleApiKeyChange = (platform: string, value: string) => {
    setApiKeys({
      ...apiKeys,
      [platform]: value,
    });
  };
  
  const handleSaveApiKeys = () => {
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been updated successfully.",
    });
  };
  
  return (
    <DashboardLayout title="Settings">
      <div className="space-y-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user?.email} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Two-factor authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                id="two-factor"
                checked={twoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
              />
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Integration</CardTitle>
            <CardDescription>
              Connect your marketing platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instantly-api">Instantly API Key</Label>
              <Input
                id="instantly-api"
                value={apiKeys.instantly}
                onChange={(e) => handleApiKeyChange("instantly", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-api">Google Ads API Key</Label>
              <Input
                id="google-api"
                value={apiKeys.google}
                onChange={(e) => handleApiKeyChange("google", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-api">Meta Ads API Key</Label>
              <Input
                id="meta-api"
                value={apiKeys.meta}
                onChange={(e) => handleApiKeyChange("meta", e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveApiKeys}>Save API Keys</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Session Management</CardTitle>
            <CardDescription>
              Manage your active sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You can extend your current session or log out of all devices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={refreshSession}>
                Extend Session
              </Button>
              <Button variant="destructive" onClick={logout}>
                Log Out of All Devices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
