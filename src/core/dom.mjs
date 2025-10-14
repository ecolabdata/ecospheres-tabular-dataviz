/**
 * Ce fichier contient toutes les fonctions qui manipulent le DOM
 * Si un ID / classe change, c'est ici qu'il faut adapter le code
 */

export function getContainer(indicator) {
  return document.querySelector(
    `.indicator-viz[data-indicator-id="${indicator.id}"`
  )
}

export function getIndicatorFromContainer(container) {
  return JSON.parse(decodeURIComponent(container.dataset.indicator))
}

export function getFilesFromContainer(container) {
  return JSON.parse(decodeURIComponent(container.dataset.files))
}

export function getFiles(indicator) {
  const container = getContainer(indicator)
  return getFilesFromContainer(container)
}

export function getChartCanvas(indicator) {
  return document.getElementById(`chart-${indicator.id}`)
}

export function getOneYearValueContainer(indicator) {
  return document.getElementById(`one-year-value-${indicator.id}`)
}

export function getTerritoryDropdownContainer(indicator) {
  return document.getElementById(`territory-dropdown-container-${indicator.id}`)
}

export function getMeshDropdownContainer(indicator) {
  return document.getElementById(`mesh-dropdown-container-${indicator.id}`)
}

export function getAxesDropdownContainer(indicator) {
  return document.getElementById(`axes-dropdown-container-${indicator.id}`)
}

export function getMeshSelect(indicator) {
  return document.getElementById(`select-mesh-${indicator.id}`)
}

export function getCurrentMesh(indicator) {
  return getMeshSelect(indicator).value
}

export function getTerritorySelect(indicator) {
  const mesh = getCurrentMesh(indicator)
  return document.getElementById(`select-${mesh}-${indicator.id}`)
}

export function getCurrentTerritory(indicator) {
  return getTerritorySelect(indicator).value
}

export function getDataVizContainers() {
  return document.querySelectorAll('.indicator-viz')
}

export function getAxeCheckboxes(indicator, axe) {
  return Array.from(
    document.querySelectorAll(`#axe-checkboxes-${axe}-${indicator.id} input`)
  )
}

export function getCurrentAxeValues(indicator, axe) {
  return getAxeCheckboxes(indicator, axe)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.dataset.value)
}

export function saveInTheDOM(indicator, name, data) {
  // On sauvegarde de la donnée
  // dans un script de type 'application/json'
  // que le code pourra lire grâce à `getSavedDataFromDOM`
  const scriptId = `${name}-${indicator.id}`
  const existing = document.getElementById(scriptId)
  if (existing) {
    existing.remove()
  }
  const script = document.createElement('script')
  script.id = scriptId
  script.type = 'application/json'
  script.textContent = JSON.stringify(data)
  const container = getContainer(indicator)
  container.insertBefore(script, container.firstChild)
}

export function getSavedDataFromDOM(indicator, name) {
  return JSON.parse(
    document.getElementById(`${name}-${indicator.id}`).textContent
  )
}

export function getGroupAxeSwitch(indicator, axe) {
  return document.getElementById(`group-axe-${axe}-${indicator.id}`)
}

export function getTabularApiUrl(indicator) {
  const container = getContainer(indicator)
  return container.dataset.tabularApiUrl
}

export function getChartTitle(indicator) {
  const container = getContainer(indicator)
  return container.dataset.chartTitle
}

export function getErrorContainer(indicator) {
  return document.getElementById(`error-container-${indicator.id}`)
}

export function showError(indicator, message, details = '') {
  const errorContainer = getErrorContainer(indicator)
  const detailsHtml = details ? `<p class="fr-alert__description">${details}</p>` : ''
  errorContainer.innerHTML = `
    <div class="fr-alert fr-alert--error">
      <p class="fr-alert__title">Erreur lors du chargement des données</p>
      <p>${message}</p>
      ${detailsHtml}
    </div>
  `
  errorContainer.classList.remove('hidden')

  // Hide the chart and one-year-value containers
  const canvasContainer = getChartCanvas(indicator).parentElement
  const oneYearContainer = getOneYearValueContainer(indicator)
  canvasContainer.classList.add('hidden')
  oneYearContainer.classList.add('hidden')
}

export function hideError(indicator) {
  const errorContainer = getErrorContainer(indicator)
  errorContainer.classList.add('hidden')
  errorContainer.innerHTML = ''
}

export function getLoadingContainer(indicator) {
  return document.getElementById(`loading-container-${indicator.id}`)
}

export function showLoading(indicator) {
  const loadingContainer = getLoadingContainer(indicator)
  loadingContainer.innerHTML = `<p class="loading-text">Chargement...</p>`
  loadingContainer.classList.remove('hidden')
}

export function hideLoading(indicator) {
  const loadingContainer = getLoadingContainer(indicator)
  loadingContainer.classList.add('hidden')
  loadingContainer.innerHTML = ''
}
