import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface MonthlyReview {
  month: string;
  achievements: string;
  challenges: string;
  growth: string;
  nextMonth: string;
}

export function MonthlyReview() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reviews, setReviews] = useState<MonthlyReview[]>([]);
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [growth, setGrowth] = useState("");
  const [nextMonth, setNextMonth] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("monthlyReviews");
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const monthKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const review = reviews.find((r) => r.month === monthKey);
    setAchievements(review?.achievements || "");
    setChallenges(review?.challenges || "");
    setGrowth(review?.growth || "");
    setNextMonth(review?.nextMonth || "");
  }, [currentDate, reviews]);

  const handleSave = () => {
    const monthKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const updatedReviews = reviews.filter((r) => r.month !== monthKey);
    if (achievements || challenges || growth || nextMonth) {
      updatedReviews.push({ month: monthKey, achievements, challenges, growth, nextMonth });
    }
    setReviews(updatedReviews);
    localStorage.setItem("monthlyReviews", JSON.stringify(updatedReviews));
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Monthly Review</h1>
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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Major Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What were your major accomplishments this month?"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenges & Obstacles</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What significant challenges did you face?"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How have you grown? What new skills or insights did you gain?"
              value={growth}
              onChange={(e) => setGrowth(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Month Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What are your main goals and priorities for next month?"
              value={nextMonth}
              onChange={(e) => setNextMonth(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Monthly Review
        </Button>
      </div>
    </div>
  );
}
