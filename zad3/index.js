const terminal = (() => {
    const terminalElement = document.querySelector('#terminal');

    return {
        clear: () => terminalElement.innerHTML = '',
        writeLine: (value) => terminalElement.innerHTML += `\n${value}`,
        scrollToBottom: () => terminalElement.scrollTo(0, terminalElement.scrollHeight),
    };
})();

const input = (() => {
    const inputElement = document.querySelector('#input');

    return {
        clear: () => inputElement.value = '',
        setValue: (value) => inputElement.value = value,
        addEventListener: (...args) => inputElement.addEventListener(...args),
        getCommandAndArgs: () => {
            const inputValue = inputElement.value;
            const parts = inputValue.trim().split(' ');
            return {
                command: parts[0],
                args: parts.slice(1),
            };
        }
    };
})();

const suggestions = (() => {
    const suggestionsElement = document.querySelector('#suggestions');

    return {
        clear: () => suggestionsElement.innerHTML = '',
        update: (inputValue) => {
            const suggestions = inputValue && inputValue.length > 0 ? ALL_COMMANDS_KEYS.reduce((prev, current) => {
                if (current.startsWith(inputValue)) {
                    prev.push(current);
                }

                return prev;
            }, []).join(', ') : '';

            suggestionsElement.innerHTML = suggestions;
        },
    };
})();

const commandHistory = (() => {
    const historyStack = [];
    let historyCursor = 0;

    return {
        resetCursor: () => historyCursor = 0,
        pushToStack: (value) => historyStack.push(value),
        getPreviousEntry: () => {
            if (historyStack.length > 0) {
                const currentIndex = historyStack.length + historyCursor;
                if (currentIndex > 0) {
                    historyCursor = historyCursor - 1;
                }
                const newIndex = historyStack.length + historyCursor;
                const inputValue = historyStack[newIndex] ?? '';
                return inputValue;
            }

            return '';
        },
        getNextEntry: () => {
            if (historyStack.length > 0) {
                const currentIndex = historyStack.length + historyCursor;
                if (currentIndex < historyStack.length) {
                    historyCursor = historyCursor + 1;
                }
                const newIndex = historyStack.length + historyCursor;
                const inputValue = historyStack[newIndex] ?? '';
                return inputValue;
            }

            return '';
        }
    }
})();

const fetchQuote = async () => {
    const response = await fetch('https://dummyjson.com/quotes/random');
    const jsonResponse = await response.json();
    return jsonResponse.quote;
};

const BUILTIN_COMMANDS = {
    clear: {
        callback: terminal.clear,
    },
    help: {
        callback: () => {
            terminal.writeLine('terminal: Available commands:');

            BUILTIN_COMMANDS_KEYS.forEach(command => terminal.writeLine('\t' + command));
            CUSTOM_COMMANDS_KEYS.forEach(command => terminal.writeLine('\t' + command));
        },
    },
    quote: {
        callback: async () => {
            const quote = await fetchQuote();
            terminal.writeLine(`terminal: ${quote}`);
        },
    },
    double: {
        callback: (args) => {
            const valueToMultiply = Number(args[0]);

            if (!Number.isNaN(valueToMultiply)) {
                terminal.writeLine(`terminal: ${valueToMultiply} * 2 = ${valueToMultiply * 2}`);
            }
        },
    },
};

const CUSTOM_COMMANDS = {
    hello: {
        msg: 'Hello :)'
    },
};

const BUILTIN_COMMANDS_KEYS = Object.keys(BUILTIN_COMMANDS);
const CUSTOM_COMMANDS_KEYS = Object.keys(CUSTOM_COMMANDS);
const ALL_COMMANDS_KEYS = BUILTIN_COMMANDS_KEYS.concat(CUSTOM_COMMANDS_KEYS);

input.addEventListener('keydown', (event) => {
    const inputValue = event.target.value;

    if (event.key === 'Enter') {
        commandHistory.pushToStack(inputValue);
        terminal.writeLine(`you: ${inputValue}`);

        const { command, args } = input.getCommandAndArgs();

        if (BUILTIN_COMMANDS_KEYS.includes(command)) {
            const builtinCommand = BUILTIN_COMMANDS[command];
            if (builtinCommand.callback) {
                builtinCommand.callback(args);
            } else if (builtinCommand.msg) {
                terminal.writeLine(`terminal: ${builtinCommand.msg}`);
            }
        } else if (CUSTOM_COMMANDS_KEYS.includes(command)) {
            const customCommand = CUSTOM_COMMANDS[command];
            if (customCommand.callback) {
                customCommand.callback(args);
            } else if (customCommand.msg) {
                terminal.writeLine(`terminal: ${customCommand.msg}`);
            }
        } else {
            terminal.writeLine(`terminal: unsupported command`);
        }

        input.clear();
        commandHistory.resetCursor();
        suggestions.clear();
        terminal.scrollToBottom();
    } else if (event.key === 'ArrowUp') {
        const value = commandHistory.getPreviousEntry();
        input.setValue(value);
        suggestions.update(value);
    } else if (event.key === 'ArrowDown') {
        const value = commandHistory.getNextEntry();
        input.setValue(value);
        suggestions.update(value);
    }
});

input.addEventListener('input', (event) => {
    suggestions.update(event.target.value);
});

