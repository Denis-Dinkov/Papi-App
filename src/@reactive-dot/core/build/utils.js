import { from, isObservable, of } from "rxjs";
export function toObservable(value) {
    if (isObservable(value)) {
        return value;
    }
    if (value instanceof Promise) {
        return from(value);
    }
    return of(value);
}
