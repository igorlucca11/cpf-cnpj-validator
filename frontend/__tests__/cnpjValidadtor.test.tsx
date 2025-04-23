import { describe, it, expect } from "vitest";
import { isValidCNPJ } from "../src/utils/cnpjValidator";

describe("cnpjValidadtor", () => {
    const cnpj1 = "00000000000000";
    const cnpj2 = "12.345.678/0000-95";
    const cnpj3 = "22.222.222/0002-22";
    const cnpj4 = "23.456.789/0001";
    const cnpj5 = "23.456.789/0001-1";
    const cnpj6 = "04.470.781/0001-39";
    const cnpj7 = "10.000.000/0003-07";

    it("Testa se o validador rejeita sem cnpj", () => {
        expect(isValidCNPJ('')).toBe(false);
    });
    it("Testa se o validador rejeita CPNJ com digitos todos iguais ", () => {
        expect(isValidCNPJ(cnpj1)).toBe(false);
    });
    it("Testa se o validador rejeita CPNJ com digito de filial 0000 ", () => {
        expect(isValidCNPJ(cnpj2)).toBe(false);
    });
    it("Testa se o validador rejeita CPNJ com digitos iguais mas digito de filial valido", () => {
        expect(isValidCNPJ(cnpj3)).toBe(false);
    });
    it("Testa se o validador rejeita CPNJ com digitos faltanddo ", () => {
        expect(isValidCNPJ(cnpj4)).toBe(false);
    }); false
    it("Testa se o validador rejeita CPNJ com digitos faltanddo ", () => {
        expect(isValidCNPJ(cnpj5)).toBe(false);
    });
    it("Testa se o validador aceita CPNJ valido", () => {
        expect(isValidCNPJ(cnpj6)).toBe(true);
    });
    it("valida CNPJ cujo dígito verificador é 0 via regra result < 2", () => {
        expect(isValidCNPJ(cnpj7)).toBe(true);
    });
});