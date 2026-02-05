import { countBusinessDays } from './services/b3Calendar';

// Test period calculation
const start = new Date('2026-01-05T00:00:00');
const end = new Date('2026-02-05T00:00:00');

console.log('Start date:', start.toISOString().split('T')[0]);
console.log('End date:', end.toISOString().split('T')[0]);
console.log('Business days (inclusive):', countBusinessDays(start, end));

// Test what the next period would be
const nextStart = new Date(end);
nextStart.setDate(nextStart.getDate() + 1);
console.log('Next period would start:', nextStart.toISOString().split('T')[0]);
