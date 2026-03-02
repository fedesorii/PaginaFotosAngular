import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryDetail } from './gallery-detail';

describe('GalleryDetail', () => {
  let component: GalleryDetail;
  let fixture: ComponentFixture<GalleryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
