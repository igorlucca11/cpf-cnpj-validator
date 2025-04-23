import { render, screen } from "@testing-library/react";
import Header from "../src/components/Header";
import { describe, it, expect, vi } from "vitest";


vi.mock('@tabler/icons-react', () => ({
    IconSquareCheck: vi.fn(() => <div data-testid="IconSquareCheck">IconSquareCheck</div>)
}));

vi.mock('@assets/avatars/igor-lucca.jpeg', () => ({
  __esModule: true,
    default: '/empty-image.jpg' // Caminho fictício
}))

describe("Testa o componente Header", () => {
    it("Exibe a imagem correta de logo", () => {
        render(<Header />);
        const logo = screen.getByTestId("IconSquareCheck");
        expect(logo).toBeInTheDocument();

    });
});