import { Group, TextInput, Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import type {ChangeEvent as ReactChangeEvent, SubmitEvent as ReactSubmitEvent} from "react";

interface OrderFormProps {
    orderDescription: string;
    handleInputChange: (e: ReactChangeEvent<HTMLInputElement>) => void;
    handleCreateOrder: (e: ReactSubmitEvent) => void;
    isLoading: boolean;
}

function OrderForm({
  orderDescription,
  handleInputChange,
  handleCreateOrder,
  isLoading
}: OrderFormProps) {
  const createBtnDisabled = isLoading || orderDescription.trim() === ''
  return (
    <form onSubmit={handleCreateOrder}>
      <Group>
        <TextInput
          name='orderDescription'
          placeholder='Description *'
          value={orderDescription}
          onChange={handleInputChange}
        />
        <Button
          type='submit'
          leftSection={<IconPlus size={16} />}
          disabled={createBtnDisabled}
          color='violet'
        >
          Create
        </Button>
      </Group>
    </form>
  )
}

export default OrderForm
