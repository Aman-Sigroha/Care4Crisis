import React from 'react'

const Rank = (props)=>{
    const { info } = props;
    return(
        <div>
            <div className='white f3'>
                { info.name  + ' , your current entry count is...' }
            </div>
            <div className='white f1'>
                { info.entries }
            </div>
        </div>
    )
}

export default Rank;