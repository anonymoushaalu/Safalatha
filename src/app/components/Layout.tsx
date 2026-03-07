import { Outlet, Link, useLocation } from "react-router";
import { useState } from "react";
import {
  BookOpen,
  CheckSquare,
  Calendar,
  CalendarDays,
  Heart,
  DollarSign,
  Sparkles,
  Image,
  FileText,
  LayoutDashboard,
  BookMarked,
  Menu,
  X,
} from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Diary", href: "/diary", icon: BookMarked },
  { name: "Daily Journal", href: "/daily-journal", icon: BookOpen },
  { name: "Daily To-Do", href: "/daily-todo", icon: CheckSquare },
  { name: "Weekly Planner", href: "/weekly-planner", icon: Calendar },
  { name: "Monthly Planner", href: "/monthly-planner", icon: CalendarDays },
  { name: "Habit Tracker", href: "/habit-tracker", icon: Heart },
  { name: "Expense Tracker", href: "/expense-tracker", icon: DollarSign },
  { name: "Passion Tracker", href: "/passion-tracker", icon: Sparkles },
  { name: "Vision Board", href: "/vision-board", icon: Image },
];

const reviews = [
  { name: "Daily Review", href: "/daily-review", icon: FileText },
  { name: "Weekly Review", href: "/weekly-review", icon: FileText },
  { name: "Monthly Review", href: "/monthly-review", icon: FileText },
  { name: "Year Review", href: "/year-review", icon: FileText },
];

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0"
        )}
      >
        <div className={cn("transition-opacity duration-300", sidebarOpen ? "opacity-100" : "opacity-0")}>
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Academic Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">Track your journey</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Reviews
              </h3>
              <nav className="space-y-1">
                {reviews.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-100"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}