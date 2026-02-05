-- ============================================================================
-- SCRIPT DE ATUALIZAÇÃO: CDB C6 Bank - Taxa CDI Correta
-- ============================================================================
-- 
-- Objetivo: Atualizar a taxa CDI para 14,2369% para bater EXATAMENTE
--           com o extrato do C6 Bank de 05/02/2026
--
-- Valores esperados após atualização:
--   - Rendimento bruto: R$ 715,77
--   - IR (22,5%): R$ 161,05
--   - Rendimento líquido: R$ 554,72
--   - Total para resgate: R$ 55.554,72
-- ============================================================================

-- Atualizar o registro de Fevereiro/2026 com a taxa CDI correta
UPDATE monthly_records
SET cdi_rate = 14.2369
WHERE month_year = '2026-02'
  AND withdrawal_date = '2026-02-05';

-- Verificar a atualização
SELECT 
    mr.month_year,
    mr.cdi_rate,
    mr.withdrawal_date,
    i.name as investment_name,
    i.initial_value,
    i.cdi_percentage
FROM monthly_records mr
JOIN investments i ON mr.investment_id = i.id
WHERE mr.month_year = '2026-02'
ORDER BY mr.withdrawal_date;
