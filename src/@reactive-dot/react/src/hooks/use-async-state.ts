import { IDLE, type AsyncValue, type MutationError } from "../../../core/src";
import { useState } from "react";

export function useAsyncState<TResult, TError extends Error = MutationError>() {
  return useState<AsyncValue<TResult, TError>>(IDLE);
}
