import React from 'react';

import {useStableEventHandler} from '../../helpers/useStableEventHendler';
import {applyFunctions} from '../Dialog/utils';

function noop() {}

export interface FocusBlurContainerProps {
    children?: React.ReactNode;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}
export function FocusBlurContainer({
    children,
    className,
    onFocus,
    onBlur = noop,
}: FocusBlurContainerProps) {
    const [focused, setFocused] = React.useState(false);

    const handleBlur = useStableEventHandler(
        applyFunctions(onBlur, () => {
            setFocused(false);
        }),
    );

    const handleFocus = useOnFocusOutside(handleBlur, focused);
    const handleClick = useOnClickOutside(handleBlur, focused);

    return (
        <div
            className={className}
            onFocus={applyFunctions(handleFocus, onFocus, () => {
                setFocused(true);
            })}
            onClick={handleClick}
        >
            {children}
        </div>
    );
}

function useOnFocusOutside(onFocusOutside: () => void, enable = true) {
    const capturedRef = React.useRef(false);

    React.useEffect(() => {
        if (enable) {
            const handleFocus = function () {
                capturedRef.current = false;
                window.setTimeout(() => {
                    if (!capturedRef.current) {
                        onFocusOutside();
                    }
                }, 0);
            };

            window.addEventListener('focus', handleFocus, {capture: true});

            return () => {
                window.removeEventListener('focus', handleFocus, {capture: true});
            };
        }

        return undefined;
    }, [enable, onFocusOutside]);

    return React.useCallback(() => {
        capturedRef.current = true;
    }, []);
}

function useOnClickOutside(onClickOutside: () => void, enable = true) {
    const capturedRef = React.useRef(false);

    React.useEffect(() => {
        if (enable) {
            const handleClick = function () {
                capturedRef.current = false;
                window.setTimeout(() => {
                    if (!capturedRef.current) {
                        onClickOutside();
                    }
                }, 0);
            };

            window.addEventListener('click', handleClick, {capture: true});

            return () => {
                window.removeEventListener('click', handleClick, {capture: true});
            };
        }

        return undefined;
    }, [enable, onClickOutside]);

    return React.useCallback(() => {
        capturedRef.current = true;
    }, []);
}
