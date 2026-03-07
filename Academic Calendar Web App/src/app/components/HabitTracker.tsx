import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Plus, Trash2, Flame, TrendingUp, Award } from "lucide-react";
import { motion } from "motion/react";

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("habits");
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  }, []);

  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit,
        completedDates: [],
      };
      saveHabits([...habits, habit]);
      setNewHabit("");
    }
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter((h) => h.id !== id));
  };

  const toggleHabitToday = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    saveHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const completedDates = habit.completedDates.includes(today)
            ? habit.completedDates.filter((d) => d !== today)
            : [...habit.completedDates, today];
          return { ...habit, completedDates };
        }
        return habit;
      })
    );
  };

  const toggleHabitDate = (habitId: string, date: string) => {
    saveHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const completedDates = habit.completedDates.includes(date)
            ? habit.completedDates.filter((d) => d !== date)
            : [...habit.completedDates, date];
          return { ...habit, completedDates };
        }
        return habit;
      })
    );
  };

  const calculateStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0;

    const sortedDates = [...completedDates].sort().reverse();
    let streak = 0;
    let checkDate = new Date();

    for (let i = 0; i < sortedDates.length; i++) {
      const dateKey = checkDate.toISOString().split("T")[0];
      if (sortedDates.includes(dateKey)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getMonthlyCompletion = (completedDates: string[]) => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = now.getDate();
    
    const completedThisMonth = completedDates.filter((date) => {
      const d = new Date(date);
      return d >= firstDayOfMonth && d <= now;
    }).length;

    return Math.round((completedThisMonth / daysInMonth) * 100);
  };

  const getLast7Weeks = () => {
    const weeks = [];
    for (let i = 6; i >= 0; i--) {
      const days = [];
      for (let j = 0; j < 7; j++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7 + (6 - j)));
        days.push(date);
      }
      weeks.push(days);
    }
    return weeks;
  };

  const weeks = getLast7Weeks();
  const today = new Date().toISOString().split("T")[0];

  const totalHabits = habits.length;
  const completedToday = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;
  const overallPercentage = totalHabits > 0 
    ? Math.round((completedToday / totalHabits) * 100) 
    : 0;

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
        <p className="text-gray-600">Build better habits, one day at a time</p>
      </motion.div>

      {/* Today's Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="border-2 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {overallPercentage}
                </span>
                <span className="text-xl text-gray-600 mb-1">%</span>
              </div>
              <Progress value={overallPercentage} className="h-2" />
              <p className="text-sm text-gray-600">
                {completedToday} of {totalHabits} completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <TrendingUp className="h-10 w-10 text-purple-600" />
              <span className="text-5xl font-bold text-gray-900">
                {totalHabits}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Award className="h-10 w-10 text-amber-600" />
              <span className="text-5xl font-bold text-gray-900">
                {Math.max(
                  ...habits.map((h) => calculateStreak(h.completedDates)),
                  0
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add New Habit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle>Add New Habit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter habit name..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addHabit()}
                className="text-base"
              />
              <Button onClick={addHabit} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-dashed">
            <CardContent className="py-16">
              <div className="text-center">
                <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No habits tracked yet. Add one to get started!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Today's Habits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Today's Habits
            </h2>
            <div className="grid gap-4">
              {habits.map((habit, index) => {
                const isCompletedToday = habit.completedDates.includes(today);
                const streak = calculateStreak(habit.completedDates);
                const monthlyCompletion = getMonthlyCompletion(habit.completedDates);

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card
                      className={`border-2 transition-all duration-300 hover:shadow-lg ${
                        isCompletedToday
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 flex-1">
                            <button
                              onClick={() => toggleHabitToday(habit.id)}
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                                isCompletedToday
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300 hover:border-green-400"
                              }`}
                            >
                              {isCompletedToday && (
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </button>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {habit.name}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1 text-sm">
                                  <Flame className="h-4 w-4 text-orange-500" />
                                  <span className="font-medium text-gray-700">
                                    {streak} day streak
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {monthlyCompletion}% this month
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteHabit(habit.id)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>

                        <div className="mt-4">
                          <Progress value={monthlyCompletion} className="h-1.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>7-Week Activity Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {habits.map((habit) => (
                    <div key={habit.id}>
                      <h4 className="font-medium text-gray-900 mb-3">
                        {habit.name}
                      </h4>
                      <div className="space-y-1">
                        {weeks.map((week, weekIndex) => (
                          <div key={weekIndex} className="flex gap-1">
                            {week.map((day) => {
                              const dateKey = day.toISOString().split("T")[0];
                              const isCompleted = habit.completedDates.includes(dateKey);
                              const isFuture = day > new Date();

                              return (
                                <button
                                  key={dateKey}
                                  onClick={() => !isFuture && toggleHabitDate(habit.id, dateKey)}
                                  disabled={isFuture}
                                  className={`w-8 h-8 rounded transition-all duration-200 ${
                                    isFuture
                                      ? "bg-gray-100 cursor-not-allowed"
                                      : isCompleted
                                      ? "bg-green-500 hover:bg-green-600"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  }`}
                                  title={day.toLocaleDateString()}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>7 weeks ago</span>
                        <div className="flex-1" />
                        <span>Today</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
