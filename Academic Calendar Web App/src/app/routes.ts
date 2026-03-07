import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DailyJournal } from "./components/DailyJournal";
import { DailyTodo } from "./components/DailyTodo";
import { WeeklyPlanner } from "./components/WeeklyPlanner";
import { MonthlyPlanner } from "./components/MonthlyPlanner";
import { HabitTracker } from "./components/HabitTracker";
import { ExpenseTracker } from "./components/ExpenseTracker";
import { PassionTracker } from "./components/PassionTracker";
import { VisionBoard } from "./components/VisionBoard";
import { DailyReview } from "./components/DailyReview";
import { WeeklyReview } from "./components/WeeklyReview";
import { MonthlyReview } from "./components/MonthlyReview";
import { YearReview } from "./components/YearReview";
import { Dashboard } from "./components/Dashboard";
import { Diary } from "./components/Diary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "diary", Component: Diary },
      { path: "daily-journal", Component: DailyJournal },
      { path: "daily-todo", Component: DailyTodo },
      { path: "weekly-planner", Component: WeeklyPlanner },
      { path: "monthly-planner", Component: MonthlyPlanner },
      { path: "habit-tracker", Component: HabitTracker },
      { path: "expense-tracker", Component: ExpenseTracker },
      { path: "passion-tracker", Component: PassionTracker },
      { path: "vision-board", Component: VisionBoard },
      { path: "daily-review", Component: DailyReview },
      { path: "weekly-review", Component: WeeklyReview },
      { path: "monthly-review", Component: MonthlyReview },
      { path: "year-review", Component: YearReview },
    ],
  },
]);