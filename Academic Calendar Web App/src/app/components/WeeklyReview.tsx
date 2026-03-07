import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface WeeklyReview {
  weekStart: string;
  highlights: string;
  challenges: string;
  learnings: string;
  nextWeek: string;
}

export function WeeklyReview() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [highlights, setHighlights] = useState("");
  const [challenges, setChallenges] = useState("");
  const [learnings, setLearnings] = useState("");
  const [nextWeek, setNextWeek] = useState("");

  function getWeekStart(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    const stored = localStorage.getItem("weeklyReviews");
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const weekKey = currentWeekStart.toISOString().split("T")[0];
    const review = reviews.find((r) => r.weekStart === weekKey);
    setHighlights(review?.highlights || "");
    setChallenges(review?.challenges || "");
    setLearnings(review?.learnings || "");
    setNextWeek(review?.nextWeek || "");
  }, [currentWeekStart, reviews]);

  const handleSave = () => {
    const weekKey = currentWeekStart.toISOString().split("T")[0];
    const updatedReviews = reviews.filter((r) => r.weekStart !== weekKey);
    if (highlights || challenges || learnings || nextWeek) {
      updatedReviews.push({ weekStart: weekKey, highlights, challenges, learnings, nextWeek });
    }
    setReviews(updatedReviews);
    localStorage.setItem("weeklyReviews", JSON.stringify(updatedReviews));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeekStart(getWeekStart(newDate));
  };

  const getWeekEnd = () => {
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);
    return end;
  };

  const weekEnd = getWeekEnd();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Weekly Review</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-4">
            {currentWeekStart.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            -{" "}
            {weekEnd.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Week Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What were your biggest wins and achievements this week?"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenges Faced</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What obstacles or difficulties did you encounter?"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Learnings</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What insights or lessons did you gain this week?"
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Week Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What are your priorities and goals for next week?"
              value={nextWeek}
              onChange={(e) => setNextWeek(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Weekly Review
        </Button>
      </div>
    </div>
  );
}
