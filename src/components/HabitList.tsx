import React from 'react';
import { Habit } from '../types';
import './HabitList.css';

interface HabitListProps {
  habits: Habit[];
  deleteHabit?: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, deleteHabit }) => {
  return (
    <div className="habit-list">
      {habits.length === 0 ? (
        <p className="no-habits">No habits yet. Add one to get started!</p>
      ) : (
        habits.map((habit) => (
          <div key={habit.id} className="habit-item">
            <span className="habit-name">{habit.name}</span>
            {deleteHabit && (
              <button 
                onClick={() => deleteHabit(habit.id)}
                className="delete-button"
                title="Delete this habit"
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HabitList;
