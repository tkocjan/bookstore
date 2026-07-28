import {useEffect, useState} from 'react'
import {
    SimpleGrid,
    Paper,
    Text,
    Container,
    Box,
    LoadingOverlay
} from '@mantine/core'
import {IconUsers, IconDeviceLaptop} from '@tabler/icons-react'
import {bookstoreApi} from '../misc/BookstoreApi.ts'
import {handleLogError} from '../misc/Helpers.ts'
import type {AxiosError} from "axios";

function Home() {
    const [numberOfUsers, setNumberOfUsers] = useState(null)
    const [numberOfOrders, setNumberOfOrders] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        bookstoreApi.numberOfUsers()
            .then((response) =>  setNumberOfUsers(response.data))
            .catch((error: AxiosError) => handleLogError(error));
        bookstoreApi.numberOfOrders()
            .then((response) =>  setNumberOfOrders(response.data))
            .catch((error: AxiosError) => handleLogError(error));
    }, [])

    useEffect(() => {
        if (isLoading && numberOfUsers !== null && numberOfOrders !== null) {
            setIsLoading(false);
        }

    }, [numberOfUsers, numberOfOrders, isLoading]);

    return (
        <Container size='sm' mt='xl'>
            <Box pos='relative' mih={120}>
                <LoadingOverlay visible={isLoading}/>
                <SimpleGrid cols={{base: 1, sm: 2}}>
                    <Paper withBorder p='xl' radius='md' ta='center'>
                        <IconUsers size={32} color='gray'/>
                        <Text size='3rem' fw={700}>
                            {numberOfUsers}
                        </Text>
                        <Text c='dimmed'>Users</Text>
                    </Paper>
                    <Paper withBorder p='xl' radius='md' ta='center'>
                        <IconDeviceLaptop size={32} color='gray'/>
                        <Text size='3rem' fw={700}>
                            {numberOfOrders}
                        </Text>
                        <Text c='dimmed'>Orders</Text>
                    </Paper>
                </SimpleGrid>
            </Box>
        </Container>
    )
}

export default Home
