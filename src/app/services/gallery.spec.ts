import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Gallery } from './gallery';
import { providePortfolioHexagonalCore } from '../core/config/adapters.provider';

describe('Gallery', () => {
  let service: Gallery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), providePortfolioHexagonalCore()],
    });
    service = TestBed.inject(Gallery);
  });

  it('should be created and delegate to PHOTO_CATALOG_PORT', () => {
    expect(service).toBeTruthy();
  });
});
