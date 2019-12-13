import { PlaceholdersConverterService } from '../../../bob-rte/src/rte/placeholders.service';

const separator = '##%%';

describe('PlachholderRteConverterService', () => {
  const options = [
    {
      groupName: 'Basic',
      key: 'root',
      options: [
        {
          value: 'First name',
          id: 'root' + separator + 'firstName',
        },
        {
          value: 'Last name',
          id: 'root' + separator + 'lastName',
        },
      ],
    },
    {
      groupName: 'Work',
      key: 'work',
      options: [
        {
          value: 'Title',
          id: 'work' + separator + 'title',
        },
        {
          value: 'Team',
          id: 'work' + separator + 'team',
        },
      ],
    },
  ];

  const htmlIn =
    // tslint:disable-next-line: max-line-length
    '<p><strong><em><span style="font-size: 18px;">Hooray!</span></em></strong> {{root' +
    separator +
    'firstName}} is {{work' +
    separator +
    'title}} of the month!</p>';

  const htmlOut =
    // tslint:disable-next-line: max-line-length
    '<div><strong><em><span style="font-size: 18px;">Hooray!</span></em></strong> <span class="fr-deletable" contenteditable="false" data-placeholder-id="root' +
    separator +
    // tslint:disable-next-line: max-line-length
    'firstName"><em>{{&nbsp;</em><strong>Basic info</strong><em>&nbsp;-&nbsp;</em>First name<em>&nbsp;}}</em></span> is <span class="fr-deletable" contenteditable="false" data-placeholder-id="work' +
    separator +
    // tslint:disable-next-line: max-line-length
    'title"><em>{{&nbsp;</em><strong>Work</strong><em>&nbsp;-&nbsp;</em>Title<em>&nbsp;}}</em></span> of the month!</div>';

  const converter = new PlaceholdersConverterService();

  describe('getGroupName', () => {
    it('Should return groupName by option Id', () => {
      expect(
        converter.getGroupName(options, 'work' + separator + 'team')
      ).toEqual('Work');
    });
  });

  describe('getOptionName', () => {
    it('Should return option Value by option Id', () => {
      expect(
        converter.getOptionName(options, 'root' + separator + 'lastName')
      ).toEqual('Last name');
    });
  });

  describe('getPlaceholderHtml', () => {
    it('Should return placeholder html', () => {
      const converted = converter.getPlaceholderHtml(
        options,
        'work' + separator + 'title'
      );

      expect(converted).toContain(
        'data-placeholder-id="work' + separator + 'title">'
      );
      expect(converted).toContain(
        '{{&nbsp;</em><strong>Work</strong><em>&nbsp;-&nbsp;</em>Title<em>&nbsp;}}'
      );
    });
  });

  describe('toRte', () => {
    it('Should convert {{}} to placeholder html', () => {
      const converted = converter.toRte(htmlIn, options);

      expect(converted).not.toContain('{{root' + separator + 'firstName}}');
      expect(converted).not.toContain('{{work' + separator + 'title}}');
      expect(converted).toContain(
        // tslint:disable-next-line: max-line-length
        'data-placeholder-id="root' +
          separator +
          'firstName"><em>{{&nbsp;</em><strong>Basic</strong><em>&nbsp;-&nbsp;</em>First name<em>&nbsp;}}'
      );
      expect(converted).toContain(
        // tslint:disable-next-line: max-line-length
        'data-placeholder-id="work' +
          separator +
          'title"><em>{{&nbsp;</em><strong>Work</strong><em>&nbsp;-&nbsp;</em>Title<em>&nbsp;}}'
      );
    });
  });

  describe('fromRte', () => {
    it('Should convert html with placeholders to html with {{}}', () => {
      const converted = converter.fromRte(htmlOut);

      expect(converted).not.toContain(
        'data-placeholder-id="root' + separator + 'firstName"'
      );
      expect(converted).not.toContain(
        'data-placeholder-id="work' + separator + 'title"'
      );
      expect(converted).toContain('{{root' + separator + 'firstName}}');
      expect(converted).toContain('{{work' + separator + 'title}}');
    });
  });
});
