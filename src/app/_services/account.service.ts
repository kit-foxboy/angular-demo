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
  private subscription = new Subscription();
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

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

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  testServerErrors() {
    return this.http.get(this.baseUrl + 'exceptions/server-error').subscribe(response => {
      console.log(response);
    });
  }
}
