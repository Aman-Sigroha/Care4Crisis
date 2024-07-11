import React from 'react';
import Tilt from 'react-parallax-tilt';
import face from './face-id_2061822.png';

const Logo1 = ()=>{
    return(
        <div className='ma4 mt0' style={{ width: '150px', height: '150px'}}>
            <Tilt>
                <div style={{  height: '150px', backgroundColor: 'linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%)' }} className='pa3 br2 shadow-2'>
                    <img src={face} alt='logo'></img>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo1;