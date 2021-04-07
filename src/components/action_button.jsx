const ActionButton = props => ( 
  props.hidden ? <div/> : 
    <a className='collection-item' onClick={props.onClick}>
      <div className='black-text'>
        {props.text}
        <a className={`secondary-content ${props.disabled ? 'disabled': ''}`}>{props.desc}</a>
      </div>
    </a>
)
export default ActionButton;