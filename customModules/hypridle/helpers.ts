export const isActiveCommand = `bash -c "systemctl --user is-active hypridle.service"`;

export const isActive = Variable(false);

export const toggleIdle = (): void => {
    Utils.execAsync(isActiveCommand)
        .then(() => Utils.execAsync(`bash -c "systemctl --user stop hypridle.service"`).then(() => checkIdleStatus()))
        .catch(() =>
            Utils.execAsync(`bash -c "systemctl --user start hypridle.service"`).then(() => checkIdleStatus()),
        );
};

export const checkIdleStatus = (): undefined => {
    Utils.execAsync(isActiveCommand)
        .then(() => {
            isActive.value = true;
        })
        .catch(() => {
            isActive.value = false;
        });
};
