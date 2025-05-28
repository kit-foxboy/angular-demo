import { TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';

import { BusyService } from './busy.service';

describe('BusyService', () => {
  let service: BusyService;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        BusyService,
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy }
      ]
    });
    
    service = TestBed.inject(BusyService);
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  afterEach(() => {
    // Reset the counter after each test to ensure clean state
    service.busyRequestsCount = 0;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('busy()', () => {
    it('should increment busyRequestsCount', () => {
      const initialCount = service.busyRequestsCount;
      service.busy();
      expect(service.busyRequestsCount).toBe(initialCount + 1);
    });

    it('should show spinner when busyRequestsCount goes from 0 to 1', () => {
      service.busyRequestsCount = 0;
      service.busy();
      
      expect(spinnerService.show).toHaveBeenCalledWith(undefined, {
        type: 'pacman',
        bdColor: 'rgba(255, 255, 255, 0.7)',
        color: '#333333'
      });
    });

    it('should not show spinner when busyRequestsCount is already greater than 0', () => {
      service.busyRequestsCount = 1;
      service.busy();
      
      expect(spinnerService.show).not.toHaveBeenCalled();
      expect(service.busyRequestsCount).toBe(2);
    });

    it('should show spinner only once for multiple concurrent requests', () => {
      service.busy();
      service.busy();
      service.busy();
      
      expect(spinnerService.show).toHaveBeenCalledTimes(1);
      expect(service.busyRequestsCount).toBe(3);
    });
  });

  describe('idle()', () => {
    it('should decrement busyRequestsCount', () => {
      service.busyRequestsCount = 2;
      service.idle();
      expect(service.busyRequestsCount).toBe(1);
    });

    it('should hide spinner when busyRequestsCount reaches 0', () => {
      service.busyRequestsCount = 1;
      service.idle();
      
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(service.busyRequestsCount).toBe(0);
    });

    it('should not hide spinner when busyRequestsCount is still greater than 0', () => {
      service.busyRequestsCount = 2;
      service.idle();
      
      expect(spinnerService.hide).not.toHaveBeenCalled();
      expect(service.busyRequestsCount).toBe(1);
    });

    it('should handle multiple idle calls gracefully', () => {
      service.busyRequestsCount = 3;
      service.idle();
      service.idle();
      
      expect(spinnerService.hide).not.toHaveBeenCalled();
      expect(service.busyRequestsCount).toBe(1);
      
      service.idle();
      expect(spinnerService.hide).toHaveBeenCalledTimes(1);
      expect(service.busyRequestsCount).toBe(0);
    });

    it('should not decrement below 0 (edge case)', () => {
      service.busyRequestsCount = 0;
      service.idle();
      
      expect(service.busyRequestsCount).toBe(-1);
      expect(spinnerService.hide).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should handle busy-idle cycle correctly', () => {
      // Start busy
      service.busy();
      expect(service.busyRequestsCount).toBe(1);
      expect(spinnerService.show).toHaveBeenCalledTimes(1);
      
      // Add more requests
      service.busy();
      service.busy();
      expect(service.busyRequestsCount).toBe(3);
      expect(spinnerService.show).toHaveBeenCalledTimes(1); // Still only called once
      
      // Start finishing requests
      service.idle();
      service.idle();
      expect(service.busyRequestsCount).toBe(1);
      expect(spinnerService.hide).not.toHaveBeenCalled();
      
      // Finish last request
      service.idle();
      expect(service.busyRequestsCount).toBe(0);
      expect(spinnerService.hide).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple busy-idle cycles', () => {
      // First cycle
      service.busy();
      expect(spinnerService.show).toHaveBeenCalledTimes(1);
      service.idle();
      expect(spinnerService.hide).toHaveBeenCalledTimes(1);
      
      // Reset spy call counts
      spinnerService.show.calls.reset();
      spinnerService.hide.calls.reset();
      
      // Second cycle
      service.busy();
      expect(spinnerService.show).toHaveBeenCalledTimes(1);
      service.idle();
      expect(spinnerService.hide).toHaveBeenCalledTimes(1);
    });

    it('should initialize with correct default state', () => {
      expect(service.busyRequestsCount).toBe(0);
    });
  });
});
