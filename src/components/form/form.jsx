import React from 'react'
import './form.css';

const Image_link_form =({onchange, onButtonSubmit}) => {
    return(
        <div className='center'>
            <p className='f3 center'>{'FACE DETECTION'}</p>
            <div className='center w-40%'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className=' f4 pa2 w-70' type='text' onChange={onchange}/>
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>DETECT</button>
                </div>
            </div>
        </div>
    )
}

export default Image_link_form;