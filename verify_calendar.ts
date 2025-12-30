
import { getLastBusinessDayOfMonth, isBusinessDay, isWeekend, isHoliday } from './services/b3Calendar';

console.log('Testing Jan 2026...');
const lastDayJan2026 = getLastBusinessDayOfMonth(2026, 0); // Month 0 = Jan
console.log('Last Business Day Jan 2026:', lastDayJan2026.toString());
console.log('Is Business Day?', isBusinessDay(lastDayJan2026));

const jan31 = new Date(2026, 0, 31);
console.log('Jan 31 2026:', jan31.toString());
console.log('Is Weekend?', isWeekend(jan31));
console.log('Is Holiday?', isHoliday(jan31));
console.log('Is Business Day?', isBusinessDay(jan31));

const jan30 = new Date(2026, 0, 30);
console.log('Jan 30 2026:', jan30.toString());
console.log('Is Weekend?', isWeekend(jan30));
console.log('Is Holiday?', isHoliday(jan30));
console.log('Is Business Day?', isBusinessDay(jan30));
