import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface WeekPlan {
  weekStart: string;
  days: {
    [key: string]: string;
  };
}

export function WeeklyPlanner() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const [dayContents, setDayContents] = useState<{ [key: string]: string }>({});

  function getWeekStart(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    const stored = localStorage.getItem("weeklyPlans");
    if (stored) {
      setWeekPlans(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const weekKey = currentWeekStart.toISOString().split("T")[0];
    const plan = weekPlans.find((p) => p.weekStart === weekKey);
    setDayContents(plan?.days || {});
  }, [currentWeekStart, weekPlans]);

  const handleSave = () => {
    const weekKey = currentWeekStart.toISOString().split("T")[0];
    const updatedPlans = weekPlans.filter((p) => p.weekStart !== weekKey);
    updatedPlans.push({ weekStart: weekKey, days: dayContents });
    setWeekPlans(updatedPlans);
    localStorage.setItem("weeklyPlans", JSON.stringify(updatedPlans));
  };

  const getDaysOfWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeekStart(getWeekStart(newDate));
  };

  const daysOfWeek = getDaysOfWeek();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Weekly Planner</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-4">
            {daysOfWeek[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {daysOfWeek[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {daysOfWeek.map((date) => {
          const dateKey = date.toISOString().split("T")[0];
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          const dayDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return (
            <Card key={dateKey}>
              <CardHeader>
                <CardTitle className="text-base">
                  {dayName}
                  <br />
                  <span className="text-sm font-normal text-gray-500">{dayDate}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Plan for this day..."
                  value={dayContents[dateKey] || ""}
                  onChange={(e) =>
                    setDayContents({ ...dayContents, [dateKey]: e.target.value })
                  }
                  className="min-h-[150px]"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button onClick={handleSave} className="w-full">
        <Save className="mr-2 h-4 w-4" />
        Save Week Plan
      </Button>
    </div>
  );
}
