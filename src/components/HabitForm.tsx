import React, { useState } from 'react';
import { HabitTemplate, HabitCategory, HabitFrequency } from '../types';
import './HabitForm.css';

interface HabitFormProps {
  addHabit: (
    name: string,
    category: HabitCategory,
    frequency: { type: HabitFrequency; customDays?: number; weeklyDays?: number[] }
  ) => void;
  templates: HabitTemplate[];
}

const CATEGORIES = ['Health', 'Mind', 'Study', 'Work', 'Social', 'Other'] as const;
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitForm: React.FC<HabitFormProps> = ({ addHabit, templates }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Other');
  const [frequencyType, setFrequencyType] = useState<HabitFrequency>('daily');
  const [customDays, setCustomDays] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const frequency = {
        type: frequencyType,
        ...(frequencyType === 'custom' && { customDays }),
        ...(frequencyType === 'weekly' && { weeklyDays: selectedDays })
      };
      addHabit(name.trim(), category, frequency);
      resetForm();
    }
  };

  const handleTemplateSelect = (template: HabitTemplate) => {
    setName(template.name);
    setCategory(template.category);
    setFrequencyType(template.frequency.type);
    if (template.frequency.customDays) {
      setCustomDays(template.frequency.customDays);
    }
    if (template.frequency.weeklyDays) {
      setSelectedDays(template.frequency.weeklyDays);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Other');
    setFrequencyType('daily');
    setCustomDays(1);
    setSelectedDays([]);
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex].sort()
    );
  };

  return (
    <div className="habit-form-container">
      <h2>Add New Habit</h2>
      
      <div className="templates-section">
        <h3>Quick Add Templates</h3>
        <div className="template-buttons">
          {templates.map((template, index) => (
            <button
              key={index}
              type="button"
              className="template-button"
              onClick={() => handleTemplateSelect(template)}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="habit-form">
        <div className="form-group">
          <label htmlFor="name">Habit Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter habit name..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as HabitCategory)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency:</label>
          <select
            id="frequency"
            value={frequencyType}
            onChange={(e) => setFrequencyType(e.target.value as HabitFrequency)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {frequencyType === 'custom' && (
          <div className="form-group">
            <label htmlFor="customDays">Every X Days:</label>
            <input
              id="customDays"
              type="number"
              min="1"
              value={customDays}
              onChange={(e) => setCustomDays(parseInt(e.target.value))}
            />
          </div>
        )}

        {frequencyType === 'weekly' && (
          <div className="form-group">
            <label>Select Days:</label>
            <div className="days-selector">
              {DAYS_OF_WEEK.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  className={`day-button ${selectedDays.includes(index) ? 'selected' : ''}`}
                  onClick={() => toggleDay(index)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="submit-button">
          Add Habit
        </button>
      </form>
    </div>
  );
};

export default HabitForm;
