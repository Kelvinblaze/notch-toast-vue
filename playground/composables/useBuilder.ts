export type BuilderState = {
  position: 'top-center' | 'bottom-center'
  mode: 'attached' | 'floating'
  animation: 'fluid' | 'gooey' | 'smooth' | 'subtle' | 'snappy'
  title: string
  /** seconds; 0 keeps the toast open */
  duration: number
  dismissible: boolean
}

export function useBuilder() {
  return useState<BuilderState>('nt-builder', () => ({
    position: 'top-center',
    mode: 'attached',
    animation: 'fluid',
    title: 'Toast rendered successfully',
    duration: 8,
    dismissible: false,
  }))
}
