import React from 'react';

function error() {
    throw new Error('Cannot call an event handler while rendering or after unmount.');
}

export function useStableEventHandler<TFunc extends (...args: unknown[]) => void>(
    func: TFunc | undefined,
) {
    const ref = React.useRef<TFunc | undefined>(error as any);

    React.useEffect(() => {
        ref.current = func;
        return () => {
            ref.current = error as any;
        };
    }, [func]);

    return React.useCallback((...args: Parameters<TFunc>) => {
        return ref.current?.(...args);
    }, []);
}
