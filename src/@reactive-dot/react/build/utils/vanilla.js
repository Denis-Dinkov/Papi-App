function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainObject(value) {
    if (!hasObjectPrototype(value)) {
        return false;
    }
    // If has modified constructor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctor = value.constructor;
    if (typeof ctor === "undefined")
        return true;
    // If has modified prototype
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot))
        return false;
    // If constructor does not have an Object-specific method
    // eslint-disable-next-line no-prototype-builtins
    if (!prot.hasOwnProperty("isPrototypeOf"))
        return false;
    // Most likely a plain Object
    return true;
}
export function stringify(queryInstruction) {
    return JSON.stringify(queryInstruction, (_, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        if (isPlainObject(value)) {
            return Object.keys(value)
                .sort()
                .reduce((result, key) => {
                result[key] = value[key];
                return result;
            }, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {});
        }
        return value;
    });
}
export function flatHead(value) {
    if (Array.isArray(value) && value.length === 1) {
        return value.at(0);
    }
    // @ts-expect-error TODO: fix this
    return value;
}
