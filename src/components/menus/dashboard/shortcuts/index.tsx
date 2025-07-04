import { Gtk } from 'astal/gtk3';
import { LeftShortcuts, RightShortcuts } from './sections/Section';
import { recordingPoller } from './helpers';
import { JSXElement } from 'src/core/types';

export const Shortcuts = ({ isEnabled, isProfileEnabled }: ShortcutsProps): JSXElement => {
    if (!isEnabled) {
        recordingPoller.stop();
        return null;
    }
    recordingPoller.initialize();

    return (
        <box className={'shortcuts-container'} halign={Gtk.Align.FILL} hexpand>
            <LeftShortcuts isProfileEnabled={isProfileEnabled} />
            <RightShortcuts />
        </box>
    );
};

interface ShortcutsProps {
    isEnabled: boolean;
    isProfileEnabled: boolean;
}
