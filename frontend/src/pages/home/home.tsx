import {Link} from 'react-router-dom';
import '../home/home.css';

const Home = () => {
    return (
        <div className='home-page'>
            <h1 className='title'>Restaurante Couraça</h1>
                <ul className='home-links'>
                    <li>
                        <Link to="/criar_reserva">
                            Create Reservation
                        </Link>
                    </li>
                    <li>
                            <Link to="/login_admin">
                            Admin Login
                        </Link>
                    </li>
                    <li>
                            <Link to="/admin_page">
                            para já admin page ig (depois delete)
                        </Link>
                    </li>
                </ul>
        </div>
    );
}

export default Home;