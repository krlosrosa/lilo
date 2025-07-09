# Sistema de Testes - Jest + Testing Library

Este projeto está configurado com Jest e Testing Library para testes unitários e de integração.

## Scripts Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo CI (sem watch)
npm run test:ci
```

## Estrutura de Testes

```
src/
├── __tests__/           # Testes gerais
│   └── utils.test.ts
├── components/
│   └── __tests__/      # Testes de componentes
│       ├── Button.test.tsx
│       └── Sidebar.test.tsx
└── types/
    ├── jest.d.ts        # Tipos do Jest
    └── testing-library.d.ts  # Tipos do Testing Library
```

## Convenções de Nomenclatura

- Arquivos de teste: `*.test.ts` ou `*.test.tsx`
- Arquivos de especificação: `*.spec.ts` ou `*.spec.tsx`
- Pastas de teste: `__tests__`

## Exemplos de Testes

### Testando Componentes

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../ui/button'

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    button.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testando Funções Utilitárias

```tsx
import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })
  })
})
```

## Mocks Configurados

### Next.js
- `next/navigation` - Router hooks
- `next/image` - Componente Image

### NextAuth
- `next-auth/react` - Hooks de autenticação

### APIs do Browser
- `ResizeObserver`
- `IntersectionObserver`
- `matchMedia`

## Matchers Disponíveis

Além dos matchers padrão do Jest, você pode usar:

- `toBeInTheDocument()` - Verifica se elemento está no DOM
- `toHaveClass(className)` - Verifica se elemento tem classe
- `toBeDisabled()` - Verifica se elemento está desabilitado
- `toHaveAttribute(attr, value)` - Verifica atributos
- `toHaveTextContent(text)` - Verifica conteúdo de texto
- `toBeVisible()` - Verifica se elemento está visível

## Boas Práticas

1. **Use queries acessíveis**: Prefira `getByRole`, `getByLabelText` sobre `getByTestId`
2. **Teste comportamento, não implementação**: Foque no que o usuário vê e faz
3. **Use data-testid apenas quando necessário**: Para elementos sem papel semântico
4. **Mock apenas o necessário**: Evite mocks excessivos
5. **Teste casos de erro**: Inclua testes para cenários de falha

## Configuração

O Jest está configurado com:
- Suporte a TypeScript
- Testing Library DOM
- Ambiente jsdom
- Cobertura de código
- Mapeamento de paths (@/*)
- Mocks globais para Next.js

## Troubleshooting

### Erro de tipos do Testing Library
Se você encontrar erros de tipos, verifique se os arquivos de tipos estão incluídos no `tsconfig.json`.

### Erro de módulos não encontrados
Certifique-se de que todas as dependências estão instaladas:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
``` 