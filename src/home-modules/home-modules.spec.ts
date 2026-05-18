import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeModules } from './home-modules';

describe('HomeModules', () => {
  let component: HomeModules;
  let fixture: ComponentFixture<HomeModules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModules],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeModules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
