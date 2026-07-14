import { screen } from '@testing-library/react'
import { render } from '../../test-utils'
import OrdersTable from './OrdersTable.tsx'

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
    render(<OrdersTable {...makeProps({ orders: null })} />)
    expect(screen.getByText('No order')).toBeInTheDocument()
  })

  it('shows "No order" when orders array is empty', () => {
    render(<OrdersTable {...makeProps({ orders: [] })} />)
    expect(screen.getByText('No order')).toBeInTheDocument()
  })

  it('renders a row for each order', () => {
    render(<OrdersTable {...makeProps({ orders: mockOrders })} />)
    expect(screen.getByText('Buy coffee')).toBeInTheDocument()
    expect(screen.getByText('Buy tea')).toBeInTheDocument()
    expect(screen.getByText('o1')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('renders the OrderForm for creating new orders', () => {
    render(<OrdersTable {...makeProps()} />)
    expect(screen.getByPlaceholderText('Description *')).toBeInTheDocument()
  })

  it('shows the Orders heading', () => {
    render(<OrdersTable {...makeProps()} />)
    expect(screen.getByText('Orders')).toBeInTheDocument()
  })

  it('shows the loading overlay when isLoading is true', () => {
    const { container } = render(
      <OrdersTable {...makeProps({ isLoading: true })} />
    )
    expect(
      container.querySelector('.mantine-LoadingOverlay-root')
    ).toBeInTheDocument()
  })

  it('does not show the loading overlay when isLoading is false', () => {
    const { container } = render(
      <OrdersTable {...makeProps({ isLoading: false })} />
    )
    expect(
      container.querySelector('.mantine-LoadingOverlay-root')
    ).not.toBeInTheDocument()
  })
})
