import '../styles/game.css';

import React, { Component } from 'react';
import {randomSalvage, onExtractItem, onGameTick, newState } from '../lib/game'
import {tryExtraction } from '../lib/crafting'
import Inventory from '../components/inventory';
import ActionButton from '../components/action_button';

class GameView extends Component {
  constructor(props){
    super(props);
    this.state = newState()
    this.onExtract = this.onExtract.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.tick = this.tick.bind(this);
  }

  onSalvage(ignite){
    this.setState({
      ignite: ignite,
      inventory: [...this.state.inventory, randomSalvage()]
    })
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

  onExtract(itemIndex){
    this.setState(onExtractItem(itemIndex, this.state))
  }

  render(){
    const {ignite} = this.state;

    return (
      <div className='container'>
        <p className='white-text'>
          Press Ignite to get started.
        </p>
        <div className="item-content grey darken-3">
          <Inventory items={this.state['inventory']} selected={this.state.selectedItems} itemCallback={this.selectItem} extracting={this.state.extracting}/>
        </div>
        <div className='row'>
          <div className='col s6'>
            <ActionButton text='Ignite' classes='waves-red' disabled={!!ignite} onClick={() => this.setState({ignite: 5})} />
            <ActionButton text='Capture Heat' classes='right waves-orange' disabled={!ignite} onClick={() => this.onCaptureHeat(ignite-1)} hidden={ignite === undefined}/>
          </div>
          <div className='col s6'>
            <ActionButton text='Find Salvage' classes='waves-teal' disabled={!ignite} onClick={() =>  this.onSalvage(ignite-1)} hidden={ignite === undefined}/>
          </div>
          <div className='col s12'>
            <div className="progress red lighten-4">
              <div className="determinate red darken-2" style={{width: `${(ignite/5)*100}%`}}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
}
export default GameView;