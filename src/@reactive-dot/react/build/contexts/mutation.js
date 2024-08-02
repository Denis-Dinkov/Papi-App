import { createContext } from "react";
import { Subject } from "rxjs";
export const MutationEventSubjectContext = createContext(new Subject());
