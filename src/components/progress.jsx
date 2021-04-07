const Progress = props => ( 
  props.hidden ? <div/> : 
    <div className={`progress lighten-4 ${props.color}`}>
      <div className={`determinate ${props.color} darken-2`} style={{width: `${((props.now || 0)/props.max)*100}%`}}/>
    </div>
)
export default Progress;