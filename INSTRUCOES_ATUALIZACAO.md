# Instruções para Atualizar a Planilha

## ✅ DECISÃO CONFIRMADA
Usar **CDI 14,2369%** para bater EXATAMENTE com o extrato do C6 Bank de 05/02/2026.

## 📊 Valores Esperados (Após Atualização)
- **Rendimento bruto**: R$ 715,77
- **IR (22,5%)**: R$ 161,05
- **Rendimento líquido**: R$ 554,72
- **Total para resgate**: R$ 55.554,72

---

## 🔧 COMO ATUALIZAR

### Opção 1: Via Interface Web (RECOMENDADO)

1. **Abra o navegador** e acesse: http://localhost:3000

2. **Faça login** (se necessário)

3. **Localize o investimento** "CDB C6 Pós-fixado" (ou similar)

4. **Clique no investimento** para ver os detalhes

5. **Encontre o registro de Fevereiro/2026**
   - Mês: Fevereiro/26
   - Data de saque: 05/02/2026

6. **Edite a taxa CDI**:
   - Clique no campo da taxa CDI
   - Digite: **14.2369** (ou **14,2369** dependendo do formato)
   - Pressione Enter ou clique fora do campo para salvar

7. **Verifique os valores calculados**:
   - Rendimento bruto deve mostrar: **R$ 715,77**
   - IR deve mostrar: **R$ 161,05**
   - Rendimento líquido deve mostrar: **R$ 554,72**

### Opção 2: Via SQL (Supabase Dashboard)

Se você tiver acesso ao Supabase Dashboard:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em "SQL Editor"
4. Cole o conteúdo do arquivo `update_cdi_rate.sql`
5. Execute o script
6. Recarregue a página da aplicação

### Opção 3: Via Código (Se necessário)

Se as opções acima não funcionarem, posso criar um script de migração automática.

---

## ✅ VERIFICAÇÃO

Após atualizar, verifique se os valores na planilha são:

| Item | Valor Esperado | Status |
|------|---------------|--------|
| Rendimento Bruto | R$ 715,77 | ⏳ |
| IR (22,5%) | R$ 161,05 | ⏳ |
| Rendimento Líquido | R$ 554,72 | ⏳ |
| Total para Resgate | R$ 55.554,72 | ⏳ |

---

## 📝 NOTAS IMPORTANTES

1. **Taxa CDI precisa**: Use exatamente **14.2369** (sem arredondamentos)
2. **Período**: 05/01/2026 a 05/02/2026 (24 dias úteis)
3. **Cálculo**: O código já está correto, só precisa da taxa certa
4. **Diferença de R$ 0,01**: É normal devido a arredondamentos

---

## 🎯 PRÓXIMOS PASSOS

Depois de atualizar:

1. ✅ Verifique se os valores batem com o C6 Bank
2. ✅ Tire um print da tela para confirmar
3. ✅ Se tudo estiver correto, a planilha está pronta para uso!

---

## ❓ PRECISA DE AJUDA?

Se você não conseguir atualizar via interface, me avise e eu crio um script automático para fazer a atualização.
