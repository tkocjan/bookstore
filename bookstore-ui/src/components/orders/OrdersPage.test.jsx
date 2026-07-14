import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  render,
  makeRegularUser,
  seedLocalStorage,
  makeToken
} from '../../test-utils'
import OrdersPage from './OrdersPage.jsx'
import { bookstoreApi } from '../misc/BookstoreApi.js'

vi.mock('../misc/OrderApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

const userMeResponse = {
  username: 'bob',
  name: 'Bob',
  orders: [{ id: 'o1', createdAt: '2024-01-01', description: 'Buy coffee' }]
}

describe('OrdersPage', () => {
  it('redirects to / when the stored user is not USER role', () => {
    const userData = {
      sub: 'admin',
      rol: ['ADMIN'],
      name: 'Admin',
      exp: Math.floor(Date.now() / 1000) + 3600
    }
    const user = { data: userData, accessToken: makeToken(userData) }
    seedLocalStorage(user)
    bookstoreApi.getUserMe.mockResolvedValue({ data: userMeResponse })

    render(<OrdersPage />, { initialRoute: '/orderspage' })
    expect(screen.queryByText('Orders')).not.toBeInTheDocument()
  })

  it('fetches and displays orders on mount', async () => {
    seedLocalStorage(makeRegularUser())
    bookstoreApi.getUserMe.mockResolvedValue({ data: userMeResponse })

    render(<OrdersPage />)

    await waitFor(() => {
      expect(bookstoreApi.getUserMe).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Buy coffee')).toBeInTheDocument()
    })
  })

  it('calls createOrder and re-fetches on form submit', async () => {
    seedLocalStorage(makeRegularUser())
    bookstoreApi.getUserMe.mockResolvedValue({ data: userMeResponse })
    bookstoreApi.createOrder.mockResolvedValue({})

    render(<OrdersPage />)
    await waitFor(() =>
      expect(screen.getByText('Buy coffee')).toBeInTheDocument()
    )

    await userEvent.type(
      screen.getByPlaceholderText('Description *'),
      'New item'
    )
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(bookstoreApi.createOrder).toHaveBeenCalledTimes(1)
      expect(bookstoreApi.getUserMe).toHaveBeenCalledTimes(2)
    })
  })

  it('shows the loading overlay while fetching and hides it after', async () => {
    seedLocalStorage(makeRegularUser())
    let resolve
    bookstoreApi.getUserMe.mockReturnValue(
      new Promise((r) => {
        resolve = r
      })
    )

    const { container } = render(<OrdersPage />)

    expect(
      container.querySelector('.mantine-LoadingOverlay-root')
    ).toBeInTheDocument()

    resolve({ data: userMeResponse })
    await waitFor(() =>
      expect(screen.getByText('Buy coffee')).toBeInTheDocument()
    )

    expect(
      container.querySelector('.mantine-LoadingOverlay-root')
    ).not.toBeInTheDocument()
  })
})
