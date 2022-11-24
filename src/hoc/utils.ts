export function getDisplayName(Component: {displayName?: string; name?: string}) {
    return Component.displayName || Component.name || 'Component';
}
