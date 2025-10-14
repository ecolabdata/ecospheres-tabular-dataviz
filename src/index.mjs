/**
 * @ecolabdata/tabular-dataviz
 * Visualisation interactive des jeux de données tabulaires de data.gouv.fr
 */

import 'choices.js/public/assets/styles/choices.min.css'

import { makeMeshDropdown } from './components/mesh.mjs'
import { makeTerritoryDropDown } from './components/territory.mjs'
import {
  getDataVizContainers,
  getFiles,
  getFilesFromContainer,
  getIndicatorFromContainer
} from './core/dom.mjs'
import { debug } from './core/debug.mjs'
import pkg from '../package.json' assert { type: 'json' }

function verifyParams(container) {
  const mandatoryCustomFields = ['indicatorId', 'files', 'indicator']
  mandatoryCustomFields.forEach((field) => {
    if (!(field in container.dataset)) {
      throw new Error(`Le container doit avoir un attribut '${field}'`)
    }
  })

  const indicator = getIndicatorFromContainer(container)
  const mandatoryIndicatorAttributes = [
    'id',
    'unite',
    'summable',
    'enableVisualisation'
  ]
  mandatoryIndicatorAttributes.forEach((field) => {
    if (!(field in indicator)) {
      throw new Error(`L'indicateur doit avoir un attribut '${field}'`)
    }
  })

  const files = getFilesFromContainer(container)
  const mandatoryFileAttributes = ['mesh', 'valueColumn', 'axes']
  mandatoryFileAttributes.forEach((field) => {
    files.forEach((file) => {
      if (!(field in file)) {
        throw new Error(`Les fichiers doivent avoir un attribut '${field}'`)
      }
    })
  })
}

export async function initializeVisualization(options = {}) {
  const { timeout = 100 } = options

  debug.log(`📦 @ecolabdata/tabular-dataviz v${pkg.version}`)

  setTimeout(() => {
    getDataVizContainers().forEach(async (container) => {
      try {
        verifyParams(container)
        const indicator = getIndicatorFromContainer(container)

        if (!indicator.enableVisualisation) {
          return
        }

        let html = `
        <div class="dropdowns">
          <div class="geo-dropdowns">
            <div id="mesh-dropdown-container-${indicator.id}" class="mesh-dropdown"></div>
            <div id="territory-dropdown-container-${indicator.id}" class="territory-dropdown"></div>
          </div>
          <div id="axes-dropdown-container-${indicator.id}" class="axes-dropdown"></div>
        </div>
        <div id="loading-container-${indicator.id}" class="loading-container hidden"></div>
        <div id="error-container-${indicator.id}" class="error-container hidden"></div>
        <div style="height:300px; width: 100%;" class="canvas-container hidden">
          <canvas id="chart-${indicator.id}"></canvas>
          <p class="help">k: millier, M: million, Md: milliard</p>
        </div>
        <div id="one-year-value-${indicator.id}" class="one-year-value hidden"></div>
        `

        container.innerHTML = html
        const files = getFiles(indicator)
        const meshes = files.map((f) => f.mesh)
        makeMeshDropdown(indicator, meshes)
        await makeTerritoryDropDown(indicator)
      } catch (error) {
        console.error('Error initializing visualization:', error)
        container.innerHTML = `<div class="error">Erreur lors de l'initialisation: <em>${error.message}</em></div>`
      }
    })
  }, timeout)
}

// Fonction globale pour utilisation sans système de build
if (typeof window !== 'undefined') {
  window.makeIndicatorVisualisation = initializeVisualization
}
