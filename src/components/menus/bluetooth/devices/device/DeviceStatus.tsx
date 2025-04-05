import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';

export const DeviceStatus = ({ device }: DeviceStatusProps): JSX.Element => {
    const revealerBinding = Variable.derive(
        [bind(device, 'connected'), bind(device, 'paired')],
        (connected, paired) => {
            return connected || paired;
        },
    );

    const labelBinding = Variable.derive(
        [bind(device, 'connected'), bind(device, 'batteryPercentage')],
        (connected, batteryPercentage) => {
            return connected
                ? 'Connected' + (batteryPercentage >= 0 ? ` (${Math.floor(batteryPercentage * 100)}%)` : '')
                : 'Paired';
        },
    );

    return (
        <revealer
            halign={Gtk.Align.START}
            revealChild={revealerBinding()}
            onDestroy={() => {
                revealerBinding.drop();
                labelBinding.drop();
            }}
        >
            <label
                halign={Gtk.Align.START}
                className={'connection-status dim'}
                label={labelBinding().as((label) => label)}
            />
        </revealer>
    );
};

interface DeviceStatusProps {
    device: AstalBluetooth.Device;
}
