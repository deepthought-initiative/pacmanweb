const InputConfigOption = ({label, desc}) => {
  return (
    <>
      <label className="form-label" htmlFor="CurrentCycle">{label}</label>
      <div className="input-group">
          <input type="text" className="form-control rounded-0 border-2"/>
      </div>
      <div className='form-text text-start'>{desc}</div>  
    </>
  )
}

export default InputConfigOption


