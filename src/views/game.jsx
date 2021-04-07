import '../styles/game.css';

import React, { Component } from 'react';
import {actionFindSalvage, actionCaptureHeat, onGameTick, newState, actionIgnite } from '../lib/game'
import {tryExtraction } from '../lib/crafting'
import Inventory from '../components/inventory';
import ActionButton from '../components/action_button';
import Progress from '../components/progress';

class GameView extends Component {
  constructor(props){
    super(props);
    this.state = newState()
    this.selectItem = this.selectItem.bind(this);
    this.tick = this.tick.bind(this);
  }


  componentDidMount() {
    setTimeout(this.tick, 3000)
  }

  tick(){
    const newState = onGameTick(this.state);
    this.setState(newState,() => setTimeout(this.tick, 1000));
  }

  onCaptureHeat(ignite){
    this.setState({
      ignite: ignite,
      inventory: [...this.state.inventory, 'heat']
    })
  }

  // Select item otherwise unselect item
  selectItem(itemIndex) {
    const {selectedItems, inventory, extracting}  = this.state;
    console.log('selection '+itemIndex)
    let selected = selectedItems.indexOf(itemIndex) > -1
    let locked = extracting.indexOf(itemIndex) > -1
    if (locked)
      return

    let newSelections = [...this.state.selectedItems, itemIndex] 
    if (selected)
      newSelections = selectedItems.splice(selected)
    
    this.setState({
      selectedItems: newSelections
    }, () => this.setState(tryExtraction(newSelections, inventory, this.state)));
  }

  handleGameAction(func){
    this.setState(func(this.state))
  }

  render(){
    const {ignite, igniteAction} = this.state;

    return (
      <div className='container'>
        <p className='white-text'>
          Press Ignite to get started.
        </p>
        <div className='row'>
          <div className='col s6 m4 l3'>
            <h5>Inventory</h5>
            <div className="item-content">
              <Inventory limit={9} items={this.state['inventory']} selected={this.state.selectedItems} itemCallback={this.selectItem} extracting={this.state.extracting}/>
            </div>
            <small>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</small>
          </div>
          <div className='col s6 m8 l9'>
            <h5>Engine</h5>
            <Progress color='red' now={ignite} max={igniteAction} />
            <ul className='collection'>
              <ActionButton text='Ignite' action='red' classes='waves-red' hidden={!!ignite && ignite > 0} 
                onClick={ () => this.setState(actionIgnite(this.state)) } />
              <ActionButton text='Capture Heat' action='orange' classes='waves-orange' hidden={!ignite || ignite < 1} 
                onClick={() => this.setState(actionCaptureHeat(this.state)) }/>
              <ActionButton text='Find Salvage'  action='teal' classes='waves-teal ' hidden={!ignite || ignite < 1} 
                onClick={() => this.setState(actionFindSalvage(this.state)) }/>
              <ActionButton text='Build Kiln' desc='Produces heat per second'/>
              <ActionButton text='Build Silo' desc='Hold additional resources'/>
              <ActionButton text='Build Junkyard' desc='Unlock machines'/>
              <ActionButton text='Build Quarry' desc='Unlock a place to dig'/>
              <ActionButton text='Build Brickworks' desc='Produces bricks from rocks'/>
              <ActionButton text='Build Smeltery' desc='Unlock new metals'/>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
}
export default GameView;