import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
    const navigate = useNavigate();
  return (
    <div className='home-page'>
        <h1 className='title'>Admin Login</h1>
          <div>
            <input type="text" placeholder="Username" /><br/>
            <input type="password" placeholder="Password" /><br/>
            <button>Login</button>
            <button type="button" onClick={() => navigate(-1)}> Return </button>
        </div>  
    </div>
  );
};

export default LoginAdmin;
