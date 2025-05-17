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
    // Mock user credentials
    const mockUser: User = { username: 'rikki', token: 'squirrel' };
    const loginModel = { username: 'rikki', password: 'squirrel' };

    // Mock http request
    service.login(loginModel).subscribe((user) => {
      expect(user).toEqual(mockUser as any);
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
      expect(service.currentUser()).toEqual(mockUser);
    });

    // Mock the HTTP request and response
    const req = httpMock.expectOne(service.baseUrl + 'account/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should register a user', () => {
    // Mock user credentials
    const mockUser: User = { username: 'newuser', token: '67890' };
    const registerModel = { username: 'newuser', password: 'password' };

    // Mock http request
    service.register(registerModel).subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
      expect(service.currentUser()).toEqual(mockUser);
    });

    // Mock the HTTP request and response
    const req = httpMock.expectOne(service.baseUrl + 'account/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should logout a user', () => {
    // Mock user credentials
    localStorage.setItem(
      'user',
      JSON.stringify({ username: 'testuser', token: '12345' })
    );
    service.currentUser.set({ username: 'testuser', token: '12345' });

    // Call the logout method
    service.logout();

    expect(localStorage.getItem('user')).toBeNull();
    expect(service.currentUser()).toBeNull();
  });

  it('should call console.log with the response on testServerErrors', () => {
    // Mock console.log to spy on its calls
    // This is a workaround for the fact that console.log is not easily spied on in Angular tests
    const consoleSpy = spyOn(console, 'log');
    const mockResponse = { status: 500, message: 'Internal Server Error' };

    // Call the testServerErrors method
    // This will trigger the HTTP request and log the response
    service.testServerErrors();

    // Check that the HTTP request was made
    const req = httpMock.expectOne(service.baseUrl + 'exceptions/server-error');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(consoleSpy).toHaveBeenCalledWith(mockResponse);
  });
});
