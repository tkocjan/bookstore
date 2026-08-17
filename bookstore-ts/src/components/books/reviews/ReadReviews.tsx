import {Button, Modal} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import {useTranslation} from "react-i18next";

type ReadReviewsProps = {
    isbn: String,
}

export default function ReadReviews(props: ReadReviewsProps)
{
    const {t} = useTranslation("common");

    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Button size='xs' onClick={open}>
                {t('Read Reviews')}
            </Button>
            <Modal opened={opened} onClose={close} title={t('Read Reviews, ISBn = ') + props.isbn}>
                {/* Modal content */}
            </Modal>
        </>
    );
}
