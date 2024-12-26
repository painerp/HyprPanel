import options from '../../../options';

const { showIcon, showTime } = options.bar.clock;

showIcon.subscribe(() => {
    if (!showTime.get() && !showIcon.get()) {
        showTime.set(true);
    }
});

showTime.subscribe(() => {
    if (!showTime.get() && !showIcon.get()) {
        showIcon.set(true);
    }
});

const { label, icon } = options.bar.windowtitle;

label.subscribe(() => {
    if (!label.get() && !icon.get()) {
        icon.set(true);
    }
});

icon.subscribe(() => {
    if (!label.get() && !icon.get()) {
        label.set(true);
    }
});

const { input, output } = options.bar.volume;

input.subscribe(() => {
    if (!input.get() && !output.get()) {
        output.set(true);
    }
});

output.subscribe(() => {
    if (!input.get() && !output.get()) {
        input.set(true);
    }
});
