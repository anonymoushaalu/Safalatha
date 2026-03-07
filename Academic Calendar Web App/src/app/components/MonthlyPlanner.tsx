import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface MonthPlan {
  month: string;
  goals: string;
  notes: string;
}

export function MonthlyPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthPlans, setMonthPlans] = useState<MonthPlan[]>([]);
  const [goals, setGoals] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("monthlyPlans");
    if (stored) {
      setMonthPlans(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const monthKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const plan = monthPlans.find((p) => p.month === monthKey);
    setGoals(plan?.goals || "");
    setNotes(plan?.notes || "");
  }, [currentDate, monthPlans]);

  const handleSave = () => {
    const monthKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const updatedPlans = monthPlans.filter((p) => p.month !== monthKey);
    updatedPlans.push({ month: monthKey, goals, notes });
    setMonthPlans(updatedPlans);
    localStorage.setItem("monthlyPlans", JSON.stringify(updatedPlans));
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Monthly Planner</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-4">{monthName}</span>
          <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What do you want to achieve this month?"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes & Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Important dates, events, or reminders..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day, index) => (
              <div
                key={index}
                className={`text-center py-3 rounded-lg ${
                  day
                    ? "bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    : ""
                } ${
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                    ? "bg-blue-100 font-bold"
                    : ""
                }`}
              >
                {day || ""}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        <Save className="mr-2 h-4 w-4" />
        Save Month Plan
      </Button>
    </div>
  );
}
