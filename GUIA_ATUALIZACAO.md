# Guia de Atualização da Planilha CDB

## Taxa DI Atual Confirmada
**14,90% ao ano** (fonte: Meelion, atualizada em 05/02/2026)

## Dados Corretos para Atualizar na Planilha

### Investimento: CDB C6 Pós-fixado
- **Valor inicial**: R$ 55.000,00
- **Data de início**: 05/01/2026
- **Rentabilidade**: 102% do CDI
- **Liquidez**: Diária (D+0)

### Mês: Fevereiro/2026
- **Data de saque**: 05/02/2026
- **Taxa CDI**: 14,90% (use exatamente este valor)
- **Dias úteis**: 24 (calculado automaticamente)
- **Dias corridos**: 31

### Valores Esperados (após atualização)
Com a taxa CDI de 14,90%, os valores calculados serão:

- **Rendimento bruto**: R$ 726,48
- **IR (22,5%)**: R$ 163,46
- **Rendimento líquido**: R$ 563,02
- **Saldo total para resgate**: R$ 55.563,02

## Como Atualizar

### Opção 1: Via Interface (Recomendado)
1. Abra http://localhost:3000
2. Faça login (se necessário)
3. Clique no investimento CDB
4. Localize o registro de Fevereiro/2026
5. Edite a taxa CDI para: **14,90**
6. Salve as alterações
7. Verifique se os valores calculados batem com os esperados acima

### Opção 2: Via Script SQL (Direto no Supabase)
```sql
-- Atualizar a taxa CDI do registro de Fevereiro/2026
UPDATE monthly_records
SET cdi_rate = 14.90
WHERE month_year = '2026-02'
  AND investment_id = (SELECT id FROM investments WHERE name LIKE '%CDB%' LIMIT 1);
```

## Observações Importantes

### Por que os valores são diferentes do C6 Bank?
Você mencionou anteriormente que o C6 Bank mostrava:
- Bruto: R$ 715,77
- Líquido: R$ 554,73

Mas isso foi calculado com CDI de **14,2369%**.

Agora, com o CDI atual de **14,90%**, os valores serão maiores:
- Bruto: R$ 726,48 (+R$ 10,71)
- Líquido: R$ 563,02 (+R$ 8,29)

### Qual taxa usar?
- Se você quer que a planilha bata EXATAMENTE com o extrato do C6 Bank de 05/02, use: **14,2369%**
- Se você quer usar a taxa DI atual (mais recente), use: **14,90%**

## Cálculo Detalhado (CDI 14,90%)

```
1. Taxa CDI anual: 14,90%
2. Taxa CDI diária (100%): (1 + 0,1490)^(1/252) - 1 = 0,0005357%
3. Taxa efetiva diária (102%): 0,0005357% × 1,02 = 0,0005464%
4. Rendimento bruto: R$ 55.000 × (1,0005464)^24 - R$ 55.000 = R$ 726,48
5. IR (22,5%): R$ 726,48 × 0,225 = R$ 163,46
6. Rendimento líquido: R$ 726,48 - R$ 163,46 = R$ 563,02
7. Total para resgate: R$ 55.000 + R$ 563,02 = R$ 55.563,02
```

## Próximos Passos

1. ✅ Código da planilha está correto (fórmulas corrigidas)
2. ⏳ Atualizar a taxa CDI no registro de Fevereiro/2026
3. ⏳ Verificar se os valores calculados estão corretos
4. ⏳ Comparar com o extrato do C6 Bank

## Decisão Necessária

**Você precisa decidir qual taxa usar:**
- [ ] **14,2369%** - Para bater com o extrato do C6 Bank de 05/02
- [ ] **14,90%** - Para usar a taxa DI atual (mais recente)

Informe sua escolha para eu atualizar a planilha corretamente.
