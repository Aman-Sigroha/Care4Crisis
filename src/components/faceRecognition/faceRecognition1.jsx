import React from 'react';
import './faceRecognition1.css';

const FaceRecognition1 = ({imageurl, box})=>{
    return(
        <div className='center1 mt3' style={{zIndex : -1}}>
            <div className='absolute mt2' style={{zIndex : 1}}>
                <img id='inputImage' src={imageurl} width='auto' height='380px' />
                <div className=' bounding-box' style={{top: box.top ,right: box.right, left: box.left , bottom: box.bottom }}></div>
            </div>
        </div>
    )
}

export default FaceRecognition1; 