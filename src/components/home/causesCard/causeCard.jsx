import React from 'react';
import './causeCard.css';
import ProgressBar from 'react-bootstrap/ProgressBar';


const CauseCard = (props) =>{
    const {source, h3, para, raised, goal} = props;
    const progress = raised *100/ goal;
    return(
        <div className='causeCard'>
            <img src={source}></img>
            <div className='causeCardTitle'>
                <h3>{h3}</h3>
            </div>
            <div className='causePara'>{para}</div>
            <ProgressBar variant="warning" className='bar'animated now={progress} label={progress+'%'}/>
            <div className='progressReport'>
                <h5>Goal: {goal}</h5>
                <h5>Raised: {raised}</h5>
            </div>
        </div>
    )
}
export default CauseCard;