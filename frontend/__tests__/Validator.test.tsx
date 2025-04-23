import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'

vi.mock('../src/utils/cpfValidator', () => ({
    isValidCpf: vi.fn(),
}))

vi.mock('../src/utils/cnpjValidator', () => ({
    isValidCNPJ: vi.fn(),
}))

let Validator: React.FC

beforeEach(async () => {
    vi.resetModules()

    // Reaplica os mocks
    vi.mock('../src/utils/cpfValidator', () => ({
        isValidCpf: vi.fn(),
    }))

    vi.mock('../src/utils/cnpjValidator', () => ({
        isValidCNPJ: vi.fn(),
    }))

    // Reimporta o componente com os mocks ativos
    Validator = (await import('../src/pages/Validator')).default
})

describe('Validator Component', () => {
    it('deve renderizar corretamente', () => {
        render(<Validator />)
        expect(screen.getByText('Validador de CPF/CNPJ')).toBeInTheDocument()
        expect(screen.getByLabelText('Digite o CPF ou CNPJ')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Validar' })).toBeDisabled()
    })

    it('deve exibir mensagem de campo vazio inicialmente', () => {
        render(<Validator />)
        expect(screen.getByText('Favor preencher o campo')).toBeInTheDocument()
    })

    describe('Validação de CPF', () => {
        it('deve formatar CPF corretamente', async () => {
            const user = userEvent.setup()
            render(<Validator />)

            const input = screen.getByLabelText('Digite o CPF ou CNPJ')
            await user.type(input, '12345678909')

            expect(input).toHaveValue('123.456.789-09')
        })

        it('deve mostrar como válido quando CPF for válido', async () => {
            const { isValidCpf } = await import('../src/utils/cpfValidator')
                ; (isValidCpf as Mock).mockReturnValue(true)

            const user = userEvent.setup()
            render(<Validator />)

            const input = screen.getByLabelText('Digite o CPF ou CNPJ')
            await user.type(input, '12345678909')

            expect(screen.getByText('Formato do CPF válido')).toBeInTheDocument()
            expect(input).toHaveClass('is-valid')
            expect(screen.getByRole('button', { name: 'Validar' })).toBeEnabled()
        })
    })

    describe('Validação de CNPJ', () => {
        it('deve formatar CNPJ corretamente', async () => {
            const user = userEvent.setup()
            render(<Validator />)

            const input = screen.getByLabelText('Digite o CPF ou CNPJ')
            await user.type(input, '11222333000181')

            expect(input).toHaveValue('11.222.333/0001-81')
        })

        it('deve mostrar como válido quando CNPJ for válido', async () => {
            const { isValidCNPJ } = await import('../src/utils/cnpjValidator');
            const { isValidCpf } = await import('../src/utils/cpfValidator');

            (isValidCpf as Mock).mockReturnValue(false);
            (isValidCNPJ as Mock).mockReturnValue(true);

            const user = userEvent.setup()
            render(<Validator />)

            const input = screen.getByLabelText('Digite o CPF ou CNPJ')
            await user.type(input, '11.222.333/0001-81')

            expect(screen.getByText('Formato do CNPJ válido')).toBeInTheDocument()
            expect(input).toHaveClass('is-valid')
            expect(screen.getByRole('button', { name: 'Validar' })).toBeEnabled()
        })
    })

    it('deve mostrar como inválido quando documento for inválido', async () => {
        const { isValidCpf } = await import('../src/utils/cpfValidator')
        const { isValidCNPJ } = await import('../src/utils/cnpjValidator')

            ; (isValidCpf as Mock).mockReturnValue(false)
            ; (isValidCNPJ as Mock).mockReturnValue(false)

        const user = userEvent.setup()
        render(<Validator />)

        const input = screen.getByLabelText('Digite o CPF ou CNPJ')
        await user.type(input, '12345678901')

        expect(
            screen.getByText('O número acima não corresponde a um CPF ou CNPJ válido')
        ).toBeInTheDocument()
        expect(input).toHaveClass('is-invalid')
        expect(screen.getByRole('button', { name: 'Validar' })).toBeDisabled()
    })
})
