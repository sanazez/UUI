import { IMap, LazyDataSourceApi } from '../../../../types';
import { ItemsMap } from './ItemsMap';
import { FAILED_RECORD, LOADED_RECORD, LOADING_RECORD, NOT_FOUND_RECORD, PENDING_RECORD, newMap } from './newTree';
import { TreeParams } from './newTree/exposed';
import { RecordStatus } from './types';

export class ItemsStatusCollector<TItem, TId, TFilter = any> {
    private itemsStatusMap: IMap<TId, RecordStatus>;
    constructor(
        itemsStatusMap: IMap<TId, RecordStatus>,
        private params: TreeParams<TItem, TId>,
    ) {
        this.itemsStatusMap = itemsStatusMap ?? newMap(params);
    }

    public setPending(ids: TId[]) {
        this.setStatus(ids, PENDING_RECORD);
    }

    public setLoading(ids: TId[]) {
        this.setStatus(ids, LOADING_RECORD);
    }

    public setLoaded(ids: TId[]) {
        this.setStatus(ids, LOADED_RECORD);
    }

    public setFailed(ids: TId[]) {
        this.setStatus(ids, FAILED_RECORD);
    }

    public getItemStatus = (itemsMap: ItemsMap<TId, TItem>) => (id: TId) => {
        if (itemsMap.has(id)) {
            return LOADED_RECORD;
        }

        const status = this.itemsStatusMap.get(id) ?? NOT_FOUND_RECORD;
        if (status === LOADED_RECORD) {
            return LOADING_RECORD;
        }

        return status;
    };

    public watch(api: LazyDataSourceApi<TItem, TId, TFilter>): LazyDataSourceApi<TItem, TId, TFilter> {
        return async (request, context) => {
            if (request.ids) {
                try {
                    this.setLoading(request.ids);
                    const result = await api(request, context);
                    this.setLoaded((result.items ?? []).map(this.params.getId));

                    return result;
                } catch (e) {
                    this.setFailed(request.ids);
                    throw e;
                }
            }

            return await api(request, context);
        };
    }

    private setStatus(ids: TId[], status: RecordStatus) {
        ids.forEach((id) => {
            this.itemsStatusMap.set(id, status);
        });
    }
}
