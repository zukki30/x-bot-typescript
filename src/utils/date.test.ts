import { describe, it, expect } from 'vitest';
import { formatDate, formatDateYYYYMMDD } from './date';

describe('formatDate', () => {
  it('should format date with single digit hours and minutes', () => {
    const date = new Date(2024, 0, 1, 9, 5); // 9:05
    expect(formatDate(date)).toBe('18:05');
  });

  it('should format date with double digit hours and minutes', () => {
    const date = new Date(2024, 0, 1, 15, 30); // 15:30
    expect(formatDate(date)).toBe('00:30');
  });

  it('should format midnight correctly', () => {
    const date = new Date(2024, 0, 1, 0, 0); // 00:00
    expect(formatDate(date)).toBe('09:00');
  });

  it('should format time before midnight correctly', () => {
    const date = new Date(2024, 0, 1, 23, 59); // 23:59
    expect(formatDate(date)).toBe('08:59');
  });
});

describe('formatDateYYYYMMDD', () => {
  it('should format date with YYYY/MM/DD format', () => {
    const date = new Date(2024, 0, 1); // 2024/01/01
    expect(formatDateYYYYMMDD(date)).toBe('2024/01/01 - 09:00');
  });
});
