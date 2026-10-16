import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Reveal } from './reveal';
import { LazyComputeService } from '../core/services/lazy-compute.service';

@Component({
  standalone: true,
  imports: [Reveal],
  template: `<div appReveal [revealIndex]="2"><span>Test Node</span></div>`,
})
class RevealHostComponent {}

describe('Reveal', () => {
  it('should attach to host element and register lazy compute node', async () => {
    await TestBed.configureTestingModule({
      imports: [RevealHostComponent],
      providers: [LazyComputeService],
    }).compileComponents();

    const fixture = TestBed.createComponent(RevealHostComponent);
    fixture.detectChanges();
    const lazyService = TestBed.inject(LazyComputeService);
    expect(lazyService.registeredCount()).toBeGreaterThan(0);
  });
});
