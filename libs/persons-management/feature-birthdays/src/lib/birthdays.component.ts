import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BirthdaysFacade } from '@angular-monorepo/persons-management/domain';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'persons-management-birthdays',
  templateUrl: './birthdays.component.html',
  styleUrls: ['./birthdays.component.scss'],
})
export class BirthdaysComponent implements OnInit {
  constructor(private birthdaysFacade: BirthdaysFacade) {}

  ngOnInit() {}
}
