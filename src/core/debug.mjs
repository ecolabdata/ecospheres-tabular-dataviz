/**
 * Utilitaire de debug pour les composants de visualisation
 * Journalise uniquement dans l'environnement de développement ou quand explicitement activé
 */

// Détecte si nous sommes en développement (localhost, file://, ou flag debug)
const isDevelopment = () => {
  return (
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.search.includes('debug=true') ||
    window.VIZ_DEBUG === true
  )
}

// Commande console pour activer/désactiver le debug
if (typeof window !== 'undefined') {
  window.enableVizDebug = () => {
    window.VIZ_DEBUG = true
    console.log('🔧 Visualization debug enabled')
  }
  window.disableVizDebug = () => {
    window.VIZ_DEBUG = false
    console.log('🔧 Visualization debug disabled')
  }
}

class DebugLogger {
  constructor() {
    this.enabled = isDevelopment()
    this.styles = {
      info: 'color: #6366f1; font-weight: bold;',
      warn: 'color: #f59e0b; font-weight: bold;',
      error: 'color: #dc2626; font-weight: bold;',
      reset: 'color: inherit;'
    }
  }

  _formatMessage(level, message, data = null) {
    const style = this.styles[level]
    if (data !== null) {
      return [`%c[VIZ]%c ${message}`, style, this.styles.reset, data]
    } else {
      return [`%c[VIZ]%c ${message}`, style, this.styles.reset]
    }
  }

  log(message, data = null) {
    if (!this.enabled) return
    console.log(...this._formatMessage('info', message, data))
  }

  warn(message, data = null) {
    if (!this.enabled) return
    console.warn(...this._formatMessage('warn', message, data))
  }

  error(message, data = null) {
    if (!this.enabled) return
    console.error(...this._formatMessage('error', message, data))
  }
}

export const debug = new DebugLogger()
