import { piles } from "./resources"
import { extractFromItem } from './crafting'

export const initWorld = () => {
  return {
    time: 0,
    unlocked: [], // list of unlocked resources
    inventory: ['energy:10']
  }
}

export const randomSalvage = () => {
  return piles()[Math.floor(Math.random() * piles().length)]
}

export const randomSel = (selections) => {
  return selections[Math.floor(Math.random() * selections.length)]
}

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
    console.log(newItems)
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