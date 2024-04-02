import React from 'react';

export function useStableEventHandler<TFunc extends (...args: unknown[]) => void>(
    func: TFunc | undefined,
) {
    const ref = React.useRef<TFunc | undefined>(undefined);

    React.useEffect(() => {
        ref.current = func;
        return () => {
            ref.current = undefined;
        };
    }, [func]);

    return React.useCallback((...args: Parameters<TFunc>) => {
        return ref.current?.(...args);
    }, []);
}
