const API_BASE_URL = 'http://localhost:5000/api';
import axios from 'axios';

// const getToken = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user.token) {
//         return `Bearer ${user.token}`;
//     } else {
//         return '';
//     }
// };

export const loginUser = async (email, password) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password,
        });
        console.log(response)
        return { data: response.data };
    } catch (err) {
        console.log('error 23', err.response.data);
        return { error: err.response.data };
    }
}

export const registerUser = async (email, password, name) => {
    console.log(email, password, name)
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
            email,
            password,
            name
        },
        );

        console.log(response?.data);
        if (response.data)
            return { data: response.data };

        return { error: response.error };
    } catch (err) {
        return { error: err.response.data.error };
    }
}

export const resetPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
            email,
        });
        console.log('response 53', response);

        return { data: response.data };
    } catch (err) {
        console.log(57, err.response.data);
        return { error: err.response.data.error };
    }
}

export const confirmReset = async ({ token, email, password, confirmPassword }) => {
    console.log(63, { token, email, password, confirmPassword })
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/reset-password/${token}`, {
            email, password, confirmPassword
        });
        console.log('response 67', token, response);

        return { data: response.data };
    } catch (err) {
        console.log(71, err.response.data);
        return { error: err.response.data.error };
    }
}
