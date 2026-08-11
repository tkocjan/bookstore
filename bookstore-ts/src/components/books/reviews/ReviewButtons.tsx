import {Button, Popover, Select, Stack} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates';
import {useTranslation} from "react-i18next";


function ReviewButtons()
{
    const {t} = useTranslation("common");

    return (
    <Stack>
        <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <Button size='xs'>{t('Create Review')}</Button>
            </Popover.Target>

            <Popover.Dropdown bg="var(--mantine-color-body)">
                <Select
                    label={t("Select within Popover")}
                    placeholder={t("Select within Popover")}
                    comboboxProps={{ withinPortal: false }}
                    data={[t('React'), 'Angular', 'Svelte', 'Vue']}
                />
                <DatePickerInput
                    label={t("DatePickerInput within Popover")}
                    placeholder={t("DatePickerInput within Popover")}
                    popoverProps={{ withinPortal: false }}
                    mt="md"
                />
            </Popover.Dropdown>
        </Popover>

        <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <Button size='xs'>{t('Read Reviews')}</Button>
            </Popover.Target>
            <Popover.Dropdown bg="var(--mantine-color-body)">
                <Select
                    label={t("Select within Popover")}
                    placeholder={t("Select within Popover")}
                    comboboxProps={{ withinPortal: false }}
                    data={[t('React'), 'Angular', 'Svelte', 'Vue']}
                />
                <DatePickerInput
                    label={t("DatePickerInput within Popover")}
                    placeholder={t("DatePickerInput within Popover")}
                    popoverProps={{ withinPortal: false }}
                    mt="md"
                />
            </Popover.Dropdown>
        </Popover>
    </Stack>
);

}

export default ReviewButtons
