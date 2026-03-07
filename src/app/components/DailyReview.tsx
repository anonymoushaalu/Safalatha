import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Save } from "lucide-react";

interface Review {
  date: string;
  wins: string;
  challenges: string;
  learnings: string;
  tomorrow: string;
}

export function DailyReview() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [learnings, setLearnings] = useState("");
  const [tomorrow, setTomorrow] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("dailyReviews");
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    const review = reviews.find((r) => r.date === dateKey);
    setWins(review?.wins || "");
    setChallenges(review?.challenges || "");
    setLearnings(review?.learnings || "");
    setTomorrow(review?.tomorrow || "");
  }, [selectedDate, reviews]);

  const handleSave = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    const updatedReviews = reviews.filter((r) => r.date !== dateKey);
    if (wins || challenges || learnings || tomorrow) {
      updatedReviews.push({ date: dateKey, wins, challenges, learnings, tomorrow });
    }
    setReviews(updatedReviews);
    localStorage.setItem("dailyReviews", JSON.stringify(updatedReviews));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Daily Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What went well today?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List your wins and achievements..."
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What challenges did you face?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe any difficulties or obstacles..."
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What did you learn?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Key insights and lessons..."
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What will you do tomorrow?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Plans and priorities for tomorrow..."
                value={tomorrow}
                onChange={(e) => setTomorrow(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Daily Review
          </Button>
        </div>
      </div>
    </div>
  );
}
