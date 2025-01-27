import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { NgIf } from '@angular/common';
import { BsDropdownMenuDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, NgIf, BsDropdownModule, BsDropdownMenuDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  accountService = inject(AccountService);
  model: { username: string, password: string } = {
    username: '',
    password: '',
  };

  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  logout() {
    this.accountService.logout();
  }
}
