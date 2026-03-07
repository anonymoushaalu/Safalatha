# 🌸 SAFALATHA - Academic Calendar & Life Tracker

A comprehensive web application for tracking habits, journaling, planning, and personal growth. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Vision

SAFALATHA aims to be a beautiful, motivating digital notebook that combines the feel of a physical book with powerful digital tracking and analytics features.

---

## ✅ Currently Implemented Features

### 📖 Notebook/Diary System (New Page Model)
- **Sequential Page Structure**: Each day has 3 pages (Journal, Reflection, To-Do)
- **Physical Book Navigation**: Previous/Next buttons to flip through pages
- **Global Page Numbering**: Pages numbered sequentially (Day 1: Pages 1-3, Day 2: Pages 4-6, etc.)
- **Page Flip Animations**: Smooth 3D rotation effects when changing pages
- **Jump to Date**: Calendar picker to navigate to specific dates
- **Writing Streak Counter**: Tracks consecutive days of writing
- **Mood Tracking**: Emoji-based mood selector for journal and reflection pages
- **Auto-save**: Content automatically saved to localStorage

### 📊 Dashboard
- **Real-time Statistics**: Overview of habits, streaks, and completion rates
- **Motivational Design**: Gradient cards with beautiful typography
- **Quick Access**: Links to all major sections

### 🎯 Habit Tracker
- **7-Week Heatmap**: Visual representation of habit completion
- **Individual Habit Streaks**: Track current and best streaks
- **Completion Percentages**: See your consistency over time
- **Beautiful UI**: Gradient cards and smooth animations

### 📝 Planning Sections
- **Weekly Planner**: Plan and track weekly goals
- **Monthly Planner**: Long-term planning and overview
- **Daily To-Do Lists**: Task management integrated into notebook pages

### 📈 Review Sections
- **Daily Reviews**: End-of-day reflections (integrated into notebook)
- **Weekly Reviews**: Weekly progress summaries
- **Monthly Reviews**: Monthly retrospectives
- **Year Reviews**: Annual goal tracking and reflection

### 💰 Financial Tracking
- **Expense Tracker**: Basic expense logging and categorization

### 🎨 Personal Development
- **Passion Tracker**: Track time spent on hobbies and interests
- **Vision Board**: Visual goal and inspiration board

### 🎨 Design System
- **Beautiful Typography**: Inter and Playfair Display fonts
- **Smooth Animations**: Motion/React animations throughout
- **Gradient Cards**: Visually appealing component design
- **Responsive Layout**: Mobile and desktop optimized
- **Sidebar Navigation**: Easy navigation between sections

### 💾 Data Persistence
- **localStorage**: All data saved locally in browser
- **Auto-save**: Changes saved automatically

---

## 🚧 Not Yet Implemented (Roadmap)

### 📖 Enhanced Notebook Features

#### 🎬 3D Book Engine (Three.js)
- [ ] Realistic 3D book model with page stack thickness
- [ ] Advanced page flip animations with Bezier curve rotation
- [ ] Dynamic shadowing on turning pages
- [ ] Bookmark ribbon animation
- [ ] Subtle page bend illusion
- [ ] Paper texture rendering
- [ ] Flip sound effects (Howler.js)
- [ ] HTML content synced with 3D page transforms

#### 📄 Page Layout System
- [ ] Multiple page layouts:
  - [ ] College ruled (pastel aesthetic)
  - [ ] Wide ruled
  - [ ] Dot grid
  - [ ] Graph grid
  - [ ] Blank
  - [ ] Cornell notes
  - [ ] Project/Planner layout
- [ ] CSS background patterns for layouts
- [ ] Global or per-page layout selection
- [ ] Layout switcher in settings

#### ✍️ Advanced Writing System
- [ ] Rich text editor (TipTap integration)
- [ ] Drawing canvas with Apple Pencil support
- [ ] Word counter
- [ ] Canvas drawing storage in IndexedDB
- [ ] Image embedding
- [ ] Text formatting (bold, italic, lists, etc.)

### 🎯 Advanced Habit System
- [ ] Binary habits (done/not done)
- [ ] Numeric habits (with targets)
- [ ] Timer-based habits
- [ ] Monthly heatmap view
- [ ] In-app nudging/reminders
- [ ] Streak animation glow effects
- [ ] Habit statistics dashboard

### 📊 Growth Engine
- [ ] Recharts integration with pastel theme
- [ ] Charts for:
  - [ ] Habit consistency over time
  - [ ] Journal word count trends
  - [ ] Passion hours tracking
  - [ ] Expense trends
  - [ ] Day score trends
- [ ] Exportable chart images

### 🧠 Weekly Auto Summary
- [ ] Algorithm-based weekly analysis
- [ ] Automated calculation of:
  - [ ] Best performing day
  - [ ] Worst day
  - [ ] Most consistent habit
  - [ ] Longest streak
  - [ ] Mood average
  - [ ] Task completion rate
  - [ ] Passion total hours
  - [ ] Expense total
- [ ] Human-readable summary paragraph generation

### 🗓 Enhanced Planner System
- [ ] Two-page weekly spread layout
- [ ] Interactive monthly grid
- [ ] Click date to open that day's pages
- [ ] Integrated with notebook page system

### 🎯 Vision Board Enhancements
- [ ] Three.js powered floating cards
- [ ] Depth parallax effects
- [ ] Hover tilt animations
- [ ] Soft glow effects
- [ ] Image upload and management

### 📄 PDF Export
- [ ] Client-side PDF generation
- [ ] Styled pastel export design
- [ ] Include:
  - [ ] Journal entries
  - [ ] Habit statistics
  - [ ] Weekly summaries
  - [ ] Growth chart snapshots
- [ ] Date range selection for export

### 📱 PWA (Progressive Web App)
- [ ] `manifest.json` configuration
- [ ] Service worker for offline functionality
- [ ] Offline cache for app assets
- [ ] Installable on mobile devices
- [ ] App-like experience
- [ ] Custom splash screen (pastel design)

### 🔔 Notifications & Reminders
- [ ] Browser notifications for habit reminders
- [ ] Daily writing prompts
- [ ] Streak milestone celebrations

### 🔄 Data Management
- [ ] IndexedDB for larger data storage
- [ ] Data export (JSON format)
- [ ] Data import functionality
- [ ] Cloud sync (optional future feature)

### 🎨 Customization
- [ ] Theme customization (color schemes)
- [ ] Font selection
- [ ] Layout preferences
- [ ] Sidebar customization

### 📊 Analytics & Insights
- [ ] Personal analytics dashboard
- [ ] Trend identification
- [ ] Goal achievement tracking
- [ ] Comparative monthly/yearly views

---

## 🛠 Technical Stack

### Core Technologies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling

### Libraries
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icons
- **React Router** - Navigation
- **date-fns** - Date utilities
- **Recharts** - Charts (to be integrated)

### Planned Integrations
- **Three.js** - 3D book rendering
- **TipTap** - Rich text editing
- **Howler.js** - Sound effects
- **html2canvas / jsPDF** - PDF export

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Usage
1. Open the app in your browser
2. Navigate using the sidebar menu
3. Start with the Dashboard to see overview
4. Use the Diary/Notebook section for daily writing
5. Track habits in the Habit Tracker
6. All data is saved automatically to localStorage

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard with stats
│   │   ├── Diary.tsx              # Notebook/diary with page system
│   │   ├── HabitTracker.tsx       # Habit tracking with heatmaps
│   │   ├── WeeklyPlanner.tsx      # Weekly planning
│   │   ├── MonthlyPlanner.tsx     # Monthly planning
│   │   ├── ExpenseTracker.tsx     # Financial tracking
│   │   ├── PassionTracker.tsx     # Hobby/interest tracking
│   │   ├── VisionBoard.tsx        # Visual goal board
│   │   ├── *Review.tsx            # Review components
│   │   └── ui/                    # Reusable UI components
│   ├── routes.ts                  # React Router configuration
│   └── App.tsx                    # Main app component
├── styles/
│   ├── fonts.css                  # Font imports
│   ├── theme.css                  # CSS custom properties
│   └── tailwind.css               # Tailwind directives
└── imports/                       # Documentation and specs
```

---

## 💾 Data Storage

### Current Implementation
- **localStorage**: All user data stored in browser
- **Auto-save**: Changes persist immediately
- **Data Keys**:
  - `notebookPages` - Diary/journal entries
  - `habits` - Habit tracking data
  - `expenses` - Financial data
  - `passions` - Passion tracking data
  - `visionBoard` - Vision board items

### Future Enhancement
- IndexedDB for larger datasets
- Cloud sync options
- Data encryption

---

## 🎨 Design Philosophy

### Visual Identity
- **Pastel Color Palette**: Soft, calming colors
- **Beautiful Typography**: Serif fonts (Playfair Display) for headers, Sans-serif (Inter) for body
- **Smooth Animations**: Enhance UX without being distracting
- **Clean Layout**: Spacious, breathing room for content

### User Experience
- **Motivating**: Streak counters and achievement celebrations
- **Physical Book Feel**: Page-based navigation, realistic transitions
- **Intuitive**: Clear navigation and visual hierarchy
- **Responsive**: Works beautifully on desktop and mobile

---

## 🔮 Future Vision

The ultimate goal is to create a digital notebook that feels as personal and satisfying as a physical journal, while leveraging digital capabilities for insights, tracking, and growth visualization.

### Key Principles
1. **Beauty First**: Every interaction should feel delightful
2. **Performance**: Smooth 60fps animations on all devices
3. **Privacy**: All data stored locally, user has full control
4. **Simplicity**: Powerful features with simple interface
5. **Motivation**: Help users build better habits through positive reinforcement

---

## 📝 Contributing

This is currently a personal project, but suggestions and feedback are welcome!

---

## 📄 License

MIT License - feel free to use this project as inspiration for your own productivity tools.

---

## 🙏 Acknowledgments

- UI Components: Shadcn/ui inspiration
- Icons: Lucide React
- Fonts: Google Fonts (Inter, Playfair Display)
- Color Inspiration: Pastel aesthetic movement

---

**Built with ❤️ for personal growth and daily reflection**
