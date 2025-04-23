export function isValidCNPJ(cnpj: string): boolean {
  if (!cnpj) return false;

  cnpj = cnpj.replace(/[^\d]+/g, '');

  // Verifica tamanho e sequência de dígitos iguais
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  // Verifica se a filial é "0000"
  if (cnpj.substring(8, 12) === "0000") return false;

  const calcCheckDigit = (slice: string, weights: number[]): number => {
    const sum = slice
      .split('')
      .reduce((acc, num, index) => acc + parseInt(num) * weights[index], 0);

    const result = sum % 11;
    return result < 2 ? 0 : 11 - result;
  };

  // Primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digit1 = calcCheckDigit(cnpj.substring(0, 12), weights1);

  // Segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digit2 = calcCheckDigit(cnpj.substring(0, 13), weights2);

  return (
    digit1 === parseInt(cnpj.charAt(12)) && 
    digit2 === parseInt(cnpj.charAt(13))
  );
}