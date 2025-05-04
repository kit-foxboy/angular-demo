import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideToastr(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should contain the app-nav component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const appNav = fixture.debugElement.nativeElement.querySelector('app-nav');
    expect(appNav).not.toBeNull();
  });

  it('should contain the router-outlet component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = fixture.debugElement.nativeElement.querySelector('router-outlet');
    expect(router).not.toBeNull();
  });

  it('should set the current user on init if user is in local storage', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const accountService = TestBed.inject(AccountService);

    // setup spies
    spyOn(accountService.currentUser, 'set').and.callThrough();
    spyOn(app, 'setCurrentUser').and.callThrough();
    spyOn(localStorage, 'getItem').and.callThrough();
    
    const user = { username: 'testuser', token: 'testtoken' } as User;
    localStorage.setItem('user', JSON.stringify(user));
    app.ngOnInit();
    
    expect(app.setCurrentUser).toHaveBeenCalled();
    expect(accountService.currentUser()).toEqual(user);
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
    expect(accountService.currentUser.set).toHaveBeenCalledWith(user);
  });

  it('should not set the current user on init if no user is in local storage', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const accountService = TestBed.inject(AccountService);

    // setup spies
    spyOn(accountService.currentUser, 'set').and.callThrough();
    spyOn(app, 'setCurrentUser').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(null);

    app.ngOnInit();

    expect(app.setCurrentUser).toHaveBeenCalled();
    expect(accountService.currentUser()).toBe(null);
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
  });
});
