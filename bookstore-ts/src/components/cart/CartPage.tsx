import {type ChangeEvent as ReactChangeEvent, useEffect, useState} from 'react'
import {Navigate} from 'react-router-dom'
import {Container} from '@mantine/core'
import CartList from './CartList'
import {getUserRole} from '../context/AuthContext'
import {bookstoreApi} from '../misc/BookstoreApi.js'
import {handleLogError} from '../misc/Helpers'
import type {AxiosError} from "axios";

function CartPage()
{
    const [books, setBooks] = useState([])
    const [bookTextSearch, setBookTextSearch] = useState('')
    const [isBooksLoading, setIsBooksLoading] = useState(false)

    useEffect(() => {
        handleGetBooks()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e: ReactChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        if (name === 'bookTextSearch') {
            setBookTextSearch(value)
        }
    }

    const handleGetBooks = async () => {
        try {
            setIsBooksLoading(true)
            const response = await bookstoreApi.getBooks()
            setBooks(response.data)
        } catch (error) {
            handleLogError(error as AxiosError)
        } finally {
            setIsBooksLoading(false)
        }
    }

    const handleSearchBook = async () => {
        try {
            const response = await bookstoreApi.getBooks(bookTextSearch)
            const books = response.data
            setBooks(books)
        } catch (error) {
            handleLogError(error as AxiosError)
            setBooks([])
        }
    }

    if (getUserRole() !== 'USER') {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <CartList
                isBooksLoading={isBooksLoading}
                bookTextSearch={bookTextSearch}
                books={books}
                handleInputChange={handleInputChange}
                handleSearchBook={handleSearchBook}
            />
        </Container>
    )
}

export default CartPage
