// TODO! Adjust the project tags.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PersonsSmartComponent } from '@angular-monorepo/persons-management-feature-birthdays';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [PersonsSmartComponent],
  selector: 'app-root',
  template: `
    <persons-management-persons-smart> </persons-management-persons-smart>
  `,
  styles: ``,
})
export class AppComponent {}
