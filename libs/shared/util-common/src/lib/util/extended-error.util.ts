// TODO! Add automated tests before merging to 
// the main branch.
// Separate the side effects.

import { inject } from "@angular/core";
import { MessageInterface } from "../interfaces/message.interface";
import { LoggerService } from "../services/logger/logger.service";

export class ExtendedError extends Error {
  
  private _uniqueStamp!: string; 

  constructor(error: Error) {
    super();
    this.message = error.message;
    this.stack = error.stack;
    this.cause = error.cause;

    this._uniqueStamp = this.generateUniqueStamp();

    const logger = inject(LoggerService);
    logger.error(this);
  }

  /**
   * A unique time stamp. 
   * 
   * Is useful when an 
   * error is logged to some external (self hosted) service.
   * Then you have very good chance to assign the problems in 
   * a support request to a concrete error.
   * 
   * Why?
   * 
   * Because this stamp is shown in an error message to the end user.
  */
  get uniqueStamp(): string {
    return this._uniqueStamp;
  }

  get extMessage(): MessageInterface {
    return {      
      summary: `Error ${this._uniqueStamp}`,
      severity: 'error',
      detail: this.message,
    }
  }
  
  private getShortRandomString() {
    return Math.random().toString(36).substring(2,6);    
  }

  private generateUniqueStamp() {
    
    // Get current date and time
    const date = new Date();

    // Format date and time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const dateTimeStamp = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;

    const p1 = this.getShortRandomString();
    const p2 = this.getShortRandomString();
    const p3 = this.getShortRandomString();    

    return `${dateTimeStamp}_${p1}-${p2}-${p3}`;
  }
}

export const toExtendedError = (error: unknown): ExtendedError => {
    
  if(error instanceof ExtendedError ) {      
    return error;
  }
  if (error instanceof Error) {
    return new ExtendedError(error);
  }
  if (typeof error === 'string') {
    return new ExtendedError(new Error(error));
  }    

  return new ExtendedError(new Error('Unknown Error'));
}
