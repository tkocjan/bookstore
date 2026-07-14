import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from '@mantine/core'
import BookList from './BookList'
import { useAuth } from '../context/AuthContext'
import { bookstoreApi } from '../misc/BookstoreApi.js'
import { handleLogError } from '../misc/Helpers'

function BooksPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
    const isUser = user.data.rol[0] === 'USER'

  const [books, setBooks] = useState([])
  const [bookTextSearch, setBookTextSearch] = useState('')
  const [isBooksLoading, setIsBooksLoading] = useState(false)

  useEffect(() => {
    handleGetBooks()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'bookTextSearch') {
      setBookTextSearch(value)
    }
  }

  const handleGetBooks = async () => {
    try {
      setIsBooksLoading(true)
      const response = await bookstoreApi.getBooks(user)
      setBooks(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsBooksLoading(false)
    }
  }

  const handleSearchBook = async () => {
    try {
      const response = await bookstoreApi.getBooks(user, bookTextSearch)
      const books = response.data
      setBooks(books)
    } catch (error) {
      handleLogError(error)
      setBooks([])
    }
  }

  if (!isUser) {
    return <Navigate to='/' />
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
