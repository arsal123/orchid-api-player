import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraSpinner } from './camera-spinner';

describe('CameraSpinner', () => {
  let component: CameraSpinner;
  let fixture: ComponentFixture<CameraSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default display text', () => {
    expect(component.displayText()).toBe('Loading ...');
  });

  it('should update display text when input changes', () => {
    fixture.componentRef.setInput('displayText', 'Please wait...');
    fixture.detectChanges();
    expect(component.displayText()).toBe('Please wait...');
  });
});
