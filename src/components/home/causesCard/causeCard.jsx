import './causeCard.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

const cardStyle = {
    borderRadius: '8px',
    width: '100%',
    maxWidth: '380px',
    minWidth: '300px',
    backgroundColor: 'rgba(10, 14, 23, 0.8)',
    marginBottom: '2rem',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
    border: '1px solid #05C3DD',
    transition: 'transform 0.3s ease',
    overflow: 'hidden',
    flex: '1 1 300px',
    height: 'auto'
};

const CauseCard = (props) =>{
    const {source, h3, para, raised, goal} = props;
    const progress = raised *100/ goal;
    return(
        <div className='causeCard' style={cardStyle}>
            <img src={source} style={{width: '100%', height: '220px', objectFit: 'cover'}}></img>
            <div className='causeCardTitle'>
                <h3 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{h3}</h3>
            </div>
            <div className='causePara' style={{fontSize: '1.1rem', lineHeight: '1.6'}}>{para}</div>
            <ProgressBar variant="warning" className='bar'animated now={progress} label={progress+'%'}/>
            <div className='progressReport'>
                <h5>Goal: {goal}</h5>
                <h5>Raised: {raised}</h5>
            </div>
        </div>
    )
}
export default CauseCard;