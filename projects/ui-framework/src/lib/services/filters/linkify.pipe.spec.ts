import { LinkifyPipe } from './linkify.pipe';

describe('LinkifyPipe', () => {
  const pipe = new LinkifyPipe();

  it('Should transform www link to http://www in a, target blank', () => {
    const testString = `
    abc
      123 www.hibob.com def
        456
    `;
    expect(pipe.transform(testString)).toContain(
      '<a href="https://www.hibob.com" target="_blank">www.hibob.com</a>'
    );
  });

  it('Should transform email to mailto: email link', () => {
    const testString = `
     abc
      123 bob@hibob.io
        456
    `;
    expect(pipe.transform(testString)).toContain(
      '<a href="mailto:bob@hibob.io">bob@hibob.io</a>'
    );
  });

  it('Should not touch links in A tags', () => {
    const testString = `abc
        <a href="http://www.link.com>
          www.link.com
        </a>
    def`;

    expect(pipe.transform(testString)).toEqual(testString);
  });

  it('Should add missing protocol to A links', () => {
    const testString = `abc
        <a href="www.link.com">
          www.link.com
        </a>
    def`;

    expect(pipe.transform(testString)).toContain('href="https://www.link.com"');
  });

  it('Should not put http in tag text, only in href', () => {
    const testString = `abc
       http://www.link.com
    def`;
    expect(pipe.transform(testString)).toContain(
      '<a href="http://www.link.com" target="_blank">www.link.com</a>'
    );
  });

  it('Should shorten very long link text', () => {
    const testString = `
    abc
      123 www.verylonglink.com/?somecrazyarguments=somecrazyparameters&andsomemoreparameters def
        456
    `;
    expect(pipe.transform(testString)).toContain(
      '>www.verylonglink.co…meters<'
    );
  });
});
