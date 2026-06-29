import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionDialog } from './option-dialog';

describe('OptionDialog', () => {
  let component: OptionDialog;
  let fixture: ComponentFixture<OptionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
