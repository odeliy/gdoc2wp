import {
  formatLinks,
  removeBoldedHeaders,
  removeParagraphTagsFromLists,
  removeTag,
  stripTagAttributes,
  swapTags
} from './formatters.js'
import formatTables from './formatTables.js'

const getToggleValue = (settings, toggleName) => {
  let toggleValue = ''

  settings.forEach((setting) => {
    if (setting.name === toggleName) {
      toggleValue = setting.togglePositionLeft ? setting.toggleValues[0] : setting.toggleValues[1]
    }
  })

  return toggleValue
}

const formatGdoc = (input, settings) => {
  let newString = input
  let platformSelection = getToggleValue(settings, 'platform')
  let websiteSelection = getToggleValue(settings, 'website')
  let tableStylingSelection = getToggleValue(settings, 'tableFormatting')
  let ToCSelection = getToggleValue(settings, 'insertToC')

  const junkTags = ['meta', 'b', 'div', 'br', 'colgroup', 'col']
  junkTags.forEach((tag) => {
    newString = removeTag(newString, tag)
  })

  // platform agnostic formatting
  newString = swapTags(newString, 'span', 'strong', 'font-weight:700')
  newString = swapTags(newString, 'span', 'em', 'font-style:italic')
  newString = removeTag(newString, 'span')
  newString = stripTagAttributes(newString)
  newString = formatLinks(newString, websiteSelection)
  newString = removeBoldedHeaders(newString)
  newString = removeParagraphTagsFromLists(newString)

  // apply table specific formatting
  if (tableStylingSelection === true)
    newString = formatTables(newString, websiteSelection, platformSelection)

  return newString
}

export default formatGdoc
