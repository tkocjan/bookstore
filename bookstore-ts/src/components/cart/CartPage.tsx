import {
    useEffect, useState, useCallback,
} from 'react'
import {Navigate} from 'react-router'
import {
    ActionIcon,
    Box,
    Container,
    Flex,
    Grid,
    LoadingOverlay,
    Pagination,
    Paper,
    TextInput,
    Title
} from '@mantine/core'
import type {AxiosError} from "axios";
import {useTranslation} from "react-i18next";

import CartList from './CartList'
import {getUserRole} from '../context/AuthContext'
import {bookstoreApi, type GetBooksParams, PAGE_SIZE} from '../misc/BookstoreApi.js'
import {handleLogError} from '../misc/Helpers'
import {IconSearch, IconShoppingCart} from "@tabler/icons-react";

export default function CartPage()
{
    const {t} = useTranslation("common");

    const [books, setBooks] = useState([])
    const [bookTextSearch, setBookTextSearch] = useState('')
    const [isBooksLoading, setIsBooksLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        handleGetBooks()
    }, [currentPage, bookTextSearch])

    const handleGetBooks = useCallback(async () => {
        setIsBooksLoading(true);

        const getBooksParams = {
            currentPage: currentPage,
            pageSize: PAGE_SIZE,
        } as GetBooksParams;

        if (bookTextSearch !== '') {
            getBooksParams.text = bookTextSearch;
        }

        bookstoreApi.getBooks(getBooksParams)
            .then((response) => {
                setBooks(response.data.content);
                setTotalPages(response.data.page.totalPages);
            })
            .catch((error: AxiosError) => handleLogError(error))
            .finally(() => setIsBooksLoading(false));

    }, [currentPage, bookTextSearch]);

    if (getUserRole() !== 'USER') {
        return <Navigate to='/'/>
    }

    return (
        <Container>
            <Paper
                withBorder
                p='md'
                mt='xs'
                radius='md'
                style={{borderColor: 'var(--mantine-color-blue-6)'}}
            >
                <Box pos='relative'>

                    <LoadingOverlay visible={isBooksLoading}/>
                    <Grid mb='md' align='center'>
                        <Grid.Col span={{base: 12, sm: 3}}>
                            <Title order={2}>
                                <IconShoppingCart
                                    size={24}
                                    style={{ marginRight: 8, verticalAlign: 'middle' }}
                                />
                                {t("Shopping Cart")}
                            </Title>
                        </Grid.Col>
                        <Grid.Col span={{base: 12, sm: 9}}>
                            <TextInput
                                placeholder='Search by ISBN or Title'
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key !== 'Enter') {
                                        return;
                                    }

                                    if (searchText !== bookTextSearch) {
                                        setCurrentPage(1);
                                        setBookTextSearch(searchText);
                                    }
                                }}
                                rightSection={
                                    <ActionIcon aria-label="Search" style={{cursor: 'pointer'}}
                                        onClick={() => {
                                            if (searchText !== bookTextSearch) {
                                                setCurrentPage(1);
                                                setBookTextSearch(searchText);
                                            }
                                        }}
                                    >
                                        <IconSearch size={16}/>
                                    </ActionIcon>
                                }
                            />
                        </Grid.Col>
                    </Grid>

                    <CartList books={books}/>

                    <Flex justify="flex-end">
                        <Pagination value={currentPage} total={totalPages} onChange={setCurrentPage} size="xs" mt="xs"/>
                    </Flex>

                </Box>
            </Paper>
        </Container>
    )
}
