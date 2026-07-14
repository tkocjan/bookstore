import axios from 'axios'
import {config} from '../../Constants'
// import {parseJwt} from './Helpers'
import {type IJwtUserData, getJwtUserData} from "../context/AuthContext.tsx";

interface ISignupInputData {
    username: string;
    password: string;
    name: string;
    email: string;
}

interface IOrderInputData {
    description: string;
}

export interface IOrderDto {
    id: string;
    description: string;
    user: IUserDto;
    createdAt: string;
}

export interface IUserDto {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    orders: IOrderDto[];
}

export interface IBookDto {
    isbn: string;
    title: string;
}

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

function authenticate(username: string, password: string) {
    return instance.post(
        '/auth/authenticate',
        {username, password},
        // {
        //   headers: { 'Content-type': 'application/json' }
        // }
    )
}

function signup(signupData: ISignupInputData) {
    return instance.post('/auth/signup', signupData, {
        headers: {'Content-type': 'application/json'}
    })
}

function numberOfUsers() {
    return instance.get('/public/numberOfUsers')
}

function numberOfOrders() {
    return instance.get('/public/numberOfOrders')
}

function getUsers(username?: string) {
    const url = username ? `/api/users/${username}` : '/api/users'
    return instance.get(url);
}

function deleteUser(username: string) {
    return instance.delete(`/api/users/${username}`);
}

function getOrders(text?: string) {
    const url = text ? `/api/orders?text=${text}` : '/api/orders'
    return instance.get(url);
}

function deleteOrder(orderId: string) {
    return instance.delete(`/api/orders/${orderId}`);
}

function createOrder(order: IOrderInputData) {
    return instance.post('/api/orders', order);
}

function getUserMe() {
    return instance.get('/api/users/me');
}

function getBooks(text?: string) {
    const url = text ? `/public/books?text=${text}` : '/public/books'
    return instance.get(url);
}

function deleteBook(isbn: string) {
    return instance.delete(`/api/books/${isbn}`);
}

function addBook(book: IBookDto) {
    return instance.post('/api/books', book);
}

// -- Axios

const instance = axios.create({
    baseURL: config.url.API_BASE_URL
})

instance.interceptors.request.use(
    function (config) {
        const jwtUserData = getJwtUserData();

        config.headers = config.headers ?? {};
        config.headers['Content-type'] = 'application/json';

        // If token is expired, redirect user to login
        if (jwtUserData) {
            if (Date.now() > jwtUserData.data.exp * 1000) {
                window.location.href = '/login';
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

        return config;
    },
    function (error) {
        return Promise.reject(error)
    }
)

// -- Helper functions

function bearerAuth(user: IJwtUserData): string {
    return `Bearer ${user.accessToken}`
}
