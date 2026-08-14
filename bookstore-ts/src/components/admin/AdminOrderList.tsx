import {IconTrash} from '@tabler/icons-react'
import {ActionIcon, Table} from '@mantine/core'
import {useTranslation} from "react-i18next";

import type {OrderDto} from "../misc/BookstoreApi.tsx";

type AdminOrderListProps = {
    orders: OrderDto[];
    handleDeleteOrder: (orderId: string) => void;
};

export default function AdminOrderList(props: AdminOrderListProps)
{
    const {
        orders,
        handleDeleteOrder,
    } = props;

    const {t} = useTranslation("common");

    let orderList
    if (orders.length === 0) {
        orderList = (
            <Table.Tr key='no-order'>
                <Table.Td colSpan={5} ta='center'>
                    {t("No orders")}
                </Table.Td>
            </Table.Tr>
        )
    } else {
        orderList = orders.map((order) => (
            <Table.Tr key={order.id}>
                <Table.Td>
                    <ActionIcon
                        color='red'
                        variant='light'
                        size='sm'
                        onClick={() => handleDeleteOrder(order.id)}
                    >
                        <IconTrash size={14}/>
                    </ActionIcon>
                </Table.Td>
                <Table.Td>{order.id}</Table.Td>
                <Table.Td>{order.user.username}</Table.Td>
                <Table.Td>{order.createdAt}</Table.Td>
                <Table.Td>{order.description}</Table.Td>
            </Table.Tr>
        ))
    }

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th w={40}/>
                    <Table.Th>{t("ID")}</Table.Th>
                    <Table.Th>{t("Username")}</Table.Th>
                    <Table.Th>{t("Created At")}</Table.Th>
                    <Table.Th>{t("Description")}</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{orderList}</Table.Tbody>
        </Table>
    )
}
