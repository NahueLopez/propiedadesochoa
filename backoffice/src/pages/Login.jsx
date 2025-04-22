import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../services/LoginService';

function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!password && !email) {
            setError("Por favor, complete los campos.");
            return;
        } else if (!email) {
            setError('Por favor, complete el usuario.');
            return;
        } else if (!password) {
            setError("Por favor, complete la contraseña.");
            return;
        }

        try {
            setError('');
            const response = await login(email, password);

            const token = response.token || response.access_token;
            if (!token) {
                throw new Error('No se recibió un token válido del servidor');
            }
            localStorage.setItem('token', token);
            navigate('/home');
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className='flex items-center justify-center h-screen bg-gray-700 opacity-90'>
            <div className='bg-white text-gray-700 p-8 rounded-lg shadow-2xl'>
                <h1 className='text-center mb-4 text-4xl font-bold'>Ingrese a su cuenta</h1>
                <hr className='shadow-2xl'></hr>
                <form onSubmit={handleSubmit} className='flex flex-col mt-4 gap-4 text-xl'>
                    <div className='flex gap-2'>
                        <label>Email:</label>
                        <input 
                            type='email'
                            className=''
                            placeholder='Ingrese su email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className='flex gap-2'>
                        <label>Contraseña:</label>
                        <input
                            className=''
                            placeholder='Ingrese su contraseña'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className='text-red-500'>{error}</div>}

                    <div className='flex justify-center'>
                        <button type="submit" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-black-200 via-black-300 to-yellow-200 group-hover:from-black-200 group-hover:via-black-300 group-hover:to-yellow-200 focus:ring-4 focus:outline-none focus:ring-black-100 ">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-transparent">
                            Ingresar
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;