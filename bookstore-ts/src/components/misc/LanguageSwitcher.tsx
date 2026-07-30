import i18n from "../../i18n";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
    const { i18n: i18nInstance } = useTranslation();

    return (
        <select
            value={i18nInstance.language}
            onChange={(e) =>
                i18n.changeLanguage(e.target.value)
            }
        >
            <option value="en">English</option>
            <option value="es">Español</option>
        </select>
    );
}
