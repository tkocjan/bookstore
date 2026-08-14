import {
    Grid,
    Title,
    Card,
    Text,
    Stack,
    Box,
    Skeleton,
    ScrollArea,
} from '@mantine/core'
import type {BookDto} from "../misc/BookstoreApi.ts";
import BookCover from '../misc/BookCover'

type CartListProps = {
    books: BookDto[],
}

export default function CartList(props: CartListProps)
{
    const {
        books,
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
        <Box pos='relative'>
            <ScrollArea p="md" h="calc(100vh - 235px)"
                        bd="1px solid var(--mantine-color-blue-6)"
            >
                <Stack gap='sm'>{bookList}</Stack>
            </ScrollArea>
        </Box>
    )
}
