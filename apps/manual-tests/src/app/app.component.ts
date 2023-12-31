import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
// TODO: give the correct tags to the projects
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MenuItemInterface, TabMenuComponent } from '@angular-monorepo/shared/ui-menu';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    TabMenuComponent,
  ],
  selector: 'angular-monorepo-root',
  template: `
    <menu-tab-menu [items]="menuItems"></menu-tab-menu>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'app1';

  private menuItems_ = [  
    {
      label: 'Statistics 1',
      icon: 'icon-home',
      url: '/home',
    },
    {
      label: 'Statistics 2',
      icon: 'icon-cog',
      url: '/statistics2',
    },
  ];

  get menuItems(): MenuItemInterface[] {
    return this.menuItems_;
  }
}
