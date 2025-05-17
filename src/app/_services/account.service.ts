import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../_models/user';
import { map, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  // Make api login call and set user in local storage
  login(model: {username: string, password: string}) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user as User);
        }

        return user;
      })
    );
  }

  // Make api register call and set user in local storage
  register(model: {username: string, password: string}) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user as User);
        }

        return user;
      })
    );
  }

  // Remove user from local storage and set currentUser to null
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  // Make api call to test for server errors
  testServerErrors() {
    return this.http.get(this.baseUrl + 'exceptions/server-error').subscribe(response => {
      console.log(response);
    });
  }
}
