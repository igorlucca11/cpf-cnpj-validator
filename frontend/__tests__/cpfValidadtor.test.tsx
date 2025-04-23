import { describe, it, expect } from "vitest";
import { isValidCpf } from "../src/utils/cpfValidator";

describe("cpfValidadtor", () => {
    const cpf1 = "00000000000";          // Inválido: todos dígitos iguais
    const cpf2 = "529.982.247-32";       // Inválido: digitos verificadores trocados
    const cpf3 = "222.222.222-22";       // Inválido: todos dígitos iguais
    const cpf4 = "123.456.789";          // Inválido: falta dígitos verificadores
    const cpf5 = "123.456.789-0";        // Inválido: dígitos verificadores incompletos
    const cpf6 = "174.025.507-02";       // Válido (CPF gerado aleatoriamente com dígitos corretos)
    const cpf7 = "100.000.028-10";       // Válido (CPF gerado aleatoriamente com dígitos corretos e o ultimo verificador = 0)
    const cpf8 = "100.000.000-10";        // Inválido: dígitos verificadores erraddos

    it("Testa se o validador rejeita CPF com todos dígitos iguais ", () => {
        expect(isValidCpf(cpf1)).toBe(false);
    });
    it("Testa se o validador rejeita CPF digitos verificadores trocados ", () => {
        expect(isValidCpf(cpf2)).toBe(false);
    });
    it("Testa se o validador rejeita CPF com todos dígitos iguais", () => {
        expect(isValidCpf(cpf3)).toBe(false);
    });
    it("Testa se o validador rejeita CPF com falta dígitos verificadores ", () => {
        expect(isValidCpf(cpf4)).toBe(false);
    });false
    it("Testa se o validador rejeita CPF com dígitos verificadores incompletos ", () => {
        expect(isValidCpf(cpf5)).toBe(false);
    });

    it("Testa se o validador rejeita CPF com dígitos verificadores incorretos ", () => {
        expect(isValidCpf(cpf8)).toBe(false);
    });

    it("Testa se o validador aceita CPF valido", () => {
        expect(isValidCpf(cpf6)).toBe(true);
    });
    it("Testa se o validador aceita CPF valido", () => {
        expect(isValidCpf(cpf7)).toBe(true);
    });
});