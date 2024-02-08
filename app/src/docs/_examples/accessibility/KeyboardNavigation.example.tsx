import React, { useState } from 'react';
import { Location } from '@epam/uui-docs';
import { useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, PickerInput, Button, FlexRow } from '@epam/uui';
import { TApi } from '../../../data';

export default function AsyncPickerInputExample() {
    const svc = useUuiContext<TApi>();
    const [locations, setLocations] = useState<string[]>([]);

    const locationsDataSource = useAsyncDataSource<Location, string, unknown>(
        {
            api: () => svc.api.demo.locations({}).then((res) => res.items),
        },
        [],
    );

    return (
        <FlexRow spacing="12">
            <PickerInput<Location, string>
                dataSource={ locationsDataSource }
                value={ locations }
                onValueChange={ setLocations }
                entityName="location"
                selectionMode="multi"
                valueType="id"
            />
            <FlexCell>
                <Button caption="Save" onClick={ () => {} } color="primary" />
            </FlexCell>
        </FlexRow>

    );
}
