import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { User } from '../_models/user';
import { provideHttpClient } from '@angular/common/http';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user', () => {
    const mockUser: User = { username: 'rikki', token: 'squirrel' };
    const loginModel = { username: 'rikki', password: 'squirrel' };

    service.login(loginModel).subscribe((user) => {
      expect(user).toEqual(mockUser as any);
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
      expect(service.currentUser()).toEqual(mockUser);
    });

    const req = httpMock.expectOne(service.baseUrl + 'account/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should register a user', () => {
    const mockUser: User = { username: 'newuser', token: '67890' };
    const registerModel = { username: 'newuser', password: 'password' };

    service.register(registerModel).subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
      expect(service.currentUser()).toEqual(mockUser);
    });

    const req = httpMock.expectOne(service.baseUrl + 'account/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should logout a user', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ username: 'testuser', token: '12345' })
    );
    service.currentUser.set({ username: 'testuser', token: '12345' });

    service.logout();

    expect(localStorage.getItem('user')).toBeNull();
    expect(service.currentUser()).toBeNull();
  });
});
