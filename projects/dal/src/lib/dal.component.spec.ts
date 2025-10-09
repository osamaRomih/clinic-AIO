import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DALComponent } from './dal.component';

describe('DALComponent', () => {
  let component: DALComponent;
  let fixture: ComponentFixture<DALComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DALComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DALComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
