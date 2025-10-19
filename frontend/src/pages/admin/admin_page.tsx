import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const admin_page = () => {
    const navigate = useNavigate();
    return (
        <div className='home-page'>
            <h1 className='title'>Welcome Admin</h1>
                <ul className='home-links'>
                    <li>
                        <Link to="/get_reservations">
                            View Reservations
                        </Link>   
                    </li>
                    <li>
                        <Link to="/get_daily_summary">
                            View Daily Summary
                        </Link>
                    </li>
                    <li>
                        <Link to="/manage_tables">
                            Manage Tables
                        </Link>
                    </li>
                </ul>
                <button type="button" onClick={() => navigate(-1)}> Return </button>
        </div>
    );
}

export default admin_page;