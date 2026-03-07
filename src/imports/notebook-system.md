🔁 Page Navigation Logic

When user opens a day:

System checks:

If pages exist for date:
→ Load them.

If not:
→ Create 3 pages:

Journal

Reflection

To-Do

When switching between them:
→ Flip to that physical page number.

🧠 Jump Logic

If jump distance > 20 pages:

We do:

Quick animation to near target

Then realistic flip for final 3–4 pages

Prevents lag.

📜 Notebook Layout System

Each page type can have layout.

We implement layout engine:

CSS background patterns

Changeable globally or per page

Layouts:

College ruled

Wide ruled

Dot grid

Graph grid

Blank

Cornell

Planner

Switchable in settings.