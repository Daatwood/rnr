import React, { Component } from 'react';

class ResourceList extends Component {

  renderItems(){
    const {items, rates} = this.props;
    if(Object.keys(items).length === 0)
      return null

    return Object.keys(items).map( (name) => {
      let rateInfo = '+'
      if (rates[name])
        rateInfo = `(${rates[name].toFixed(2)})`
      return <li key={name} className='pure-menu=item'>{name}: {items[name].toFixed(2)} {!!rates[name] && rateInfo }</li>
    })
  }

  render() {
    return (
      <ul className='pure-menu-list'>
        {this.renderItems()}
      </ul>
    )
  }
}
export default ResourceList;