import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Flame,
  Smile,
  CalendarDays,
  BookMarked,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Page Types
type PageType = "journal" | "reflection" | "todo";

interface Page {
  date: string; // ISO date string
  type: PageType;
  content: string;
  mood?: string;
  todos?: TodoItem[];
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

// Helper to get all dates from Jan 1 to Dec 31 of selected year
function getDateRange(selectedYear: number): string[] {
  const allDates: string[] = [];
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, month, day);
      allDates.push(date.toISOString().split("T")[0]);
    }
  }
  
  return allDates;
}

// Helper to calculate page number for a date and page type
function calculatePageNumber(date: string, pageType: PageType, allDates: string[]): number {
  const dateIndex = allDates.indexOf(date);
  if (dateIndex === -1) return 1;

  const pagesPerDay = 3;
  const basePage = dateIndex * pagesPerDay;

  const typeOffset = pageType === "journal" ? 0 : pageType === "reflection" ? 1 : 2;
  
  return basePage + typeOffset + 1; // +1 because pages start at 1, not 0
}

// Helper to get date and type from page number
function getDateAndTypeFromPageNumber(
  pageNumber: number,
  allDates: string[]
): { date: string; type: PageType } {
  const pageIndex = pageNumber - 1; // Convert to 0-based
  const dayIndex = Math.floor(pageIndex / 3);
  const pageInDay = pageIndex % 3;

  const date = allDates[dayIndex] || allDates[allDates.length - 1];
  const type: PageType = pageInDay === 0 ? "journal" : pageInDay === 1 ? "reflection" : "todo";

  return { date, type };
}

export function Diary() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward");

  // Load pages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("notebookPages");
    if (stored) {
      const loadedPages = JSON.parse(stored);
      setPages(loadedPages);
    }
  }, []);

  // Save pages to localStorage
  const savePages = (updatedPages: Page[]) => {
    setPages(updatedPages);
    localStorage.setItem("notebookPages", JSON.stringify(updatedPages));
  };

  // Get all dates
  const selectedYear = new Date().getFullYear();
  const allDates = getDateRange(selectedYear);
  const totalPages = allDates.length * 3;

  // Get current page details
  const { date: currentDate, type: currentPageType } = getDateAndTypeFromPageNumber(
    currentPageNumber,
    allDates
  );

  // Get current page data
  const currentPage = pages.find((p) => p.date === currentDate && p.type === currentPageType);

  // Update or create page
  const updatePage = (date: string, type: PageType, updates: Partial<Page>) => {
    const updatedPages = [...pages];
    const existingIndex = updatedPages.findIndex((p) => p.date === date && p.type === type);

    if (existingIndex >= 0) {
      updatedPages[existingIndex] = { ...updatedPages[existingIndex], ...updates };
    } else {
      updatedPages.push({
        date,
        type,
        content: "",
        ...updates,
      });
    }

    savePages(updatedPages);
  };

  // Navigate pages
  const goToPage = (pageNum: number, direction: "forward" | "backward" = "forward") => {
    setFlipDirection(direction);
    const clampedPage = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPageNumber(clampedPage);
  };

  const nextPage = () => {
    if (currentPageNumber < totalPages) {
      goToPage(currentPageNumber + 1, "forward");
    }
  };

  const prevPage = () => {
    if (currentPageNumber > 1) {
      goToPage(currentPageNumber - 1, "backward");
    }
  };

  // Jump to specific date
  const jumpToDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const pageNum = calculatePageNumber(dateStr, "journal", allDates);
    goToPage(pageNum, "forward");
    setShowCalendar(false);
  };

  // Calculate writing streak
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i >= -365; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() + i);
      const dateStr = checkDate.toISOString().split("T")[0];

      const hasContent = pages.some(
        (p) =>
          p.date === dateStr &&
          (p.type === "journal" || p.type === "reflection") &&
          p.content.trim().length > 0
      );

      if (hasContent) {
        streak++;
      } else if (i < 0) {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // Moods
  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😫", label: "Tired" },
    { emoji: "😤", label: "Frustrated" },
    { emoji: "🤗", label: "Grateful" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "🥳", label: "Excited" },
  ];

  // Todo functions
  const currentTodos = currentPage?.todos || [];

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
      };
      updatePage(currentDate, currentPageType, {
        todos: [...currentTodos, todo],
      });
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = currentTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    updatePage(currentDate, currentPageType, { todos: updatedTodos });
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
    updatePage(currentDate, currentPageType, { todos: updatedTodos });
  };

  // Page titles and prompts
  const pageConfig = {
    journal: {
      title: "Daily Journal",
      icon: "✍️",
      prompt: "Write freely about your day, thoughts, and experiences...",
    },
    reflection: {
      title: "Daily Reflection",
      icon: "💭",
      prompt: "What went well today? What could be improved? What am I grateful for?",
    },
    todo: {
      title: "Daily To-Do",
      icon: "✓",
      prompt: "Tasks for today",
    },
  };

  const config = pageConfig[currentPageType];

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2 md:gap-3">
          <BookOpen className="h-6 w-6 md:h-10 md:w-10 text-blue-600" />
          My Notebook
        </h1>
        <p className="text-sm md:text-lg text-gray-600">
          A physical notebook experience • Page {currentPageNumber} of {totalPages}
        </p>
      </motion.div>

      {/* Streak Counter */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto mb-4 md:mb-6"
        >
          <Card className="border-2 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="py-3 md:py-4">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                <span className="text-sm md:text-lg font-semibold text-gray-900">
                  {streak} Day Writing Streak! Keep it going! 🔥
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Book Container */}
      <div className="max-w-6xl mx-auto">
        <Card className="border-2 md:border-4 border-amber-900 shadow-2xl bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="p-4 md:p-8">
            {/* Page Type Navigation - MOVED INSIDE NOTEBOOK */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8">
              <button
                onClick={() => {
                  const journalPageNum = calculatePageNumber(currentDate, "journal", allDates);
                  goToPage(journalPageNum, currentPageType === "journal" ? "forward" : "backward");
                }}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                  currentPageType === "journal"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                ✍️ Daily Journal
              </button>
              <button
                onClick={() => {
                  const reflectionPageNum = calculatePageNumber(currentDate, "reflection", allDates);
                  goToPage(reflectionPageNum, "forward");
                }}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                  currentPageType === "reflection"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                💭 Diary
              </button>
              <button
                onClick={() => {
                  const todoPageNum = calculatePageNumber(currentDate, "todo", allDates);
                  goToPage(todoPageNum, "forward");
                }}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                  currentPageType === "todo"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                ✓ To-Do List
              </button>
            </div>

            {/* Compact Mood Selector Bar - Replaces navigation bar */}
            {(currentPageType === "journal" || currentPageType === "reflection") && (
              <div className="mb-6 bg-white rounded-lg p-3 md:p-4 shadow-md">
                <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                  <span className="text-xs md:text-sm text-gray-600 font-serif mr-2">
                    <Smile className="h-4 w-4 inline mr-1" />
                    Mood:
                  </span>
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() =>
                        updatePage(currentDate, currentPageType, {
                          mood: mood.emoji,
                          content: currentPage?.content || "",
                        })
                      }
                      className={`px-2 md:px-3 py-1 md:py-2 rounded-lg border-2 transition-all hover:scale-110 ${
                        currentPage?.mood === mood.emoji
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      title={mood.label}
                    >
                      <span className="text-lg md:text-2xl">{mood.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Popup */}
            {showCalendar && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookMarked className="h-5 w-5" />
                      Jump to a specific date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={new Date(currentDate)}
                      onSelect={(date) => date && jumpToDate(date)}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Page Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPageNumber}
                initial={{ 
                  opacity: 0, 
                  rotateY: flipDirection === "forward" ? -15 : 15,
                  x: flipDirection === "forward" ? 50 : -50 
                }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ 
                  opacity: 0, 
                  rotateY: flipDirection === "forward" ? 15 : -15,
                  x: flipDirection === "forward" ? -50 : 50 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Two-Page Notebook Spread */}
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 relative">
                  {/* Spiral Binding in Center - Only on Desktop */}
                  <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 flex-col items-center justify-start gap-6 py-8 z-10">
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg border-2 border-gray-800" />
                    ))}
                  </div>

                  {/* Left Page - Hidden on mobile */}
                  <div 
                    className="hidden lg:block flex-1 bg-white rounded-l-lg shadow-2xl p-4 md:p-8 pr-6 md:pr-12 min-h-[500px] md:min-h-[750px] relative"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        repeating-linear-gradient(
                          transparent,
                          transparent 31px,
                          #e0e0e0 31px,
                          #e0e0e0 32px
                        )
                      `,
                      backgroundSize: '40px 32px, 100% 32px',
                      backgroundPosition: '0 48px, 0 48px',
                      backgroundRepeat: 'no-repeat, repeat',
                    }}
                  >
                    {/* Margin line */}
                    <div className="absolute left-8 md:left-10 top-0 bottom-0 w-0.5 bg-red-300"></div>
                    
                    {/* Page number in corner */}
                    <div className="absolute top-4 md:top-6 right-4 md:right-6 text-gray-400 font-serif text-xs md:text-sm">
                      {currentPageNumber}
                    </div>

                    {/* Date Header */}
                    <div className="mb-4 md:mb-6 relative z-10">
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
                        <span className="text-base md:text-xl">{config.icon}</span>
                        {config.title}
                      </h2>
                      <p className="text-gray-600 mt-1 font-serif text-xs md:text-sm">
                        {new Date(currentDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Left Page Content */}
                    {(currentPageType === "journal" || currentPageType === "reflection") && (
                      <div className="relative z-10">
                        {/* Content removed - clean page */}
                      </div>
                    )}

                    {/* To-Do Page Header */}
                    {currentPageType === "todo" && (
                      <div className="relative z-10">
                        {/* Content removed - clean page */}
                      </div>
                    )}
                  </div>

                  {/* Right Page (Main page on mobile, right page on desktop) */}
                  <div 
                    className="flex-1 bg-white rounded-lg lg:rounded-r-lg shadow-2xl p-4 md:p-8 pl-6 md:pl-12 min-h-[500px] md:min-h-[750px] relative"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          transparent,
                          transparent 31px,
                          #e0e0e0 31px,
                          #e0e0e0 32px
                        )
                      `,
                      backgroundSize: '100% 32px',
                      backgroundPosition: '0 48px',
                      backgroundRepeat: 'repeat',
                    }}
                  >
                    {/* Page number in corner */}
                    <div className="absolute top-4 md:top-6 left-4 md:left-6 text-gray-400 font-serif text-xs md:text-sm">
                      <span className="lg:hidden">{currentPageNumber}</span>
                      <span className="hidden lg:inline">{currentPageNumber + 1}</span>
                    </div>

                    {/* Mobile: Show header on single page */}
                    <div className="lg:hidden mb-4 relative z-10">
                      <h2 className="text-lg font-bold text-gray-900 font-serif flex items-center gap-2">
                        <span className="text-base">{config.icon}</span>
                        {config.title}
                      </h2>
                      <p className="text-gray-600 mt-1 font-serif text-xs">
                        {new Date(currentDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Mobile: Show mood selector */}
                    {(currentPageType === "journal" || currentPageType === "reflection") && (
                      <div className="lg:hidden relative z-10 mb-4">
                        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1 font-serif">
                          <Smile className="h-3 w-3" />
                          Mood:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {moods.slice(0, 4).map((mood) => (
                            <button
                              key={mood.label}
                              onClick={() =>
                                updatePage(currentDate, currentPageType, {
                                  mood: mood.emoji,
                                  content: currentPage?.content || "",
                                })
                              }
                              className={`px-2 py-1 rounded border transition-all hover:scale-110 ${
                                currentPage?.mood === mood.emoji
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300 bg-white"
                              }`}
                              title={mood.label}
                            >
                              <span className="text-base">{mood.emoji}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Right Page Content - Writing Area */}
                    {(currentPageType === "journal" || currentPageType === "reflection") && (
                      <div className="relative z-10 pt-4 md:pt-8">
                        <Textarea
                          placeholder="Start writing..."
                          value={currentPage?.content || ""}
                          onChange={(e) =>
                            updatePage(currentDate, currentPageType, {
                              content: e.target.value,
                              mood: currentPage?.mood,
                            })
                          }
                          className="w-full min-h-[400px] md:min-h-[640px] border-0 font-serif text-sm md:text-base leading-7 md:leading-8 bg-transparent resize-none focus-visible:ring-0 focus-visible:outline-none p-0"
                          style={{
                            lineHeight: '32px',
                          }}
                        />
                      </div>
                    )}

                    {/* Right Page Content - To-Do List */}
                    {currentPageType === "todo" && (
                      <div className="relative z-10 pt-4 md:pt-8">
                        <div className="mb-4 md:mb-6">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a new task..."
                              value={newTodo}
                              onChange={(e) => setNewTodo(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addTodo()}
                              className="font-serif bg-white text-sm md:text-base"
                            />
                            <Button onClick={addTodo} size="sm">
                              <Plus className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {currentTodos.length === 0 ? (
                            <p className="text-gray-400 text-center py-8 md:py-12 font-serif italic text-sm">
                              No tasks yet. Add one to get started!
                            </p>
                          ) : (
                            currentTodos.map((todo) => (
                              <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 md:gap-3 py-2 group"
                                style={{ lineHeight: '32px' }}
                              >
                                <Checkbox
                                  checked={todo.completed}
                                  onCheckedChange={() => toggleTodo(todo.id)}
                                />
                                <span
                                  className={`flex-1 font-serif text-sm md:text-base ${
                                    todo.completed
                                      ? "line-through text-gray-400"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {todo.text}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTodo(todo.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-3 w-3 text-red-400" />
                                </Button>
                              </motion.div>
                            ))
                          )}
                        </div>

                        {currentTodos.length > 0 && (
                          <div className="mt-6 md:mt-8 text-xs md:text-sm text-gray-500 font-serif italic">
                            {currentTodos.filter((t) => t.completed).length} of {currentTodos.length} completed
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}