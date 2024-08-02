import { IDLE } from "../../../core/src";
import { useState } from "react";
export function useAsyncState() {
    return useState(IDLE);
}
