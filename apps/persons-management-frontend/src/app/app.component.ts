import { Component } from '@angular/core';

import { PersonsSmartComponent } from '@angular-monorepo/persons-management-feature-birthdays';

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
