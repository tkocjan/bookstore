import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test-utils'
import AdminTabs from './AdminTabs.tsx.bak'

function makeProps(overrides = {}) {
  return {
    isUsersLoading: false,
    users: [],
    userUsernameSearch: '',
    handleDeleteUser: vi.fn(),
    handleSearchUser: vi.fn(),
    isOrdersLoading: false,
    orders: [],
    orderDescription: '',
    orderTextSearch: '',
    handleCreateOrder: vi.fn(),
    handleDeleteOrder: vi.fn(),
    handleSearchOrder: vi.fn(),
    handleInputChange: vi.fn(),
    ...overrides
  }
}

describe('AdminTab', () => {
  it('renders Users tab by default', () => {
    render(<AdminTabs {...makeProps()} />)
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('No user')).toBeInTheDocument()
  })

  it('switches to Orders panel when Orders tab is clicked', () => {
    render(<AdminTabs {...makeProps()} />)
    fireEvent.click(screen.getByRole('tab', { name: /orders/i }))
    expect(screen.getByText('No order')).toBeInTheDocument()
  })

  it('renders user rows in the Users tab', () => {
    const users = [
      {
        id: 1,
        username: 'alice',
        name: 'Alice',
        email: 'alice@example.com',
        role: 'USER'
      }
    ]
    render(<AdminTabs {...makeProps({ users })} />)
    expect(screen.getByText('alice')).toBeInTheDocument()
  })

  it('renders order rows in the Orders tab', () => {
    const orders = [
      {
        id: 'o1',
        user: { username: 'alice' },
        createdAt: '2024-01-01',
        description: 'Test order'
      }
    ]
    render(<AdminTabs {...makeProps({ orders })} />)
    fireEvent.click(screen.getByRole('tab', { name: /orders/i }))
    expect(screen.getByText('Test order')).toBeInTheDocument()
  })

  it('shows the users loading overlay when isUsersLoading is true', () => {
    const { container } = render(
      <AdminTabs {...makeProps({ isUsersLoading: true })} />
    )
    expect(
      container.querySelector('.mantine-LoadingOverlay-root')
    ).toBeInTheDocument()
  })

  it('shows the orders loading overlay when isOrdersLoading is true', () => {
    const { container } = render(
      <AdminTabs {...makeProps({ isOrdersLoading: true })} />
    )
    fireEvent.click(screen.getByRole('tab', { name: /orders/i }))
    expect(
      container.querySelector('.mantine-LoadingOverlay-root')
    ).toBeInTheDocument()
  })
})
