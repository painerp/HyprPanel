import options from 'options';

const { showIcon, showTime } = options.bar.clock;

showIcon.connect('changed', () => {
    if (!showTime.value && !showIcon.value) {
        showTime.value = true;
    }
});

showTime.connect('changed', () => {
    if (!showTime.value && !showIcon.value) {
        showIcon.value = true;
    }
});

const { label, icon } = options.bar.windowtitle;

label.connect('changed', () => {
    if (!label.value && !icon.value) {
        icon.value = true;
    }
});

icon.connect('changed', () => {
    if (!label.value && !icon.value) {
        label.value = true;
    }
});

const { output, input } = options.bar.volume;

output.connect('changed', () => {
    if (!output.value && !input.value) {
        input.value = true;
    }
});

input.connect('changed', () => {
    if (!output.value && !input.value) {
        output.value = true;
    }
});