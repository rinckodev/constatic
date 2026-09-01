// spinner.ts
import { ck, type Chalk } from "#utils/ck.js";
import { log } from "./log.js";

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] as const;
const CLEAR_LINE = '\x1b[2K';
const CARRIAGE_RETURN = '\r';
const INTERVAL_MS = 80;

interface Spinner {
    start(message?: string): this;
    stop(): this;
    fail(message?: string): this;
    succeed(message?: string): this;
    warn(message?: string): this;
    clear(): this;
    update(message: string): this;
}

interface SpinnerState {
    message: string;
    frameIndex: number;
    interval: NodeJS.Timeout | null;
    isRunning: boolean;
}

export function createSpinner(start?: string): Spinner {
    const state: SpinnerState = {
        message: '',
        frameIndex: 0,
        interval: null,
        isRunning: false
    };

    const render = (): void => {
        const frame = FRAMES[state.frameIndex++ % FRAMES.length];
        const coloredFrame = ck.cyan(frame);
        const coloredMessage = ck.white(state.message);

        process.stdout.write(
            `${CARRIAGE_RETURN}${CLEAR_LINE}${coloredFrame} ${coloredMessage}`
        );
    };

    const stopSpinner = (): void => {
        if (state.interval) {
            clearInterval(state.interval);
            state.interval = null;
        }
        state.isRunning = false;
    };

    const finishWith = (icon: string, color: Chalk, message?: string): void => {
        stopSpinner();
        const finalMessage = message || state.message;
        const coloredIcon = color(icon);
        const coloredText = color(finalMessage);

        process.stdout.write(
            `${CARRIAGE_RETURN}${CLEAR_LINE}${coloredIcon} ${coloredText}\n`
        );
        state.message = '';
    };

    const spinner = {
        start(message = '') {
            if (state.isRunning) return this;

            state.message = message;
            state.isRunning = true;
            state.frameIndex = 0;

            render();
            state.interval = setInterval(render, INTERVAL_MS);

            return this;
        },

        stop() {
            if (!state.isRunning) return this;

            stopSpinner();
            process.stdout.write(`${CARRIAGE_RETURN}${CLEAR_LINE}`);
            state.message = '';

            return this;
        }, 

        fail(message?: string) {
            finishWith(log.icon.fail, ck.red, message);
            return this;
        },

        succeed(message?: string) {
            finishWith(log.icon.success, ck.green, message);
            return this;
        },

        warn(message?: string) {
            finishWith(log.icon.warn, ck.yellow, message);
            return this;
        },

        clear() {
            stopSpinner();
            process.stdout.write(`${CARRIAGE_RETURN}${CLEAR_LINE}`);
            state.message = '';
            return this;
        },

        update(message: string) {
            if (state.isRunning) {
                state.message = message;
            }
            return this;
        }
    };

    return start
        ? spinner.start(start)
        : spinner;
}