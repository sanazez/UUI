import { IThemeVar } from '../themeTokensGen/types/sharedTypes';
import { PATH } from '../themeTokensGen/constants';

export type TVar = { token: IThemeVar, name: string, value: string };
export type TVarGroup = { title: string, items: TVar[] };
export type TMainGroupConfig = {
    title: string,
    condition: (token: IThemeVar) => boolean,
    showInnerGroupTitle: boolean,
    getInnerGroupId: (v: TVar) => string
};

export const TOKENS_MIXIN_NAME = 'theme-tokens';

const THEME_TOKENS_DIR = './epam-assets/theme/tokens';

export const tokensFile = PATH.FIGMA_VARS_COLLECTION_OUT_TOKENS;
export const getThemeMixinsFilePath = (themeName: string) => {
    const themeNameNorm = themeName.toLowerCase().replaceAll('-', '_');
    return `${THEME_TOKENS_DIR}/_theme_${themeNameNorm}.scss`;
};

const getInnerGroupIdLevel2 = (v: TVar) => {
    const idSplit = v.token.id.split('/');
    return idSplit.length >= 3 ? idSplit.slice(0, 2).join('/') : '';
};

export const GROUPS_CONFIG: Record<string, TMainGroupConfig> = {
    palette: {
        title: 'Palette',
        condition: (token) => {
            return ['palette/', 'palette-additional/'].some((t) => token.id.indexOf(t) === 0);
        },
        showInnerGroupTitle: true,
        getInnerGroupId: getInnerGroupIdLevel2,
    },
    coreSemantic: {
        title: 'Core Semantic',
        condition: (token) => {
            return token.id.indexOf('core/semantic/') === 0;
        },
        showInnerGroupTitle: true,
        getInnerGroupId: (v) => {
            const suffix = v.token.id.split('/')[2].split('-')[0];
            return `core/semantic/${suffix}-`;
        },
    },
    coreNeutral: {
        title: 'Core Neutral',
        condition: (token) => {
            return token.id.indexOf('core/neutral/') === 0;
        },
        showInnerGroupTitle: false,
        getInnerGroupId: () => '',
    },
    core: {
        title: 'Core',
        condition: (token) => {
            return token.id.indexOf('core/') === 0;
        },
        showInnerGroupTitle: true,
        getInnerGroupId: getInnerGroupIdLevel2,
    },
    fallback: {
        title: '',
        condition: () => true,
        showInnerGroupTitle: true,
        getInnerGroupId: getInnerGroupIdLevel2,
    },
};
