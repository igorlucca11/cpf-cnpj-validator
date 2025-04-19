export function isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
  
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
    const calcCheckDigit = (cnpj: string, length: number): number => {
      const weights = length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
      const sum = cnpj
        .substr(0, length)
        .split('')
        .reduce((acc, num, index) => acc + parseInt(num) * weights[index], 0);
  
      const result = sum % 11;
      return result < 2 ? 0 : 11 - result;
    };
  
    const digit1 = calcCheckDigit(cnpj, 12);
    const digit2 = calcCheckDigit(cnpj, 13);
  
    return digit1 === parseInt(cnpj.charAt(12)) && digit2 === parseInt(cnpj.charAt(13));
  }
  