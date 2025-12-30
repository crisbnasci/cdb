/**
 * Calendário oficial B3 para cálculo de dias úteis
 * Gera feriados dinamicamente para qualquer ano
 * Feriados móveis calculados automaticamente (Páscoa, Carnaval, Corpus Christi)
 */

/**
 * Calcula a data da Páscoa para um ano usando o algoritmo de Meeus/Jones/Butcher
 * Fonte: Jean Meeus - Astronomical Algorithms
 */
function calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

/**
 * Gera todos os feriados B3 para um ano específico
 * Inclui feriados fixos e móveis
 */
function generateHolidaysForYear(year: number): Map<string, string> {
    const holidays = new Map<string, string>();
    const easter = calculateEaster(year);

    // Função auxiliar para adicionar dias a uma data
    const addDays = (date: Date, days: number): Date => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Função para formatar data como 'YYYY-MM-DD'
    const formatDate = (date: Date): string => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // === FERIADOS FIXOS ===

    // 1º de Janeiro - Confraternização Universal
    holidays.set(`${year}-01-01`, 'Confraternização Universal');

    // 21 de Abril - Tiradentes
    holidays.set(`${year}-04-21`, 'Tiradentes');

    // 1º de Maio - Dia do Trabalho
    holidays.set(`${year}-05-01`, 'Dia do Trabalho');

    // 7 de Setembro - Independência (não é feriado bancário B3, mas sim nacional)
    // A B3 funciona normalmente, então NÃO incluímos

    // 12 de Outubro - Nossa Senhora Aparecida (não é feriado bancário B3)
    // A B3 funciona normalmente, então NÃO incluímos

    // 2 de Novembro - Finados (não é feriado bancário B3)
    // A B3 funciona normalmente, então NÃO incluímos

    // 15 de Novembro - Proclamação da República
    holidays.set(`${year}-11-15`, 'Proclamação da República');

    // 20 de Novembro - Consciência Negra (feriado nacional a partir de 2024)
    if (year >= 2024) {
        holidays.set(`${year}-11-20`, 'Dia da Consciência Negra');
    }

    // 24 de Dezembro - Véspera de Natal (sem negociações B3)
    holidays.set(`${year}-12-24`, 'Véspera de Natal (B3 Fechada)');

    // 25 de Dezembro - Natal
    holidays.set(`${year}-12-25`, 'Natal');

    // 31 de Dezembro - Véspera de Ano Novo (sem negociações B3)
    holidays.set(`${year}-12-31`, 'Véspera de Ano Novo (B3 Fechada)');

    // === FERIADOS MÓVEIS (baseados na Páscoa) ===

    // Carnaval: 47 dias antes da Páscoa (segunda-feira)
    const carnivalMonday = addDays(easter, -48);
    holidays.set(formatDate(carnivalMonday), 'Carnaval (Segunda)');

    // Carnaval: 46 dias antes da Páscoa (terça-feira)
    const carnivalTuesday = addDays(easter, -47);
    holidays.set(formatDate(carnivalTuesday), 'Carnaval (Terça)');

    // Sexta-feira Santa: 2 dias antes da Páscoa
    const goodFriday = addDays(easter, -2);
    holidays.set(formatDate(goodFriday), 'Paixão de Cristo');

    // Corpus Christi: 60 dias após a Páscoa
    const corpusChristi = addDays(easter, 60);
    holidays.set(formatDate(corpusChristi), 'Corpus Christi');

    return holidays;
}

// Cache de feriados gerados
const holidayCache: Map<number, Map<string, string>> = new Map();

/**
 * Obtém o mapa de feriados para um ano (com cache)
 */
function getHolidaysForYear(year: number): Map<string, string> {
    if (!holidayCache.has(year)) {
        holidayCache.set(year, generateHolidaysForYear(year));
    }
    return holidayCache.get(year)!;
}

/**
 * Converte uma data para string no formato 'YYYY-MM-DD'
 */
function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Verifica se uma data é feriado B3
 */
export function isHoliday(date: Date): boolean {
    const year = date.getFullYear();
    const holidays = getHolidaysForYear(year);
    return holidays.has(formatDateKey(date));
}

/**
 * Retorna o nome do feriado, se houver
 */
export function getHolidayName(date: Date): string | undefined {
    const year = date.getFullYear();
    const holidays = getHolidaysForYear(year);
    return holidays.get(formatDateKey(date));
}

/**
 * Verifica se uma data é fim de semana (sábado ou domingo)
 */
export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = domingo, 6 = sábado
}

/**
 * Verifica se uma data é dia útil (não é feriado nem fim de semana)
 */
export function isBusinessDay(date: Date): boolean {
    return !isWeekend(date) && !isHoliday(date);
}

/**
 * Conta o número de dias úteis entre duas datas (inclusive)
 * @param startDate Data inicial
 * @param endDate Data final
 * @returns Número de dias úteis
 */
export function countBusinessDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        if (isBusinessDay(current)) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}

/**
 * Retorna um array com todas as datas de dias úteis no período
 * @param startDate Data inicial
 * @param endDate Data final
 * @returns Array de datas (dias úteis)
 */
export function getBusinessDaysInPeriod(startDate: Date, endDate: Date): Date[] {
    const businessDays: Date[] = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        if (isBusinessDay(current)) {
            businessDays.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }

    return businessDays;
}

/**
 * Calcula o número de dias corridos entre duas datas
 * Usado para determinar a alíquota de IR
 */
export function countCalendarDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Retorna o último dia útil de um mês
 */
export function getLastBusinessDayOfMonth(year: number, month: number): Date {
    // Começa do último dia do mês
    const lastDay = new Date(year, month + 1, 0);

    while (!isBusinessDay(lastDay)) {
        lastDay.setDate(lastDay.getDate() - 1);
    }

    return lastDay;
}

/**
 * Retorna o primeiro dia útil de um mês
 */
export function getFirstBusinessDayOfMonth(year: number, month: number): Date {
    const firstDay = new Date(year, month, 1);

    while (!isBusinessDay(firstDay)) {
        firstDay.setDate(firstDay.getDate() + 1);
    }

    return firstDay;
}

/**
 * Lista todos os feriados de um ano (útil para debug/verificação)
 */
export function getHolidaysList(year: number): string[] {
    return Array.from(generateHolidaysForYear(year).keys()).sort();
}
