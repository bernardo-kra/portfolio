import type { SectorId } from './consoleState'

export type TerminalCommand =
  | { type: 'scan' | 'intercept' | 'assist' | 'cancel' | 'reset' | 'help' }
  | { type: 'tune'; frequency: number }
  | { type: 'target'; sector: SectorId }

export function parseCommand(input: string): TerminalCommand | null {
  const words = input.trim().toLowerCase().split(/\s+/)
  const command = words[0]
  if (
    words.length === 1 &&
    ['scan', 'intercept', 'assist', 'cancel', 'reset', 'help'].includes(command)
  ) {
    return {
      type: command as
        | 'scan'
        | 'intercept'
        | 'assist'
        | 'cancel'
        | 'reset'
        | 'help',
    }
  }
  if (words.length === 2 && command === 'tune' && /^\d{2,3}$/.test(words[1])) {
    const frequency = Number(words[1])
    return frequency >= 80 && frequency <= 120
      ? { type: 'tune', frequency }
      : null
  }
  if (words.length === 2 && command === 'target') {
    const targets: Record<string, SectorId> = {
      d07: 'dock',
      b02: 'boiler',
      t09: 'tower',
    }
    if (!Object.hasOwn(targets, words[1])) return null
    const sector = targets[words[1]]
    return sector ? { type: 'target', sector } : null
  }
  return null
}
