import {
    useEffect, useState,
    type ChangeEvent as ReactChangeEvent,
    type SubmitEvent as ReactSubmitEvent
} from 'react'
import {Navigate} from 'react-router-dom'
import {Container} from '@mantine/core'
import BookList from './BookList.tsx'
import {useAuth} from '../context/AuthContext'
import {bookstoreApi} from '../misc/BookstoreApi'
import {handleLogError} from '../misc/Helpers'
import type {AxiosError} from "axios";

function BooksPage() {
    const authContext = useAuth()
    const jwtUserData = authContext.getJwtUserData()
    const isUser = jwtUserData?.data.rol[0] === 'USER'

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

    const handleSearchBook = async (e: ReactSubmitEvent) => {
        e.preventDefault()
        try {
            const response = await bookstoreApi.getBooks(bookTextSearch)
            const books = response.data
            setBooks(books)
        } catch (error) {
            handleLogError(error as AxiosError)
            setBooks([])
        }
    }

    if (!isUser) {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <BookList
                isBooksLoading={isBooksLoading}
                bookTextSearch={bookTextSearch}
                books={books}
                handleInputChange={handleInputChange}
                handleSearchBook={handleSearchBook}
            />
        </Container>
    )
}

export default BooksPage
