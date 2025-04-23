// src/components/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '../src/components/Footer'
import React from 'react'

describe('Footer', () => {
  it('exibe o texto com o nome e ano atual', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(`Created by Igor Lucca © ${year}`)).toBeInTheDocument()
  })

  it('contém o link do GitHub com o href correto', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', { name: /GitHub/i })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/igorlucca11')
  })

  it('contém o link do LinkedIn com o href correto', () => {
    render(<Footer />)
    const linkedinLink = screen.getByRole('link', { name: /LinkedIn/i })
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/igorlucca/')
  })
})
