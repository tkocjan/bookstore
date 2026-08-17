import {Button, Checkbox, Grid, Group, Modal, Stack, Text, TextInput, Title} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {useTranslation} from "react-i18next";
import BookCover from "@/components/misc/BookCover.tsx";

type CreateReviewProps = {
    isbn: string,
    bookTitle: string,
}

export default function CreateReview(props: CreateReviewProps)
{
    const {t} = useTranslation("common");

    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            isbn: props.isbn,
            email: '',
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <>
            <Button size='xs' onClick={open}>
                {t('Create Review')}
            </Button>
            <Modal opened={opened} onClose={close} title={t('Write a Review')}>
                <Stack>
                    <Grid align='center'>
                        <Grid.Col span='content'>
                            <BookCover isbn={props.isbn} w={60} h={80}/>
                        </Grid.Col>

                        <Grid.Col span='auto'>
                            <Stack gap={4}>
                                <Title order={5}>{props.bookTitle}</Title>

                                <Text size='sm' c='dimmed'>
                                    {props.isbn}
                                </Text>
                            </Stack>
                        </Grid.Col>
                    </Grid>

                    <form onSubmit={form.onSubmit((values) => console.log(values))}>
                        <TextInput
                            type="hidden"
                            key={form.key('isbn')}
                            {...form.getInputProps('isbn')}
                        />

                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="your@email.com"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />

                        <Checkbox
                            mt="md"
                            label="I agree to sell my privacy"
                            key={form.key('termsOfService')}
                            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                        />

                        <Group justify="flex-end" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>

                </Stack>
            </Modal>
        </>
    );
}
