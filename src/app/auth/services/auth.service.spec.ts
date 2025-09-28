import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with null sessionId', () => {
    expect(service.sessionId()).toBeNull();
  });

  it('should login successfully and set sessionId', () => {
    const mockResponse = { id: 'test-session-id' };
    const credentials = { user: 'testuser', pass: 'testpass' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.sessionId()).toBe('test-session-id');
    });

    const req = httpMock.expectOne('https://orchid.ipconfigure.com/service/sessions/user');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'testuser',
      password: 'testpass'
    });
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should logout and clear sessionId', () => {
    // Set a session ID first
    const mockResponse = { id: 'test-session-id' };
    const credentials = { user: 'testuser', pass: 'testpass' };

    service.login(credentials).subscribe();
    const req = httpMock.expectOne('https://orchid.ipconfigure.com/service/sessions/user');
    req.flush(mockResponse);

    expect(service.sessionId()).toBe('test-session-id');

    // Now logout
    service.logout();
    expect(service.sessionId()).toBeNull();
  });
});