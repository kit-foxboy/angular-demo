import { TestBed } from '@angular/core/testing';

import { MembersService } from './members.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { HttpClient, provideHttpClient } from '@angular/common/http';

describe('MembersService', () => {
  let service: MembersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MembersService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(MembersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Service tests
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve members from the API via GET', () => {
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

    // Mock the API call and return the dummy data
    service.getMembers().subscribe((members) => {
      expect(members.length).toBe(2);
      expect(members).toEqual(dummyMembers);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}users`);
    req.flush(dummyMembers);

    // Make assertions
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(`${environment.apiUrl}users`);
  });

  it('should retrieve a single member from the API via GET', () => {
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

    // Mock the API call and return the dummy data
    service.getMember('JohnDoe').subscribe((member: Member) => {
      expect(member).toEqual(dummyMembers[0]);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}users/JohnDoe`);
    req.flush(dummyMembers[0]);

    // Make assertions
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(`${environment.apiUrl}users/JohnDoe`);
  });
});
