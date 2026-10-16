import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { GalleryDetail } from './gallery-detail';
import { providePortfolioHexagonalCore } from '../../core/config/adapters.provider';

describe('GalleryDetail', () => {
  let component: GalleryDetail;
  let fixture: ComponentFixture<GalleryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryDetail],
      providers: [provideRouter([]), provideHttpClient(), providePortfolioHexagonalCore()],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryDetail);
    fixture.componentRef.setInput('id', 'norte-argentino');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and support Levon Biss style Read More summary expansion', () => {
    expect(component).toBeTruthy();
    expect(component.isReadMoreExpanded()).toBe(false);
    component.toggleReadMore();
    expect(component.isReadMoreExpanded()).toBe(true);
  });
});
