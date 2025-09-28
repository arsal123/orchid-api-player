import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CameraService } from './camera.service';
import { AuthService } from '../../auth/services/auth.service';
import { API_BASE_URL } from '../../app.constants';

describe('CameraService', () => {
  let service: CameraService;
  let httpMock: HttpTestingController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    const authServiceMock = {
      sessionId: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CameraService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(CameraService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get streams with session ID', () => {
    const mockSessionId = 'test-session-id';
    const mockResponse = {
      streams: [
        { id: 1, name: 'Camera 1' },
        { id: 2, name: 'Camera 2' }
      ]
    };

    authService.sessionId.mockReturnValue(mockSessionId);

    service.getStreams().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/service/streams?sid=${mockSessionId}&live=primary`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should generate camera frame URL with session ID', () => {
    const mockSessionId = 'test-session-id';
    const streamId = 123;

    authService.sessionId.mockReturnValue(mockSessionId);

    const frameUrl = service.getCameraFrameUrl(streamId);
    
    expect(frameUrl).toBe(`${API_BASE_URL}/service/streams/${streamId}/frame?sid=${mockSessionId}`);
  });

  it('should throw error when generating frame URL without session ID', () => {
    authService.sessionId.mockReturnValue(null);

    expect(() => service.getCameraFrameUrl(123)).toThrow('Not authenticated');
  });
});