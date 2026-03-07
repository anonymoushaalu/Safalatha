import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface VisionItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export function VisionBoard() {
  const [items, setItems] = useState<VisionItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("visionBoard");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const saveItems = (updatedItems: VisionItem[]) => {
    setItems(updatedItems);
    localStorage.setItem("visionBoard", JSON.stringify(updatedItems));
  };

  const addItem = () => {
    if (newTitle.trim()) {
      const item: VisionItem = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDescription,
        imageUrl: newImageUrl || undefined,
      };
      saveItems([...items, item]);
      setNewTitle("");
      setNewDescription("");
      setNewImageUrl("");
    }
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter((i) => i.id !== id));
  };

  const startEdit = (item: VisionItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const saveEdit = (id: string) => {
    saveItems(
      items.map((item) =>
        item.id === id
          ? { ...item, title: editTitle, description: editDescription }
          : item
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Vision Board</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Vision Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input
              placeholder="Goal or dream title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="Describe your vision..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <Input
              placeholder="Image URL (optional)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <Button onClick={addItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add to Vision Board
            </Button>
          </div>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-gray-500 text-center">
              Your vision board is empty. Add your goals and dreams to visualize your future!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.imageUrl && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                {editingId === item.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="font-bold"
                  />
                ) : (
                  <CardTitle>{item.title}</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {editingId === item.id ? (
                  <>
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(item.id)}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(item)}
                        className="flex-1"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteItem(item.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 text-red-500 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
