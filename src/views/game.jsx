import '../styles/game.css';

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBurn, faFire, faCannabis } from '@fortawesome/free-solid-svg-icons'

import {randomSalvage, onExtractItem, onGameTick } from '../lib/game'
import {tryExtraction } from '../lib/crafting'
import Inventory from '../components/inventory';

class GameView extends Component {
  constructor(props){
    super(props);
    this.state = {
      lastTick: Date.now(),
      inventory: [],
      extracting: [],
      heatLevel: 0,
      selectedItems: [],
      ignite: undefined
    };
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
      <div>
        <div className="item-content grey darken-3">
          <p className='white-text'>
            Select an item and heat to begin extraction process
            <br/>
            TODO:
            <br/>
            Selection: Select only the same types. Select upto 3 of same type (or more with research)
            <br/>
            Extraction: Select items then select heat to reveal inner resource
            <br/>
            Refinement : select items then select bacterium to upgrade quality
            <br/>
            Salvage: Clicking the button will add an item. Clicking on that new item will reveal itself
            <br/>
            Cooking Time: Each item requires X amount of essence to process
            <br/>
            Upgrades: more than one processors
          </p>
          <Inventory items={this.state['inventory']} selected={this.state.selectedItems} itemCallback={this.selectItem} extracting={this.state.extracting}/>
        </div>
        <div className='row'>
          <div className='col s6'>
            {<a className={`waves-effect waves-red btn-flat ${!!ignite ? 'disabled': ''}`} onClick={() => this.setState({ignite: 5})}>Ignite</a>}
            {ignite != undefined && <a className={`waves-effect waves-orange btn-flat right ${!ignite ? 'disabled': ''}`} onClick={() => this.onCaptureHeat(ignite-1)}>Capture Heat</a>}
          </div>
          <div className='col s6'>
            { ignite != undefined && <a className={`waves-effect waves-teal btn-flat ${!ignite ? 'disabled' : ''}`}  onClick={() => this.onSalvage(ignite-1)}>Salvage</a>}
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