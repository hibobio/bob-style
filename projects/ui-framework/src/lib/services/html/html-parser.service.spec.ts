import { HtmlParserHelpers } from './html-parser.service';

describe('HtmlParserHelpers', () => {
  const parser = new HtmlParserHelpers();

  const testEnforce = {
    'span,p,div,a': {
      contenteditable: null,
      tabindex: null,
      spellcheck: null,
      class: {
        'fr-.*': false,
      },
    },
  };

  const testString = `<br>

    <div><br></div>
    <p>Hello</p>
<div><br></div>
    <p tabindex="0">
    <a class="class" contenteditable="true" href="blah">
      <br>
      blah
      </a>
      </p>

      some text
      <br><br><br>
      some other text

    <p class="fr-removeme" spellcheck="false"></p>

    <p><br></p> <em>
    </em>

    &nbsp; &nbsp;

    <h1>Some Title</h1>

    <h5>Some other title</h5>

    <div><br></div>
    <div><br></div>

    <span>  </span> <sometag>


    </sometag>

    <div><br></div>

    <br>`;

  describe('cleanupHtml', () => {
    const processedString = parser.cleanupHtml(testString, {
      removeNbsp: true,
    });

    it('Should replace Ps with DIVs', () => {
      expect(processedString).not.toContain('<p');
    });

    it('Should replace Hx', () => {
      expect(processedString).not.toContain('<h1>');
      expect(processedString).not.toContain('<h5>');
      expect(processedString).toContain(
        '<span style="font-size: 28px;"><strong>Some Title'
      );
      expect(processedString).toContain('<span><strong>Some other title');
    });

    it('Should remove empty tags', () => {
      expect(processedString).not.toContain('<sometag>');
      expect(processedString).not.toContain('<em>');
    });

    it('Should trim unnecessary white space', () => {
      expect(/&nbsp;/gi.test(processedString)).toBeFalsy();
      expect(/\s\s+/g.test(processedString)).toBeFalsy();
    });

    it('Should replace multiple BRs with div+br', () => {
      expect(processedString).not.toContain('<br><br>');
    });

    it('Should remove BRs from tags with text', () => {
      expect(processedString).not.toContain('href="blah"><br>');
    });

    it('Should remove BRs from start/end of string', () => {
      expect(processedString.endsWith('<br>')).toBeFalsy();
      expect(processedString.startsWith('<br>')).toBeFalsy();
    });

    it('Should remove unnecessary empty lines', () => {
      const regex = /\<div\>\<br\>\<\/div\>/gim;
      expect(processedString.match(regex).length).toEqual(4);
      expect(processedString.endsWith('<div><br></div>')).toBeFalsy();
      expect(processedString.startsWith('<div><br></div>')).toBeFalsy();
    });
  });

  describe('enforceAttributes', () => {
    const processedString = parser.enforceAttributes(testString, testEnforce);

    it('Should remove attributes & classes', () => {
      expect(processedString).not.toContain('fr-removeme');
      expect(processedString).not.toContain('class=""');
      expect(processedString).not.toContain('contenteditable=');
      expect(processedString).not.toContain('tabindex=');
      expect(processedString).not.toContain('spellcheck=');
    });
  });

  describe('enforceAttributes', () => {
    const origClass = 'mydiv rem-oveme rem-ovemetoo';
    const testString2 = `
      <div class="${origClass}">text</div>
      <a href="link" class="mylink">link</a>
      <span data-blah="blah">text2</span>
    `;

    it('Should add class', () => {
      expect(
        parser.enforceAttributes(testString2, {
          div: { class: 'hello' },
        })
      ).toContain(`<div class="${origClass} hello">`);
    });

    it('Should add multiple classes', () => {
      expect(
        parser.enforceAttributes(testString2, {
          div: {
            class: {
              hello: true,
              world: true,
            },
          },
        })
      ).toContain(`<div class="${origClass} hello world">`);
    });

    it('Should remove class', () => {
      expect(
        parser.enforceAttributes(testString2, {
          div: {
            class: {
              mydiv: false,
            },
          },
        })
      ).not.toContain('<div class="mydiv');
    });

    it('Should remove wildcard classes', () => {
      expect(
        parser.enforceAttributes(testString2, {
          div: {
            class: {
              'rem-.*': false,
              mydiv: false,
              'new-class': true,
            },
          },
        })
      ).toContain('<div class="new-class');
    });

    it('Should remove attribute', () => {
      expect(
        parser.enforceAttributes(testString2, {
          span: {
            'data-blah': null,
          },
        })
      ).not.toContain('<span data-blah="blah">');
    });

    it('Should add/remove multiple attributes', () => {
      const parsed = parser.enforceAttributes(testString2, {
        span: {
          'data-blah': null,
          'data-bruh': 'bro',
        },
      });

      expect(parsed).not.toContain('<span data-blah="blah">');
      expect(parsed).toContain('<span data-bruh="bro">');
    });

    it('Should add attribute', () => {
      expect(
        parser.enforceAttributes(testString2, {
          a: {
            target: '_blank',
          },
        })
      ).toContain('<a href="link" class="mylink" target="_blank">');
    });
  });

  describe('linkify', () => {
    it('Should linkify and add passed string to tag', () => {
      expect(parser.linkify('abc www.link.com 123', 'class="link"')).toContain(
        '<a href="https://www.link.com" target="_blank" class="link">www.link.com</a>'
      );
    });
  });
});
