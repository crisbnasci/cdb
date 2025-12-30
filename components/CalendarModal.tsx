import React, { useMemo } from 'react';
import { isBusinessDay, isHoliday, isWeekend, getHolidayName } from '../services/b3Calendar';

interface CalendarModalProps {
    monthYear: string; // Format: "YYYY-MM"
    onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ monthYear, onClose }) => {
    const { days, monthName, year, businessDaysCount } = useMemo(() => {
        const [yearStr, monthStr] = monthYear.split('-');
        const yearParsed = parseInt(yearStr, 10);
        const monthIndex = parseInt(monthStr, 10) - 1;

        const date = new Date(yearParsed, monthIndex, 1);
        const monthName = date.toLocaleString('pt-BR', { month: 'long' });

        const daysInMonth = new Date(yearParsed, monthIndex + 1, 0).getDate();
        // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const firstDayOfWeek = new Date(yearParsed, monthIndex, 1).getDay();

        const daysArray: (Date | null)[] = [];

        // Add empty slots for days before the 1st
        for (let i = 0; i < firstDayOfWeek; i++) {
            daysArray.push(null);
        }

        // Add all days of the month
        let businessCount = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(yearParsed, monthIndex, day);
            daysArray.push(currentDate);
            if (isBusinessDay(currentDate)) {
                businessCount++;
            }
        }

        return {
            days: daysArray,
            monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            year: yearParsed,
            businessDaysCount: businessCount
        };
    }, [monthYear]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-1">
                        <h3 className="text-lg font-bold text-gray-900">{monthName} de {year}</h3>
                        <span className="material-symbols-outlined text-[20px] text-gray-400">arrow_drop_down</span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-4">
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                            <div key={i} className="text-xs font-medium text-gray-500 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-sm">
                        {days.map((date, index) => {
                            if (!date) return <div key={`empty-${index}`} className="aspect-square"></div>;

                            const isWknd = isWeekend(date);
                            const isHol = isHoliday(date);
                            const holidayName = isHol ? getHolidayName(date) : '';
                            const dayNum = date.getDate();

                            let bgClass = "bg-transparent text-gray-900 hover:bg-gray-50";
                            let borderClass = "border border-transparent";

                            // Priority: Holiday > Weekend > Business Day
                            if (isHol) {
                                // Holiday: Blue background as requested
                                bgClass = "bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-200";
                            } else if (isWknd) {
                                // Weekend: Gray text
                                bgClass = "text-gray-400 bg-gray-50/50";
                            }

                            return (
                                <div
                                    key={index}
                                    className={`aspect-square flex items-center justify-center rounded-lg transition-all relative group cursor-default ${bgClass} ${borderClass}`}
                                    title={holidayName || (isWknd ? 'Fim de semana' : 'Dia útil')}
                                >
                                    {dayNum}
                                    {/* Dot indicator for Business Day */}
                                    {/*{!isWknd && !isHol && (
                                <div className="absolute bottom-1 w-1 h-1 bg-green-400 rounded-full"></div>
                            )}*/}

                                    {/* Tooltip for Holidays */}
                                    {isHol && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg">
                                            {holidayName}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer info */}
                <div className="px-4 pb-4 pt-0 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 mt-2 pt-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
                        <span>Feriado</span>
                    </div>
                    <div className="font-medium">
                        {businessDaysCount} dias úteis
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
