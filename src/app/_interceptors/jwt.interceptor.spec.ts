import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';

describe('JWT Interceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let accountService: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AccountService,
        provideHttpClient(withInterceptors([jwtInterceptor])), 
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

  it('should be created', () => {
    expect(httpClient).toBeTruthy();
    expect(accountService).toBeDefined();
  });
  

  // it('should call currentUser method and check token', () => {
  //   const token = 'test-token';
  //   const user = { token, username: 'testuser' } as User;
  //   spyOn(accountService, 'currentUser').and.returnValue(user);

  //   expect(accountService.currentUser()).toEqual(user);
  //   expect(accountService.currentUser()?.token).toEqual(token);
  // });

  it('should add an Authorization header', () => {
    // Mock the account service
    const token = 'test-token';
    const user = { token, username: 'testuser' } as User;
    spyOn(accountService, 'currentUser').and.returnValue(user);

    // Mock the http get request
    httpClient.get('/test').subscribe(response => {
      expect(response).toBeTruthy();
    });

    // Simulate a response
    const httpRequest = httpMock.expectOne('/test');
    httpRequest.flush({data: 'test'});

    expect(accountService.currentUser()).toEqual({ token, username: 'testuser' });
    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should not add an Authorization header if no token is present', () => {
    // Mock the account service
    spyOn(accountService, 'currentUser').and.returnValue(null);

    // Mock the http request
    httpClient.get('/test').subscribe(response => {
      expect(response).toBeTruthy();
    });

    // Simulate a response
    const httpRequest = httpMock.expectOne('/test');
    httpRequest.flush({data: 'test'});

    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();
    expect(accountService.currentUser()?.token).toBeFalsy();
  });

  it('should not add an Authorization header if token is an empty string', () => {
    // Mock the account service
    const token = ''; // Empty string token
    spyOn(accountService, 'currentUser').and.returnValue({
      token,
      username: 'testuser-empty'
    });
  
    // Mock the http request
    httpClient.get('/test-empty-token').subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    // Simulate a response
    const httpRequest = httpMock.expectOne('/test-empty-token');
    httpRequest.flush({data: 'test'}); // Simulate a response
  
    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();
    expect(accountService.currentUser()).toEqual({ token: '', username: 'testuser-empty' }); 
  });

  it('should pass through requests without modification when no conditions are met', () => {
    // Mock the account service
    spyOn(accountService, 'currentUser').and.returnValue(null);
    
    // Mock the http request
    httpClient.get('/test').subscribe(response => {
      expect(response).toBeTruthy();
    });
    
    // Simulate a response
    const req = httpMock.expectOne('/test');
    req.flush({ success: true });
    
    expect(req.request.headers.has('Authorization')).toBeFalsy();
  });
});