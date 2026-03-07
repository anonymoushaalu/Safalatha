import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Save } from "lucide-react";

interface JournalEntry {
  date: string;
  content: string;
}

export function DailyJournal() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("journalEntries");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    const entry = entries.find((e) => e.date === dateKey);
    setContent(entry?.content || "");
  }, [selectedDate, entries]);

  const handleSave = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    const updatedEntries = entries.filter((e) => e.date !== dateKey);
    if (content.trim()) {
      updatedEntries.push({ date: dateKey, content });
    }
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Daily Journal</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your thoughts for today..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] mb-4"
            />
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Entry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
