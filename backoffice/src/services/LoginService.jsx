import axios from 'axios';

const login = async (email, password) => {
    const url = `${import.meta.env.VITE_URL_BACK}/api/login`;

    try {
        const response = await axios.post(
            url,
            {
                email,
                password
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message);
        throw error;
    }
};

export default login;