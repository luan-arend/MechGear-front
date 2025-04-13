
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ChevronLeft,
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Wrench, 
  ShoppingBag, 
  FileSpreadsheet, 
  Settings, 
  LogOut,
  Cog
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";

const MainSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard",
    },
    {
      title: "Clientes",
      icon: <Users size={20} />,
      href: "/customers",
    },
    {
      title: "Pedidos",
      icon: <FileSpreadsheet size={20} />,
      href: "/pedidos",
    },
    {
      title: "Equipamentos",
      icon: <Wrench size={20} />,
      href: "/equipamentos",
    },
    {
      title: "Itens/Serviços",
      icon: <ShoppingBag size={20} />,
      href: "/itens",
    },
    {
      title: "Configurações",
      icon: <Settings size={20} />,
      href: "/configuracoes",
    },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar transition-all duration-300 flex flex-col text-sidebar-foreground relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="text-xl font-bold flex items-center gap-2">
            <Cog className="h-5 w-5 text-sidebar-primary animate-spin-slow" />
            MechGear<span className="text-sidebar-primary"></span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs opacity-70">{user?.role}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              {user?.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-primary",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/80"
                  )
                }
              >
                <span className="mr-3">{link.icon}</span>
                {!collapsed && <span>{link.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <span className="text-sm">Modo Escuro</span>
            <Switch 
              checked={theme === "dark"} 
              onCheckedChange={toggleTheme} 
              className="data-[state=checked]:bg-sidebar-primary" 
            />
          </div>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center w-full py-2 px-3 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default MainSidebar;
