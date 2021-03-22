import React, { useCallback, useMemo, useState } from "react";
import css from './DemoTable.scss';
import { LazyDataSource, DataRowProps, DataRowOptions, cx } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';
import { FlexRow, DataTable, DataTableRow, IconButton } from '@epam/promo';
import filterIcon from "@epam/assets/icons/common/content-filter_list-24.svg";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { getFilters, presets, api } from "./data";
import { getColumns } from "./columns";
import { PersonsTableState, PersonTableRecord, PersonTableRecordId } from './types';
import { Panel } from "./Panel";
import { Presets } from "./Presets";
import { SidebarPanel } from "./SidebarPanel";

export const DemoTable: React.FC = () => {
    const [value, setValue] = useState<PersonsTableState>(() => ({
        topIndex: 0,
        visibleCount: 100,
        sorting: [{ field: 'name' }],
        isFolded: true,
    }));

    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
    const openPanel = useCallback(() => setIsFilterPanelOpened(true), []);
    const closePanel = useCallback(() => {
        Promise.resolve(false)
            .then((value) => {
                setTimeout(() => setIsFilterPanelOpened(value), 500);
            });
    }, []);

    const [infoPanelId, setInfoPanelId] = useState<number | null>(null);
    const [isInfoPanelOpened, setInfoPanelOpened] = useState<boolean>(false);

    const openInfoPanel = useCallback((id) => {
        setInfoPanelId(id);
        setInfoPanelOpened(true);
    }, []);

    const closeInfoPanel = useCallback(() => {
        Promise.resolve(false)
            .then(value => setInfoPanelOpened(value))
            .then(() => {
                setTimeout(() => setInfoPanelId(null), 500);
            });
    }, []);

    const [filters] = useState(getFilters());
    const [columnsSet] = useState(getColumns(filters, openInfoPanel));

    let dataSource = useMemo(() => new LazyDataSource({
        api,
        getId: (i) => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: (item: PersonTableRecord) =>
            item.__typename === 'PersonGroup' ? item.count : null,
    }), []);

    const rowOptions: DataRowOptions<PersonTableRecord, PersonTableRecordId> = {
        checkbox: { isVisible: true },
        onClick: (rowProps: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
            if (infoPanelId === rowProps.id[1]) {
                closeInfoPanel();
            }
            openInfoPanel(rowProps.id[1]);
        },
    };

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        let columns = (props.isLoading || props.value?.__typename === 'Person') ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size='36' columns={ columns }/>;
    };

    const personsDataView = dataSource.useView(value, setValue, {
        rowOptions,
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    const renderActiveRowDataSidebarPanel = () => {
        const data = dataSource.getById(['Person', infoPanelId]) as Person;
        return <SidebarPanel data={ data } onClose={ closeInfoPanel } />;
    };

    return (
        <FlexRow cx={ css.wrapper } alignItems="top">
            { isFilterPanelOpened && <div className={ cx(css.filterSidebarPanelWrapper, isFilterPanelOpened ? 'show' : 'hide') }>
                <Panel
                    filters={ filters }
                    close={ closePanel }
                    value={ value }
                    onValueChange={ setValue }
                />
            </div> }
            <div className={ css.container }>
                <FlexRow background='white' borderBottom >
                    { !isFilterPanelOpened && (
                        <div className={ css.iconContainer }>
                            <IconButton icon={ filterIcon } color="gray50" cx={ [css.icon] } onClick={ openPanel }/>
                        </div>
                    ) }
                    <Presets presets={ presets }/>
                </FlexRow>
                <DataTable
                    headerTextCase='upper'
                    getRows={ () => personsDataView.getVisibleRows() }
                    columns={ columnsSet.personColumns }
                    renderRow={ renderRow }
                    selectAll={ { value: false, isDisabled: true, onValueChange: null } }
                    showColumnsConfig
                    value={ value }
                    onValueChange={ setValue }
                    { ...personsDataView.getListProps() }
                />
            </div>
            { infoPanelId && <div className={ cx(css.infoSidebarPanelWrapper, isInfoPanelOpened ? 'show' : 'hide') }>
                { infoPanelId && renderActiveRowDataSidebarPanel() }
            </div> }
        </FlexRow>
    );
};