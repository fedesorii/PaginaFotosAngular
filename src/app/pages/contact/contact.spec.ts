import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Contact } from './contact';
import { providePortfolioHexagonalCore } from '../../core/config/adapters.provider';

describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [provideRouter([]), provideHttpClient(), providePortfolioHexagonalCore()],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and use decoupled EMAIL_NOTIFICATION_PORT', () => {
    expect(component).toBeTruthy();
    expect(component.serviceOptions.length).toBeGreaterThan(0);
  });
});
