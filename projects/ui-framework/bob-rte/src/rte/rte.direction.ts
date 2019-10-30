import FroalaEditor from 'froala-editor';

// https://www.froala.com/wysiwyg-editor/examples/rtl-ltr-custom-button
const changeDirection = function(dir: string) {
  this.selection.save();
  this.html.wrap(true, true, true, true);
  this.selection.restore();
  const elements = this.selection.blocks();
  this.selection.save();

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element !== this.el) {
      const curEl = this.$(element);
      curEl
        .css('direction', dir === 'rtl' ? dir : null)
        .css('text-align', dir === 'rtl' ? 'right' : null)
        .removeClass('fr-temp-div');

      if (curEl.attr('style') === '') {
        curEl.removeAttr('style');
      }
    }
  }

  this.html.unwrap();
  this.selection.restore();
};

FroalaEditor.DefineIcon('rightToLeft');
FroalaEditor.RegisterCommand('rightToLeft', {
  icon: 'right to left',
  title: 'Direction',
  focus: true,
  undo: true,
  refreshAfterCallback: true,

  callback: function() {
    changeDirection.apply(this, ['rtl']);
  },

  refresh: function(btns: HTMLElement[]) {
    const elem = this.selection.blocks()[0] as HTMLElement;
    if (elem && elem.style.cssText.includes('rtl')) {
      btns[0].classList.add('fr-active');
    } else {
      btns[0].classList.remove('fr-active');
    }
  }
});

FroalaEditor.DefineIcon('leftToRight');
FroalaEditor.RegisterCommand('leftToRight', {
  icon: 'left to right',
  title: 'Direction',
  focus: true,
  undo: true,
  refreshAfterCallback: true,

  callback: function() {
    changeDirection.apply(this, ['ltr']);
  },

  refresh: function(btns: HTMLElement[]) {
    const elem = this.selection.blocks()[0] as HTMLElement;
    if (elem && elem.style.cssText.includes('ltr')) {
      btns[0].classList.add('fr-active');
    } else {
      btns[0].classList.remove('fr-active');
    }
  }
});
