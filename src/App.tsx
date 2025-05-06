import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitCategory, HabitFrequency, DEFAULT_TEMPLATES } from './types';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import HabitGrid from './components/HabitGrid';
import HabitDashboard from './components/HabitDashboard';
import usePersistedState from './hooks/usePersistedState';
import './App.css';

const App: React.FC = () => {
  const [habits, setHabits] = usePersistedState<Habit[]>('habits', []);
  const [selectedCategory, setSelectedCategory] = usePersistedState<keyof typeof HabitCategory | 'All'>('selectedCategory', 'All');

  const addHabit = (
    name: string, 
    category: HabitCategory, 
    frequency: { type: HabitFrequency; customDays?: number; weeklyDays?: number[] }
  ): void => {
    const newHabit: Habit = {
      id: uuidv4(),
      name,
      category,
      frequency,
      completions: {},
      streak: {
        current: 0,
        longest: 0
      },
      createdAt: new Date().toISOString()
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string): void => {
    setHabits(habits.filter((habit: Habit) => habit.id !== id));
  };

  const toggleCompletion = (habitId: string, date: string, note?: string): void => {
    setHabits(habits.map((habit: Habit) => {
      if (habit.id === habitId) {
        const currentCompletion = habit.completions[date];
        const newCompletion = {
          completed: currentCompletion ? !currentCompletion.completed : true,
          note: note || currentCompletion?.note,
          timestamp: new Date().toISOString()
        };

        // Update streak
        const streak = calculateStreak(habit.id, {
          ...habit.completions,
          [date]: newCompletion
        });

        return {
          ...habit,
          completions: {
            ...habit.completions,
            [date]: newCompletion
          },
          streak
        };
      }
      return habit;
    }));
  };

  const calculateStreak = (habitId: string, completions: Habit['completions']): { current: number; longest: number } => {
    const dates = Object.entries(completions)
      .filter(([_, data]) => data.completed)
      .map(([date]) => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (dates.length === 0) {
      return { current: 0, longest: 0 };
    }

    let current = 1;
    let longest = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const diff = Math.abs(dates[i - 1].getTime() - dates[i].getTime());
      const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        currentStreak++;
        if (currentStreak > longest) {
          longest = currentStreak;
        }
      } else {
        currentStreak = 1;
      }
    }

    return { current: currentStreak, longest };
  };

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(habit => habit.category === selectedCategory);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Habit Tracker</h1>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value as keyof typeof HabitCategory | 'All')}
          className="category-filter"
        >
          <option value="All">All Categories</option>
          {Object.keys(HabitCategory).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </header>
      
      <main className="App-main">
        <div className="left-panel">
          <HabitForm 
            addHabit={addHabit} 
            templates={DEFAULT_TEMPLATES}
          />
          <HabitList 
            habits={filteredHabits} 
            deleteHabit={deleteHabit}
          />
        </div>
        
        <div className="right-panel">
          <HabitDashboard habits={habits} />
          <HabitGrid 
            habits={filteredHabits} 
            onToggleHabit={toggleCompletion}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
