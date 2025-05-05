import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  model: any = {};
  onCancel = output<boolean>();

  // Attempt to register a new user using the account service
  // If successful, emit a cancel event to close the registration form
  register() {
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => {
        console.log(error);
      }
    });
  }

  cancel() {
    this.onCancel.emit(false);
  }
}
