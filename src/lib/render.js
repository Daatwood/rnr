import { icon } from '@fortawesome/fontawesome-svg-core'
import * as icons from '@fortawesome/free-solid-svg-icons'

export const iconFromItem = (item) => {
  switch(item) {
    case 'heat':
      return icons.faFire;
    case 'fuel':
      return icons.faBurn;
    case 'rock':
    case 'stone':
    case 'granite':
    case 'diorite':
    case 'andesite':
    case 'bedrock':
      return icons.faMountain;
    case 'crystal':
    case 'terra':
    case 'pyro':
    case 'aqua':
    case 'spirit':
    case 'demon':
      return icons.faGem;
    case 'metal':
    case 'iron':
    case 'titanium':
    case 'zironium':
    case 'silicon':
    case 'alkaline':
    case 'neodynium':
    case 'cerium':
    case 'gypsum':
      return icons.faCircle;
    case 'scrap':
    case 'junk':
    case 'rubble':
      return icons.faBox;
    case 'bacterium':
      return icons.faBacterium;
    default:
      return icons.faCannabis;
  }
}
export const colorFromItem = (item) => {
  switch(item) {
    case 'heat':
      return 'red-text accent-1';
    case 'fuel':
      return 'deep-orange-text accent-1';
    case 'stone':
      return 'brown-text lighten-4'
    case 'granite':
      return 'amber-text lighten-5'
    case 'diorite':
      return 'grey-text lighten-5'
    case 'andesite':
      return 'blue-grey-text lighten-4'
    case 'bedrock':
      return 'indigo-text lighten-5';
    case 'terra':
      return 'light-green-text lighten-5'
    case 'pyro':
      return 'red-text lighten-5'
    case 'aqua':
      return 'blue-text lighten-5'
    case 'spirit':
      return 'light-blue-text lighten-5'
    case 'demon':
      return 'deep-purple-text lighten-5';
    case 'iron':
      return 'grey-text lighten-5'
    case 'titanium':
      return 'blue-grey-text lighten-5'
    case 'zironium':
      return 'lime-text lighten-5'
    case 'silicon':
      return 'yellow-text lighten-5'
    case 'alkaline':
      return 'indigo-text lighten-5';
    case 'neodynium':
      return 'deep-purple-text lighten-5'
    case 'cerium':
      return 'orange-text lighten-5'
    case 'gypsum':
      return 'deep-orange-text lighten-5';
    default:
      return ''
  }
}

export const shadeFromRank = (rank) =>{
  switch(rank){
    case 0: 
      return 'lighten-5'
    case 1: 
      return 'lighten-4'
    case 2: 
      return 'lighten-3'
    case 3: 
      return 'lighten-2'
    case 4: 
      return 'lighten-1'
    default:
      return ''
  }
}