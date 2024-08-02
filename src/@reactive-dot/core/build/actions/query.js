export function preflight(instruction) {
    switch (instruction.instruction) {
        case "get-constant":
        case "call-api":
        case "read-storage-entries":
            return "promise";
        case "read-storage":
            return "observable";
    }
}
export function query(api, instruction, options) {
    switch (instruction.instruction) {
        case "get-constant":
            return (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            api.constants[instruction.pallet][instruction.constant]());
        case "call-api":
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return api.apis[instruction.pallet][instruction.api](...instruction.args, { signal: options?.signal, at: instruction.at });
        case "read-storage": {
            const storageEntry = api.query[instruction.pallet][instruction.storage
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ];
            return instruction.at?.startsWith("0x")
                ? storageEntry.getValue(...instruction.args, { at: instruction.at })
                : storageEntry.watchValue(...instruction.args, ...[instruction.at].filter((x) => x !== undefined));
        }
        case "read-storage-entries":
            return (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            api.query[instruction.pallet][instruction.storage].getEntries(...instruction.args, {
                signal: options?.signal,
                at: instruction.at,
            }));
    }
}
