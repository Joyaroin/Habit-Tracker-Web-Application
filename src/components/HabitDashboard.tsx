import React from 'react';
import { Habit } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import './HabitDashboard.css';

interface HabitDashboardProps {
  habits: Habit[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

const HabitDashboard: React.FC<HabitDashboardProps> = ({ habits }) => {
  const calculateCompletionRate = (habit: Habit): number => {
    const completions = Object.values(habit.completions);
    if (completions.length === 0) return 0;
    const completed = completions.filter(data => data.completed).length;
    return Math.round((completed / completions.length) * 100);
  };

  const chartData = habits.map((habit, index) => ({
    name: habit.name,
    completionRate: calculateCompletionRate(habit),
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="habit-dashboard">
      <h2>Habit Analytics</h2>
      
      <div className="stats-grid">
        {habits.map(habit => (
          <div key={habit.id} className="stat-card">
            <h3>{habit.name}</h3>
            <div className="stat-details">
              <div className="stat-item">
                <span className="label">Current Streak:</span>
                <span className="value">{habit.streak.current} days</span>
              </div>
              <div className="stat-item">
                <span className="label">Longest Streak:</span>
                <span className="value">{habit.streak.longest} days</span>
              </div>
              <div className="stat-item">
                <span className="label">Completion Rate:</span>
                <span className="value">{calculateCompletionRate(habit)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <h3>Completion Rates</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completionRate" name="Completion Rate (%)" >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HabitDashboard;
