import Gdk from 'gi://Gdk?version=3.0';
const audio = await Service.import('audio');
import { openMenu } from '../utils.js';
import options from 'options';
import { VolumeIcons } from 'lib/types/volume.js';
import { BarBoxChild } from 'lib/types/bar.js';
import Button from 'types/widgets/button.js';
import { Attribute, Child } from 'lib/types/widget.js';
import Separator from 'types/widgets/separator';
import Label from 'types/widgets/label';
import { runAsyncCommand, throttledScrollHandler } from 'customModules/utils.js';

const { rightClick, middleClick, scrollUp, scrollDown } = options.bar.volume;

const Volume = (): BarBoxChild => {
    const { label, input, output, hide_muted_label } = options.bar.volume;
    const button_style = options.theme.bar.buttons.style;

    const outputIcons: VolumeIcons = {
        101: '󱄠',
        66: '󰕾',
        34: '󰖀',
        1: '󰕿',
        0: '󰝟',
    };

    const inputIcons: VolumeIcons = {
        51: '󰍬',
        1: '󰍮',
        0: '󰍭',
    };

    const getIcon = (icons: VolumeIcons, volume: number, isMuted: boolean): string => {
        const keys: number[] = Object.keys(icons).map(Number).reverse();
        let icon: number;
        if (isMuted) {
            icon = 0;
        } else {
            icon = keys.find((threshold) => threshold <= Math.round(volume * 100)) ?? keys[0];
        }
        return icons[icon];
    };

    const volIcn = (volume: number, isMuted: boolean, icons: VolumeIcons, class_name: string): Label<never> => {
        return Widget.Label({
            class_name: `bar-button-icon volume txt-icon bar ${class_name}`,
            label: getIcon(icons, volume, isMuted),
        });
    };

    const volPct = (volume: number, isMuted: boolean, class_name: string): Label<never> => {
        return Widget.Label({
            class_name: `bar-button-label volume ${class_name}`,
            label: isMuted ? '0%' : `${Math.round(volume * 100)}%`,
        });
    };

    return {
        component: Widget.Box({
            vexpand: true,
            tooltip_text: Utils.merge(
                [audio.speaker.bind('description'), audio.speaker.bind('volume'), audio.speaker.bind('is_muted')],
                (desc, vol, mut) => ` ${getIcon(outputIcons, vol, mut !== false)} ${desc}`,
            ),
            className: Utils.merge([button_style.bind('value'), label.bind('value')], (style, showLabel) => {
                const styleMap = {
                    default: 'style1',
                    split: 'style2',
                    wave: 'style3',
                    wave2: 'style3',
                };

                return `volume-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
            }),
            children: Utils.merge(
                [
                    audio.speaker.bind('volume'),
                    audio.speaker.bind('is_muted'),
                    audio.microphone.bind('volume'),
                    audio.microphone.bind('is_muted'),
                    button_style.bind('value'),
                    label.bind('value'),
                    output.bind('value'),
                    input.bind('value'),
                    hide_muted_label.bind('value'),
                ],
                (
                    outputVolume,
                    outputIsMuted,
                    inputVolume,
                    inputIsMuted,
                    buttonStyle,
                    showLabel,
                    showOutput,
                    showInput,
                    hideMutedLabel,
                ) => {
                    const children: (Label<Child> | Separator<Child>)[] = [];
                    if (showOutput) {
                        const isMuted = outputIsMuted !== false || Math.round(outputVolume * 100) === 0;
                        const labelVisible = showLabel && !(hideMutedLabel && isMuted);
                        children.push(
                            volIcn(outputVolume, isMuted, outputIcons, `output ${!labelVisible ? 'no-label' : ''}`),
                        );
                        if (labelVisible) {
                            children.push(volPct(outputVolume, isMuted, `output ${!showInput ? 'no-separator' : ''}`));
                        }
                    }

                    if (showInput) {
                        if (showOutput) {
                            children.push(Widget.Separator({ vertical: true, class_name: 'bar-separator volume' }));
                        }
                        const isMuted = inputIsMuted !== false || Math.round(inputVolume * 100) === 0;
                        const labelVisible = showLabel && !(hideMutedLabel && isMuted);
                        const rightIcon = buttonStyle === 'split' && showOutput;

                        if (!rightIcon) {
                            children.push(
                                volIcn(inputVolume, isMuted, inputIcons, `input ${!labelVisible ? 'no-label' : ''}`),
                            );
                        }

                        if (labelVisible) {
                            children.push(
                                volPct(inputVolume, isMuted, `input ${rightIcon ? 'right-icon' : 'no-separator'}`),
                            );
                        }

                        if (rightIcon) {
                            children.push(
                                volIcn(
                                    inputVolume,
                                    isMuted,
                                    inputIcons,
                                    `input right-icon ${!labelVisible ? 'no-label' : ''}`,
                                ),
                            );
                        }
                    }
                    return children;
                },
            ),
        }),
        isVisible: true,
        boxClass: 'volume',
        props: {
            onPrimaryClick: (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                openMenu(clicked, event, 'audiomenu');
            },
            setup: (self: Button<Child, Attribute>): void => {
                self.hook(options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    self.on_secondary_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    };
                    self.on_middle_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    };
                    self.on_scroll_up = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        throttledHandler(scrollUp.value, { clicked, event });
                    };
                    self.on_scroll_down = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        throttledHandler(scrollDown.value, { clicked, event });
                    };
                });
            },
        },
    };
};

export { Volume };
