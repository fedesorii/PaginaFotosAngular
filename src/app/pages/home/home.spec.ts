import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { providePortfolioHexagonalCore } from '../../core/config/adapters.provider';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), providePortfolioHexagonalCore()],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and support staggered collage rhythm', () => {
    expect(component).toBeTruthy();
    expect(component.collageRhythm()).toBe('staggered');
    component.toggleCollageRhythm();
    expect(component.collageRhythm()).toBe('balanced');
  });
});
