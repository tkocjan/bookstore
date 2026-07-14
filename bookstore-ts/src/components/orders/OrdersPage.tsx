import {
    useEffect, useState,
    type ChangeEvent as ReactChangeEvent,
    type SubmitEvent as ReactSubmitEvent,
} from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from '@mantine/core'
import OrdersTable from './OrdersTable.tsx'
import {useAuth} from '../context/AuthContext.tsx'
import { bookstoreApi } from '../misc/BookstoreApi.ts'
import { handleLogError } from '../misc/Helpers.ts'
import type {AxiosError} from "axios";
import type {IUserDto} from "../misc/BookstoreApi.tsx";

function OrdersPage() {
  const authContext = useAuth()
  const user = authContext.getJwtUserData()
  const isUser = user?.data.rol[0] === 'USER'

  const [userDtoMe, setUserDtoMe] = useState<IUserDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [orderDescription, setOrderDescription] = useState('')

  useEffect(() => {
    fetchUserDtoMe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e: ReactChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name === 'orderDescription') {
      setOrderDescription(value)
    }
  }

  const handleCreateOrder = async (e: ReactSubmitEvent) => {
    e.preventDefault()
    const trimmedDescription = orderDescription.trim()
    if (!trimmedDescription) {
      return
    }

    const order = { description: trimmedDescription }
    try {
      await bookstoreApi.createOrder(order)
      await fetchUserDtoMe()
      setOrderDescription('')
    } catch (error) {
      handleLogError(error as AxiosError)
    }
  }

  const fetchUserDtoMe = async () => {
  // const fetchUserDtoMe = async () => {
    setIsLoading(true)
    try {
      const response = await bookstoreApi.getUserMe()
      setUserDtoMe(response.data)
    } catch (error) {
      handleLogError(error as AxiosError)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isUser) {
    return <Navigate to='/' />
  }

  return (
    <Container>
      <OrdersTable
        orders={userDtoMe && userDtoMe.orders}
        isLoading={isLoading}
        orderDescription={orderDescription}
        handleCreateOrder={handleCreateOrder}
        handleInputChange={handleInputChange}
      />
    </Container>
  )
}

export default OrdersPage
