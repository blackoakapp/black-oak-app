import * as React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, BookOpen, BarChart3, User, Trophy, Users, MessageSquare, Settings, History } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { ChatBot } from "./ChatBot";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Journal", path: "/journal" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: History, label: "Backtesting", path: "/backtesting" },
  { icon: Users, label: "Community", path: "/community" },
];

const secondaryNavItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = navItems.findIndex(item => item.path === location.pathname);
    if (currentIndex === -1) return;

    if (direction === 'left' && currentIndex < navItems.length - 1) {
      navigate(navItems[currentIndex + 1].path);
    } else if (direction === 'right' && currentIndex > 0) {
      navigate(navItems[currentIndex - 1].path);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-16 md:pt-0 md:pb-0 md:pl-64 transition-colors duration-200 dark:bg-black dark:text-slate-100 overflow-x-hidden">
      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl transition-colors duration-200 dark:border-gray-800 dark:bg-black/80 md:hidden">
        <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
          BLACK <span className="text-blue-500">OAK</span>
        </span>
        <button 
          onClick={() => navigate("/profile")}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-90 z-[60]",
            location.pathname === "/profile" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-200 text-slate-500 dark:bg-gray-800 dark:text-gray-400"
          )}
        >
          <User className="h-6 w-6" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-slate-200 bg-white/50 backdrop-blur-xl transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/50 md:flex">
        <div className="flex h-16 items-center px-6">
          <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
            BLACK <span className="text-blue-500">OAK</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="my-4 border-t border-slate-200 dark:border-gray-800" />
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-slate-200 bg-white/80 px-2 py-3 backdrop-blur-xl transition-colors duration-200 dark:border-gray-800 dark:bg-black/80 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center space-y-1 text-xs font-medium transition-colors",
                isActive ? "text-blue-500" : "text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300"
              )
            }
          >
            <item.icon className="h-6 w-6" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/add-trade"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-transform -translate-y-4"
        >
          <PlusCircle className="h-7 w-7" />
        </NavLink>
      </nav>

      {/* Floating Action Button (Desktop) */}
      <NavLink
        to="/add-trade"
        className="fixed bottom-8 right-8 hidden h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all md:flex"
      >
        <PlusCircle className="h-8 w-8" />
      </NavLink>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.05}
            onDragEnd={(_, info) => {
              const threshold = 50;
              if (info.offset.x < -threshold) {
                handleSwipe('left');
              } else if (info.offset.x > threshold) {
                handleSwipe('right');
              }
            }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <ChatBot />
    </div>
  );
}
