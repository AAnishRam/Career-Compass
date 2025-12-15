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
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logoImage from "@/assests/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Job Match", url: "/analyze", icon: FileText },
  { title: "Analytics", url: "/results", icon: BarChart3 },
  { title: "Skills", url: "/skills", icon: Target },
  { title: "Recommendations", url: "/recommendations", icon: TrendingUp },
];

const bottomNavItems = [
  { title: "Help center", url: "/help", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function AppSidebar({ isOpen, onClose, onToggle }: AppSidebarProps) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-6 left-4 z-50 lg:hidden bg-sidebar/80 backdrop-blur-sm border border-sidebar-border hover:bg-sidebar shadow-md text-primary hover:text-primary"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-2 sm:left-4 top-2 sm:top-4 z-40 h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] w-64 sm:w-60 bg-sidebar border border-sidebar-border rounded-xl sm:rounded-2xl shadow-soft transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-[calc(100%+1rem)] lg:translate-x-0"
        }`}
      >
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
                onClick={() => {
                  // Close sidebar on mobile when navigating
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
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
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            ))}

            {/* User Profile with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
                    {user ? getInitials(user.name) : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name || "User"}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
}
