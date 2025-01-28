import { Component, inject, OnInit } from '@angular/core';
import { NavComponent } from "./components/nav/nav.component";
import { AccountService } from './_services/account.service';
import { HomeComponent } from "./components/home/home.component";

@Component({
  selector: 'app-root',
  imports: [NavComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);
  title = 'Vore Dash';
  
  
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user) {
      return;
    }

    this.accountService.currentUser.set(JSON.parse(user));
  }
}
