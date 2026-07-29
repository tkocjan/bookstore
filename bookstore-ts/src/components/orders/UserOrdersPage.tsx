import {
    useEffect, useState,
    type ChangeEvent as ReactChangeEvent,
    type SubmitEvent as ReactSubmitEvent,
} from 'react'
import {Navigate} from 'react-router-dom'
import {Box, Container, Grid, Group, LoadingOverlay, Title} from '@mantine/core'
import UserOrderList from './UserOrderList.tsx'
import {getUserRole} from '../context/AuthContext.tsx'
import {bookstoreApi, type OrderInputData} from '../misc/BookstoreApi.ts'
import {handleLogError} from '../misc/Helpers.ts'
import type {AxiosError} from "axios";
import type {UserDto} from "../misc/BookstoreApi.tsx";
import {IconDeviceLaptop} from "@tabler/icons-react";
import OrderForm from "../misc/OrderForm.tsx";

function UserOrdersPage() {

    const [userDtoMe, setUserDtoMe] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [orderDescription, setOrderDescription] = useState('');

    useEffect(() => {
        fetchUserDtoMe();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e: ReactChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target as HTMLInputElement;
        if (name === 'orderDescription') {
            setOrderDescription(value);
        }
    }

    const handleCreateOrder = async (e: ReactSubmitEvent) => {
        e.preventDefault();

        const description = orderDescription.trim();
        if (!description) {
            return;
        }

        const orderInputData: OrderInputData = {description: description};

        bookstoreApi.createOrder(orderInputData)
            .then(() => {
                fetchUserDtoMe();
                setOrderDescription('');
            })
            .catch((error: AxiosError) => handleLogError(error));
    }

    const fetchUserDtoMe = async () => {
        setIsLoading(true);

        bookstoreApi.getUserMe()
            .then((response) => setUserDtoMe(response.data))
            .catch((error: AxiosError) => handleLogError(error))
            .finally(() => setIsLoading(false));
    }

    if (getUserRole() !== 'USER') {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <Box pos='relative'>

                <LoadingOverlay visible={isLoading} />

                <Grid mb='md' align='center'>
                    <Grid.Col span={{ base: 12, sm: 3 }}>
                        <Group>
                            <IconDeviceLaptop size={28} />
                            <Title order={2}>Orders</Title>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 9 }}>
                        <OrderForm
                            orderDescription={orderDescription}
                            handleInputChange={handleInputChange}
                            handleCreateOrder={handleCreateOrder}
                            isLoading={isLoading}
                        />
                    </Grid.Col>
                </Grid>

                <UserOrderList orders={userDtoMe && userDtoMe.orders}/>

            </Box>
        </Container>
    )
}

export default UserOrdersPage;
