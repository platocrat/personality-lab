// Externals
import { CSSProperties } from 'react'
// Locals
import { PhaseChecks } from '@/utils'


enum GamePhases {
  Lobby = 'lobby',
  ConsentForm = 'consent-form',
  SelfReport = 'self-report',
  ObserverReport = 'observer-report',
  Results = 'results',
}



export const generateButtonStyle: CSSProperties = {
  position: 'relative',
  top: '-1px',
  right: '3px',
  fontSize: '16px',
  color: '#155724',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  marginLeft: '12px',
  padding: '0px',
}


export const PHASE_CHECKS: PhaseChecks[] = [
  { check: 'hasCompletedConsentForm', phase: GamePhases.SelfReport },
  { check: 'hasCompletedSelfReport', phase: GamePhases.ObserverReport },
  { check: 'hasCompletedObserverReport', phase: GamePhases.Results }
]