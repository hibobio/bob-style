import FroalaEditor from 'froala-editor';

export const initMentionsControl = () => {
  FroalaEditor.DefineIcon('mentions');
  FroalaEditor.RegisterCommand('mentions', {
    icon: 'mention',
    title: 'Mention',
    focus: true,
    undo: true,
    refreshAfterCallback: false,
  });
};
