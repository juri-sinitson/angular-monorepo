import { Message } from 'primeng/api';

export type Severity = 'success' | 'info' | 'warn' | 'error';

export interface MessageInterface extends Message {
  severity?: Severity;
}
