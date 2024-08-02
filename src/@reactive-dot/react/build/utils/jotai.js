import { QueryError } from "../../../core/src";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
export class AtomFamilyError extends QueryError {
    atomFamily;
    param;
    constructor(atomFamily, param, message, options) {
        super(message, options);
        this.atomFamily = atomFamily;
        this.param = param;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromAtomFamilyError(error, atomFamily, param, message) {
        return new this(atomFamily, param, message, {
            cause: error,
        });
    }
}
export function withAtomFamilyErrorCatcher(atomFamily, param, atomCreator) {
    // @ts-expect-error complex sub-type
    const atomCatching = (read, ...args) => {
        // @ts-expect-error complex sub-type
        const readCatching = (...readArgs) => {
            try {
                const value = read(...readArgs);
                if (value instanceof Promise) {
                    return value.catch((error) => {
                        throw AtomFamilyError.fromAtomFamilyError(error, atomFamily, param);
                    });
                }
                if (value instanceof Observable) {
                    return value.pipe(catchError((error) => {
                        throw AtomFamilyError.fromAtomFamilyError(error, atomFamily, param);
                    }));
                }
                return value;
            }
            catch (error) {
                throw AtomFamilyError.fromAtomFamilyError(error, atomFamily, param);
            }
        };
        return atomCreator(readCatching, ...args);
    };
    return atomCatching;
}
export function resetQueryError(error) {
    if (!(error instanceof Error)) {
        return;
    }
    if (error instanceof AtomFamilyError) {
        error.atomFamily.remove(error.param);
    }
    if (error.cause instanceof Error) {
        resetQueryError(error.cause);
    }
}
