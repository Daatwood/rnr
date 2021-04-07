import '../styles/game.css';

import React, { Component } from 'react';

import Item from './item'
import * as render from '../lib/render'

class Inventory extends Component {

  renderEmptySpaces(amt){
    let spaces = []
    for (let index = 0; index < amt; index++) {
      spaces[index] = (
        <Item key={`e-${index}`} 
          name='' 
          color=''
          icon=''
          count=''
          classes='undiscovered'
          selected={false}
          extracting={false}
          clicked={() => console.log('click empty')}
        />
      )
    }
    return spaces
  }

  render(){
    const { items, selected, extracting, limit } = this.props;
    return (
      <div className='item-grid'> 
        { items.map((item, index) => (
          <Item key={`f-${index}`}
            name={item} 
            color={render.colorFromItem(item)}
            icon={render.iconFromItem(item)}
            count={''}
            selected={selected && selected.indexOf(index) > -1}
            extracting={extracting && extracting.indexOf(index) > -1}
            clicked={() => this.props.itemCallback(index)}
          />
        )) }
        { this.renderEmptySpaces(limit-items.length) }
      </div>
    )
  }
  
}
export default Inventory;