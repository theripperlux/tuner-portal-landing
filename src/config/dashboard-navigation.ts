import { DashboardPermission } from "@/types/auth";
import { LayoutDashboard, Settings, Key, Users, CreditCard, Car, FileCode, Ticket } from "lucide-react";

export type DashboardIconId = "LayoutDashboard" | "Settings" | "Key" | "Users" | "CreditCard" | "Car" | "FileCode" | "Ticket";

export type DashboardNavigationItem = {
  id: string;
  href: string;
  labelId: string;
  icon: any; // We use the actual Lucide component here for simplicity in rendering
  requiredPermission: DashboardPermission;
};

export const dashboardNavigation: DashboardNavigationItem[] = [
  {
    id: "overview",
    href: "/dashboard",
    labelId: "Overview", // Will be localized via next-intl later
    icon: LayoutDashboard,
    requiredPermission: "dashboard:view",
  },
  {
    id: "files",
    href: "/dashboard/files",
    labelId: "Tuning Files",
    icon: FileCode,
    requiredPermission: "files:view",
  },
  {
    id: "tickets",
    href: "/dashboard/tickets",
    labelId: "Support",
    icon: Ticket,
    requiredPermission: "tickets:view",
  },
  {
    id: "billing",
    href: "/dashboard/billing",
    labelId: "Billing & Credits",
    icon: CreditCard,
    requiredPermission: "credits:view",
  },
  {
    id: "customers",
    href: "/dashboard/customers",
    labelId: "Customers",
    icon: Users,
    requiredPermission: "profile:view",
  },
  {
    id: "branding",
    href: "/dashboard/branding",
    labelId: "Branding",
    icon: Settings,
    requiredPermission: "settings:view",
  },
  {
    id: "integrations",
    href: "/dashboard/integrations",
    labelId: "Integrations",
    icon: Key,
    requiredPermission: "settings:view",
  },
  {
    id: "vehicles",
    href: "/dashboard/vehicles",
    labelId: "Vehicle DB",
    icon: Car,
    requiredPermission: "vehicles:view",
  },
];
