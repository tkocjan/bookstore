import {
    Grid,
    Title,
    Card,
    Text,
    Stack,
    Skeleton,
    Button, Group,
} from '@mantine/core'
import type {BookDto} from "../misc/BookstoreApi.ts";
import BookCover from '../misc/BookCover'
import {useTranslation} from "react-i18next";
import CreateReview from "@/components/books/reviews/CreateReview.tsx";
import ReadReviews from "@/components/books/reviews/ReadReviews.tsx";

type BookListProps = {
    books: BookDto[],
}

export default function BookList(props: BookListProps)
{
    const {
        books,
    } = props;

    const {t} = useTranslation("common");

    if (books.length === 0) {
        return <Text c='dimmed'>{t('No books')}</Text>;
    }

    const bookList = books.map((book) => (
        <Card key={book.isbn} shadow='sm' padding='sm' radius='md' withBorder>
            <Grid align='center'>

                <Grid.Col span='content'>
                    <BookCover isbn={book.isbn} w={60} h={80}/>
                </Grid.Col>

                <Grid.Col span='auto'>
                    <Stack gap={4}>
                        <Group justify="space-between" w="100%">
                            <Title order={5}>{book.title}</Title>
                            <Button color="red" justify="flex-end" size='xs'>{t('Add To Cart')}</Button>
                        </Group>

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

                <Grid.Col span='content'>
                    <Stack>
                        <CreateReview isbn={book.isbn} bookTitle={book.title}/>
                        <ReadReviews isbn={book.isbn}/>
                    </Stack>
                </Grid.Col>

            </Grid>
        </Card>
    ))

    return (
        <Stack gap='sm'>{bookList}</Stack>
    );
}
