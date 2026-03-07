import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  CheckSquare,
  TrendingUp,
  Flame,
  Target,
  Calendar,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

export function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [streak, setStreak] = useState(0);

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  useEffect(() => {
    // Load habits
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }

    // Load todos
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      const allTodos = JSON.parse(storedTodos);
      const todayTodos = allTodos.filter((t: TodoItem) => t.date === todayString);
      setTodos(todayTodos);
    }

    // Calculate streak
    calculateStreak();
  }, []);

  const calculateStreak = () => {
    const dailyReviews = localStorage.getItem("dailyReviews");
    if (!dailyReviews) {
      setStreak(0);
      return;
    }

    const reviews = JSON.parse(dailyReviews);
    let currentStreak = 0;
    let checkDate = new Date();

    while (true) {
      const dateKey = checkDate.toISOString().split("T")[0];
      if (reviews[dateKey]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  // Calculate today's stats
  const todayTodosCount = todos.length;
  const completedTodosCount = todos.filter((t) => t.completed).length;
  const todoPercentage = todayTodosCount > 0 
    ? Math.round((completedTodosCount / todayTodosCount) * 100) 
    : 0;

  const todayHabitsCount = habits.length;
  const completedHabitsCount = habits.filter((h) =>
    h.completedDates.includes(todayString)
  ).length;
  const habitPercentage = todayHabitsCount > 0
    ? Math.round((completedHabitsCount / todayHabitsCount) * 100)
    : 0;

  // Calculate weekly completion
  const getWeekStats = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    let totalDays = 0;
    let completeDays = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      if (date <= today) {
        totalDays++;
        const dateString = date.toISOString().split("T")[0];
        const dayHabits = habits.filter(h => h.completedDates.includes(dateString));
        if (dayHabits.length === habits.length && habits.length > 0) {
          completeDays++;
        }
      }
    }

    return { totalDays, completeDays };
  };

  const weekStats = getWeekStats();
  const weeklyPercentage = weekStats.totalDays > 0
    ? Math.round((weekStats.completeDays / weekStats.totalDays) * 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          {today.toLocaleDateString("en-US", { weekday: "long" })}
        </h1>
        <p className="text-xl text-gray-600 font-light">
          {today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </motion.div>

      {/* Main Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Habit Completion */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-rose-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-700">
                  Today's Habits
                </CardTitle>
                <Target className="h-5 w-5 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {habitPercentage}
                  </span>
                  <span className="text-2xl text-gray-600 mb-1">%</span>
                </div>
                <Progress value={habitPercentage} className="h-2" />
                <p className="text-sm text-gray-600">
                  {completedHabitsCount} of {todayHabitsCount} completed
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Todo Completion */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-700">
                  Today's Tasks
                </CardTitle>
                <CheckSquare className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {completedTodosCount}
                  </span>
                  <span className="text-2xl text-gray-600 mb-1">
                    / {todayTodosCount}
                  </span>
                </div>
                <Progress value={todoPercentage} className="h-2" />
                <p className="text-sm text-gray-600">
                  {todayTodosCount - completedTodosCount} remaining
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak Counter */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-700">
                  Daily Streak
                </CardTitle>
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {streak}
                  </span>
                  <span className="text-2xl text-gray-600 mb-1">days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>Keep it going!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="border-2 bg-gradient-to-r from-violet-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">This Week's Progress</CardTitle>
              <TrendingUp className="h-5 w-5 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  {weeklyPercentage}% Complete
                </span>
                <span className="text-sm text-gray-600">
                  {weekStats.completeDays} / {weekStats.totalDays} perfect days
                </span>
              </div>
              <Progress value={weeklyPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/diary">
            <Card className="border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        Open Today's Page
                      </h3>
                      <p className="text-sm text-gray-600">
                        Journal, tasks & review
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/habit-tracker">
            <Card className="border-2 hover:border-rose-500 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                      <Target className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        Check Habits
                      </h3>
                      <p className="text-sm text-gray-600">
                        Track your daily habits
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>

      {/* Growth Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Your Growth Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {habits.length}
                </p>
                <p className="text-sm text-gray-600">Active Habits</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {streak}
                </p>
                <p className="text-sm text-gray-600">Current Streak</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {habitPercentage}%
                </p>
                <p className="text-sm text-gray-600">Today's Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
