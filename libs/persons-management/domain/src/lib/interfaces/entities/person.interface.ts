import { EntityId } from "@angular-monorepo/shared/util-common";

export type BirthDate = `${string}.${string}.${number}` | `${string}.${string}`;

export interface PersonInterface {
  id: EntityId
  name: string;
  surname?: string;
  birthDay: number;     
  birthMonth: number;  
  birthYear?: number;
}

export type Age = `${number}` | '-';

export interface PersonInterfaceComputed extends PersonInterface {  
  age?: Age;
  birthDate: BirthDate;
  daysToBirthday: number | 'today!';
}
