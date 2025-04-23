import { render, screen } from "@testing-library/react";
import App from "../src/App";
import { describe, it, expect, vi } from "vitest";

describe('App Component', () => {
  it('deve renderizar o Header, Validator e Footer', () => {
    render(<App />)

    // Verifica se o Header está presente
    expect(screen.getByText(/Buscador de CPF e CNPJ/i)).toBeInTheDocument()

    // Verifica se o Validator está presente
    expect(screen.getByLabelText(/Digite o CPF ou CNPJ/i)).toBeInTheDocument()

    // Verifica se o Footer está presente
    expect(screen.getByText(/Created by Igor Lucca/i)).toBeInTheDocument()
  })
})
