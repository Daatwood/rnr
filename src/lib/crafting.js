import {crystals, metals, rocks, robots, machines} from './resources'
import {randomSel} from './game'

/*
 Extract: "Drag an item from grid into the EXTRACTOR." 
 removes 1 item from stack and creates 1 results from matching item results
  key: item o
*/
export const extractorList = () => {
  return {
    heat: [],
    scrap: ['metal', 'rock'],
    junk: ['crystal', 'metal'],
    rubble: ['rock', 'crystal'],
    metal: metals(),
    crystal: crystals(),
    rock: rocks(),
    robot: robots(),
    machine: machines()
  }
}

// kills heat and extracts selections
export const tryExtraction = (selections, inventory, gameState) => {
  // Select all items
  const items = selections.map((idx) => inventory[idx])
  if (!checkItemSelection(items))
    return gameState

  console.log('flag transmute')

  // moves from selection to extraction; locking the item
  return {
    ...gameState,
    extracting: selections,
    heatLevel: 1500 * (selections.length - 1 ),
    selectedItems: []
  }
}

// // kills heat and extracts selections
// export const performExtraction = (selections, inventory, gameState) => {
//   // Select all items
//   const items = selections.map((idx) => inventory[idx])
//   if (!checkItemSelection(items))
//     return gameState

//   console.log('lets trasmute')

//   // moves from selection to extraction; locking the item
//   return {
//     ...gameState,
//     extracting: selections,
//     heatLevel: 9000,
//     selectedItems: []
//   }
// }

// Returns new item and count
export const extractFromItem = (item) => {
  console.log('extracting ' + item)
  const extracts = extractorList()[item]
  console.log('found: '+extracts)
  
  if (!!extracts){
    const extract = randomSel(extracts)
    console.log('to:' +extract)
    return extract;
  }
  return item

  console.log('advanced mode')

  // Essence conversions
  switch(item) {
    case /iron/:
    case /titanium/:
    case /zironium/:
    case /silicon/:
    case /rock/:
      return `matter`
    case /alkaline/:
    case /neodynium/:
    case /cerium/:
    case /gypsum/:
    case /crystal/:
      return `energy`
    default:
      console.log('nothing found')
      return item
  }
}

export const checkItemSelection = (selectedItems) => {
  // for every extract there is heat to match
  if (!!selectedItems.find((item) => item == 'heat'))
    console.log('found fire')
  return !!selectedItems.find((item) => item == 'heat') && selectedItems.length > 1
}