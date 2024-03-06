import { isDevMode } from "@angular/core";

import { withDevtools } from '@angular-architects/ngrx-toolkit';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const withDevToolsFuncStub = (name: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (store: any) => store
}

// We only want to use the devtools in development mode
export const withDevToolsFunc = isDevMode() === true ? withDevtools : withDevToolsFuncStub;
