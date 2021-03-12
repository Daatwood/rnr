import './App.css';
import React, { Component } from 'react';

import ResourceList from './ResourceList'
import Menu from './Menu'
import RobotJobs from './RobotJobs'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      time: 0,
      resourceTypes: [
        'heat',
        'scrap',
        'bricks',
        'minerals',
        'metals',
        'parts',
        'robots',
        'matter',
        'crystal'
      ],
      buildingTypes: [
        'kiln',
        'scrapyard',
        'quarry',
        'brickworks',
        'harvestor',
        'smeltery',
        'assembler',
        'disintegrator',
        'reactor'
      ],
      robotTypes: [
        'scavenger',
        'engineer',
        'metallurgist',
        'technician'
      ],
      crystalCooldownRate: 0,
      itemStock: {},
      stockRate: {},
      stockLimit: {},
      buildings: {},
      robots: {
        scavenger: 0,
        metallurgist: 0,
        engineer: 0,
        technician: 0,
      },
    }
    this.tick = this.tick.bind(this);
    this.buildStructure = this.buildStructure.bind(this);
    this.calculateRates = this.calculateRates.bind(this);
    this.addJob = this.addJob.bind(this);
    this.removeJob = this.removeJob.bind(this);
    this.buildStructure = this.buildStructure.bind(this);
    this.loadCookie = this.loadCookie.bind(this);
  }

  componentDidMount() {
    setTimeout(this.tick, 1000)
  }

  saveCookie(state){
    console.log('Saved!')
    document.cookie = `rnrData=${btoa(JSON.stringify(state))}`
  }

  loadCookie(){
    let cookie = document.cookie.match("rnrData=[^&]+")[0]
    if (!cookie)
      return
    console.log(cookie)
    this.setState({
      ...JSON.parse(atob(cookie.split('rnrData=')[1]))
    })
  }

  tick(){
    let { itemStock, crystalCooldownRate } = this.state
    const { stockRate } = this.state
    Object.keys(stockRate).map((name) => {
      if (!itemStock[name])
        itemStock[name] = 0
      itemStock[name] += stockRate[name]
    });

    // CHANCE to generate 1 based on number of quarries
    if (Math.random() * this.state.buildings.quarry >= 42 + crystalCooldownRate) {
      let crystals = (itemStock.crystal || 0)
      itemStock.crystal = crystals + 1
      crystalCooldownRate = 100
    } else if (this.state.buildings.quarry >= 42) {
      crystalCooldownRate -= 1
      if (crystalCooldownRate < 1)
        crystalCooldownRate = 0
    }

    // Generates a Robot given the right conditions
    // 5 parts, 1 crystal, empty reactor spot
    if ((itemStock.robots || 0) < this.state.buildings.reactor) {
      if ( itemStock.parts >= 5 && itemStock.crystal >= 1) {
        itemStock.parts -= 5;
        itemStock.crystal -= 1;
        if (!itemStock.robots)
          itemStock.robots = 0
        itemStock.robots += 1;
      }
    }
    const newState = {
      time: this.state ? this.state.time + 1 : 1,
      itemStock: itemStock,
      crystalCooldownRate: crystalCooldownRate
    }
    
    this.state.autoSave && newState.time % 5 == 0 && this.saveCookie(newState)
    this.setState(newState,() => setTimeout(this.tick, 1000));
  }

  incrStock(name, amt) {
    let stock = this.state.itemStock[name] + amt
    if (!stock && stock != 0)
      stock = amt
    this.setState({
      itemStock: {
        ...this.state.itemStock,
        [name]: stock
      }
    })
  }

  decrStock(name, amt) {
    let stock = this.state.itemStock[name] - amt
    if (!stock && stock != 0)
      stock = -amt
    this.setState({
      itemStock: {
        ...this.state.itemStock,
        [name]: stock
      }
    })
  }

  convertStock(from, amt, to) {
    const stockA = this.state.itemStock[from] - amt || 0
    const stockB = this.state.itemStock[to] + 1 || 1
    this.setState({
      itemStock: {
        ...this.state.itemStock,
        [from]: stockA,
        [to]: stockB
      }
    });
  }

  onGenerateHeatButton() {
    this.incrStock('heat',1)
  }

  // Thought? 1st building provides a base Rate
  // Each additional buildings is an upgrade that increases by a percentage
  // Robots give off heat 
  calculateRates(){
    const { robots } = this.state.itemStock
    const { kiln, scrapyard, harvestor, quarry, brickworks, smeltery, assembler, disintegrator } = this.state.buildings
    const { scavenger, metallurgist, technician, engineer } = this.state.robots
    this.setState({
      stockRate:{
        heat: ((robots || 0 ) * 0.02) + ((kiln || 0) * 0.68) - ((scrapyard || 0) * 0.08) - ((quarry || 0) * 0.05) - ((brickworks || 0) * 0.32) - ((smeltery || 0) * 0.75) - ((assembler || 0) * 1) - ((disintegrator || 0) * 2.5),
        scrap: ((scrapyard || 0) * 0.24) - ((smeltery || 0) * 0.17) - ((harvestor || 0 ) * 0.13) + ((disintegrator || 0) * 0.33) + ((scavenger || 0) * 0.25),
        minerals: ((quarry || 0 ) * 0.05) + ((harvestor || 0 ) * 0.17) - ((brickworks || 0) * 0.09) - ((smeltery || 0) * 0.09),
        bricks: ((brickworks || 0 ) * 0.05),
        metals: ((smeltery || 0 ) * 0.09) - ((assembler || 0) * 1.0) + ((metallurgist || 0) * 0.09),
        parts: ((assembler || 0) * 0.03) - ((disintegrator || 0) * 0.035) + ((engineer || 0 ) * 0.03), 
        matter: ((disintegrator || 0) * 0.01) + ((technician || 0) * 0.01)
      }
    })
  }

  canBuild(name, cost){
    return this.state.itemStock[name] && this.state.itemStock[name] >= cost
  }

  buildStructure(building){
    const cost = this.calculateBuildingCost(building)
    const itemName = Object.keys(cost)[0]
    const itemCost = Object.values(cost)[0].toFixed(0)

    if (this.canBuild(itemName, itemCost)) {
      const count = this.state.buildings[building] || 0;
      this.setState({
        itemStock:{
          ...this.state.itemStock,
          [itemName]: this.state.itemStock[itemName] - itemCost
        },
        buildings:{
          ...this.state.buildings,
          [building]: count + 1
        }
      }, this.calculateRates)
    }
  }

  buildingLink(name) {
    let cost = this.calculateBuildingCost(name)
    const itemName = Object.keys(cost)[0]
    const itemCost = Object.values(cost)[0].toFixed(0)
    let classes = 'pure-button button-small'
    if (!this.canBuild(itemName, itemCost))
      classes +=' button-error'
    return (
      <p key={name}>
        <button className={classes} onClick={() => this.buildStructure(name)}>
          {name} {this.state.buildings[name]} {Object.keys(cost)[0]}:{Object.values(cost)[0].toFixed(0)}
        </button>
      </p>
    )
  }

  totalWorking() {
    return Object.values(this.state.robots).reduce((sum, val) => sum + val);
  }

  addJob(name) {
    const jobs = Object.values(this.state.robots).reduce((sum, val) => sum + val);
    const total = this.state.itemStock.robots 
    if (jobs < total) {
      const count = this.state.robots[name] || 0;
      this.setState({
        robots:{
          ...this.state.robots,
          [name]: count + 1
        }
      }, this.calculateRates)
    }
  }

  removeJob(name) {
    const count = this.state.robots[name] || 0;
    this.setState({
      robots:{
        ...this.state.robots,
        [name]: Math.max(0, count - 1)
      }
    }, this.calculateRates)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="pure-g">
            <div className="pure-u-1">
              <h1>Robots and Resources</h1>
              <div className='pure-g'>
                <div className='pure-u-4-5'>
                  <small>Day {this.state.time}</small>
                </div>
                <div className='pure-u-1-5'>
                  <div>
                    <label htmlFor="autosave" className="pure-checkbox"><input id='autosave' type="checkbox" onClick={(e) => this.setState({autoSave: e.target.checked})}/>
                      Autosave
                    </label>
                  </div>

                  <button className='button-xsmall pure-button' onClick={() => this.saveCookie(this.state)}>Save</button>
                  <button className='button-xsmall pure-button' onClick={this.loadCookie}>Load</button>
                </div>
              </div>
              <Menu/>
            </div>
            <div className="pure-u-1-3">
              <h2>Resources</h2>
              <p>
                <button className='pure-button button-large' onClick={() => this.incrStock('heat', Math.random())}>Capture Heat</button>
              </p>
              <p>
                <button className='pure-button button-large' onClick={() => this.incrStock('scrap', Math.random())}>Salvage</button>
              </p>
              <ResourceList items={this.state.itemStock} rates={this.state.stockRate}/>
            </div>
            <div className="pure-u-1-3">
              <h2>Buildings</h2>
              { this.state.buildingTypes.map((name) => this.buildingLink(name) ) }
            </div>
            <div className="pure-u-1-3">
              <RobotJobs addJob={this.addJob} removeJob={this.removeJob} robots={this.state.robots} free={this.state.itemStock.robots - this.totalWorking() || ''} />
            </div>
          </div>
        </header>
      </div>
    );
  }

  calculateBuildingCost(name){
    const count = this.state.buildings[name] || 0
    switch(name){
      case 'kiln':
        return {heat: 19 + 20 ** (4 * count / 100)} // 160019 at 100
      case 'scrapyard':
        return {scrap: 49+ 50 ** (25 * count / 137)}
      case 'quarry':
        return {heat: 49 + 50 ** (18 * count / 500)} 
      case 'brickworks':
        return {minerals: 50 + (100 * count)}
      default:
        return {bricks: 1 + count}
    }
  }
}

export default App;
