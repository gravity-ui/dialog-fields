import React from 'react';

const SizeContext = React.createContext<'s' | 'm' | 'l'>('m');

export const SizeProvider = SizeContext.Provider;

export function useSize() {
    const size = React.useContext(SizeContext);
    return {size};
}
