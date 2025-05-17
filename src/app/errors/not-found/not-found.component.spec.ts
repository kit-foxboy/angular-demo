import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import {
  RouterModule,
  provideRouter,
  Router,
  Routes,
  ActivatedRoute,
} from '@angular/router';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let router: jasmine.SpyObj<Router>;

  const routes = [{ path: '/', component: {} }] as Routes;
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['url']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        { provide: provideRouter(routes), useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Component tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to the home page', () => {
    // Check if the link to the home page is present in the template
    const compiled = fixture.nativeElement;
    const link = compiled.querySelector('button');
    expect(link.getAttribute('routerLink')).toBe('/');
  });

  it('should navigate to the home page when the link is clicked', () => {
    // Simulate a click on the link and check if the router navigates to the home page
    const compiled = fixture.nativeElement;
    const link = compiled.querySelector('button');
    link.click();
    fixture.detectChanges();
    expect(router.url).toBe('/');
  });
});
