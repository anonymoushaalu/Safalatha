import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Trash2, Heart } from "lucide-react";
import { Progress } from "./ui/progress";

interface Passion {
  id: string;
  name: string;
  description: string;
  timeSpent: number;
  goal: number;
}

export function PassionTracker() {
  const [passions, setPassions] = useState<Passion[]>([]);
  const [newPassion, setNewPassion] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("passions");
    if (stored) {
      setPassions(JSON.parse(stored));
    }
  }, []);

  const savePassions = (updatedPassions: Passion[]) => {
    setPassions(updatedPassions);
    localStorage.setItem("passions", JSON.stringify(updatedPassions));
  };

  const addPassion = () => {
    if (newPassion.trim()) {
      const passion: Passion = {
        id: Date.now().toString(),
        name: newPassion,
        description: newDescription,
        timeSpent: 0,
        goal: parseInt(newGoal) || 100,
      };
      savePassions([...passions, passion]);
      setNewPassion("");
      setNewDescription("");
      setNewGoal("");
    }
  };

  const deletePassion = (id: string) => {
    savePassions(passions.filter((p) => p.id !== id));
  };

  const updateTimeSpent = (id: string, increment: number) => {
    savePassions(
      passions.map((passion) =>
        passion.id === id
          ? { ...passion, timeSpent: Math.max(0, passion.timeSpent + increment) }
          : passion
      )
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Passion Tracker</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Passion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input
              placeholder="Passion name (e.g., Guitar, Painting, Reading)"
              value={newPassion}
              onChange={(e) => setNewPassion(e.target.value)}
            />
            <Textarea
              placeholder="Why is this important to you?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Goal (hours)"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addPassion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Passion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {passions.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-gray-500 text-center">
              No passions tracked yet. Add one to start following your dreams!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passions.map((passion) => {
            const progress = Math.min((passion.timeSpent / passion.goal) * 100, 100);
            return (
              <Card key={passion.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      {passion.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePassion(passion.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{passion.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">
                        {passion.timeSpent}h / {passion.goal}h
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTimeSpent(passion.id, -1)}
                      className="flex-1"
                    >
                      -1h
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTimeSpent(passion.id, 1)}
                      className="flex-1"
                    >
                      +1h
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTimeSpent(passion.id, 5)}
                      className="flex-1"
                    >
                      +5h
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
