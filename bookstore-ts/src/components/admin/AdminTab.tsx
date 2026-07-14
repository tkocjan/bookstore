import { Tabs, Box, LoadingOverlay } from '@mantine/core'
import { IconUsers, IconDeviceLaptop } from '@tabler/icons-react'
import UserTable from './UserTable'
import AdminOrderTable from './AdminOrderTable.tsx'
import type {IOrderDto, IUserDto} from "../misc/BookstoreApi.tsx";
import type {SubmitEvent as ReactSubmitEvent, ChangeEvent as ReactChangeEvent} from "react";

interface AdminTabProps {
    handleInputChange: (e: ReactChangeEvent<HTMLInputElement>) => void;

    isUsersLoading: boolean,
    users: IUserDto[],
    userUsernameSearch: string;
    handleDeleteUser: (username: string) => Promise<void>;
    handleSearchUser: (e: ReactSubmitEvent) => Promise<void>;

    isOrdersLoading: boolean;
    orders: IOrderDto[];
    orderDescription: string;
    orderTextSearch: string;
    handleCreateOrder: (e: ReactSubmitEvent) => Promise<void>;
    handleDeleteOrder: (orderId: string) => void;
    handleSearchOrder: (e: ReactSubmitEvent) => Promise<void>;
}

function AdminTab(props: AdminTabProps)
{
  const { handleInputChange } = props
  const {
    isUsersLoading,
    users,
    userUsernameSearch,
    handleDeleteUser,
    handleSearchUser
  } = props
  const {
    isOrdersLoading,
    orders,
    orderDescription,
    orderTextSearch,
    handleCreateOrder,
    handleDeleteOrder,
    handleSearchOrder
  } = props

  return (
    <Tabs defaultValue='users' mt='md'>
      <Tabs.List>
        <Tabs.Tab value='users' leftSection={<IconUsers size={16} />}>
          Users
        </Tabs.Tab>
        <Tabs.Tab value='orders' leftSection={<IconDeviceLaptop size={16} />}>
          Orders
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='users' pt='md'>
        <Box pos='relative'>
          <LoadingOverlay visible={isUsersLoading} />
          <UserTable
            users={users}
            userUsernameSearch={userUsernameSearch}
            handleInputChange={handleInputChange}
            handleDeleteUser={handleDeleteUser}
            handleSearchUser={handleSearchUser}
          />
        </Box>
      </Tabs.Panel>

      <Tabs.Panel value='orders' pt='md'>
        <Box pos='relative'>
          <LoadingOverlay visible={isOrdersLoading} />
          <AdminOrderTable
            orders={orders}
            isOrdersLoading={isOrdersLoading}
            orderDescription={orderDescription}
            orderTextSearch={orderTextSearch}
            handleInputChange={handleInputChange}
            handleCreateOrder={handleCreateOrder}
            handleDeleteOrder={handleDeleteOrder}
            handleSearchOrder={handleSearchOrder}
          />
        </Box>
      </Tabs.Panel>
    </Tabs>
  )
}

export default AdminTab
