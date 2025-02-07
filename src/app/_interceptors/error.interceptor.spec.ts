import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { errorInterceptor } from './error.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { provideToastr, ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;
  let router: Router;
  let httpClient: HttpClient;

  beforeEach(() => {
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

    httpMock = TestBed.inject(HttpTestingController);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
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

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });
    
    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Bad Request', status: 400 }, { status: 400, statusText: 'Bad Request' });
    
    expect(toastrService.error).toHaveBeenCalled();
  });

  it('should handle 401 error', () => {

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 401 error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(toastrService.error).toHaveBeenCalledWith('Unauthorized', '401');
  });

  it('should handle 404 error', () => {

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 404, statusText: 'Not Found' });

    expect(router.navigateByUrl).toHaveBeenCalledWith('/not-found');
  });

  it('should handle 500 error', () => {

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Server Error' }, { status: 500, statusText: 'Internal Server Error' });

    expect(router.navigateByUrl).toHaveBeenCalledWith('/server-error', { state: { error: { message: 'Server Error' } } });
  });

  it('should handle unexpected error', () => {

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with unexpected error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 418, statusText: "I'm a teapot" });

    expect(toastrService.error).toHaveBeenCalledWith('Something unexpected went wrong. A little oopsie, you might say');
  });
});
