import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AccountService } from './_services/account.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let accountService: AccountService;
  let mockCurrentUserSignal: any;

  beforeEach(async () => {
    // Create a properly functioning signal mock that can be called as a function
    // and also has the set method that can be spied on
    let currentUserValue: any = null;

    // Create a base function that returns the current user value
    mockCurrentUserSignal = jasmine
      .createSpy('currentUserSignal')
      .and.callFake(() => currentUserValue);

    // Add signal methods
    mockCurrentUserSignal.set = jasmine
      .createSpy('set')
      .and.callFake((val: any) => {
        currentUserValue = val;
      });
    mockCurrentUserSignal.update = jasmine.createSpy('update');
    mockCurrentUserSignal.mutate = jasmine.createSpy('mutate');

    // Create the account service with our specially crafted signal spy
    const mockAccountService = jasmine.createSpyObj(
      'AccountService',
      ['setCurrentUser'],
      {
        currentUser: mockCurrentUserSignal,
      }
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AccountService, useValue: mockAccountService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        provideRouter([]),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    accountService = TestBed.inject(AccountService);

    // Mock localStorage methods
    localStorage.clear();
  });

  // Component tests
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the app-nav component', () => {
    fixture.detectChanges(); // Important: detect changes before querying elements
    const appNav = fixture.debugElement.nativeElement.querySelector('app-nav');
    expect(appNav).not.toBeNull();
  });

  it('should contain the router-outlet component', () => {
    fixture.detectChanges(); // Important: detect changes before querying elements
    const router =
      fixture.debugElement.nativeElement.querySelector('router-outlet');
    expect(router).not.toBeNull();
  });

  it('should set the current user on init if user is in local storage', () => {
    // Mock service methods
    const user = { username: 'testuser', token: 'testtoken' };
    spyOn(component, 'setCurrentUser').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

    // Initialize the component
    component.ngOnInit();

    // Make assertions
    expect(component.setCurrentUser).toHaveBeenCalled();
    expect(accountService.currentUser.set).toHaveBeenCalledWith(user);
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
    expect(accountService.currentUser()).toEqual(user);
  });

  it('should not set the current user on init if no user is in local storage', () => {
    // Mock service methods
    spyOn(component, 'setCurrentUser').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // Initialize the component
    component.ngOnInit();

    // Make assertions
    expect(component.setCurrentUser).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
    expect(accountService.currentUser()).toBeNull(); // Should remain null
    expect(accountService.currentUser.set).not.toHaveBeenCalledWith(
      jasmine.anything()
    );
  });
});
