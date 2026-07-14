import {
    Grid,
    Title,
    TextInput,
    ActionIcon,
    Card,
    Text,
    Stack,
    Box,
    LoadingOverlay,
    Skeleton,
    Paper
} from '@mantine/core'
import {IconBook, IconSearch} from '@tabler/icons-react'
import BookCover from '../misc/BookCover'
import type {SubmitEvent as ReactSubmitEvent, ChangeEvent as ReactChangeEvent} from "react";
import type {IBookDto} from "../misc/BookstoreApi.ts";

interface BookListProps
{
    isBooksLoading: boolean;
    bookTextSearch: string;
    books: IBookDto[],
    handleInputChange: (e: ReactChangeEvent<HTMLInputElement>) => void,
    handleSearchBook: (e: ReactSubmitEvent) => Promise<void>;
}

// function BookList({
//     isBooksLoading,
//     bookTextSearch,
//     books,
//     handleInputChange,
//     handleSearchBook
// }: BookListProps) {

function BookList(props: BookListProps)
{
    const {
        isBooksLoading,
        bookTextSearch,
        books,
        handleInputChange,
        handleSearchBook
    } = props;

    let bookList
    if (books.length === 0) {
        bookList = <Text c='dimmed'>No book</Text>
    } else {
        bookList = books.map((book) => (
            <Card key={book.isbn} shadow='sm' padding='sm' radius='md' withBorder>
                <Grid align='center'>
                    <Grid.Col span='content'>
                        <BookCover isbn={book.isbn} w={60} h={80}/>
                    </Grid.Col>
                    <Grid.Col span='auto'>
                        <Stack gap={4}>
                            <Title order={5}>{book.title}</Title>
                            <Text size='sm' c='dimmed'>
                                {book.isbn}
                            </Text>
                            <Skeleton height={8} mt={4} radius='xl' animate={false}/>
                            <Skeleton
                                height={8}
                                mt={4}
                                radius='xl'
                                width='70%'
                                animate={false}
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Card>
        ))
    }

    return (
        <Paper
            withBorder
            p='md'
            mt='md'
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
                                style={{marginRight: 8, verticalAlign: 'middle'}}
                            />
                            Books
                        </Title>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, sm: 9}}>
                        <form onSubmit={handleSearchBook}>
                            <TextInput
                                name='bookTextSearch'
                                placeholder='Search by ISBN or Title'
                                value={bookTextSearch}
                                onChange={handleInputChange}
                                rightSection={
                                    <ActionIcon type='submit' variant='subtle'>
                                        <IconSearch size={16}/>
                                    </ActionIcon>
                                }
                            />
                        </form>
                    </Grid.Col>
                </Grid>
                <Stack gap='sm'>{bookList}</Stack>
            </Box>
        </Paper>
    )
}

export default BookList
