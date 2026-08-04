import {Select} from '@mantine/core';
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";


export function LanguageSwitcher() {
    const { i18n: i18nInstance } = useTranslation();

    return (
        <Select defaultValue={i18nInstance.language} allowDeselect={false} size='xs' w='10ch'
            data={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
            ]}
            onChange={(value) => i18n.changeLanguage(value as string)}
        />
    );
}
