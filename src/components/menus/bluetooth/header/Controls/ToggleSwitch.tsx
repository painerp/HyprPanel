import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { exec } from 'astal/process';

const bluetoothService = AstalBluetooth.get_default();

const isPowered = Variable(false);

Variable.derive([bind(bluetoothService, 'isPowered')], (isOn) => {
    return isPowered.set(isOn);
});

const blockBluetooth = (block: boolean): void => {
    exec(
        `bash -c "rfkill | grep -i 'bluetooth' | grep -i 'hci' | awk '\\$4 == \\"${block ? 'unblocked' : 'blocked'}\\" {print \\$1}' | xargs -I {} rfkill ${block ? 'block' : 'unblock'} {}"`,
    );
};

export const ToggleSwitch = (): JSX.Element => (
    <switch
        className="menu-switch bluetooth"
        halign={Gtk.Align.END}
        hexpand
        active={bluetoothService.isPowered}
        setup={(self) => {
            self.connect('notify::active', () => {
                blockBluetooth(!self.active);
                bluetoothService.adapter?.set_powered(self.active);
            });
        }}
    />
);
