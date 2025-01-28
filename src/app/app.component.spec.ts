import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
});
