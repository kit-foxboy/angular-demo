import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        AccountService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        provideRouter([]),
        provideAnimations()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Clear local storage before each test
    localStorage.clear();
  });


  // Component tests
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the app-nav component', () => {
    const appNav = fixture.debugElement.nativeElement.querySelector('app-nav');
    expect(appNav).not.toBeNull();
  });

  it('should contain the router-outlet component', () => {
    const router =
      fixture.debugElement.nativeElement.querySelector('router-outlet');
    expect(router).not.toBeNull();
  });

  it('should set the current user on init if user is in local storage', () => {
    const accountService = TestBed.inject(AccountService);

    // Mock service methods
    spyOn(accountService.currentUser, 'set').and.callThrough();
    spyOn(component, 'setCurrentUser').and.callThrough();
    spyOn(localStorage, 'getItem').and.callThrough();

    // Mock local storage
    const user = { username: 'testuser', token: 'testtoken' } as User;
    localStorage.setItem('user', JSON.stringify(user));

    // Initialize the component
    // This will call service methods and local storage methods
    // to check if the user is in local storage
    component.ngOnInit();

    // Make assertions
    expect(component.setCurrentUser).toHaveBeenCalled();
    expect(accountService.currentUser()).toEqual(user);
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
    expect(accountService.currentUser.set).toHaveBeenCalledWith(user);
  });

  it('should not set the current user on init if no user is in local storage', () => {
    const accountService = TestBed.inject(AccountService);

    // Mock service methods
    spyOn(component, 'setCurrentUser').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(accountService.currentUser, 'set').and.callFake(() => {});

    // Initialize the component
    // This will call service methods and local storage methods
    // to check if the user is in local storage
    component.ngOnInit();

    // Make assertions
    expect(component.setCurrentUser).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
    expect(accountService.currentUser()).toEqual(null);
  });
});
