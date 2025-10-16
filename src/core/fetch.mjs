/**
 * Fichier pour appeler l'API tabular de data.gouv.fr
 * https://github.com/datagouv/api-tabular
 */

import { makeAxesCheckboxes } from '../components/axes.mjs'
import { makeChart } from './chart.mjs'
import {
  getCurrentMesh,
  getCurrentTerritory,
  getFiles,
  getTabularApiUrl,
  saveInTheDOM,
  showError,
  hideError,
  showLoading,
  hideLoading
} from './dom.mjs'
import { DEFAULT_TABULAR_API_URL, GEOCOLUMNS, YEAR_COLUMN } from './enums.mjs'
import { formatData } from './format.mjs'
import { debug } from './debug.mjs'

async function fetchPage(url, allData, pageSize = 200) {
  /**
   * Fonction récursive pour prendre en compte la pagination de l'API
   */
  const urlObj = new URL(url)
  if (!urlObj.searchParams.has('page_size')) {
    urlObj.searchParams.set('page_size', pageSize)
  }

  const response = await fetch(urlObj.toString())
  if (response.ok) {
    const body = await response.json()
    const data = body.data
    if (data && data.length > 0) {
      allData = allData.concat(data)
      const nextUrl = body.links?.next
      if (nextUrl) {
        allData = fetchPage(nextUrl, allData)
      }
    }
  } else {
    const errorText = await response.text()
    console.error(
      'Error fetching data from tabular API at url',
      url,
      response.status,
      errorText
    )
    throw new Error(
      errorText || `Erreur HTTP ${response.status}`
    )
  }
  return allData
}

function getGeoCondition(indicator, mesh) {
  // Si la maille est nationale on ne filtre pas sur un territoire
  if (mesh == 'fr') {
    return ''
  }
  const geocode = getCurrentTerritory(indicator)
  const geoColumn = GEOCOLUMNS[mesh]
  const condition = `${geoColumn}__exact=${geocode}&`
  return condition
}

export async function fetchData(indicator) {
  const mesh = getCurrentMesh(indicator)
  const territory = getCurrentTerritory(indicator)

  // Clear any previous errors and show loading
  hideError(indicator)
  showLoading(indicator)

  debug.log(`🔄 Fetching data for indicator ${indicator.id}`, {
    mesh: mesh,
    territory: territory || 'National'
  })

  const files = getFiles(indicator)
  const file = files.find((f) => f.mesh === mesh)
  const geoCondition = getGeoCondition(indicator, mesh)
  const baseUrl = getTabularApiUrl(indicator) || DEFAULT_TABULAR_API_URL
  const path = `${baseUrl}/api/resources/${file.id}/data/`
  const url = `${path}?${geoCondition}${YEAR_COLUMN}__sort=asc`

  try {
    const allData = await fetchPage(url, [])
    debug.log(`✅ Data fetched: ${allData.length} records`)

    const formatedData = formatData(allData, file)
    // On sauvegarde les données et les axes directement dans le DOM (sous forme de script JSON)
    // Ce qui permettra de ne pas effectuer de nouvelles requêtes à l'API si l'utilisateur filtre sur les axes
    saveInTheDOM(indicator, 'data', formatedData)
    saveInTheDOM(indicator, 'axes', file.axes)
    // Une fois qu'on a les données, on peut remplir les valeurs possibles des axes
    // Cela permet de ne pas afficher des valeurs d'axe absentes du jeu de données courant
    makeAxesCheckboxes(indicator, file, formatedData)
    makeChart(indicator)
    hideLoading(indicator)
  } catch (error) {
    debug.error('Failed to fetch data', error)
    hideLoading(indicator)
    showError(indicator, error.message)
  }
}
