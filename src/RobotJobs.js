import React, { Component } from 'react';

class RobotJobs extends Component {

  renderJobs(){
    const {robots} = this.props;
    if(Object.keys(robots).length === 0)
      return null

    return Object.keys(robots).map( (name) => {
      return (
        <p>
          { name } {robots[name]}
          <button onClick={() => this.props.addJob(name)}>+</button>
          <button onClick={() => this.props.removeJob(name)}>-</button>
        </p>
      )
    })
  }

  render() {
    const {free} = this.props

    return (
      <ul className='pure-menu-list'>
        <h2>Robots {free}</h2>
        { this.renderJobs() }
      </ul>
    )
  }
}
export default RobotJobs;