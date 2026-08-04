import {
    useEffect, useState,
    type ChangeEvent as ReactChangeEvent,
    type SubmitEvent as ReactSubmitEvent,
} from 'react'
import {Navigate} from 'react-router'
import {ActionIcon, Box, Container, Grid, Group, LoadingOverlay, TextInput, Title} from '@mantine/core'
import type {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {IconDeviceLaptop, IconSearch} from "@tabler/icons-react";

import UserOrderList from './UserOrderList.tsx'
import {getUserRole} from '@/context/AuthContext.tsx'
import {bookstoreApi, type OrderInputData} from '@/components/misc/BookstoreApi.ts'
import {handleLogError} from '../misc/Helpers.ts'
import OrderForm from "../misc/OrderForm.tsx";

function UserOrdersPage()
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

    if (getUserRole() !== 'USER') {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <Box pos='relative'>

                <LoadingOverlay visible={isOrdersLoading}/>

                <Grid mb='md'>
                    <Grid.Col span={{base: 12, sm: 2}}>
                        <Group>
                            <IconDeviceLaptop size={28}/>
                            <Title order={2}>{t("Orders")}</Title>
                        </Group>
                    </Grid.Col>

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

                    <Grid.Col span={{base: 12, sm: 5}}>
                        <OrderForm
                            orderDescription={orderDescription}
                            handleInputChange={handleInputChange}
                            handleCreateOrder={handleCreateOrder}
                            isLoading={isOrdersLoading}
                        />
                    </Grid.Col>
                </Grid>

                <UserOrderList orders={orders}/>

            </Box>
        </Container>
    )
}

export default UserOrdersPage;
