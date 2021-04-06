const ActionButton = props => ( 
  props.hidden ? <div/> : 
    <a className={`waves-effect btn-flat ${props.classes || ''} ${props.disabled ? 'disabled': ''}`} 
      onClick={props.onClick}>
        {props.text}
    </a>
)
export default ActionButton;