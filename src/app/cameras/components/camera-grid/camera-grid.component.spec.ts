import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CameraGridComponent } from './camera-grid.component';
import { CameraService } from '../../services/camera.service';
import { AuthService } from '../../../auth/services/auth.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CameraGridComponent', () => {
  let component: CameraGridComponent;
  let fixture: any;
  let cameraService: jest.Mocked<CameraService>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const cameraServiceMock = {
      getStreams: jest.fn()
    };

    const authServiceMock = {
      logout: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CameraGridComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: CameraService, useValue: cameraServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CameraGridComponent);
    component = fixture.componentInstance;
    cameraService = TestBed.inject(CameraService) as jest.Mocked<CameraService>;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default states', () => {
    expect(component.streams()).toEqual([]);
    expect(component.isLoading()).toBe(true);
    expect(component.hasError()).toBe(false);
  });

  it('should load streams successfully on init', () => {
    const mockStreams = [
      { id: 1, name: 'Camera 1' },
      { id: 2, name: 'Camera 2' }
    ];
    const mockResponse = { streams: mockStreams };

    cameraService.getStreams.mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(cameraService.getStreams).toHaveBeenCalled();
    expect(component.streams()).toEqual(mockStreams);
    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(false);
  });

  it('should handle error when loading streams fails', () => {
    cameraService.getStreams.mockReturnValue(throwError(() => new Error('Network error')));

    component.ngOnInit();

    expect(cameraService.getStreams).toHaveBeenCalled();
    expect(component.streams()).toEqual([]);
    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(true);
  });

  it('should handle response without streams property', () => {
    const mockResponse = { streams: [] }; // Empty streams array

    cameraService.getStreams.mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(cameraService.getStreams).toHaveBeenCalled();
    expect(component.streams()).toEqual([]);
    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(false);
  });

  it('should logout and navigate to login page', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});