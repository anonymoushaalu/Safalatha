import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface YearReview {
  year: string;
  highlights: string;
  challenges: string;
  lessons: string;
  gratitude: string;
  nextYear: string;
}

export function YearReview() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [reviews, setReviews] = useState<YearReview[]>([]);
  const [highlights, setHighlights] = useState("");
  const [challenges, setChallenges] = useState("");
  const [lessons, setLessons] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [nextYear, setNextYear] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("yearReviews");
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const yearKey = currentYear.toString();
    const review = reviews.find((r) => r.year === yearKey);
    setHighlights(review?.highlights || "");
    setChallenges(review?.challenges || "");
    setLessons(review?.lessons || "");
    setGratitude(review?.gratitude || "");
    setNextYear(review?.nextYear || "");
  }, [currentYear, reviews]);

  const handleSave = () => {
    const yearKey = currentYear.toString();
    const updatedReviews = reviews.filter((r) => r.year !== yearKey);
    if (highlights || challenges || lessons || gratitude || nextYear) {
      updatedReviews.push({
        year: yearKey,
        highlights,
        challenges,
        lessons,
        gratitude,
        nextYear,
      });
    }
    setReviews(updatedReviews);
    localStorage.setItem("yearReviews", JSON.stringify(updatedReviews));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Year Review</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear(currentYear - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium px-4">{currentYear}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear(currentYear + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Year Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What were the biggest moments, achievements, and memorable experiences?"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biggest Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What were the major obstacles and difficulties you overcame?"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Lessons Learned</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What important insights and wisdom did you gain this year?"
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gratitude</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What are you most grateful for this year?"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Year Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What are your aspirations and goals for the coming year?"
              value={nextYear}
              onChange={(e) => setNextYear(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Year Review
        </Button>
      </div>
    </div>
  );
}
