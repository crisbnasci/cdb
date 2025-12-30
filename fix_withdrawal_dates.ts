
import { createClient } from '@supabase/supabase-js';
import { getLastBusinessDayOfMonth, isBusinessDay } from './services/b3Calendar';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixWithdrawalDates() {
    console.log('Fetching monthly records...');
    // Type assertion or manual query construction might be needed depending on the client generation
    // Using 'any' for simplicity in this script
    const { data: records, error } = await supabase
        .from('monthly_records')
        .select('*');

    if (error) {
        console.error('Error fetching records:', error);
        return;
    }

    console.log(`Found ${records.length} records. Checking dates...`);

    for (const record of records) {
        const [year, month] = record.month_year.split('-').map(Number);
        // month_year is YYYY-MM. 
        // record.withdrawal_date is YYYY-MM-DD string.

        // Calculate correct last business day for this month
        // Note: month in split is 1-12. Date() expects 0-11.
        // So for '2026-01', month is 1. getLastBusinessDayOfMonth expects 0 for Jan.
        const correctDateObj = getLastBusinessDayOfMonth(year, month - 1);
        const correctDateStr = `${correctDateObj.getFullYear()}-${String(correctDateObj.getMonth() + 1).padStart(2, '0')}-${String(correctDateObj.getDate()).padStart(2, '0')}`;

        if (record.withdrawal_date !== correctDateStr) {
            console.log(`Fixing record ${record.id} (${record.month_year}): ${record.withdrawal_date} -> ${correctDateStr}`);

            const { error: updateError } = await supabase
                .from('monthly_records')
                .update({ withdrawal_date: correctDateStr })
                .eq('id', record.id);

            if (updateError) {
                console.error(`Failed to update record ${record.id}:`, updateError);
            }
        }
    }
    console.log('Finished fixing dates.');
}

fixWithdrawalDates();
