import { execAsync, Variable } from 'astal';

/**
 * Checks if the hypridle process is active.
 *
 * This command checks if the hypridle process is currently running by using the `pgrep` command.
 * It returns 'yes' if the process is found and 'no' otherwise.
 */
export const isActiveCommand = `bash -c "systemctl --user is-active hypridle.service"`;

/**
 * A variable to track the active state of the hypridle process.
 */
export const isActive = Variable(false);

/**
 * Toggles the hypridle process on or off based on its current state.
 *
 * This function checks if the hypridle process is currently running. If it is not running, it starts the process.
 * If it is running, it stops the process. The active state is updated accordingly.
 */
export const toggleIdle = (): void => {
    execAsync(isActiveCommand)
        .then(() => execAsync(`bash -c "systemctl --user stop hypridle.service"`).then(() => checkIdleStatus()))
        .catch(() => execAsync(`bash -c "systemctl --user start hypridle.service"`).then(() => checkIdleStatus()));
};

/**
 * Checks the current status of the hypridle process and updates the active state.
 *
 * This function checks if the hypridle process is currently running and updates the `isActive` variable accordingly.
 */
export const checkIdleStatus = (): void => {
    execAsync(isActiveCommand)
        .then(() => {
            isActive.set(true);
        })
        .catch(() => {
            isActive.set(false);
        });
};
