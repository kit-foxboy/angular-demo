import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { AccountService } from './account.service';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);
  
  // Make api call to get list of members
  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions()).subscribe({
      next: members => {
        this.members.set(members);
      }
    });
  }

  // Make api call to get a single member by username
  getMember(username: string) {
    // Check if the member is already in the signal
    const member = this.members().find(m => m.userName === username);
    if (member) {
      return of(member);
    }

    // If not found, make an API call to get the member
    // and return an observable
    return this.http.get<Member>(this.baseUrl + 'users/' + username, this.getHttpOptions());
  }

  updateMember(member: Member) {
    return this.http.put<Member>(this.baseUrl + 'users', member, this.getHttpOptions()).pipe(
      tap(() => this.members.update(members => members.map(m => m.userName === member.userName ? member : m)))
    );
  }

  // Add authoorization header to the request if needed
  getHttpOptions() {
    return {
      headers: {
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`
      }
    };
  }
}
