import React from 'react'
import 'tachyons/css/tachyons.min.css';
 
const Navigation =({onroutechange , issignedin}) =>{
    if(issignedin){
    return(
        <nav className='tr'>
            <p onClick={() => {onroutechange('signin')}} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
        </nav>
    )}
    else {
        return(
            <nav className='flex justify-end'>
                <p onClick={() => {onroutechange('home')}} className='f3 link dim black underline pa3 pointer'>Sign IN</p>
                <p onClick={() => {onroutechange('register')}} className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>
        )
    }
}

export default Navigation;