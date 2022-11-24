import {I18N, Params} from '@gravity-ui/i18n';
import {Lang, subscribeConfigure} from './configure';

const i18n = new I18N();

subscribeConfigure((config) => {
    i18n.setLang(config.lang);
});

type KeysetData = Parameters<typeof i18n.registerKeyset>[2];

export function makeKeyset<Keyset extends KeysetData>(
    component: string,
    {ru, en}: Record<Lang, Keyset>,
) {
    i18n.registerKeyset('ru', component, ru);
    i18n.registerKeyset('en', component, en);

    return i18n.keyset(component) as (key: keyof Keyset, params?: Params) => string;
}
