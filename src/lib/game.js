import { piles } from "./resources"
import { extractFromItem } from './crafting'
import { randomSel } from './util'

export const newState = () => {
  return {
    lastTick: Date.now(),
    inventory: [],
    extracting: [],
    heatLevel: 0,
    selectedItems: [],
    ignite: undefined,
    igniteAction: 5,
    igniteMin: 0,
    captureHeatCost: 1,
    findSalvageCost: 1,
  }
}


///-- Actions

export const actionIgnite = (state) => {
  if (state.ignite > state.igniteMin)
    return state;

  return {
    ...state,
    ignite: state.igniteAction
  }
}

export const actionCaptureHeat = (state) => {
  if (state.ignite < state.captureHeatCost)
    return state;

  return {
    ...state,
    ignite: state.ignite - state.captureHeatCost,
    inventory: [...state.inventory, 'heat']
  }
}

export const actionFindSalvage = (state) => {
  if (state.ignite < state.findSalvageCost)
    return state;

  return {
    ...state,
    ignite: state.ignite - state.findSalvageCost,
    inventory: [...state.inventory, randomSel(piles())]
  }
}



///-- Item Extraction

export const onExtractItem = (itemIndex, gameState) => {
  const { inventory } = gameState;
  const item = inventory[itemIndex];
  const newItem = extractFromItem(item)
  console.log(`xta ${item} => ${newItem}`)

  const newInventory = replaceAt(inventory, itemIndex, newItem)

  return {
    ...gameState,
    inventory: newInventory
  }
}

function replaceAt(array, index, value) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

export const onGameTick = (gameState) => {
  const { lastTick, heatLevel, extracting, inventory } = gameState;
  const tick = Date.now()
  const delta = tick - lastTick
  const newHeatLevel = Math.max(heatLevel - delta, 0)
  const newInventory = inventory.slice(0);

  if (newHeatLevel === 0 && extracting.length > 0) {
    let newItems = extracting.map((itemIndex) => {
      return extractFromItem(inventory[itemIndex])
    })
    extracting.forEach((itemIndex, index) => {
      newInventory[itemIndex] = newItems[index]
    });
    console.log(newInventory)
  }
  
  return {
    ...gameState,
    lastTick: tick,
    lastDelta: delta,
    inventory: newInventory.filter((item) => item != undefined),
    extracting: newHeatLevel === 0 ? [] : extracting,
    heatLevel: newHeatLevel
  }

}