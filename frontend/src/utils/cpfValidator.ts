export function isValidCpf(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let firstCheckDigit = 11 - (sum % 11);
  if (firstCheckDigit >= 10) firstCheckDigit = 0;
  if (firstCheckDigit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }

  let secondCheckDigit = 11 - (sum % 11);
  if (secondCheckDigit >= 10) secondCheckDigit = 0;
  if (secondCheckDigit !== parseInt(cpf.charAt(10))) return false;

  return true;
}
