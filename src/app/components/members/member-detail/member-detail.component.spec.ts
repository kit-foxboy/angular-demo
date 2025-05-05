import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDetailComponent } from './member-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Member } from '../../../_models/member';
import { Observable, Observer } from 'rxjs';
import { MembersService } from '../../../_services/members.service';

describe('MemberDetailComponent', () => {
  let component: MemberDetailComponent;
  let fixture: ComponentFixture<MemberDetailComponent>;
  let memberService: jasmine.SpyObj<MembersService>;

  beforeEach(async () => {
    memberService = jasmine.createSpyObj('MembersService', ['getMember']);
    await TestBed.configureTestingModule({
      imports: [MemberDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MembersService, useValue: memberService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load member on initialization', () => {
    // Mock the memberService to return a member
    const loadMemberSpy = spyOn<any>(component, 'loadMember').and.callThrough();
    const username = 'testuser';
    spyOn(component['route'].snapshot.paramMap, 'get').and.returnValue(
      username
    );

    const mockMember: Member = {
      userName: username,
      photos: [],
      id: 0,
      age: 0,
      photoUrl: '',
      knownAs: '',
      created: new Date(),
      lastActive: new Date(),
      gender: '',
      introduction: '',
      interests: '',
      lookingFor: '',
      city: '',
      country: '',
      isPredator: false
    };
    memberService.getMember.and.returnValue(
      new Observable<Member>((observer: Observer<Member>) => {
        observer.next(mockMember);
        observer.complete();
      })
    );

    // Initialize the component
    component.ngOnInit();

    // Make assertions
    expect(loadMemberSpy).toHaveBeenCalledWith(username);
    expect(component.member).toEqual(mockMember);
  });

  it('should populate images array when member is loaded', () => {
    // Mock the memberService to return a member with photos
    const mockMember = {
      userName: 'testuser',
      photos: [
        { url: 'photo1.jpg', isMain: true },
        { url: 'photo2.jpg', isMain: false },
      ],
    } as Member;

    memberService.getMember.and.returnValue(
      new Observable<Member>((observer: Observer<Member>) => {
        observer.next(mockMember);
        observer.complete();
      })
    );

    // Mock the route parameter to return a username
    spyOn(component['route'].snapshot.paramMap, 'get').and.returnValue('testuser');
    
    // Delegate the loadMember method to the actual implementation
    // this will call the loadMember method in the ngOnInit method
    const loadMemberSpy = spyOn<any>(component, 'loadMember').and.callThrough();
    

    // Initialize the component
    component.ngOnInit();

    // Make assertions
    expect(component.images.length).toBe(2);
    expect(component.images[0]).toEqual(
      jasmine.objectContaining({
        data: { src: 'photo1.jpg', thumb: 'photo1.jpg' },
      })
    );
    expect(component.images[1]).toEqual(
      jasmine.objectContaining({
        data: { src: 'photo2.jpg', thumb: 'photo2.jpg' },
      })
    );
  });

  it('should set main photo when member is loaded', () => {
    // Mock the memberService to return a member with a main photo
    const mockMember = {
      userName: 'testuser',
      photos: [
        { url: 'photo1.jpg', isMain: true },
        { url: 'photo2.jpg', isMain: false },
      ],
    } as Member;

    memberService.getMember.and.returnValue(
      new Observable<Member>((observer: Observer<Member>) => {
        observer.next(mockMember);
        observer.complete();
      })
    );

    // Mock the route parameter to return a username
    spyOn(component['route'].snapshot.paramMap, 'get').and.returnValue('testuser');

    // Initialize the component
    component.ngOnInit();

    // Make assertions
    expect(component.member?.mainPhoto?.url).toBe('photo1.jpg');
  });
});
