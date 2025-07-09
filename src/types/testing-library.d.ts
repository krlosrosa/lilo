import '@testing-library/jest-dom'

declare module '@testing-library/react' {
  export * from '@testing-library/react'
  export { screen } from '@testing-library/dom'
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeHidden(): R
    }
  }
}

export {} 