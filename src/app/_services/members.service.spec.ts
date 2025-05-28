import { TestBed } from '@angular/core/testing';

import { MembersService } from './members.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AccountService } from './account.service';

describe('MembersService', () => {
  let service: MembersService;
  let httpMock: HttpTestingController;
  let accountService: jasmine.SpyObj<AccountService>;

  beforeEach(() => {
    const accountSpy = jasmine.createSpyObj('AccountService', ['currentUser']);
    
    TestBed.configureTestingModule({
      providers: [
        MembersService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AccountService, useValue: accountSpy },
      ],
    });
    service = TestBed.inject(MembersService);
    httpMock = TestBed.inject(HttpTestingController);
    accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    
    // Mock the currentUser method to return a user with token
    accountService.currentUser.and.returnValue({
      username: 'testuser',
      token: 'test-token'
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Service tests
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty members signal initially', () => {
    expect(service.members()).toEqual([]);
  });

  it('should retrieve members from the API and update signal', () => {
    // Mock the response from the API
    const dummyMembers: Member[] = [
      {
        id: 1,
        userName: 'JohnDoe',
        age: 30,
        photoUrl: 'url1',
        knownAs: 'John',
        created: new Date(),
        lastActive: new Date(),
        gender: 'male',
        introduction: 'Hi',
        lookingFor: 'Dating',
        interests: 'Sports',
        city: 'City1',
        country: 'Country1',
        photos: [],
        isPredator: false,
      },
      {
        id: 2,
        userName: 'JaneDoe',
        age: 25,
        photoUrl: 'url2',
        knownAs: 'Jane',
        created: new Date(),
        lastActive: new Date(),
        gender: 'female',
        introduction: 'Hello',
        lookingFor: 'Friendship',
        interests: 'Reading',
        city: 'City2',
        country: 'Country2',
        photos: [],
        isPredator: false,
      },
    ];

    // Call getMembers - it returns a Subscription, not an observable
    service.getMembers();

    // Expect the HTTP request and flush the response
    const req = httpMock.expectOne(`${environment.apiUrl}users`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(dummyMembers);

    // Check that the signal was updated
    expect(service.members()).toEqual(dummyMembers);
    expect(service.members().length).toBe(2);
  });

  it('should retrieve a member from cache if available', () => {
    // Setup cached members
    const cachedMembers: Member[] = [
      {
        id: 1,
        userName: 'JohnDoe',
        age: 30,
        photoUrl: 'url1',
        knownAs: 'John',
        created: new Date(),
        lastActive: new Date(),
        gender: 'male',
        introduction: 'Hi',
        lookingFor: 'Dating',
        interests: 'Sports',
        city: 'City1',
        country: 'Country1',
        photos: [],
        isPredator: false,
      },
    ];

    // Manually set the signal to simulate cached data
    service.members.set(cachedMembers);

    // Call getMember for cached member
    service.getMember('JohnDoe').subscribe((member: Member) => {
      expect(member).toEqual(cachedMembers[0]);
    });

    // Should not make HTTP request since member is cached
    httpMock.expectNone(`${environment.apiUrl}users/JohnDoe`);
  });

  it('should retrieve a member from API if not in cache', () => {
    const mockMember: Member = {
      id: 1,
      userName: 'JohnDoe',
      age: 30,
      photoUrl: 'url1',
      knownAs: 'John',
      created: new Date(),
      lastActive: new Date(),
      gender: 'male',
      introduction: 'Hi',
      lookingFor: 'Dating',
      interests: 'Sports',
      city: 'City1',
      country: 'Country1',
      photos: [],
      isPredator: false,
    };

    // Members signal is empty, so should make API call
    service.getMember('JohnDoe').subscribe((member: Member) => {
      expect(member).toEqual(mockMember);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}users/JohnDoe`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockMember);
  });

  it('should update member and refresh signal', () => {
    // Setup initial members in signal
    const initialMembers: Member[] = [
      {
        id: 1,
        userName: 'JohnDoe',
        age: 30,
        photoUrl: 'url1',
        knownAs: 'John',
        created: new Date(),
        lastActive: new Date(),
        gender: 'male',
        introduction: 'Hi',
        lookingFor: 'Dating',
        interests: 'Sports',
        city: 'City1',
        country: 'Country1',
        photos: [],
        isPredator: false,
      },
    ];
    service.members.set(initialMembers);

    const updatedMember: Member = {
      ...initialMembers[0],
      introduction: 'Updated introduction',
    };

    service.updateMember(updatedMember).subscribe((member: Member) => {
      expect(member).toEqual(updatedMember);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}users`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.body).toEqual(updatedMember);
    req.flush(updatedMember);

    // Check that the signal was updated
    const updatedMembers = service.members();
    expect(updatedMembers[0]).toEqual(updatedMember);
    expect(updatedMembers[0].introduction).toBe('Updated introduction');
  });
});
