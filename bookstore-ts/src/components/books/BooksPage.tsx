import {
    useEffect, useState, useCallback,
} from 'react'
import {
    ActionIcon,
    Box,
    Container,
    Flex,
    Grid, Group,
    LoadingOverlay, NumberInput,
    Pagination,
    Paper, ScrollArea, Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core'
import type {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {IconBook, IconSearch} from "@tabler/icons-react";

import {type BookDto, bookstoreApi, type GetBooksParams, PAGE_SIZE} from '../misc/BookstoreApi'
import BookList from './BookList.tsx'
import {handleLogError} from '../misc/Helpers'

export default function BooksPage()
{
    const {t} = useTranslation("common");

    const [books, setBooks] = useState<BookDto[]>([]);
    const [bookTextSearch, setBookTextSearch] = useState<string>('');
    const [isBooksLoading, setIsBooksLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        handleGetBooks()
    }, [currentPage, bookTextSearch])

    const handleGetBooks = useCallback(() => {
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
                                <IconBook
                                    size={24}
                                    style={{ marginRight: 8, verticalAlign: 'middle' }}
                                />
                                {t("Books")}
                            </Title>
                        </Grid.Col>
                        <Grid.Col span={{base: 12, sm: 9}}>
                            <TextInput
                                placeholder={t("Search by ISBN or Title")}
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

                    <Box pos='relative'>
                        <ScrollArea p="md" h="calc(100vh - 235px)"
                                    bd="1px solid var(--mantine-color-blue-6)"
                        >
                            <BookList books={books}/>
                        </ScrollArea>
                    </Box>


                    {/*<BookList books={books}/>*/}

                    <Flex justify="flex-end">
                        <Group>
                        <Pagination value={currentPage} total={totalPages} onChange={setCurrentPage} size="xs" mt="sm"/>
                        <Stack gap={0}>
                            <Text size="xs" p={0} ta="center">{t("Page")}</Text>
                            <NumberInput size="xs" p={0}
                                value={currentPage}
                                onChange={(val) => {
                                    if (typeof val === 'number') {
                                        setCurrentPage(Math.min(Math.max(val, 1), totalPages));
                                    }
                                }}
                                min={1}
                                max={totalPages}
                                style={{ width: 50 }}
                                aria-label="Jump to page"
                            />
                        </Stack>
                        </Group>
                    </Flex>

                </Box>
            </Paper>
        </Container>
    )
}
