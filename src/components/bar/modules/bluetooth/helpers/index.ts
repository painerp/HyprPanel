import { BluetoothIcons } from 'src/lib/types/bluetooth';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';

export const bluetoothIcons: BluetoothIcons = {
    100: '󰥈',
    90: '󰥆',
    80: '󰥅',
    70: '󰥄',
    60: '󰥃',
    50: '󰥂',
    40: '󰥁',
    30: '󰥀',
    20: '󰤿',
    10: '󰤾',
    0: '󰥇',
    battery_error: '󰥊',
    connected: '󰂱',
    on: '󰂯',
    off: '󰂲',
};

/**
 * Retrieves the appropriate Bluetooth icon based on the Bluetooth state and device connection status.
 *
 * @param icons Array of icons.
 * @param isPowered A boolean indicating whether Bluetooth is powered on.
 * @param devices Array of Bluetooth devices.
 * @param batteryPercentage The battery percentage of the connected device.
 */
export const getIcon = (
    icons: BluetoothIcons,
    isPowered: boolean,
    devices: AstalBluetooth.Device[],
    batteryPercentage: number | null = null,
): string => {
    if (!isPowered) return icons.off;
    if (devices.length === 0) return icons.on;

    const connectedDevices = devices.filter((device) => device.connected);
    if (connectedDevices.length === 0) return icons.on;
    if (batteryPercentage === null) return icons.connected;

    const keys: number[] = Object.keys(icons)
        .map(Number)
        .filter((f) => !isNaN(f))
        .reverse();
    const batteryIcon: number | undefined = keys.find((threshold) => threshold <= Math.floor(batteryPercentage * 100));
    return batteryIcon !== undefined ? icons[batteryIcon] : icons.battery_error;
};
