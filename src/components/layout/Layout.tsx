import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, History, Settings, Moon, Sun, Menu, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Toaster } from "sonner";

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "POS Terminal", path: "/pos", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Order History", path: "/history", icon: <History className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans overflow-hidden transition-colors duration-300">
      <Toaster theme={theme} position="top-right" />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-colors z-20">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-emerald-500/20">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-xl">Smart POS</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group",
                location.pathname === item.path
                  ? "bg-zinc-100 dark:bg-zinc-800/80 text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50"
              )}
            >
              <div className={cn(
                "mr-3 transition-colors",
                location.pathname === item.path
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              )}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <button 
            onClick={toggleTheme}
            className="flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-5 h-5 mr-3 text-zinc-400" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 mr-3 text-zinc-400" />
                Dark Mode
              </>
            )}
          </button>
          <button className="flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 group">
            <LogOut className="w-5 h-5 mr-3 text-zinc-400 group-hover:text-red-500 transition-colors" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-20">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-2 shadow-sm">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">Smart POS</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-50 shadow-xl opacity-100 animate-in fade-in slide-in-from-top-2">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                    location.pathname === item.path
                      ? "bg-zinc-100 dark:bg-zinc-800/80 text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  <div className="mr-3">{item.icon}</div>
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2"></div>
              <button 
                onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium text-zinc-600 dark:text-zinc-400"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
                Toggle Theme
              </button>
            </nav>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 overflow-auto bg-zinc-100/50 dark:bg-zinc-950/50 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
