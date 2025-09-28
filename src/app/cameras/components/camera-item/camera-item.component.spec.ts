import { TestBed } from '@angular/core/testing';
import { CameraItemComponent } from './camera-item.component';
import { CameraService } from '../../services/camera.service';
import { SingleStream } from '../../models/streams.model';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CameraItemComponent', () => {
  let component: CameraItemComponent;
  let fixture: any;
  let cameraService: jest.Mocked<CameraService>;

  const mockStream: SingleStream = {
    id: 123,
    name: 'Test Camera'
  };

  beforeEach(async () => {
    const cameraServiceMock = {
      getCameraFrameUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CameraItemComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: CameraService, useValue: cameraServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CameraItemComponent);
    component = fixture.componentInstance;
    cameraService = TestBed.inject(CameraService) as jest.Mocked<CameraService>;
    
    // Set the required input
    fixture.componentRef.setInput('inputStream', mockStream);
    
    cameraService.getCameraFrameUrl.mockReturnValue('http://test-url/frame');
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct input stream', () => {
    expect(component.inputStream()).toEqual(mockStream);
  });

  it('should initialize with default states', () => {
    expect(component.imageUrl()).toBe('');
    expect(component.isImageLoading()).toBe(true);
    expect(component.hasImageError()).toBe(false);
  });

  it('should update image URL on init', () => {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1234567890);
    
    component.ngOnInit();

    expect(cameraService.getCameraFrameUrl).toHaveBeenCalledWith(123);
    expect(component.imageUrl()).toBe('http://test-url/frame&t=1234567890');
  });

  it('should set up refresh interval on init', () => {
    jest.useFakeTimers();
    
    component.ngOnInit();
    
    expect(component['refreshInterval']).toBeTruthy();
    
    jest.useRealTimers();
  });

  it('should refresh image URL every 5 seconds', () => {
    jest.useFakeTimers();
    jest.spyOn(Date.prototype, 'getTime')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(6000);
    
    component.ngOnInit();
    
    expect(component.imageUrl()).toBe('http://test-url/frame&t=1000');
    
    // Fast forward 5 seconds
    jest.advanceTimersByTime(5000);
    
    expect(component.imageUrl()).toBe('http://test-url/frame&t=6000');
    
    jest.useRealTimers();
  });

  it('should clear interval on destroy', () => {
    const originalClearInterval = global.clearInterval;
    global.clearInterval = jest.fn();
    
    component.ngOnInit();
    component.ngOnDestroy();
    
    expect(global.clearInterval).toHaveBeenCalled();
    
    global.clearInterval = originalClearInterval;
  });

  it('should handle image load', () => {
    component.onImageLoad();
    
    expect(component.isImageLoading()).toBe(false);
    expect(component.hasImageError()).toBe(false);
  });

  it('should handle image error', () => {
    component.onImageError();
    
    expect(component.isImageLoading()).toBe(false);
    expect(component.hasImageError()).toBe(true);
  });
});