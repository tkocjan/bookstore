import axios from 'axios'
import {config} from '../../Constants'
import {parseJwt} from './Helpers'
import {getUser} from "../context/AuthContext.jsx";

export const bookstoreApi = {
    authenticate,
    signup,
    numberOfUsers,
    numberOfOrders,
    getUsers,
    deleteUser,
    getOrders,
    deleteOrder,
    createOrder,
    getBooks,
    deleteBook,
    addBook,
    getUserMe
}

function authenticate(username, password) {
    return instance.post(
        '/auth/authenticate',
        {username, password},
    );
}

// function authenticate(username, password) {
//     return instance.post(
//         '/auth/authenticate',
//         {username, password},
//         {
//             headers: {'Content-type': 'application/json'}
//         }
//     )
// }

function signup(user) {
    return instance.post('/auth/signup', user, {
        headers: {'Content-type': 'application/json'}
    })
}

function numberOfUsers() {
    return instance.get('/public/numberOfUsers')
}

function numberOfOrders() {
    return instance.get('/public/numberOfOrders')
}

function getUsers(user, username) {
    const url = username ? `/api/users/${username}` : '/api/users'
    return instance.get(url, {
        headers: {Authorization: bearerAuth(user)}
    })
}

function deleteUser(user, username) {
    return instance.delete(`/api/users/${username}`, {
        headers: {Authorization: bearerAuth(user)}
    })
}

function getOrders(user, text) {
    const url = text ? `/api/orders?text=${text}` : '/api/orders'
    return instance.get(url, {
        headers: {Authorization: bearerAuth(user)}
    })
}

function deleteOrder(user, orderId) {
    return instance.delete(`/api/orders/${orderId}`, {
        headers: {Authorization: bearerAuth(user)}
    })
}

function createOrder(user, order) {
    return instance.post('/api/orders', order, {
        headers: {
            'Content-type': 'application/json',
            Authorization: bearerAuth(user)
        }
    })
}

function getUserMe(user) {
    return instance.get('/api/users/me', {
        headers: {Authorization: bearerAuth(user)}
    })
}

function getBooks(user, text) {
    const url = text ? `/public/books?text=${text}` : '/public/books'

    return instance.get(url);
}

// function getBooks(user, text) {
//     const url = text ? `/public/books?text=${text}` : '/public/books'
//     return instance.get(url, {
//         headers: {Authorization: bearerAuth(user)}
//     })
// }

function deleteBook(user, isbn) {
    return instance.delete(`/api/books/${isbn}`, {
        headers: {Authorization: bearerAuth(user)}
    })
}

function addBook(user, book) {
    return instance.post('/api/books', book, {
        headers: {
            'Content-type': 'application/json',
            Authorization: bearerAuth(user)
        }
    })
}

// -- Axios

const instance = axios.create({
    baseURL: config.url.API_BASE_URL
})

instance.interceptors.request.use(
    function (config) {
        const jwtUserData = getUser();

        config.headers = config.headers ?? {}
        config.headers['Content-type'] = 'application/json';

        // If token is expired, redirect user to login
        if (jwtUserData) {
            if (Date.now() > jwtUserData.exp * 1000) {
                window.location.href = '/login'
            }

            config.headers['Authorization'] = bearerAuth(jwtUserData);
        }

        // // If token is expired, redirect user to login
        // if (config.headers.Authorization) {
        //     const token = config.headers.Authorization.split(' ')[1]
        //     const data = parseJwt(token)
        //     if (Date.now() > data.exp * 1000) {
        //         window.location.href = '/login'
        //     }
        // }

        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

// -- Helper functions

function bearerAuth(user) {
    return `Bearer ${user.accessToken}`
}
