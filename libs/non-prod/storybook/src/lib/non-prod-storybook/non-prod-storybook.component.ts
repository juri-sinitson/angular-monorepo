import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'angular-monorepo-non-prod-storybook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './non-prod-storybook.component.html',
})
export class NonProdStorybookComponent {}
