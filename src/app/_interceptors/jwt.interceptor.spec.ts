import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';
import { AccountService } from '../_services/account.service';

describe('JWT Interceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let accountService: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: HTTP_INTERCEPTORS, useValue: jwtInterceptor, multi: true },
        AccountService,
        provideHttpClient(), 
        provideHttpClientTesting()
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    accountService = TestBed.inject(AccountService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header', () => {
    const token = 'test-token';
    spyOn(accountService, 'currentUser').and.returnValue({
      token,
      username: ''
    });

    httpClient.get('/test', { headers: { Authorization: `Bearer ${token}` } }).subscribe(response => {
      expect(response).toBeTruthy();
      console.log(response);
    });

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should not add an Authorization header if no token is present', () => {
    spyOn(accountService, 'currentUser').and.returnValue(null);

    httpClient.get('/test').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();
  });
});