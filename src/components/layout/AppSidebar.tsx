import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  BookOpen, 
  PlusCircle,
  Settings, 
  LogOut,
} from "lucide-react";

interface AppSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export const AppSidebar = ({ activeItem, onItemClick }: AppSidebarProps) => {
  const [readingStreak, setReadingStreak] = useState(7);
  const { state } = useSidebar();

  const menuItems = [
    { id: "my-books", label: "My Books", icon: BookOpen, badge: null },
    { id: "add-book", label: "Add Book", icon: PlusCircle, badge: null },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <div>
              <h1 className="text-xl font-bold gradient-text">BookBase</h1>
              <p className="text-xs text-sidebar-foreground/60">Personal Library</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Reading Stats */}
        {state === "expanded" && (
          <div className="p-4">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-sidebar-foreground">Reading Streak</span>
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold gradient-text">{readingStreak}</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Keep it up! 🔥</div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => onItemClick(item.id)}
                      isActive={isActive}
                      tooltip={state === "collapsed" ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <SidebarMenuBadge>
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton 
                  onClick={() => onItemClick(item.id)}
                  tooltip={state === "collapsed" ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};