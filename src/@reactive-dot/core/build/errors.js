export class ReDotError extends Error {
    static from(error, message) {
        return new this(message, { cause: error });
    }
}
export class QueryError extends ReDotError {
}
export class MutationError extends ReDotError {
}
