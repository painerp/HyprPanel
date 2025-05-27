import { opt } from 'src/lib/options';

export default {
    label: opt(true),
    output: opt(true),
    input: opt(false),
    hideMutedLabel: opt(false),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt('hyprpanel vol +5'),
    scrollDown: opt('hyprpanel vol -5'),
};
