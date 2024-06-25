import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimesPage } from './animes.page';

describe('AnimesPage', () => {
  let component: AnimesPage;
  let fixture: ComponentFixture<AnimesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
