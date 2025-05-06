import React, { useState } from 'react';
import { Habit } from '../types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isWithinInterval } from 'date-fns';
import './HabitGrid.css';

interface HabitGridProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string, note?: string) => void;
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  initialNote?: string;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, initialNote = '' }) => {
  const [note, setNote] = useState(initialNote);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Note</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note..."
          rows={4}
        />
        <div className="modal-buttons">
          <button onClick={() => {
            onSave(note);
            onClose();
          }}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const HabitGrid: React.FC<HabitGridProps> = ({ habits, onToggleHabit }) => {
  const [selectedCell, setSelectedCell] = useState<{ habitId: string; date: string; note?: string } | null>(null);
  const currentDate = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const shouldShowDate = (habit: Habit, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    switch (habit.frequency.type) {
      case 'daily':
        return true;
      case 'weekly':
        return habit.frequency.weeklyDays?.includes(date.getDay()) ?? false;
      case 'custom':
        if (!habit.frequency.customDays) return true;
        const habitStartDate = new Date(habit.createdAt);
        const daysSinceStart = Math.floor((date.getTime() - habitStartDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceStart % habit.frequency.customDays === 0;
      default:
        return true;
    }
  };

  const handleCellClick = (habit: Habit, date: string) => {
    const completion = habit.completions[date];
    if (completion?.note) {
      setSelectedCell({ habitId: habit.id, date, note: completion.note });
    } else {
      onToggleHabit(habit.id, date);
    }
  };

  const handleCellRightClick = (e: React.MouseEvent, habit: Habit, date: string) => {
    e.preventDefault();
    const completion = habit.completions[date];
    setSelectedCell({ habitId: habit.id, date, note: completion?.note });
  };

  return (
    <div className="habit-grid">
      <div className="grid-header">
        <div className="habit-name">Habit</div>
        {daysInMonth.map((day: Date) => (
          <div key={day.toISOString()} className="day-header">
            {format(day, 'd')}
          </div>
        ))}
      </div>
      {habits.map((habit) => (
        <div key={habit.id} className="habit-row">
          <div className="habit-name">
            <span>{habit.name}</span>
            <span className="habit-frequency">
              {habit.frequency.type === 'weekly' && 
                `(${habit.frequency.weeklyDays?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join('/')})` }
              {habit.frequency.type === 'custom' && 
                `(Every ${habit.frequency.customDays} days)` }
            </span>
          </div>
          {daysInMonth.map((day: Date) => {
            const dateString = format(day, 'yyyy-MM-dd');
            const completion = habit.completions[dateString];
            const isTrackingDay = shouldShowDate(habit, day);
            const cellClass = `day-cell ${completion?.completed ? 'completed' : ''} ${isTrackingDay ? '' : 'disabled'} ${completion?.note ? 'has-note' : ''}`;

            return (
              <div
                key={`${habit.id}-${dateString}`}
                className={cellClass}
                onClick={() => isTrackingDay && handleCellClick(habit, dateString)}
                onContextMenu={(e) => isTrackingDay && handleCellRightClick(e, habit, dateString)}
                title={completion?.note || `Click to mark ${dateString} as ${completion?.completed ? 'incomplete' : 'complete'}`}
              >
                {completion?.completed ? '✓' : ''}
                {completion?.note && <span className="note-indicator">📝</span>}
              </div>
            );
          })}
        </div>
      ))}

      <NoteModal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        onSave={(note) => {
          if (selectedCell) {
            onToggleHabit(selectedCell.habitId, selectedCell.date, note);
          }
        }}
        initialNote={selectedCell?.note}
      />
    </div>
  );
};

export default HabitGrid;
