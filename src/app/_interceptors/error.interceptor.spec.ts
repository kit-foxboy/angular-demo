import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { errorInterceptor } from './error.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { provideToastr, ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;
  let router: Router;
  let httpClient: HttpClient;

  beforeEach(() => {
    // Create a spy for the ToastrService and Router
    const toastrSpy = jasmine.createSpyObj<ToastrService>('ToastrService', ['error']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl'])

    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot()
      ],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        provideToastr({
          positionClass: 'toast-bottom-right',
        }),
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    // Inject the required services
    httpMock = TestBed.inject(HttpTestingController);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests after each test
    httpMock.verify();
  });

  it('should not intercept successful responses', () => {
    const mockSuccessData = { data: 'success' };

    // Mock the HTTP GET request
    httpClient.get('/test').subscribe({
      next: (response) => {
        expect(response).toEqual(mockSuccessData);
      },
      error: () => fail('should not have failed'),
    });

    // Simulate a successful response
    const req = httpMock.expectOne('/test');
    expect(req.request.method).toBe('GET');
    req.flush(mockSuccessData);

    // Ensure no side effects from the error interceptor occurred
    expect(toastrService.error).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should handle 400 error with validation errors', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
        expect(error).toEqual(['Validation error']);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({ errors: ['Validation error'] }, { status: 400, statusText: 'Bad Request' });

    expect(toastrService.error).not.toHaveBeenCalled();
  });

  it('should handle 400 error without validation errors', () => {
    // Mock the HTTP GET request
    const mockErrorBody = { message: 'Specific bad request message', status: 400 };
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
       expect(error).toBeTruthy();
       expect(error.status).toBe(400);
       expect(error.error).toEqual(mockErrorBody);
      }
    });
    
    // Simulate a 400 error response
    const req = httpMock.expectOne('/test');
    req.flush(mockErrorBody, { status: 400, statusText: 'Bad Request' });
    
    expect(toastrService.error).toHaveBeenCalledWith(mockErrorBody as any, '400');
  });

  it('should handle 401 error', () => {
    // Mock the HTTP GET request
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 401 error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(401);
      }
    });

    // Simulate a 401 error response
    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(toastrService.error).toHaveBeenCalledWith('Unauthorized', '401');
  });

  it('should handle default error', () => {
    // Mock the HTTP GET request
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with default error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(505);
      }
    });

    // Simulate a default error response
    // This is a custom error code for testing purposes
    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 505, statusText: 'Internal Server Error' });
    
    expect(toastrService.error).toHaveBeenCalledWith('Something unexpected went wrong. A little oopsie, you might say');
  });

  it('should handle 404 error', () => {
    // Mock the HTTP GET request
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(404);
      }
    });

    // Simulate a 404 error response
    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 404, statusText: 'Not Found' });

    expect(router.navigateByUrl).toHaveBeenCalledWith('/not-found');
  });

  it('should handle 500 error', () => {
    // Mock the HTTP GET request
    const mockErrorBody = { message: 'Server Error' };
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
        expect(error.error).toEqual(mockErrorBody);
      }
    });

    // Simulate a 500 error response
    const req = httpMock.expectOne('/test');
    req.flush(mockErrorBody, { status: 500, statusText: 'Internal Server Error' });

    expect(router.navigateByUrl).toHaveBeenCalledWith('/server-error', { state: { error: { message: 'Server Error' } } });
  });

  it('should handle unexpected error', () => {
    // Mock the HTTP GET request
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with unexpected error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(418);
      }
    });

    // Simulate an unexpected error response
    // This is a custom error code for testing purposes
    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 418, statusText: "I'm a teapot" });

    expect(toastrService.error).toHaveBeenCalledWith('Something unexpected went wrong. A little oopsie, you might say');
  });
});
