import { PlaceholderRteConverterService } from './placeholder-rte-converter.service';

describe('PlachholderRteConverterService', () => {
  let templateTextEditorService: PlaceholderRteConverterService;
  const listOptions = [
    {
      sample: 'Jon',
      displayName: 'First name',
      id: '/root/firstName'
    },
    {
      sample: 'CTO',
      displayName: 'CTO',
      id: '/work/title'
    },
  ];
  beforeEach(() => {
    templateTextEditorService = new PlaceholderRteConverterService();
  });

  describe('toRte', () => {
    it('Should convert HTML content with one placeholder to RTE format', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is cto';
      const expectResult =
        '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">First name</span> my job title is cto';
      expect(templateTextEditorService
        .toRte(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should convert plain text content with placeholder at the end to RTE format', () => {
      const htmlInput =
        'Hi, My name is {{/root/firstName}} my job title is cto';
      const expectResult = 'Hi, My name is <span placeholder="/root/firstName">First name</span>' +
        ' my job title is cto';
      expect(templateTextEditorService
        .toRte(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should return HTML content untouched when content has no placeHolder to convert', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is yossi my job title is cto';
      expect(templateTextEditorService
        .toRte(htmlInput, listOptions))
        .toEqual(htmlInput);
    });
    it('Should convert HTML content with multiple placeholders to RTE format', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is {{/work/title}}';
      const expectResult = '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">First name</span>' +
        ' my job title is ' +
        '<span placeholder="/work/title">CTO</span>';
      expect(templateTextEditorService
        .toRte(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should convert HTML content placeholders at the beginning of the content to RTE format', () => {
      const htmlInput =
        '<h1>{{/work/title}}</h1> my job title is cto';
      const expectResult = '<h1><span placeholder="/work/title">CTO</span></h1> ' +
        'my job title is cto';
      expect(templateTextEditorService
        .toRte(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should convert HTML content and fallback to id in case there are no placeholders found at list', () => {
      const htmlInput =
        '<h1>{{/address/city}}</h1> lives';
      const expectResult = '<h1><span placeholder="/address/city">/address/city</span></h1>' +
        ' lives';
      expect(templateTextEditorService
        .toRte(htmlInput, listOptions))
        .toEqual(expectResult);
    });
  });
});
