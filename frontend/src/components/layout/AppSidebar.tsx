import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Target,
  Settings,
  HelpCircle,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import logoImage from "@/assests/logo.png";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/analyze", icon: FileText },
  { title: "Analytics", url: "/results", icon: BarChart3 },
  { title: "Skills", url: "/skills", icon: Target },
  { title: "Recommendations", url: "/recommendations", icon: TrendingUp },
];

const bottomNavItems = [
  { title: "Help center", url: "/help", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <aside className="fixed left-4 top-4 z-40 h-[calc(100vh-2rem)] w-60 bg-sidebar border border-sidebar-border rounded-2xl shadow-soft">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <img
            src={logoImage}
            alt="Career Compass Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="font-display text-base font-bold text-foreground">
            Career Compass
          </h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-muted/50 transition-all duration-150"
              activeClassName="bg-muted text-foreground font-semibold"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          {/* Bottom Nav Items */}
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-muted/50 transition-all duration-150"
              activeClassName="bg-muted text-foreground font-semibold"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          ))}

          {/* User Profile */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                John Doe
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
