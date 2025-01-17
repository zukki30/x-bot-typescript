import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('should format date with single digit hours and minutes', () => {
    const date = new Date(2024, 0, 1, 9, 5); // 9:05
    expect(formatDate(date)).toBe('09:05');
  });

  it('should format date with double digit hours and minutes', () => {
    const date = new Date(2024, 0, 1, 15, 30); // 15:30
    expect(formatDate(date)).toBe('15:30');
  });

  it('should format midnight correctly', () => {
    const date = new Date(2024, 0, 1, 0, 0); // 00:00
    expect(formatDate(date)).toBe('00:00');
  });

  it('should format time before midnight correctly', () => {
    const date = new Date(2024, 0, 1, 23, 59); // 23:59
    expect(formatDate(date)).toBe('23:59');
  });
});
