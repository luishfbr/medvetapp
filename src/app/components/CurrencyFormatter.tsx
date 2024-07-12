// CurrencyFormatter.ts

const CurrencyFormatter = {
    format: (value: number): string => {
      // Remover os dois últimos dígitos
      const integerValue = Math.floor(value / 100); // Parte inteira do valor
      
      // Formatação como moeda, adicionando separador de milhar se necessário
      return integerValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
  };
  
  export default CurrencyFormatter;
  