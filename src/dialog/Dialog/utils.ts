import _find from 'lodash/find';

const TAB_ID = 'id';

interface TabData {
    [TAB_ID]: string;
}

export function getTabId(tabValues: TabData) {
    return tabValues[TAB_ID];
}

export function checkTabId(newTabData: TabData, tabs: TabData[]) {
    const id = getTabId(newTabData);
    if (id === undefined) {
        throw new Error('id field must be defined');
    }

    const tab = _find(tabs, (tab) => id === getTabId(tab));
    if (tab) {
        throw new Error('id of a tab must be unique');
    }
}

export function applyFunctions<T extends (...args: unknown[]) => void>(...fns: (T | undefined)[]) {
    return (...args: Parameters<T>) => fns.forEach((fn) => fn?.(...args));
}
