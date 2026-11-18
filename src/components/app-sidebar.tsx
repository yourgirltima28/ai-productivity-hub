import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, FileSearch, LayoutDashboard, Mail, Settings } from "lucide-react";

import logo from "@/assets/logo-mark.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const NAV_ITEMS = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Smart Email Generator", url: "/email", icon: Mail },
  { title: "AI Research Assistant", url: "/research", icon: FileSearch },
  { title: "AI Workplace Chatbot", url: "/chat", icon: Bot },
] as const;

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const item = (title: string, url: "/" | "/email" | "/research" | "/chat" | "/settings", Icon: typeof Mail) => (
    <SidebarMenuItem key={url}>
      <SidebarMenuButton
        asChild
        isActive={pathname === url}
        tooltip={title}
        className="h-10 data-[active=true]:bg-gradient-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-glow"
      >
        <Link to={url} onClick={() => setOpenMobile(false)}>
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden" onClick={() => setOpenMobile(false)}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
            <img src={logo} alt="" width={24} height={24} className="size-6" />
          </span>
          <span className="truncate font-display text-sm font-semibold leading-tight text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
            Workplace
            <span className="block text-xs font-normal text-sidebar-foreground">AI Productivity Assistant</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">{NAV_ITEMS.map((n) => item(n.title, n.url, n.icon))}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-4">
        <SidebarMenu>{item("Settings", "/settings", Settings)}</SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
