import React, { useState } from 'react';
import {
    Burger, BurgerButton, Button, Dropdown, DropdownMenuBody, DropdownMenuButton, FlexSpacer, GlobalMenu, IconContainer,
    MainMenu, MainMenuButton, MultiSwitch, Text, FlexRow, DropdownMenuHeader,
} from '@epam/uui';
import { Anchor, MainMenuCustomElement, useDocumentDir } from '@epam/uui-components';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';
import { TMode } from './docs/docsConstants';
import { useAppThemeContext } from '../helpers/appTheme';
import { ReactComponent as LogoIcon } from '../icons/logo.svg';
import { ReactComponent as GitIcon } from '@epam/assets/icons/external_logo/github-fill.svg';
import { ReactComponent as FigmaIcon } from '@epam/assets/icons/external_logo/figma-logo-outline-inverted.svg';
import { ReactComponent as DoneIcon } from '@epam/assets/icons/common/notification-done-18.svg';
import { ReactComponent as CommunicationStarOutlineIcon } from '@epam/assets/icons/communication-star-outline.svg';
import css from './AppHeader.module.scss';
import cx from 'classnames';

const GIT_LINK = 'https://github.com/epam/UUI';

type ContentDirection = 'rtl' | 'ltr';

export function AppHeader() {
    const { theme, toggleTheme, themesById } = useAppThemeContext();
    const dir = useDocumentDir();
    const [direction, setDirection] = useState<ContentDirection>(dir || 'ltr');

    const sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.trusted(link));
    };

    const changeContentDirection = (value: ContentDirection) => {
        setDirection(value);
        window.document.dir = value;
    };

    const renderBurger = () => {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;
        return (
            <>
                <BurgerButton caption="Home" link={ { pathname: '/' } } clickAnalyticsEvent={ () => sendEvent('Welcome') } />
                <BurgerButton
                    caption="Docs"
                    link={ { pathname: '/documents', query: { id: 'overview' } } }
                    isLinkActive={ pathName === 'documents' && !category }
                    clickAnalyticsEvent={ () => sendEvent('Documents') }
                />
                <BurgerButton
                    caption="Assets"
                    link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                    isLinkActive={ pathName === '/documents' && category === 'assets' }
                    clickAnalyticsEvent={ () => sendEvent('Assets') }
                />
                <BurgerButton
                    caption="Components"
                    link={ {
                        pathname: '/documents',
                        query: {
                            category: 'components', id: 'accordion', mode: TMode.doc,
                        },
                    } }
                    isLinkActive={ pathName === '/documents' && category === 'components' }
                    clickAnalyticsEvent={ () => sendEvent('Components') }
                />
                <BurgerButton caption="Demo" link={ { pathname: '/demo' } } isLinkActive={ pathName === '/demo' } clickAnalyticsEvent={ () => sendEvent('Demo') } />
            </>
        );
    };

    const renderThemeSwitcher = () => {
        return (
            <Dropdown
                renderBody={ (props) => (
                    <DropdownMenuBody { ...props } rawProps={ { style: { width: '180px', padding: '6px 0', marginTop: '3px' } } }>
                        { Object.values(themesById).map(({ id, name }) => (
                            <DropdownMenuButton
                                key={ id }
                                caption={ name }
                                icon={ theme === id && DoneIcon }
                                isActive={ theme === id }
                                iconPosition="right"
                                onClick={ () => toggleTheme(id) }
                            />
                        )) }
                    </DropdownMenuBody>
                ) }
                renderTarget={ (props) => (
                    <Button { ...props } cx={ css.themeSwitcherButton } caption={ themesById[theme]?.name } fill="none" isDropdown={ true } />
                ) }
                placement="bottom-end"
                key="Theme-switcher"
            />
        );
    };

    const renderDirectionSwitcher = () => {
        return (
            <FlexRow padding="12">
                <MultiSwitch value={ direction } onValueChange={ changeContentDirection } items={ [{ id: 'ltr', caption: 'LTR' }, { id: 'rtl', caption: 'RTL' }] } />
            </FlexRow>
        );
    };

    const getMainMenuItems = () => {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;

        return [
            {
                id: 'burger',
                priority: 100500,
                collapsedContainer: true,
                render: () => <Burger renderBurgerContent={ renderBurger } logoUrl="/static/logo.svg" key="burger" />,
            },
            {
                id: 'logo',
                priority: 100499,
                render: () => (
                    <MainMenuCustomElement key="logo">
                        <Anchor link={ { pathname: '/' } } href={ GIT_LINK } onClick={ () => sendEvent('Welcome') }>
                            <IconContainer icon={ LogoIcon } cx={ cx(css.icon, css.logo) } />
                        </Anchor>
                    </MainMenuCustomElement>
                ),
            },
            {
                id: 'documents',
                priority: 3,
                render: () => (
                    <MainMenuButton
                        caption="Docs"
                        link={ { pathname: '/documents', query: { id: 'overview' } } }
                        isLinkActive={ pathName === '/documents' && category !== 'components' && category !== 'assets' }
                        showInBurgerMenu
                        clickAnalyticsEvent={ analyticsEvents.header.link('Documents') }
                        key="documents"
                    />
                ),
            },
            {
                id: 'assets',
                priority: 2,
                render: () => (
                    <MainMenuButton
                        caption="Assets"
                        link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                        isLinkActive={ pathName === '/documents' && category === 'assets' }
                        showInBurgerMenu
                        clickAnalyticsEvent={ analyticsEvents.header.link('Assets') }
                        key="assets"
                    />
                ),
            },
            {
                id: 'components',
                priority: 2,
                render: () => (
                    <MainMenuButton
                        caption="Components"
                        link={ {
                            pathname: '/documents',
                            query: {
                                category: 'components', id: 'accordion', mode: 'doc',
                            },
                        } }
                        isLinkActive={ pathName === '/documents' && category === 'components' }
                        showInBurgerMenu
                        clickAnalyticsEvent={ analyticsEvents.header.link('Components') }
                        key="components"
                    />
                ),
            },
            {
                id: 'demo',
                priority: 2,
                render: () => (
                    <MainMenuButton
                        caption="Demo"
                        link={ { pathname: '/demo' } }
                        isLinkActive={ pathName === '/demo' }
                        showInBurgerMenu
                        clickAnalyticsEvent={ analyticsEvents.header.link('Demo') }
                        key="demo"
                    />
                ),
            },
            window.location.host.includes('localhost') && {
                id: 'Sandbox',
                priority: 1,
                render: () => <MainMenuButton caption="Sandbox" link={ { pathname: '/sandbox' } } isLinkActive={ pathName === '/sandbox' } key="sandbox" />,
            },
            { id: 'flexSpacer', priority: 100500, render: () => <FlexSpacer priority={ 100500 } key="spacer" /> },
            {
                id: 'figma',
                priority: 3,
                render: () => (
                    <Dropdown
                        renderTarget={ (props) => <MainMenuButton icon={ FigmaIcon } cx={ cx(css.icon, css.figmaIcon) } { ...props } /> }
                        renderBody={ (props) => (
                            <DropdownMenuBody { ...props }>
                                <DropdownMenuHeader caption="Open in" />
                                <DropdownMenuButton caption="Figma Community" href="https://www.figma.com/community/file/1380452603479283689/epam-uui-v5-7" target="_blank" />
                                <DropdownMenuButton caption="EPAM Team (employee only)" href="https://www.figma.com/design/M5Njgc6SQJ3TPUccp5XHQx/UUI-Components?m=auto&t=qiBDEE9slwMV4paI-6" target="_blank" />
                            </DropdownMenuBody>
                        ) }
                    />
                ),
            },
            {
                id: 'git',
                priority: 3,
                render: () => <MainMenuButton icon={ GitIcon } href={ GIT_LINK } target="_blank" cx={ cx(css.icon) } />,
            },
            {
                id: 'gitStar',
                priority: 0,
                render: () => (
                    <Anchor cx={ css.gitStarContainer } href={ GIT_LINK } target="_blank" onClick={ () => sendEvent(GIT_LINK) } key="gitstar">
                        <div className={ css.wrapper }>
                            <IconContainer icon={ CommunicationStarOutlineIcon } />
                            <Text cx={ css.starCaption }>Star on github</Text>
                        </div>
                    </Anchor>
                ),
            },
            {
                id: 'themeCaption',
                priority: 2,
                render: () => (
                    <MainMenuButton
                        cx={ css.themeCaption }
                        caption="Theme"
                        showInBurgerMenu
                        key="themeCaption"
                    />
                ),
            },
            { id: 'theme', priority: 3, render: renderThemeSwitcher },
            !window.location.host.includes('uui.epam.com') && {
                id: 'direction',
                priority: 2,
                render: renderDirectionSwitcher,
            },
            { id: 'globalMenu', priority: 100500, render: () => <GlobalMenu key="globalMenu" /> },
        ].filter((i) => !!i);
    };

    return <MainMenu cx={ css.root } items={ getMainMenuItems() }></MainMenu>;
}
