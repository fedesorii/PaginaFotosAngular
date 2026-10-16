import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Studio } from './studio';
import { providePortfolioHexagonalCore } from '../../core/config/adapters.provider';

describe('Studio', () => {
  let component: Studio;
  let fixture: ComponentFixture<Studio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Studio],
      providers: [provideRouter([]), provideHttpClient(), providePortfolioHexagonalCore()],
    }).compileComponents();

    fixture = TestBed.createComponent(Studio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and allow switching between studio tabs and hexagonal adapters', () => {
    expect(component).toBeTruthy();
    expect(component.activeTab()).toBe('upload');
    component.setTab('adapters');
    expect(component.activeTab()).toBe('adapters');
  });
});
