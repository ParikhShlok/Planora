import { describe, it, expect } from 'vitest';
import {
  generateTimelineTasks,
  calculateOffsetDate,
  recalculateTimelineDates,
  isTaskOverdue,
} from '../engine/timelineEngine';

describe('Timeline Engine', () => {
  it('generates milestone tasks based on event type and target date', () => {
    const weddingTasks = generateTimelineTasks('wedding', '2026-12-31');
    expect(weddingTasks.length).toBeGreaterThan(8);

    const firstTask = weddingTasks[0];
    expect(firstTask.relativeOffsetDays).toBeLessThan(0);
    expect(firstTask.dueDate).toBe('2026-07-04'); // 180 days before Dec 31
    expect(firstTask.priority).toBe('critical');

    const dayOfTask = weddingTasks.find(t => t.relativeOffsetDays === 0);
    expect(dayOfTask).toBeDefined();
    expect(dayOfTask?.dueDate).toBe('2026-12-31');
  });

  it('correctly shifts all task due dates when the event date is updated', () => {
    const originalTasks = generateTimelineTasks('birthday', '2026-06-01');
    const initialDueDates = originalTasks.map(t => t.dueDate);

    // Shift event by 30 days
    const updatedTasks = recalculateTimelineDates(originalTasks, '2026-07-01');
    const newDueDates = updatedTasks.map(t => t.dueDate);

    expect(newDueDates).not.toEqual(initialDueDates);

    const dayOfTask = updatedTasks.find(t => t.relativeOffsetDays === 0);
    expect(dayOfTask?.dueDate).toBe('2026-07-01');
  });

  it('detects overdue tasks when deadline is in the past and task is incomplete', () => {
    const pastDate = '2020-01-01';
    const futureDate = '2030-01-01';

    expect(isTaskOverdue(pastDate, false)).toBe(true);
    expect(isTaskOverdue(pastDate, true)).toBe(false); // Completed tasks are never overdue
    expect(isTaskOverdue(futureDate, false)).toBe(false);
  });

  it('handles invalid or approximate dates safely without throwing errors', () => {
    const fallbackDate = calculateOffsetDate('invalid-date-string', -30);
    expect(typeof fallbackDate).toBe('string');
    expect(fallbackDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
