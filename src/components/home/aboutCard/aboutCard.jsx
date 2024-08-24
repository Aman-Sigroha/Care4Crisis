import React from "react";
import './aboutCard.css';

const AboutCard = (props) =>{
    const {source, h2, h5, para} = props;
    return(
        <div className='aboutCard'>
            <img src={source}></img>
            <div className='aboutCardTitle'>
                <h2>{h2}</h2>
                <h5>{h5}</h5>
            </div>
            <div className='aboutPara'>{para}</div>
        </div>
    )
}
export default AboutCard;