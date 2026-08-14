import type {ChangeEvent as ReactChangeEvent, SubmitEvent as ReactSubmitEvent} from "react";
import {Group, TextInput, Button} from '@mantine/core'
import {useTranslation} from "react-i18next";

import {IconPlus} from '@tabler/icons-react'

type OrderFormProps = {
    orderDescription: string;
    handleInputChange: (e: ReactChangeEvent<HTMLInputElement>) => void;
    handleCreateOrder: (e: ReactSubmitEvent) => void;
    isLoading: boolean;
}

export default function OrderForm({
   orderDescription,
   handleInputChange,
   handleCreateOrder,
   isLoading
}: OrderFormProps) {
    const {t} = useTranslation("common");

    const createBtnDisabled = isLoading || orderDescription.trim() === ''
    return (
        <form onSubmit={handleCreateOrder}>
            <Group>
                <TextInput
                    name='orderDescription'
                    placeholder={t("Description") + " *"}
                    value={orderDescription}
                    onChange={handleInputChange}
                />
                <Button
                    type='submit'
                    leftSection={<IconPlus size={16}/>}
                    disabled={createBtnDisabled}
                    color='violet'
                >
                    {t("Create")}
                </Button>
            </Group>
        </form>
    )
}
