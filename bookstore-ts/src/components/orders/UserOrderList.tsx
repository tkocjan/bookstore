import {Table} from '@mantine/core'
import {useTranslation} from "react-i18next";

import type {OrderDto} from "../misc/BookstoreApi.tsx";

type UserOrderListProps = {
    orders: OrderDto[] | null;
}

export default function UserOrderList({
                           orders,
                       }: UserOrderListProps) {
    const {t} = useTranslation("common");

    let orderList;

    if (!orders || orders.length === 0) {
        orderList = (
            <Table.Tr key='no-order'>
                <Table.Td colSpan={3} ta='center'>
                    {t("No orders")}
                </Table.Td>
            </Table.Tr>
        )
    } else {
        orderList = orders.map((order) => (
            <Table.Tr key={order.id}>
                <Table.Td>{order.id}</Table.Td>
                <Table.Td>{order.createdAt}</Table.Td>
                <Table.Td>{order.description}</Table.Td>
            </Table.Tr>
        ))
    }

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>{t("ID")}</Table.Th>
                    <Table.Th>{t("Created At")}</Table.Th>
                    <Table.Th>{t("Description")}</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{orderList}</Table.Tbody>
        </Table>
    )
}
