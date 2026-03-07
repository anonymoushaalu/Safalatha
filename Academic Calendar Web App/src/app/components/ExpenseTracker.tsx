import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const categories = [
  "Food",
  "Transport",
  "Education",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Other",
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) {
      setExpenses(JSON.parse(stored));
    }
  }, []);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
  };

  const addExpense = () => {
    if (amount && category && description) {
      const expense: Expense = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString().split("T")[0],
      };
      saveExpenses([expense, ...expenses]);
      setAmount("");
      setCategory("");
      setDescription("");
    }
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthExpenses = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = categories.map((cat) => ({
    category: cat,
    total: expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Expense Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{thisMonthExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button onClick={addExpense}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.slice(0, 10).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-gray-500">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">₹{expense.amount.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No expenses recorded yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expensesByCategory
                .filter((item) => item.total > 0)
                .sort((a, b) => b.total - a.total)
                .map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-sm">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(item.total / totalExpenses) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-medium w-20 text-right">
                        ₹{item.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              {expensesByCategory.every((item) => item.total === 0) && (
                <p className="text-gray-500 text-center py-8">
                  No expenses to categorize yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}