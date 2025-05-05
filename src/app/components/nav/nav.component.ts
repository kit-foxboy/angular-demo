import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { NgIf, TitleCasePipe } from '@angular/common';
import {
  BsDropdownMenuDirective,
  BsDropdownModule,
} from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  imports: [
    FormsModule,
    NgIf,
    BsDropdownModule,
    BsDropdownMenuDirective,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: { username: string; password: string } = {
    username: '',
    password: '',
  };

  // Attempt to log in using the account service
  // If successful, navigate to the members page
  login() {
    this.accountService.login(this.model).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        this.toastr.error(error.error);
      },
    });
  }

  // Clear the user's data from the account service
  // Then navigate to the home page
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
