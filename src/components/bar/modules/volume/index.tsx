import { openMenu } from '../../utils/menu.js';
import options from 'src/options';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, Variable } from 'astal';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import { getIcon, inputIcons, outputIcons } from './helpers/index.js';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { Astal } from 'astal/gtk3';
import { VolumeIcons } from 'src/lib/types/volume';
import AstalWp from 'gi://AstalWp?version=0.1';

const wireplumber = AstalWp.get_default() as AstalWp.Wp;
const audioService = wireplumber?.audio;

const { rightClick, middleClick, scrollUp, scrollDown } = options.bar.volume;

const Volume = (): BarBoxChild => {
    const VolumeIcon = ({ icons, isMuted, volume, extra_classes }: VolumeIconProps): JSX.Element => {
        return (
            <label
                className={`bar-button-icon volume txt-icon bar ${extra_classes}`}
                label={getIcon(icons, isMuted, volume)}
            />
        );
    };

    const VolumeLabel = ({ volume, extra_classes }: VolumeLabelProps): JSX.Element => {
        return <label className={`bar-button-label volume ${extra_classes}`} label={`${Math.round(volume * 100)}%`} />;
    };

    const componentTooltip = Variable.derive(
        [
            bind(audioService.defaultSpeaker, 'description'),
            bind(audioService.defaultSpeaker, 'volume'),
            bind(audioService.defaultSpeaker, 'mute'),
        ],
        (desc, vol, isMuted) => {
            return `${getIcon(outputIcons, isMuted, vol)} ${desc}`;
        },
    );
    const componentClassName = Variable.derive(
        [options.theme.bar.buttons.style, options.bar.volume.label],
        (style, showLabel) => {
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `volume-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
        },
    );
    const componentChildren = Variable.derive(
        [
            bind(audioService.defaultSpeaker, 'volume'),
            bind(audioService.defaultSpeaker, 'mute'),
            bind(audioService.defaultMicrophone, 'volume'),
            bind(audioService.defaultMicrophone, 'mute'),
            bind(options.bar.volume.label),
            bind(options.bar.volume.output),
            bind(options.bar.volume.input),
            bind(options.bar.volume.hideMutedLabel),
        ],
        (outputVolume, outputIsMuted, inputVolume, inputIsMuted, showLabel, showOutput, showInput, hideMutedLabel) => {
            const children: JSX.Element[] = [];
            if (showOutput) {
                const isMuted: boolean = outputIsMuted !== false || Math.round(outputVolume * 100) === 0;
                const labelVisible: boolean = showLabel && !(hideMutedLabel && isMuted);
                children.push(
                    VolumeIcon({
                        icons: outputIcons,
                        volume: outputVolume,
                        isMuted,
                        extra_classes: `output ${!labelVisible ? 'no-label' : ''}`,
                    }),
                );
                if (labelVisible) {
                    children.push(
                        VolumeLabel({
                            volume: outputVolume,
                            extra_classes: `output ${!showInput ? 'no-separator' : ''}`,
                        }),
                    );
                }
            }

            if (showInput) {
                if (showOutput) {
                    children.push(
                        <box
                            className={'bar-separator volume'}
                            orientation={1}
                            // label={getIcon(icons, isMuted, vol)}
                        />,
                    );
                }
                const isMuted: boolean = inputIsMuted !== false || Math.round(inputVolume * 100) === 0;
                const labelVisible: boolean = showLabel && !(hideMutedLabel && isMuted);

                children.push(
                    VolumeIcon({
                        icons: inputIcons,
                        volume: inputVolume,
                        isMuted,
                        extra_classes: `input ${!labelVisible ? 'no-label' : ''}`,
                    }),
                );

                if (labelVisible) {
                    children.push(VolumeLabel({ volume: inputVolume, extra_classes: 'input no-separator' }));
                }
            }
            return children;
        },
    );
    const component = (
        <box
            vexpand
            tooltipText={componentTooltip()}
            className={componentClassName()}
            onDestroy={() => {
                componentTooltip.drop();
                componentClassName.drop();
                componentChildren.drop();
            }}
        >
            {componentChildren()}
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'volume',
        props: {
            setup: (self: Astal.Button): void => {
                let disconnectFunctions: (() => void)[] = [];

                Variable.derive(
                    [
                        bind(rightClick),
                        bind(middleClick),
                        bind(scrollUp),
                        bind(scrollDown),
                        bind(options.bar.scrollSpeed),
                    ],
                    () => {
                        disconnectFunctions.forEach((disconnect) => disconnect());
                        disconnectFunctions = [];

                        const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                        disconnectFunctions.push(
                            onPrimaryClick(self, (clicked, event) => {
                                openMenu(clicked, event, 'audiomenu');
                            }),
                        );

                        disconnectFunctions.push(
                            onSecondaryClick(self, (clicked, event) => {
                                runAsyncCommand(rightClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onMiddleClick(self, (clicked, event) => {
                                runAsyncCommand(middleClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()));
                    },
                );
            },
        },
    };
};

interface VolumeIconProps {
    icons: VolumeIcons;
    isMuted: boolean;
    volume: number;
    extra_classes: string;
}

interface VolumeLabelProps {
    volume: number;
    extra_classes: string;
}

export { Volume };
