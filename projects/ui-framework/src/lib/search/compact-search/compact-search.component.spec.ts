import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactSearchComponent } from './compact-search.component';
import { SearchComponent } from '../search/search.component';
import { MockComponent } from 'ng-mocks';

describe('CompactSearchComponent', () => {
  let component: CompactSearchComponent;
  let fixture: ComponentFixture<CompactSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CompactSearchComponent,
        MockComponent(SearchComponent)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearchChange', () => {
    it('Should trigger event with searched query', () => {
      const spy = spyOn(component.searchChange, 'emit');
      component.onSearchChange('search');
      expect(spy).toHaveBeenCalledWith('search');
    });
  });
});
