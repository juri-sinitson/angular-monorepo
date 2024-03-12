import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'angular-monorepo-root',
  template: `<h1>Welcome examples-frontend</h1>
    <router-outlet></router-outlet>`,
  styles: ``,
})
export class AppComponent {}
