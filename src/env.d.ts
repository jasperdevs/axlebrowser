/// <reference types="vite/client" />

// Make JSX namespace available globally for component return types
import type { JSX } from 'react'
export { JSX }

declare global {
  namespace JSX {
    interface Element extends React.JSX.Element {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}
