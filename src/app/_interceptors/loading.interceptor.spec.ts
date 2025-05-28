import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { loadingInterceptor } from './loading.interceptor';
import { BusyService } from '../_services/busy.service';

describe('loadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let busyService: jasmine.SpyObj<BusyService>;

  beforeEach(() => {
    // Create a spy for the BusyService
    const busyServiceSpy = jasmine.createSpyObj<BusyService>('BusyService', ['busy', 'idle']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        { provide: BusyService, useValue: busyServiceSpy }
      ]
    });

    // Inject the required services
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    busyService = TestBed.inject(BusyService) as jasmine.SpyObj<BusyService>;
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests after each test
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptor: HttpInterceptorFn = (req, next) => 
      TestBed.runInInjectionContext(() => loadingInterceptor(req, next));
    expect(interceptor).toBeTruthy();
  });

  it('should call busy() when request starts', () => {
    const mockData = { data: 'test' };

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.method).toBe('GET');

    // Verify that busy() was called when the request started
    expect(busyService.busy).toHaveBeenCalledTimes(1);

    req.flush(mockData);
  });

  it('should call idle() when request completes successfully', fakeAsync(() => {
    const mockData = { data: 'test' };

    httpClient.get('/test').subscribe({
      next: (response) => {
        expect(response).toEqual(mockData);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush(mockData);

    // Advance time to trigger the delay and finalize
    tick(1000);

    // Verify that idle() was called when the request completed
    expect(busyService.idle).toHaveBeenCalledTimes(1);
  }));

  it('should call idle() when request fails', fakeAsync(() => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    // Advance time to trigger the delay and finalize
    tick(1000);

    // Verify that idle() was called even when the request failed
    expect(busyService.idle).toHaveBeenCalledTimes(1);
  }));

  it('should call busy() and idle() in correct order', fakeAsync(() => {
    const mockData = { data: 'test' };

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    
    // At this point, busy() should have been called
    expect(busyService.busy).toHaveBeenCalledTimes(1);
    expect(busyService.idle).not.toHaveBeenCalled();

    req.flush(mockData);

    // Advance time to trigger the delay and finalize
    tick(1000);

    // After request completion, idle() should have been called
    expect(busyService.idle).toHaveBeenCalledTimes(1);
  }));

  it('should handle multiple concurrent requests', fakeAsync(() => {
    const mockData1 = { data: 'test1' };
    const mockData2 = { data: 'test2' };

    // Start two concurrent requests
    httpClient.get('/test1').subscribe();
    httpClient.get('/test2').subscribe();

    const req1 = httpMock.expectOne('/test1');
    const req2 = httpMock.expectOne('/test2');

    // busy() should have been called twice
    expect(busyService.busy).toHaveBeenCalledTimes(2);

    // Complete both requests
    req1.flush(mockData1);
    req2.flush(mockData2);

    // Advance time to trigger the delay and finalize for both requests
    tick(1000);

    // idle() should have been called twice
    expect(busyService.idle).toHaveBeenCalledTimes(2);
  }));

  it('should apply delay to requests', (done) => {
    const mockData = { data: 'test' };
    const startTime = Date.now();

    httpClient.get('/test').subscribe({
      next: (response) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // The delay should be approximately 1000ms (allowing for some variance)
        expect(duration).toBeGreaterThanOrEqual(900);
        expect(response).toEqual(mockData);
        done();
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush(mockData);
  });

  it('should handle POST requests', fakeAsync(() => {
    const postData = { name: 'test' };
    const responseData = { id: 1, name: 'test' };

    httpClient.post('/test', postData).subscribe({
      next: (response) => {
        expect(response).toEqual(responseData);
      }
    });

    const req = httpMock.expectOne('/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);

    // Verify busy() was called
    expect(busyService.busy).toHaveBeenCalledTimes(1);

    req.flush(responseData);

    // Advance time to trigger the delay and finalize
    tick(1000);

    // Verify idle() was called
    expect(busyService.idle).toHaveBeenCalledTimes(1);
  }));

  it('should handle PUT requests', fakeAsync(() => {
    const putData = { id: 1, name: 'updated' };

    httpClient.put('/test/1', putData).subscribe();

    const req = httpMock.expectOne('/test/1');
    expect(req.request.method).toBe('PUT');

    expect(busyService.busy).toHaveBeenCalledTimes(1);

    req.flush(putData);

    // Advance time to trigger the delay and finalize
    tick(1000);

    expect(busyService.idle).toHaveBeenCalledTimes(1);
  }));

  it('should handle DELETE requests', fakeAsync(() => {
    httpClient.delete('/test/1').subscribe();

    const req = httpMock.expectOne('/test/1');
    expect(req.request.method).toBe('DELETE');

    expect(busyService.busy).toHaveBeenCalledTimes(1);

    req.flush({});

    // Advance time to trigger the delay and finalize
    tick(1000);

    expect(busyService.idle).toHaveBeenCalledTimes(1);
  }));

  it('should preserve request headers and body', () => {
    const headers = { 'Authorization': 'Bearer token' };
    const postData = { data: 'test' };

    httpClient.post('/test', postData, { headers }).subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    expect(req.request.body).toEqual(postData);

    req.flush({});
  });
});
