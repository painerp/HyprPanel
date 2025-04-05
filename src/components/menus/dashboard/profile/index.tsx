import { Gtk } from 'astal/gtk3';
import { UserProfile } from './Profile';
import { PowerMenu } from './PowerMenu';

export const Profile = ({ isEnabled }: ProfileProps): JSX.Element => {
    if (!isEnabled) {
        return;
    }

    return (
        <box className={'profiles-container'} halign={Gtk.Align.FILL} hexpand>
            <UserProfile />
            <PowerMenu />
        </box>
    );
};

interface ProfileProps {
    isEnabled: boolean;
}
