import {useEffect, useState,
    type ChangeEvent as ReactChangeEvent,
    type SubmitEvent as ReactSubmitEvent
} from 'react'
import {Navigate} from 'react-router-dom'
import {Container} from '@mantine/core'
import {useAuth, type IJwtUserData} from '../context/AuthContext.tsx'
import AdminTab from './AdminTab'
import {bookstoreApi} from '../misc/BookstoreApi.ts'
import {handleLogError} from '../misc/Helpers.ts'
import type {AxiosError} from "axios";

function AdminPage() {
    const Auth = useAuth()
    const user: IJwtUserData | null = Auth.getJwtUserData()

    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [orderDescription, setOrderDescription] = useState('')
    const [orderTextSearch, setOrderTextSearch] = useState('')
    const [userUsernameSearch, setUserUsernameSearch] = useState('')
    const [isAdmin, setIsAdmin] = useState(true)
    const [isUsersLoading, setIsUsersLoading] = useState(true)
    const [isOrdersLoading, setIsOrdersLoading] = useState(true)

    useEffect(() => {
        setIsAdmin(user?.data.rol[0] === 'ADMIN')
        handleGetUsers()
        handleGetOrders()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e: ReactChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target as HTMLInputElement;
        if (name === 'userUsernameSearch') {
            setUserUsernameSearch(value)
        } else if (name === 'orderDescription') {
            setOrderDescription(value)
        } else if (name === 'orderTextSearch') {
            setOrderTextSearch(value)
        }
    }

    const handleGetUsers = async () => {
        setIsUsersLoading(true)
        try {
            const response = await bookstoreApi.getUsers()
            setUsers(response.data)
        } catch (error) {
            handleLogError(error as AxiosError)
        } finally {
            setIsUsersLoading(false)
        }
    }

    const handleDeleteUser = async (username: string) => {
        setIsUsersLoading(true)
        try {
            await bookstoreApi.deleteUser(username)
            handleGetUsers()
        } catch (error) {
            handleLogError(error as AxiosError)
            setIsUsersLoading(false)
        }
    }

    const handleSearchUser = async (e: ReactSubmitEvent) => {
        e.preventDefault()
        const username = userUsernameSearch
        setIsUsersLoading(true)
        try {
            const response = await bookstoreApi.getUsers(username)
            const data = response.data
            const users = data instanceof Array ? data : [data]
            setUsers(users as [])
        } catch (error) {
            handleLogError(error as AxiosError)
            setUsers([])
        } finally {
            setIsUsersLoading(false)
        }
    }

    const handleGetOrders = async () => {
        setIsOrdersLoading(true)
        try {
            const response = await bookstoreApi.getOrders()
            setOrders(response.data)
        } catch (error) {
            handleLogError(error as AxiosError)
        } finally {
            setIsOrdersLoading(false)
        }
    }

    const handleDeleteOrder = async (orderId: string) => {
        setIsOrdersLoading(true)
        try {
            await bookstoreApi.deleteOrder(orderId)
            handleGetOrders()
        } catch (error) {
            handleLogError(error as AxiosError)
            setIsOrdersLoading(false)
        }
    }

    const handleCreateOrder = async (e: ReactSubmitEvent) => {
        e.preventDefault()
        const description = orderDescription.trim()
        if (!description) {
            return
        }

        const order = {description}
        try {
            await bookstoreApi.createOrder(order)
            handleGetOrders()
            setOrderDescription('')
        } catch (error: any) {
            handleLogError(error as AxiosError)
        }
    }

    const handleSearchOrder = async (e: ReactSubmitEvent) => {
        e.preventDefault()
        const text = orderTextSearch
        setIsOrdersLoading(true)
        try {
            const response = await bookstoreApi.getOrders(text)
            setOrders(response.data)
        } catch (error) {
            handleLogError(error as AxiosError)
            setOrders([])
        } finally {
            setIsOrdersLoading(false)
        }
    }

    if (!isAdmin) {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <AdminTab
                isUsersLoading={isUsersLoading}
                users={users}
                userUsernameSearch={userUsernameSearch}
                handleDeleteUser={handleDeleteUser}
                handleSearchUser={handleSearchUser}
                isOrdersLoading={isOrdersLoading}
                orders={orders}
                orderDescription={orderDescription}
                orderTextSearch={orderTextSearch}
                handleCreateOrder={handleCreateOrder}
                handleDeleteOrder={handleDeleteOrder}
                handleSearchOrder={handleSearchOrder}
                handleInputChange={handleInputChange}
            />
        </Container>
    )
}

export default AdminPage
