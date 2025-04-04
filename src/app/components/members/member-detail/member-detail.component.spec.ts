import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDetailComponent } from './member-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Member } from '../../../_models/member';
import { Observable, Observer } from 'rxjs';

describe('MemberDetailComponent', () => {
  let component: MemberDetailComponent;
  let fixture: ComponentFixture<MemberDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberDetailComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load member on initialization', () => {
    const loadMemberSpy = spyOn<any>(component, 'loadMember');
    const username = 'testuser';
    spyOn(component['route'].snapshot.paramMap, 'get').and.returnValue(username);

    component.ngOnInit();

    expect(loadMemberSpy).toHaveBeenCalledWith(username);
  });

  it('should populate images array when member is loaded', () => {
    const mockMember = {
      photos: [
        { url: 'photo1.jpg', isMain: true },
        { url: 'photo2.jpg', isMain: false }
      ]
    } as Member;

    spyOn(component['memberService'], 'getMember').and.returnValue(new Observable<Member>((observer: Observer<Member>) => {
      observer.next(mockMember);
      observer.complete();
    }));

    component['loadMember']('testuser');

    expect(component.images.length).toBe(2);
    expect(component.images[0]).toEqual(jasmine.objectContaining({ data: { src: 'photo1.jpg', thumb: 'photo1.jpg' } }));
    expect(component.images[1]).toEqual(jasmine.objectContaining({ data: { src: 'photo2.jpg', thumb: 'photo2.jpg' } }));
  });

  it('should set main photo when member is loaded', () => {
    const mockMember = {
      photos: [
        { url: 'photo1.jpg', isMain: true },
        { url: 'photo2.jpg', isMain: false }
      ]
    } as Member;

    spyOn(component['memberService'], 'getMember').and.returnValue(
      new Observable<Member>((observer: Observer<Member>) => {
        observer.next(mockMember);
        observer.complete();
      })
    );

    component['loadMember']('testuser');

    expect(component.member?.mainPhoto?.url).toBe('photo1.jpg');
  });
});
