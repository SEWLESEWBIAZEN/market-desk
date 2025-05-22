import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader, LogOut, Settings, User } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionTimer } from "@/components/auth/SessionTimer";
import { logout as userLogout } from "@/firebase/authentication";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getInitials } from "@/utils/getInitials";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  loading?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title = "Dashboard",
  loading = false
}) => {
  const { user } = useAuth();
  const [isUserLoggedOut, setIsUserLoggedOut] = useState<boolean>(false)
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const isLoggedOut = await userLogout()
      if (isLoggedOut) setIsUserLoggedOut(true)
    } catch (err) {
      toast.error("Logout failed")
    }
  }
  useEffect(() => {
    if (isUserLoggedOut) {
      navigate('/login')
    }
  }, [isUserLoggedOut, navigate])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-6 space-x-2.5">
            <div className="flex-1">
              <h2 className="text-xl font-bold">Market Desk</h2>
              <p className="text-xs text-sidebar-foreground/70">Marketing Analytics</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/dashboard")}
                      >
                        Overview
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Platforms</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/dashboard/instantly")}
                      >
                        <span className="w-2 h-2 rounded-full bg-instantly mr-2"></span>
                        Instantly
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/dashboard/google")}
                      >
                        <span className="w-2 h-2 rounded-full bg-google mr-2"></span>
                        Google Ads
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/dashboard/meta")}
                      >
                        <span className="w-2 h-2 rounded-full bg-meta mr-2"></span>
                        Meta Ads
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/dashboard/settings")}
                      >
                        Settings
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4 space-y-4">
              <SessionTimer />

              <div className="flex items-center justify-between">
                {user && (
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto hover:bg-gray-900 hover:px-2 hover:text-slate-100">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-black">{getInitials(user?.name || "Default User")}</AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="text-sm font-medium">{user?.name || "User"}</p>
                            <p className="text-xs text-muted-foreground">{user?.name || "User"}</p>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold ml-4">{title}</h1>

              <div className="ml-auto flex items-center space-x-4">
                {loading && <Loader className="animate-spin h-5 w-5" />}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
