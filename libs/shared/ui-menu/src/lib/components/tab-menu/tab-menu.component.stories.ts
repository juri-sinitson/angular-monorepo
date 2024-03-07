import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet, Routes, provideRouter } from '@angular/router';

import { 
  componentWrapperDecorator, 
  type Meta, 
  type StoryObj, 
  moduleMetadata, 
  applicationConfig,
} from '@storybook/angular';


import { TabMenuComponent } from './tab-menu.component';
import { MenuItemInterface } from '../../interfaces/menu-item.interface';
import { clickElem, expectElem, getCanvas } from '@angular-monorepo/shared/util-common-non-prod';

@Component({
  selector: 'menu-test',
  standalone: true,
  template: ` <p [attr.data-testid]="'page/' + url">{{ pageName }} page</p> `,
})
export class MenuTestComponent {
  constructor(private router: Router) {}

  get pageName(): string {
    // Capitalize the first letter of the url
    return this.url.charAt(0).toUpperCase() + this.url.slice(1);
  }

  get url(): string {
    return this.router.url
        .replace('/', '')
        // Workaround for the cases where the url gets
        // some params from storybook. 
        // Replacing the '?' and everything after it with 
        // an empty string.
        .replace(/(\?.*)/, '');
  }
}

const routes: Routes = [  
  { path: 'home', component: MenuTestComponent },
  { path: 'calendar', component: MenuTestComponent },
  { path: 'edit', component: MenuTestComponent },
  { path: 'docs', component: MenuTestComponent },
  { path: 'settings', component: MenuTestComponent },  
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@Component({
  selector: 'menu-tab-menu-test-wrapper',
  standalone: true,
  imports: [TabMenuComponent],
  template: `
    <menu-tab-menu [items]="items" 
      [showLabels]="showLabels" 
      [showIcons]="showIcons">
    </menu-tab-menu>
  `,  
})
export class TabMenuTestWrapperComponent {
  // TODO! Figure how to use signal 
  // inputs here that the controls 
  // of storybook stay usable.
  @Input() items: MenuItemInterface[] = [];  
  @Input() showLabels = true;
  @Input() showIcons = true;
}

const meta: Meta<TabMenuTestWrapperComponent> = {
  component: TabMenuTestWrapperComponent,
  title: 'shared/ui-menu/Tab Menu',
  decorators: [
    moduleMetadata ({
      imports: [
        MenuTestComponent,        
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
      ],
    }),
    // TODO: Figure out how to make router outlet work here
    componentWrapperDecorator((story) => `
      ${story}
      <!-- Workaround: the target component is used directly instead of the router outlet. -->
      <menu-test></menu-test>
    `),
    applicationConfig({
      providers: [
        provideRouter(routes),        
      ],
    })
  ],
};

type Story = StoryObj<TabMenuTestWrapperComponent>;

const items: MenuItemInterface[] = [
  { label: 'Home', icon: 'icon-home', url: '/home', },
  { label: 'Calendar', icon: 'icon-calendar', url: '/calendar' },
  { label: 'Edit', icon: 'icon-pencil', url: '/edit' },
  { label: 'Documentation', icon: 'icon-file', url: '/docs' },
  { label: 'Settings', icon: 'icon-cog', url: '/settings' },  
];

export default meta;


export const primary: Story = {
  args: {
    items,
    showLabels: true,
    showIcons: true,
  },

  play: async ({ canvasElement }) => {
    
    const canvas = getCanvas(canvasElement);

    // Testing if the menu and the target page are rendered correctly.

    // Refusing to use loop here because of better readability.
    // There might also be (unsolvable) issues with awaits in a loop.
    await clickElem('link/home', canvas);
    await expectElem('page/home', canvas);

    await clickElem('link/calendar', canvas);
    await expectElem('page/calendar', canvas);

    await clickElem('link/edit', canvas);
    await expectElem('page/edit', canvas);

    await clickElem('link/docs', canvas);
    await expectElem('page/docs', canvas);

    await clickElem('link/settings', canvas);
    await expectElem('page/settings', canvas);
  },
};
