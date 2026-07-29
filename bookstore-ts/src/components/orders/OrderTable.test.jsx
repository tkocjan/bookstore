import { screen } from '@testing-library/react'
import { render } from '../../test-utils'
import UserOrderList from './UserOrderList.tsx'

const mockOrders = [
  { id: 'o1', createdAt: '2024-01-01', description: 'Buy coffee' },
  { id: 'o2', createdAt: '2024-01-02', description: 'Buy tea' }
]

function makeProps(overrides = {}) {
  return {
    orders: [],
    isLoading: false,
    orderDescription: '',
    handleInputChange: vi.fn(),
    handleCreateOrder: vi.fn(),
    ...overrides
  }
}

describe('user/OrderTable', () => {
  it('shows "No order" when orders is null', () => {
    render(<UserOrderList {...makeProps({ orders: null })} />)
    expect(screen.getByText('No order')).toBeInTheDocument()
  })

  it('shows "No order" when orders array is empty', () => {
    render(<UserOrderList {...makeProps({ orders: [] })} />)
    expect(screen.getByText('No order')).toBeInTheDocument()
  })

  it('renders a row for each order', () => {
    render(<UserOrderList {...makeProps({ orders: mockOrders })} />)
    expect(screen.getByText('Buy coffee')).toBeInTheDocument()
    expect(screen.getByText('Buy tea')).toBeInTheDocument()
    expect(screen.getByText('o1')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('renders the OrderForm for creating new orders', () => {
    render(<UserOrderList {...makeProps()} />)
    expect(screen.getByPlaceholderText('Description *')).toBeInTheDocument()
  })

  it('shows the Orders heading', () => {
    render(<UserOrderList {...makeProps()} />)
    expect(screen.getByText('Orders')).toBeInTheDocument()
  })

  it('shows the loading overlay when isLoading is true', () => {
    const { container } = render(
      <UserOrderList {...makeProps({ isLoading: true })} />
    )
    expect(
      container.querySelector('.mantine-LoadingOverlay-root')
    ).toBeInTheDocument()
  })

  it('does not show the loading overlay when isLoading is false', () => {
    const { container } = render(
      <UserOrderList {...makeProps({ isLoading: false })} />
    )
    expect(
      container.querySelector('.mantine-LoadingOverlay-root')
    ).not.toBeInTheDocument()
  })
})
