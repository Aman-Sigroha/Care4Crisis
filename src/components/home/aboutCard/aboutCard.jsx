import './aboutCard.css';

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

const AboutCard = (props) =>{
    const {source, h2, h5, para} = props;
    return(
        <div className='aboutCard' style={cardStyle}>
            <img src={source} style={{width: '100%', height: '220px', objectFit: 'cover'}}></img>
            <div className='aboutCardTitle'>
                <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#05C3DD', margin: '1rem 1rem 0.5rem 1rem'}}>{h2}</h2>
                <h5 style={{fontSize: '1.2rem', color: '#F31BEF', margin: '0 1rem 1rem 1rem'}}>{h5}</h5>
            </div>
            <div className='aboutPara' style={{fontSize: '1.1rem', lineHeight: '1.6', margin: '0 1.5rem 1.5rem 1.5rem', color: '#E8ECEF'}}>{para}</div>
        </div>
    )
}
export default AboutCard;