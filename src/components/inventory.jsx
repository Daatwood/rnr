import '../styles/game.css';

import React, { Component } from 'react';

import Item from './item'
import * as render from '../lib/render'

class Inventory extends Component {
  render(){
    const { items, selected, extracting } = this.props;
    return (
      <div className='item-grid'> 
        { items.map((item, index) => (
          <Item key={index} 
            name={item} 
            color={render.colorFromItem(item)}
            icon={render.iconFromItem(item)} 
            count={''} 
            selected={selected && selected.indexOf(index) > -1}
            extracting={extracting && extracting.indexOf(index) > -1}
            clicked={() => this.props.itemCallback(index)}
          />
        )) }
      </div>
    )
  }
  
}
export default Inventory;