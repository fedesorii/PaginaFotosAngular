import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { About } from './about';
import { providePortfolioHexagonalCore } from '../../core/config/adapters.provider';

describe('About', () => {
  let component: About;
  let fixture: ComponentFixture<About>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter([]), provideHttpClient(), providePortfolioHexagonalCore()],
    }).compileComponents();

    fixture = TestBed.createComponent(About);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and display photographer CV timeline and services', () => {
    expect(component).toBeTruthy();
    expect(component.profile().timeline.length).toBeGreaterThan(0);
    expect(component.profile().services.length).toBeGreaterThan(0);
  });
});
