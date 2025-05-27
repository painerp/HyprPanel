export const outputIcons: Record<number, string> = {
    101: '󱄠',
    66: '󰕾',
    34: '󰖀',
    1: '󰕿',
    0: '󰝟',
};

export const inputIcons: Record<number, string> = {
    51: '󰍬',
    1: '󰍮',
    0: '󰍭',
};

/**
 * Retrieves the appropriate volume icon based on the volume level and mute status.
 *
 * This function returns the corresponding volume icon based on the provided volume level and mute status.
 * It uses predefined mappings for volume icons.
 *
 * @param icons Array of icons.
 * @param isMuted A boolean indicating whether the volume is muted.
 * @param vol The current volume level as a number between 0 and 1.
 *
 * @returns The corresponding volume icon as a string.
 */
export const getIcon = (icons: Record<number, string>, isMuted: boolean, vol: number): string => {
    if (isMuted) return icons[0];
    const keys: number[] = Object.keys(icons).map(Number).reverse();
    const icon: number = keys.find((threshold) => threshold <= Math.round(vol * 100)) ?? keys[0];
    return icons[icon];
};
