import '../styles/game.css';

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Item extends Component {
  render(){
    const { icon, name, count, selected, extracting, color } = this.props
    let classes = selected ? ' selected' : ''
    classes += extracting ? ' orange darken-2' : ''
    return (
      <div className={color+' item-border'+classes} onClick={() => this.props.clicked()}>
        <div className={`item item-${name}` }>
          <FontAwesomeIcon icon={icon} />
        </div> 
        <div className='count'>
          <small style={{fontSize: '10px'}}>{name}</small>
        </div>
        <div className='count'>
          {
            extracting &&
            <div className="progress yellow">
              <div className="indeterminate orange darken-4" ></div>
            </div>
          }
        </div>
      </div>
    )
  }
  
}
export default Item;