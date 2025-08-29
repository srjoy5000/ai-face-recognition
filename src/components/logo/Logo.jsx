import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png'

const Logo = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }} className="ma4 mt0">
            <Tilt className='tilt br2 shadow-2'>
                <div className='tiltImg pa3'>
                    <img style={{ paddingTop: '5px' }} alt='brain logo' src={brain} />
                </div>
            </Tilt>
        </div>
    )
}

export default Logo