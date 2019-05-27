import { IconService } from './icon.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { Icons } from './icons.enum';
import { Observable } from 'rxjs';

fdescribe('IconService', () => {
  let iconService: IconService;
  let iconRegistry: jasmine.SpyObj<MatIconRegistry>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    const spyMatIconRegistry = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon', 'getNamedSvgIcon']);
    const spyDomSanitizer =
      jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    spyDomSanitizer.bypassSecurityTrustResourceUrl.and
      .callFake(val => val);
    spyMatIconRegistry.getNamedSvgIcon.and.returnValue(new Observable());
    TestBed.configureTestingModule({
      providers: [
        IconService,
        { provide: MatIconRegistry, useValue: spyMatIconRegistry },
        { provide: DomSanitizer, useValue: spyDomSanitizer }
      ]
    });

    iconService = TestBed.get(IconService);
    iconRegistry = TestBed.get(MatIconRegistry);
    sanitizer = TestBed.get(DomSanitizer);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      iconService.initIcon(Icons.toDos_link);
    });
    it('should call iconRegistry and sanitizer correct amount of times', () => {
      expect(iconRegistry.getNamedSvgIcon).toHaveBeenCalledTimes(1);
    });
    it('should call iconRegistry and sanitizer with correct params', () => {
      expect(iconRegistry.getNamedSvgIcon.calls.first().args)
        .toEqual(['todos_link']);
    });
  });
});
