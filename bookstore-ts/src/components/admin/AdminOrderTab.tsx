import {type ChangeEvent as ReactChangeEvent, type SubmitEvent as ReactSubmitEvent, useEffect, useState} from "react";
import {Grid, Group, TextInput, ActionIcon, Tabs, Box, LoadingOverlay} from '@mantine/core'
import type {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {IconSearch} from '@tabler/icons-react'

import OrderForm from '../misc/OrderForm.tsx'
import {bookstoreApi, type OrderInputData} from '../misc/BookstoreApi'
import {handleLogError} from "../misc/Helpers.ts";
import AdminOrderList from "./AdminOrderList.tsx";


function AdminOrderTab()
{
    const {t} = useTranslation("common");

    const [orders, setOrders] = useState([])
    const [orderDescription, setOrderDescription] = useState('')
    const [orderTextSearch, setOrderTextSearch] = useState('')
    const [isOrdersLoading, setIsOrdersLoading] = useState(true)

    useEffect(() => {
        handleGetOrders()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e: ReactChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target as HTMLInputElement;
        if (name === 'orderDescription') {
            setOrderDescription(value)
        } else if (name === 'orderTextSearch') {
            setOrderTextSearch(value)
        }
    }

    const handleGetOrders = () => {
        setIsOrdersLoading(true);

        bookstoreApi.getOrders()
            .then((response) => setOrders(response.data))
            .catch((error: AxiosError) => handleLogError(error))
            .finally(() => setIsOrdersLoading(false));
    }

    const handleDeleteOrder = (orderId: string) => {
        setIsOrdersLoading(true);

        bookstoreApi.deleteOrder(orderId)
            .then(() => handleGetOrders())
            .catch((error: AxiosError) => {
                handleLogError(error);
                setIsOrdersLoading(false);
            });
    }

    const handleCreateOrder = (e: ReactSubmitEvent) => {
        e.preventDefault()

        const description = orderDescription.trim()
        if (!description) {
            return
        }

        const orderInputData: OrderInputData = {description}

        bookstoreApi.createOrder(orderInputData)
            .then(() => {
                handleGetOrders();
                setOrderDescription('');
            })
            .catch((error: AxiosError) => handleLogError(error));
    }

    const handleSearchOrder = (e: ReactSubmitEvent) => {
        e.preventDefault()

        const text = orderTextSearch
        setIsOrdersLoading(true)

        bookstoreApi.getOrders(text)
            .then((response) => setOrders(response.data))
            .catch((error: AxiosError) => {
                handleLogError(error);
                setOrders([]);
            })
            .finally(() => setIsOrdersLoading(false));
    }

    return (
        <Tabs.Panel value='orders' pt='md'>
            <Box pos='relative'>
                <LoadingOverlay visible={isOrdersLoading}/>
                <Grid mb='md'>
                    <Grid.Col span={{base: 12, sm: 5}}>
                        <form onSubmit={handleSearchOrder}>
                            <Group>
                                <TextInput
                                    name='orderTextSearch'
                                    placeholder={t("Search by Id or Description")}
                                    value={orderTextSearch}
                                    onChange={handleInputChange}
                                />
                                <ActionIcon type='submit' variant='light' color='violet'>
                                    <IconSearch size={16}/>
                                </ActionIcon>
                            </Group>
                        </form>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, sm: 7}}>
                        <OrderForm
                            orderDescription={orderDescription}
                            handleInputChange={handleInputChange}
                            handleCreateOrder={handleCreateOrder}
                            isLoading={isOrdersLoading}
                        />
                    </Grid.Col>
                </Grid>
                <AdminOrderList orders={orders} handleDeleteOrder={handleDeleteOrder}/>
            </Box>
        </Tabs.Panel>
    )
}

export default AdminOrderTab
