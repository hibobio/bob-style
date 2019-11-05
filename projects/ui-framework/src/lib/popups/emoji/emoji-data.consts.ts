import { find } from 'lodash';
import {EmojiCategory} from './emoji.interface';

export const EMOJI_DATA: EmojiCategory[] = [
  {name: 'people', code: '1f600', data: [
    {
    code: '1F600',
    shortname: 'grinning',
    category: 'people',
    description: 'grinning face',
    tags: ['smile', 'happy'],
    icon: '😀'
  }, {
    code: '1F603',
    shortname: 'smiley',
    category: 'people',
    description: 'smiling face with open mouth',
    tags: ['happy', 'joy', 'haha'],
    icon: '😃'
  }, {
    code: '1F604',
    shortname: 'smile',
    category: 'people',
    description: 'smiling face with open mouth & smiling eyes',
    tags: ['happy', 'joy', 'laugh', 'pleased'],
    icon: '😄'
  }, {
    code: '1F601',
    shortname: 'grin',
    category: 'people',
    description: 'grinning face with smiling eyes',
    tags: [],
    icon: '😁'
  }, {
    code: '1F606',
    shortname: 'laughing',
    category: 'people',
    description: 'smiling face with open mouth & closed eyes',
    tags: ['happy', 'haha'],
    icon: '😆'
  }, {
    code: '1F605',
    shortname: 'sweat_smile',
    category: 'people',
    description: 'smiling face with open mouth & cold sweat',
    tags: ['hot'],
    icon: '😅'
  }, {
    code: '1F602',
    shortname: 'joy',
    category: 'people',
    description: 'face with tears of joy',
    tags: ['tears'],
    icon: '😂'
  }, {
    code: '263A',
    shortname: 'relaxed',
    category: 'people',
    description: 'smiling face',
    tags: ['blush', 'pleased'],
    icon: '☺'
  }, {
    code: '1F60A',
    shortname: 'blush',
    category: 'people',
    description: 'smiling face with smiling eyes',
    tags: ['proud'],
    icon: '😊'
  }, {
    code: '1F607',
    shortname: 'innocent',
    category: 'people',
    description: 'smiling face with halo',
    tags: ['angel'],
    icon: '😇'
  }, {
    code: '1F609',
    shortname: 'wink',
    category: 'people',
    description: 'winking face',
    tags: ['flirt'],
    icon: '😉'
  }, {
    code: '1F60C',
    shortname: 'relieved',
    category: 'people',
    description: 'relieved face',
    tags: ['whew'],
    icon: '😌'
  }, {
    code: '1F60D',
    shortname: 'heart_eyes',
    category: 'people',
    description: 'smiling face with heart-eyes',
    tags: ['love', 'crush'],
    icon: '😍'
  }, {
    code: '1F618',
    shortname: 'kissing_heart',
    category: 'people',
    description: 'face blowing a kiss',
    tags: ['flirt'],
    icon: '😘'
  }, {
    code: '1F617',
    shortname: 'kissing',
    category: 'people',
    description: 'kissing face',
    tags: [],
    icon: '😗'
  }, {
    code: '1F619',
    shortname: 'kissing_smiling_eyes',
    category: 'people',
    description: 'kissing face with smiling eyes',
    tags: [],
    icon: '😙'
  }, {
    code: '1F61A',
    shortname: 'kissing_closed_eyes',
    category: 'people',
    description: 'kissing face with closed eyes',
    tags: [],
    icon: '😚'
  }, {
    code: '1F60B',
    shortname: 'yum',
    category: 'people',
    description: 'face savouring delicious food',
    tags: ['tongue', 'lick'],
    icon: '😋'
  }, {
    code: '1F61C',
    shortname: 'stuck_out_tongue_winking_eye',
    category: 'people',
    description: 'face with stuck-out tongue & winking eye',
    tags: ['prank', 'silly'],
    icon: '😜'
  }, {
    code: '1F61D',
    shortname: 'stuck_out_tongue_closed_eyes',
    category: 'people',
    description: 'face with stuck-out tongue & closed eyes',
    tags: ['prank'],
    icon: '😝'
  }, {
    code: '1F61B',
    shortname: 'stuck_out_tongue',
    category: 'people',
    description: 'face with stuck-out tongue',
    tags: [],
    icon: '😛'
  }, {
    code: '1F60E',
    shortname: 'sunglasses',
    category: 'people',
    description: 'smiling face with sunglasses',
    tags: ['cool'],
    icon: '😎'
  }, {
    code: '1F60F',
    shortname: 'smirk',
    category: 'people',
    description: 'smirking face',
    tags: ['smug'],
    icon: '😏'
  }, {
    code: '1F612',
    shortname: 'unamused',
    category: 'people',
    description: 'unamused face',
    tags: ['meh'],
    icon: '😒'
  }, {
    code: '1F61E',
    shortname: 'disappointed',
    category: 'people',
    description: 'disappointed face',
    tags: ['sad'],
    icon: '😞'
  }, {
    code: '1F614',
    shortname: 'pensive',
    category: 'people',
    description: 'pensive face',
    tags: [],
    icon: '😔'
  }, {
    code: '1F61F',
    shortname: 'worried',
    category: 'people',
    description: 'worried face',
    tags: ['nervous'],
    icon: '😟'
  }, {
    code: '1F615',
    shortname: 'confused',
    category: 'people',
    description: 'confused face',
    tags: [],
    icon: '😕'
  }, {
    code: '1F623',
    shortname: 'persevere',
    category: 'people',
    description: 'persevering face',
    tags: ['struggling'],
    icon: '😣'
  }, {
    code: '1F616',
    shortname: 'confounded',
    category: 'people',
    description: 'confounded face',
    tags: [],
    icon: '😖'
  }, {
    code: '1F62B',
    shortname: 'tired_face',
    category: 'people',
    description: 'tired face',
    tags: ['upset', 'whine'],
    icon: '😫'
  }, {
    code: '1F629',
    shortname: 'weary',
    category: 'people',
    description: 'weary face',
    tags: ['tired'],
    icon: '😩'
  }, {
    code: '1F624',
    shortname: 'triumph',
    category: 'people',
    description: 'face with steam from nose',
    tags: ['smug'],
    icon: '😤'
  }, {
    code: '1F620',
    shortname: 'angry',
    category: 'people',
    description: 'angry face',
    tags: ['mad', 'annoyed'],
    icon: '😠'
  }, {
    code: '1F621',
    shortname: 'rage',
    category: 'people',
    description: 'pouting face',
    tags: ['angry'],
    icon: '😡'
  }, {
    code: '1F636',
    shortname: 'no_mouth',
    category: 'people',
    description: 'face without mouth',
    tags: ['mute', 'silence'],
    icon: '😶'
  }, {
    code: '1F610',
    shortname: 'neutral_face',
    category: 'people',
    description: 'neutral face',
    tags: ['meh'],
    icon: '😐'
  }, {
    code: '1F611',
    shortname: 'expressionless',
    category: 'people',
    description: 'expressionless face',
    tags: [],
    icon: '😑'
  }, {
    code: '1F62F',
    shortname: 'hushed',
    category: 'people',
    description: 'hushed face',
    tags: ['silence', 'speechless'],
    icon: '😯'
  }, {
    code: '1F626',
    shortname: 'frowning',
    category: 'people',
    description: 'frowning face with open mouth',
    tags: [],
    icon: '😦'
  }, {
    code: '1F627',
    shortname: 'anguished',
    category: 'people',
    description: 'anguished face',
    tags: ['stunned'],
    icon: '😧'
  }, {
    code: '1F62E',
    shortname: 'open_mouth',
    category: 'people',
    description: 'face with open mouth',
    tags: ['surprise', 'impressed', 'wow'],
    icon: '😮'
  }, {
    code: '1F632',
    shortname: 'astonished',
    category: 'people',
    description: 'astonished face',
    tags: ['amazed', 'gasp'],
    icon: '😲'
  }, {
    code: '1F635',
    shortname: 'dizzy_face',
    category: 'people',
    description: 'dizzy face',
    tags: [],
    icon: '😵'
  }, {
    code: '1F633',
    shortname: 'flushed',
    category: 'people',
    description: 'flushed face',
    tags: [],
    icon: '😳'
  }, {
    code: '1F631',
    shortname: 'scream',
    category: 'people',
    description: 'face screaming in fear',
    tags: ['horror', 'shocked'],
    icon: '😱'
  }, {
    code: '1F628',
    shortname: 'fearful',
    category: 'people',
    description: 'fearful face',
    tags: ['scared', 'shocked', 'oops'],
    icon: '😨'
  }, {
    code: '1F630',
    shortname: 'cold_sweat',
    category: 'people',
    description: 'face with open mouth & cold sweat',
    tags: ['nervous'],
    icon: '😰'
  }, {
    code: '1F622',
    shortname: 'cry',
    category: 'people',
    description: 'crying face',
    tags: ['sad', 'tear'],
    icon: '😢'
  }, {
    code: '1F625',
    shortname: 'disappointed_relieved',
    category: 'people',
    description: 'disappointed but relieved face',
    tags: ['phew', 'sweat', 'nervous'],
    icon: '😥'
  }, {
    code: '1F62D',
    shortname: 'sob',
    category: 'people',
    description: 'loudly crying face',
    tags: ['sad', 'cry', 'bawling'],
    icon: '😭'
  }, {
    code: '1F613',
    shortname: 'sweat',
    category: 'people',
    description: 'face with cold sweat',
    tags: [],
    icon: '😓'
  }, {
    code: '1F62A',
    shortname: 'sleepy',
    category: 'people',
    description: 'sleepy face',
    tags: ['tired'],
    icon: '😪'
  }, {
    code: '1F634',
    shortname: 'sleeping',
    category: 'people',
    description: 'sleeping face',
    tags: ['zzz'],
    icon: '😴'
  }, {
    code: '1F62C',
    shortname: 'grimacing',
    category: 'people',
    description: 'grimacing face',
    tags: [],
    icon: '😬'
  }, {
    code: '1F637',
    shortname: 'mask',
    category: 'people',
    description: 'face with medical mask',
    tags: ['sick', 'ill'],
    icon: '😷'
  }, {
    code: '1F608',
    shortname: 'smiling_imp',
    category: 'people',
    description: 'smiling face with horns',
    tags: ['devil', 'evil', 'horns'],
    icon: '😈'
  }, {
    code: '1F47F',
    shortname: 'imp',
    category: 'people',
    description: 'angry face with horns',
    tags: ['angry', 'devil', 'evil', 'horns'],
    icon: '👿'
  }, {
    code: '1F479',
    shortname: 'japanese_ogre',
    category: 'people',
    description: 'ogre',
    tags: ['monster'],
    icon: '👹'
  }, {
    code: '1F47A',
    shortname: 'japanese_goblin',
    category: 'people',
    description: 'goblin',
    tags: [],
    icon: '👺'
  }, {
    code: '1F47B',
    shortname: 'ghost',
    category: 'people',
    description: 'ghost',
    tags: ['halloween'],
    icon: '👻'
  }, {
    code: '1F480',
    shortname: 'skull',
    category: 'people',
    description: 'skull',
    tags: ['dead', 'danger', 'poison'],
    icon: '💀'
  }, {
    code: '1F47D',
    shortname: 'alien',
    category: 'people',
    description: 'alien',
    tags: ['ufo'],
    icon: '👽'
  }, {
    code: '1F47E',
    shortname: 'space_invader',
    category: 'people',
    description: 'alien monster',
    tags: ['game', 'retro'],
    icon: '👾'
  }, {
    code: '1F383',
    shortname: 'jack_o_lantern',
    category: 'people',
    description: 'jack-o-lantern',
    tags: ['halloween'],
    icon: '🎃'
  }, {
    code: '1F63A',
    shortname: 'smiley_cat',
    category: 'people',
    description: 'smiling cat face with open mouth',
    tags: [],
    icon: '😺'
  }, {
    code: '1F638',
    shortname: 'smile_cat',
    category: 'people',
    description: 'grinning cat face with smiling eyes',
    tags: [],
    icon: '😸'
  }, {
    code: '1F639',
    shortname: 'joy_cat',
    category: 'people',
    description: 'cat face with tears of joy',
    tags: [],
    icon: '😹'
  }, {
    code: '1F63B',
    shortname: 'heart_eyes_cat',
    category: 'people',
    description: 'smiling cat face with heart-eyes',
    tags: [],
    icon: '😻'
  }, {
    code: '1F63C',
    shortname: 'smirk_cat',
    category: 'people',
    description: 'cat face with wry smile',
    tags: [],
    icon: '😼'
  }, {
    code: '1F63D',
    shortname: 'kissing_cat',
    category: 'people',
    description: 'kissing cat face with closed eyes',
    tags: [],
    icon: '😽'
  }, {
    code: '1F640',
    shortname: 'scream_cat',
    category: 'people',
    description: 'weary cat face',
    tags: ['horror'],
    icon: '🙀'
  }, {
    code: '1F63F',
    shortname: 'crying_cat_face',
    category: 'people',
    description: 'crying cat face',
    tags: ['sad', 'tear'],
    icon: '😿'
  }, {
    code: '1F63E',
    shortname: 'pouting_cat',
    category: 'people',
    description: 'pouting cat face',
    tags: [],
    icon: '😾'
  }, {
    code: '1F450',
    shortname: 'open_hands',
    category: 'people',
    description: 'open hands',
    tags: [],
    icon: '👐'
  }, {
    code: '1F4A9',
    shortname: 'hankey',
    category: 'people',
    description: 'poop',
    tags: ['poop', 'shit'],
    icon: '💩'
  }, {
    code: '1F44D',
    shortname: 'thumbs_up',
    category: 'people',
    description: 'thumbs up',
    tags: [],
    icon: '👍'
  }, {
    code: '1F44E',
    shortname: 'thumbs_down',
    category: 'people',
    description: 'thumbs down',
    tags: [],
    icon: '👎'
  }, {
    code: '1F64C',
    shortname: 'raised_hands',
    category: 'people',
    description: 'raising hands',
    tags: ['hooray'],
    icon: '🙌'
  }, {
    code: '1F44F',
    shortname: 'clap',
    category: 'people',
    description: 'clapping hands',
    tags: ['praise', 'applause'],
    icon: '👏'
  }, {
    code: '1F64F',
    shortname: 'pray',
    category: 'people',
    description: 'folded hands',
    tags: ['please', 'hope', 'wish'],
    icon: '🙏'
  }, {
    code: '270C',
    shortname: 'v',
    category: 'people',
    description: 'victory hand',
    tags: ['victory', 'peace'],
    icon: '✌'
  }, {
    code: '1F44C',
    shortname: 'ok_hand',
    category: 'people',
    description: 'OK hand',
    tags: [],
    icon: '👌'
  }, {
    code: '1F448',
    shortname: 'point_left',
    category: 'people',
    description: 'backhand index pointing left',
    tags: [],
    icon: '👈'
  }, {
    code: '1F449',
    shortname: 'point_right',
    category: 'people',
    description: 'backhand index pointing right',
    tags: [],
    icon: '👉'
  }, {
    code: '1F446',
    shortname: 'point_up_2',
    category: 'people',
    description: 'backhand index pointing up',
    tags: [],
    icon: '👆'
  }, {
    code: '1F447',
    shortname: 'point_down',
    category: 'people',
    description: 'backhand index pointing down',
    tags: [],
    icon: '👇'
  }, {
    code: '261D',
    shortname: 'point_up',
    category: 'people',
    description: 'index pointing up',
    tags: [],
    icon: '☝'
  }, {
    code: '1F44B',
    shortname: 'wave',
    category: 'people',
    description: 'waving hand',
    tags: ['goodbye'],
    icon: '👋'
  }, {
    code: '1F4AA',
    shortname: 'muscle',
    category: 'people',
    description: 'flexed biceps',
    tags: ['flex', 'bicep', 'strong', 'workout'],
    icon: '💪'
  }, {
    code: '1F485',
    shortname: 'nail_care',
    category: 'people',
    description: 'nail polish',
    tags: ['beauty', 'manicure'],
    icon: '💅'
  }, {
    code: '1F48D',
    shortname: 'ring',
    category: 'people',
    description: 'ring',
    tags: ['wedding', 'marriage', 'engaged'],
    icon: '💍'
  }, {
    code: '1F484',
    shortname: 'lipstick',
    category: 'people',
    description: 'lipstick',
    tags: ['makeup'],
    icon: '💄'
  }, {
    code: '1F48B',
    shortname: 'kiss',
    category: 'people',
    description: 'kiss mark',
    tags: ['lipstick'],
    icon: '💋'
  }, {
    code: '1F444',
    shortname: 'lips',
    category: 'people',
    description: 'mouth',
    tags: ['kiss'],
    icon: '👄'
  }, {
    code: '1F445',
    shortname: 'tongue',
    category: 'people',
    description: 'tongue',
    tags: ['taste'],
    icon: '👅'
  }, {
    code: '1F442',
    shortname: 'ear',
    category: 'people',
    description: 'ear',
    tags: ['hear', 'sound', 'listen'],
    icon: '👂'
  }, {
    code: '1F443',
    shortname: 'nose',
    category: 'people',
    description: 'nose',
    tags: ['smell'],
    icon: '👃'
  }, {
    code: '1F463',
    shortname: 'footprints',
    category: 'people',
    description: 'footprints',
    tags: ['feet', 'tracks'],
    icon: '👣'
  }, {
    code: '1F440',
    shortname: 'eyes',
    category: 'people',
    description: 'eyes',
    tags: ['look', 'see', 'watch'],
    icon: '👀'
  }, {
    code: '1F464',
    shortname: 'bust_in_silhouette',
    category: 'people',
    description: 'bust in silhouette',
    tags: ['user'],
    icon: '👤'
  }, {
    code: '1F465',
    shortname: 'busts_in_silhouette',
    category: 'people',
    description: 'busts in silhouette',
    tags: ['users', 'group', 'team'],
    icon: '👥'
  }, {
    code: '1F476',
    shortname: 'baby',
    category: 'people',
    description: 'baby',
    tags: ['child', 'newborn'],
    icon: '👶'
  }, {
    code: '1F466',
    shortname: 'boy',
    category: 'people',
    description: 'boy',
    tags: ['child'],
    icon: '👦'
  }, {
    code: '1F467',
    shortname: 'girl',
    category: 'people',
    description: 'girl',
    tags: ['child'],
    icon: '👧'
  }, {
    code: '1F468',
    shortname: 'man',
    category: 'people',
    description: 'man',
    tags: ['mustache', 'father', 'dad'],
    icon: '👨'
  }, {
    code: '1F469',
    shortname: 'woman',
    category: 'people',
    description: 'woman',
    tags: ['girls'],
    icon: '👩'
  }, {
    code: '1F474',
    shortname: 'older_man',
    category: 'people',
    description: 'old man',
    tags: [],
    icon: '👴'
  }, {
    code: '1F475',
    shortname: 'older_woman',
    category: 'people',
    description: 'old woman',
    tags: [],
    icon: '👵'
  }, {
    code: '1F385',
    shortname: 'santa',
    category: 'people',
    description: 'Santa Claus',
    tags: ['christmas'],
    icon: '🎅'
  }, {
    code: '1F478',
    shortname: 'princess',
    category: 'people',
    description: 'princess',
    tags: ['blonde', 'crown', 'royal'],
    icon: '👸'
  }, {
    code: '1F470',
    shortname: 'bride_with_veil',
    category: 'people',
    description: 'bride with veil',
    tags: ['marriage', 'wedding'],
    icon: '👰'
  }, {
    code: '1F47C',
    shortname: 'angel',
    category: 'people',
    description: 'baby angel',
    tags: [],
    icon: '👼'
  }, {
    code: '1F483',
    shortname: 'dancer',
    category: 'people',
    description: 'woman dancing',
    tags: ['dress'],
    icon: '💃'
  }, {
    code: '1F46B',
    shortname: 'couple',
    category: 'people',
    description: 'man and woman holding hands',
    tags: ['date'],
    icon: '👫'
  }, {
    code: '1F46D',
    shortname: 'two_women_holding_hands',
    category: 'people',
    description: 'two women holding hands',
    tags: ['couple', 'date'],
    icon: '👭'
  }, {
    code: '1F46C',
    shortname: 'two_men_holding_hands',
    category: 'people',
    description: 'two men holding hands',
    tags: ['couple', 'date'],
    icon: '👬'
  }, {
    code: '1F45A',
    shortname: 'womans_clothes',
    category: 'people',
    description: 'woman’s clothes',
    tags: [],
    icon: '👚'
  }, {
    code: '1F455',
    shortname: 'shirt',
    category: 'people',
    description: 't-shirt',
    tags: [],
    icon: '👕'
  }, {
    code: '1F456',
    shortname: 'jeans',
    category: 'people',
    description: 'jeans',
    tags: ['pants'],
    icon: '👖'
  }, {
    code: '1F454',
    shortname: 'necktie',
    category: 'people',
    description: 'necktie',
    tags: ['shirt', 'formal'],
    icon: '👔'
  }, {
    code: '1F457',
    shortname: 'dress',
    category: 'people',
    description: 'dress',
    tags: [],
    icon: '👗'
  }, {
    code: '1F459',
    shortname: 'bikini',
    category: 'people',
    description: 'bikini',
    tags: ['beach'],
    icon: '👙'
  }, {
    code: '1F458',
    shortname: 'kimono',
    category: 'people',
    description: 'kimono',
    tags: [],
    icon: '👘'
  }, {
    code: '1F460',
    shortname: 'high_heel',
    category: 'people',
    description: 'high-heeled shoe',
    tags: ['shoe'],
    icon: '👠'
  }, {
    code: '1F461',
    shortname: 'sandal',
    category: 'people',
    description: 'woman’s sandal',
    tags: ['shoe'],
    icon: '👡'
  }, {
    code: '1F462',
    shortname: 'boot',
    category: 'people',
    description: 'woman’s boot',
    tags: [],
    icon: '👢'
  }, {
    code: '1F45E',
    shortname: 'mans_shoe',
    category: 'people',
    description: 'man’s shoe',
    tags: [],
    icon: '👞'
  }, {
    code: '1F45F',
    shortname: 'athletic_shoe',
    category: 'people',
    description: 'running shoe',
    tags: ['sneaker', 'sport', 'running'],
    icon: '👟'
  }, {
    code: '1F452',
    shortname: 'womans_hat',
    category: 'people',
    description: 'woman’s hat',
    tags: [],
    icon: '👒'
  }, {
    code: '1F3A9',
    shortname: 'tophat',
    category: 'people',
    description: 'top hat',
    tags: ['hat', 'classy'],
    icon: '🎩'
  }, {
    code: '1F393',
    shortname: 'mortar_board',
    category: 'people',
    description: 'graduation cap',
    tags: ['education', 'college', 'university', 'graduation'],
    icon: '🎓'
  }, {
    code: '1F451',
    shortname: 'crown',
    category: 'people',
    description: 'crown',
    tags: ['king', 'queen', 'royal'],
    icon: '👑'
  }, {
    code: '1F392',
    shortname: 'school_satchel',
    category: 'people',
    description: 'school backpack',
    tags: [],
    icon: '🎒'
  }, {
    code: '1F45D',
    shortname: 'pouch',
    category: 'people',
    description: 'clutch bag',
    tags: ['bag'],
    icon: '👝'
  }, {
    code: '1F45B',
    shortname: 'purse',
    category: 'people',
    description: 'purse',
    tags: [],
    icon: '👛'
  }, {
    code: '1F45C',
    shortname: 'handbag',
    category: 'people',
    description: 'handbag',
    tags: ['bag'],
    icon: '👜'
  }, {
    code: '1F4BC',
    shortname: 'briefcase',
    category: 'people',
    description: 'briefcase',
    tags: ['business'],
    icon: '💼'
  }, {
    code: '1F453',
    shortname: 'eyeglasses',
    category: 'people',
    description: 'glasses',
    tags: ['glasses'],
    icon: '👓'
  }, {
    code: '1F302',
    shortname: 'closed_umbrella',
    category: 'people',
    description: 'closed umbrella',
    tags: ['weather', 'rain'],
    icon: '🌂'
  }]},
  {name: 'nature',  code: '1f436', data: [
    {
    code: '1F436',
    shortname: 'dog',
    category: 'nature',
    description: 'dog face',
    tags: ['pet'],
    icon: '🐶'
  }, {
    code: '1F431',
    shortname: 'cat',
    category: 'nature',
    description: 'cat face',
    tags: ['pet'],
    icon: '🐱'
  }, {
    code: '1F42D',
    shortname: 'mouse',
    category: 'nature',
    description: 'mouse face',
    tags: [],
    icon: '🐭'
  }, {
    code: '1F439',
    shortname: 'hamster',
    category: 'nature',
    description: 'hamster face',
    tags: ['pet'],
    icon: '🐹'
  }, {
    code: '1F430',
    shortname: 'rabbit',
    category: 'nature',
    description: 'rabbit face',
    tags: ['bunny'],
    icon: '🐰'
  }, {
    code: '1F43B',
    shortname: 'bear',
    category: 'nature',
    description: 'bear face',
    tags: [],
    icon: '🐻'
  }, {
    code: '1F43C',
    shortname: 'panda_face',
    category: 'nature',
    description: 'panda face',
    tags: [],
    icon: '🐼'
  }, {
    code: '1F428',
    shortname: 'koala',
    category: 'nature',
    description: 'koala',
    tags: [],
    icon: '🐨'
  }, {
    code: '1F42F',
    shortname: 'tiger',
    category: 'nature',
    description: 'tiger face',
    tags: [],
    icon: '🐯'
  }, {
    code: '1F42E',
    shortname: 'cow',
    category: 'nature',
    description: 'cow face',
    tags: [],
    icon: '🐮'
  }, {
    code: '1F437',
    shortname: 'pig',
    category: 'nature',
    description: 'pig face',
    tags: [],
    icon: '🐷'
  }, {
    code: '1F43D',
    shortname: 'pig_nose',
    category: 'nature',
    description: 'pig nose',
    tags: [],
    icon: '🐽'
  }, {
    code: '1F438',
    shortname: 'frog',
    category: 'nature',
    description: 'frog face',
    tags: [],
    icon: '🐸'
  }, {
    code: '1F435',
    shortname: 'monkey_face',
    category: 'nature',
    description: 'monkey face',
    tags: [],
    icon: '🐵'
  }, {
    code: '1F648',
    shortname: 'see_no_evil',
    category: 'nature',
    description: 'see-no-evil monkey',
    tags: ['monkey', 'blind', 'ignore'],
    icon: '🙈'
  }, {
    code: '1F649',
    shortname: 'hear_no_evil',
    category: 'nature',
    description: 'hear-no-evil monkey',
    tags: ['monkey', 'deaf'],
    icon: '🙉'
  }, {
    code: '1F64A',
    shortname: 'speak_no_evil',
    category: 'nature',
    description: 'speak-no-evil monkey',
    tags: ['monkey', 'mute', 'hush'],
    icon: '🙊'
  }, {
    code: '1F412',
    shortname: 'monkey',
    category: 'nature',
    description: 'monkey',
    tags: [],
    icon: '🐒'
  }, {
    code: '1F414',
    shortname: 'chicken',
    category: 'nature',
    description: 'chicken',
    tags: [],
    icon: '🐔'
  }, {
    code: '1F427',
    shortname: 'penguin',
    category: 'nature',
    description: 'penguin',
    tags: [],
    icon: '🐧'
  }, {
    code: '1F426',
    shortname: 'bird',
    category: 'nature',
    description: 'bird',
    tags: [],
    icon: '🐦'
  }, {
    code: '1F424',
    shortname: 'baby_chick',
    category: 'nature',
    description: 'baby chick',
    tags: [],
    icon: '🐤'
  }, {
    code: '1F423',
    shortname: 'hatching_chick',
    category: 'nature',
    description: 'hatching chick',
    tags: [],
    icon: '🐣'
  }, {
    code: '1F425',
    shortname: 'hatched_chick',
    category: 'nature',
    description: 'front-facing baby chick',
    tags: [],
    icon: '🐥'
  }, {
    code: '1F43A',
    shortname: 'wolf',
    category: 'nature',
    description: 'wolf face',
    tags: [],
    icon: '🐺'
  }, {
    code: '1F417',
    shortname: 'boar',
    category: 'nature',
    description: 'boar',
    tags: [],
    icon: '🐗'
  }, {
    code: '1F434',
    shortname: 'horse',
    category: 'nature',
    description: 'horse face',
    tags: [],
    icon: '🐴'
  }, {
    code: '1F41D',
    shortname: 'bee',
    category: 'nature',
    description: 'honeybee',
    tags: [],
    icon: '🐝'
  }, {code: '1F41B', shortname: 'bug', category: 'nature', description: 'bug', tags: [], icon: '🐛'}, {
    code: '1F40C',
    shortname: 'snail',
    category: 'nature',
    description: 'snail',
    tags: ['slow'],
    icon: '🐌'
  }, {
    code: '1F41A',
    shortname: 'shell',
    category: 'nature',
    description: 'spiral shell',
    tags: ['sea', 'beach'],
    icon: '🐚'
  }, {
    code: '1F41E',
    shortname: 'beetle',
    category: 'nature',
    description: 'lady beetle',
    tags: ['bug'],
    icon: '🐞'
  }, {code: '1F41C', shortname: 'ant', category: 'nature', description: 'ant', tags: [], icon: '🐜'}, {
    code: '1F422',
    shortname: 'turtle',
    category: 'nature',
    description: 'turtle',
    tags: ['slow'],
    icon: '🐢'
  }, {
    code: '1F40D',
    shortname: 'snake',
    category: 'nature',
    description: 'snake',
    tags: [],
    icon: '🐍'
  }, {
    code: '1F419',
    shortname: 'octopus',
    category: 'nature',
    description: 'octopus',
    tags: [],
    icon: '🐙'
  }, {
    code: '1F420',
    shortname: 'tropical_fish',
    category: 'nature',
    description: 'tropical fish',
    tags: [],
    icon: '🐠'
  }, {
    code: '1F41F',
    shortname: 'fish',
    category: 'nature',
    description: 'fish',
    tags: [],
    icon: '🐟'
  }, {
    code: '1F421',
    shortname: 'blowfish',
    category: 'nature',
    description: 'blowfish',
    tags: [],
    icon: '🐡'
  }, {
    code: '1F42C',
    shortname: 'dolphin',
    category: 'nature',
    description: 'dolphin',
    tags: [],
    icon: '🐬'
  }, {
    code: '1F433',
    shortname: 'whale',
    category: 'nature',
    description: 'spouting whale',
    tags: ['sea'],
    icon: '🐳'
  }, {
    code: '1F40B',
    shortname: 'whale2',
    category: 'nature',
    description: 'whale',
    tags: [],
    icon: '🐋'
  }, {
    code: '1F40A',
    shortname: 'crocodile',
    category: 'nature',
    description: 'crocodile',
    tags: [],
    icon: '🐊'
  }, {
    code: '1F406',
    shortname: 'leopard',
    category: 'nature',
    description: 'leopard',
    tags: [],
    icon: '🐆'
  }, {
    code: '1F405',
    shortname: 'tiger2',
    category: 'nature',
    description: 'tiger',
    tags: [],
    icon: '🐅'
  }, {
    code: '1F403',
    shortname: 'water_buffalo',
    category: 'nature',
    description: 'water buffalo',
    tags: [],
    icon: '🐃'
  }, {code: '1F402', shortname: 'ox', category: 'nature', description: 'ox', tags: [], icon: '🐂'}, {
    code: '1F404',
    shortname: 'cow2',
    category: 'nature',
    description: 'cow',
    tags: [],
    icon: '🐄'
  }, {
    code: '1F42A',
    shortname: 'dromedary_camel',
    category: 'nature',
    description: 'camel',
    tags: ['desert'],
    icon: '🐪'
  }, {
    code: '1F42B',
    shortname: 'camel',
    category: 'nature',
    description: 'two-hump camel',
    tags: [],
    icon: '🐫'
  }, {
    code: '1F418',
    shortname: 'elephant',
    category: 'nature',
    description: 'elephant',
    tags: [],
    icon: '🐘'
  }, {
    code: '1F40E',
    shortname: 'racehorse',
    category: 'nature',
    description: 'horse',
    tags: ['speed'],
    icon: '🐎'
  }, {code: '1F416', shortname: 'pig2', category: 'nature', description: 'pig', tags: [], icon: '🐖'}, {
    code: '1F410',
    shortname: 'goat',
    category: 'nature',
    description: 'goat',
    tags: [],
    icon: '🐐'
  }, {code: '1F40F', shortname: 'ram', category: 'nature', description: 'ram', tags: [], icon: '🐏'}, {
    code: '1F411',
    shortname: 'sheep',
    category: 'nature',
    description: 'sheep',
    tags: [],
    icon: '🐑'
  }, {code: '1F415', shortname: 'dog2', category: 'nature', description: 'dog', tags: [], icon: '🐕'}, {
    code: '1F429',
    shortname: 'poodle',
    category: 'nature',
    description: 'poodle',
    tags: ['dog'],
    icon: '🐩'
  }, {code: '1F408', shortname: 'cat2', category: 'nature', description: 'cat', tags: [], icon: '🐈'}, {
    code: '1F413',
    shortname: 'rooster',
    category: 'nature',
    description: 'rooster',
    tags: [],
    icon: '🐓'
  }, {
    code: '1F407',
    shortname: 'rabbit2',
    category: 'nature',
    description: 'rabbit',
    tags: [],
    icon: '🐇'
  }, {
    code: '1F401',
    shortname: 'mouse2',
    category: 'nature',
    description: 'mouse',
    tags: [],
    icon: '🐁'
  }, {code: '1F400', shortname: 'rat', category: 'nature', description: 'rat', tags: [], icon: '🐀'}, {
    code: '1F43E',
    shortname: 'feet',
    category: 'nature',
    description: 'paw prints',
    tags: [],
    icon: '🐾'
  }, {
    code: '1F409',
    shortname: 'dragon',
    category: 'nature',
    description: 'dragon',
    tags: [],
    icon: '🐉'
  }, {
    code: '1F432',
    shortname: 'dragon_face',
    category: 'nature',
    description: 'dragon face',
    tags: [],
    icon: '🐲'
  }, {
    code: '1F335',
    shortname: 'cactus',
    category: 'nature',
    description: 'cactus',
    tags: [],
    icon: '🌵'
  }, {
    code: '1F384',
    shortname: 'christmas_tree',
    category: 'nature',
    description: 'Christmas tree',
    tags: [],
    icon: '🎄'
  }, {
    code: '1F332',
    shortname: 'evergreen_tree',
    category: 'nature',
    description: 'evergreen tree',
    tags: ['wood'],
    icon: '🌲'
  }, {
    code: '1F333',
    shortname: 'deciduous_tree',
    category: 'nature',
    description: 'deciduous tree',
    tags: ['wood'],
    icon: '🌳'
  }, {
    code: '1F334',
    shortname: 'palm_tree',
    category: 'nature',
    description: 'palm tree',
    tags: [],
    icon: '🌴'
  }, {
    code: '1F331',
    shortname: 'seedling',
    category: 'nature',
    description: 'seedling',
    tags: ['plant'],
    icon: '🌱'
  }, {
    code: '1F33F',
    shortname: 'herb',
    category: 'nature',
    description: 'herb',
    tags: [],
    icon: '🌿'
  }, {
    code: '1F340',
    shortname: 'four_leaf_clover',
    category: 'nature',
    description: 'four leaf clover',
    tags: ['luck'],
    icon: '🍀'
  }, {
    code: '1F38D',
    shortname: 'bamboo',
    category: 'nature',
    description: 'pine decoration',
    tags: [],
    icon: '🎍'
  }, {
    code: '1F38B',
    shortname: 'tanabata_tree',
    category: 'nature',
    description: 'tanabata tree',
    tags: [],
    icon: '🎋'
  }, {
    code: '1F343',
    shortname: 'leaves',
    category: 'nature',
    description: 'leaf fluttering in wind',
    tags: ['leaf'],
    icon: '🍃'
  }, {
    code: '1F342',
    shortname: 'fallen_leaf',
    category: 'nature',
    description: 'fallen leaf',
    tags: ['autumn'],
    icon: '🍂'
  }, {
    code: '1F341',
    shortname: 'maple_leaf',
    category: 'nature',
    description: 'maple leaf',
    tags: ['canada'],
    icon: '🍁'
  }, {
    code: '1F344',
    shortname: 'mushroom',
    category: 'nature',
    description: 'mushroom',
    tags: [],
    icon: '🍄'
  }, {
    code: '1F33E',
    shortname: 'ear_of_rice',
    category: 'nature',
    description: 'sheaf of rice',
    tags: [],
    icon: '🌾'
  }, {
    code: '1F490',
    shortname: 'bouquet',
    category: 'nature',
    description: 'bouquet',
    tags: ['flowers'],
    icon: '💐'
  }, {
    code: '1F337',
    shortname: 'tulip',
    category: 'nature',
    description: 'tulip',
    tags: ['flower'],
    icon: '🌷'
  }, {
    code: '1F339',
    shortname: 'rose',
    category: 'nature',
    description: 'rose',
    tags: ['flower'],
    icon: '🌹'
  }, {
    code: '1F33B',
    shortname: 'sunflower',
    category: 'nature',
    description: 'sunflower',
    tags: [],
    icon: '🌻'
  }, {
    code: '1F33C',
    shortname: 'blossom',
    category: 'nature',
    description: 'blossom',
    tags: [],
    icon: '🌼'
  }, {
    code: '1F338',
    shortname: 'cherry_blossom',
    category: 'nature',
    description: 'cherry blossom',
    tags: ['flower', 'spring'],
    icon: '🌸'
  }, {
    code: '1F33A',
    shortname: 'hibiscus',
    category: 'nature',
    description: 'hibiscus',
    tags: [],
    icon: '🌺'
  }, {
    code: '1F30E',
    shortname: 'earth_americas',
    category: 'nature',
    description: 'globe showing Americas',
    tags: ['globe', 'world', 'international'],
    icon: '🌎'
  }, {
    code: '1F30D',
    shortname: 'earth_africa',
    category: 'nature',
    description: 'globe showing Europe-Africa',
    tags: ['globe', 'world', 'international'],
    icon: '🌍'
  }, {
    code: '1F30F',
    shortname: 'earth_asia',
    category: 'nature',
    description: 'globe showing Asia-Australia',
    tags: ['globe', 'world', 'international'],
    icon: '🌏'
  }, {
    code: '1F315',
    shortname: 'full_moon',
    category: 'nature',
    description: 'full moon',
    tags: [],
    icon: '🌕'
  }, {
    code: '1F316',
    shortname: 'waning_gibbous_moon',
    category: 'nature',
    description: 'waning gibbous moon',
    tags: [],
    icon: '🌖'
  }, {
    code: '1F317',
    shortname: 'last_quarter_moon',
    category: 'nature',
    description: 'last quarter moon',
    tags: [],
    icon: '🌗'
  }, {
    code: '1F318',
    shortname: 'waning_crescent_moon',
    category: 'nature',
    description: 'waning crescent moon',
    tags: [],
    icon: '🌘'
  }, {
    code: '1F311',
    shortname: 'new_moon',
    category: 'nature',
    description: 'new moon',
    tags: [],
    icon: '🌑'
  }, {
    code: '1F312',
    shortname: 'waxing_crescent_moon',
    category: 'nature',
    description: 'waxing crescent moon',
    tags: [],
    icon: '🌒'
  }, {
    code: '1F313',
    shortname: 'first_quarter_moon',
    category: 'nature',
    description: 'first quarter moon',
    tags: [],
    icon: '🌓'
  }, {
    code: '1F31A',
    shortname: 'new_moon_with_face',
    category: 'nature',
    description: 'new moon face',
    tags: [],
    icon: '🌚'
  }, {
    code: '1F31D',
    shortname: 'full_moon_with_face',
    category: 'nature',
    description: 'full moon with face',
    tags: [],
    icon: '🌝'
  }, {
    code: '1F31E',
    shortname: 'sun_with_face',
    category: 'nature',
    description: 'sun with face',
    tags: ['summer'],
    icon: '🌞'
  }, {
    code: '1F31B',
    shortname: 'first_quarter_moon_with_face',
    category: 'nature',
    description: 'first quarter moon with face',
    tags: [],
    icon: '🌛'
  }, {
    code: '1F31C',
    shortname: 'last_quarter_moon_with_face',
    category: 'nature',
    description: 'last quarter moon with face',
    tags: [],
    icon: '🌜'
  }, {
    code: '1F319',
    shortname: 'crescent_moon',
    category: 'nature',
    description: 'crescent moon',
    tags: ['night'],
    icon: '🌙'
  }, {
    code: '1F4AB',
    shortname: 'dizzy',
    category: 'nature',
    description: 'dizzy',
    tags: ['star'],
    icon: '💫'
  }, {
    code: '2B50',
    shortname: 'star',
    category: 'nature',
    description: 'white medium star',
    tags: [],
    icon: '⭐'
  }, {
    code: '1F31F',
    shortname: 'star2',
    category: 'nature',
    description: 'glowing star',
    tags: [],
    icon: '🌟'
  }, {
    code: '2728',
    shortname: 'sparkles',
    category: 'nature',
    description: 'sparkles',
    tags: ['shiny'],
    icon: '✨'
  }, {
    code: '26A1',
    shortname: 'zap',
    category: 'nature',
    description: 'high voltage',
    tags: ['lightning', 'thunder'],
    icon: '⚡'
  }, {
    code: '1F525',
    shortname: 'fire',
    category: 'nature',
    description: 'fire',
    tags: ['burn'],
    icon: '🔥'
  }, {
    code: '1F4A5',
    shortname: 'boom',
    category: 'nature',
    description: 'collision',
    tags: ['explode'],
    icon: '💥'
  }, {
    code: '2600',
    shortname: 'sunny',
    category: 'nature',
    description: 'sun',
    tags: ['weather'],
    icon: '☀'
  }, {
    code: '26C5',
    shortname: 'partly_sunny',
    category: 'nature',
    description: 'sun behind cloud',
    tags: ['weather', 'cloud'],
    icon: '⛅'
  }, {
    code: '1F308',
    shortname: 'rainbow',
    category: 'nature',
    description: 'rainbow',
    tags: [],
    icon: '🌈'
  }, {code: '2601', shortname: 'cloud', category: 'nature', description: 'cloud', tags: [], icon: '☁'}, {
    code: '26C4',
    shortname: 'snowman',
    category: 'nature',
    description: 'snowman without snow',
    tags: ['winter'],
    icon: '⛄'
  }, {
    code: '2744',
    shortname: 'snowflake',
    category: 'nature',
    description: 'snowflake',
    tags: ['winter', 'cold', 'weather'],
    icon: '❄'
  }, {
    code: '1F4A8',
    shortname: 'dash',
    category: 'nature',
    description: 'dashing away',
    tags: ['wind', 'blow', 'fast'],
    icon: '💨'
  }, {
    code: '1F30A',
    shortname: 'ocean',
    category: 'nature',
    description: 'water wave',
    tags: ['sea'],
    icon: '🌊'
  }, {
    code: '1F4A7',
    shortname: 'droplet',
    category: 'nature',
    description: 'droplet',
    tags: ['water'],
    icon: '💧'
  }, {
    code: '1F4A6',
    shortname: 'sweat_drops',
    category: 'nature',
    description: 'sweat droplets',
    tags: ['water', 'workout'],
    icon: '💦'
  }, {
    code: '2614',
    shortname: 'umbrella',
    category: 'nature',
    description: 'umbrella with rain drops',
    tags: ['rain', 'weather'],
    icon: '☔'
  }]},
  {name: 'foods', code: '1f355', data: [
    {
    code: '1F34F',
    shortname: 'green_apple',
    category: 'foods',
    description: 'green apple',
    tags: ['fruit'],
    icon: '🍏'
  }, {
    code: '1F34E',
    shortname: 'apple',
    category: 'foods',
    description: 'red apple',
    tags: [],
    icon: '🍎'
  }, {code: '1F350', shortname: 'pear', category: 'foods', description: 'pear', tags: [], icon: '🍐'}, {
    code: '1F34A',
    shortname: 'tangerine',
    category: 'foods',
    description: 'tangerine',
    tags: [],
    icon: '🍊'
  }, {
    code: '1F34B',
    shortname: 'lemon',
    category: 'foods',
    description: 'lemon',
    tags: [],
    icon: '🍋'
  }, {
    code: '1F34C',
    shortname: 'banana',
    category: 'foods',
    description: 'banana',
    tags: ['fruit'],
    icon: '🍌'
  }, {
    code: '1F349',
    shortname: 'watermelon',
    category: 'foods',
    description: 'watermelon',
    tags: [],
    icon: '🍉'
  }, {
    code: '1F347',
    shortname: 'grapes',
    category: 'foods',
    description: 'grapes',
    tags: [],
    icon: '🍇'
  }, {
    code: '1F353',
    shortname: 'strawberry',
    category: 'foods',
    description: 'strawberry',
    tags: ['fruit'],
    icon: '🍓'
  }, {
    code: '1F348',
    shortname: 'melon',
    category: 'foods',
    description: 'melon',
    tags: [],
    icon: '🍈'
  }, {
    code: '1F352',
    shortname: 'cherries',
    category: 'foods',
    description: 'cherries',
    tags: ['fruit'],
    icon: '🍒'
  }, {
    code: '1F351',
    shortname: 'peach',
    category: 'foods',
    description: 'peach',
    tags: [],
    icon: '🍑'
  }, {
    code: '1F34D',
    shortname: 'pineapple',
    category: 'foods',
    description: 'pineapple',
    tags: [],
    icon: '🍍'
  }, {
    code: '1F345',
    shortname: 'tomato',
    category: 'foods',
    description: 'tomato',
    tags: [],
    icon: '🍅'
  }, {
    code: '1F346',
    shortname: 'eggplant',
    category: 'foods',
    description: 'eggplant',
    tags: ['aubergine'],
    icon: '🍆'
  }, {
    code: '1F33D',
    shortname: 'corn',
    category: 'foods',
    description: 'ear of corn',
    tags: [],
    icon: '🌽'
  }, {
    code: '1F360',
    shortname: 'sweet_potato',
    category: 'foods',
    description: 'roasted sweet potato',
    tags: [],
    icon: '🍠'
  }, {
    code: '1F330',
    shortname: 'chestnut',
    category: 'foods',
    description: 'chestnut',
    tags: [],
    icon: '🌰'
  }, {
    code: '1F36F',
    shortname: 'honey_pot',
    category: 'foods',
    description: 'honey pot',
    tags: [],
    icon: '🍯'
  }, {
    code: '1F35E',
    shortname: 'bread',
    category: 'foods',
    description: 'bread',
    tags: ['toast'],
    icon: '🍞'
  }, {
    code: '1F364',
    shortname: 'fried_shrimp',
    category: 'foods',
    description: 'fried shrimp',
    tags: ['tempura'],
    icon: '🍤'
  }, {
    code: '1F357',
    shortname: 'poultry_leg',
    category: 'foods',
    description: 'poultry leg',
    tags: ['meat', 'chicken'],
    icon: '🍗'
  }, {
    code: '1F356',
    shortname: 'meat_on_bone',
    category: 'foods',
    description: 'meat on bone',
    tags: [],
    icon: '🍖'
  }, {
    code: '1F355',
    shortname: 'pizza',
    category: 'foods',
    description: 'pizza',
    tags: [],
    icon: '🍕'
  }, {
    code: '1F354',
    shortname: 'hamburger',
    category: 'foods',
    description: 'hamburger',
    tags: ['burger'],
    icon: '🍔'
  }, {
    code: '1F35F',
    shortname: 'fries',
    category: 'foods',
    description: 'french fries',
    tags: [],
    icon: '🍟'
  }, {
    code: '1F35D',
    shortname: 'spaghetti',
    category: 'foods',
    description: 'spaghetti',
    tags: ['pasta'],
    icon: '🍝'
  }, {
    code: '1F35C',
    shortname: 'ramen',
    category: 'foods',
    description: 'steaming bowl',
    tags: ['noodle'],
    icon: '🍜'
  }, {
    code: '1F372',
    shortname: 'stew',
    category: 'foods',
    description: 'pot of food',
    tags: [],
    icon: '🍲'
  }, {
    code: '1F365',
    shortname: 'fish_cake',
    category: 'foods',
    description: 'fish cake with swirl',
    tags: [],
    icon: '🍥'
  }, {
    code: '1F363',
    shortname: 'sushi',
    category: 'foods',
    description: 'sushi',
    tags: [],
    icon: '🍣'
  }, {
    code: '1F371',
    shortname: 'bento',
    category: 'foods',
    description: 'bento box',
    tags: [],
    icon: '🍱'
  }, {
    code: '1F35B',
    shortname: 'curry',
    category: 'foods',
    description: 'curry rice',
    tags: [],
    icon: '🍛'
  }, {
    code: '1F359',
    shortname: 'rice_ball',
    category: 'foods',
    description: 'rice ball',
    tags: [],
    icon: '🍙'
  }, {
    code: '1F35A',
    shortname: 'rice',
    category: 'foods',
    description: 'cooked rice',
    tags: [],
    icon: '🍚'
  }, {
    code: '1F358',
    shortname: 'rice_cracker',
    category: 'foods',
    description: 'rice cracker',
    tags: [],
    icon: '🍘'
  }, {code: '1F362', shortname: 'oden', category: 'foods', description: 'oden', tags: [], icon: '🍢'}, {
    code: '1F361',
    shortname: 'dango',
    category: 'foods',
    description: 'dango',
    tags: [],
    icon: '🍡'
  }, {
    code: '1F367',
    shortname: 'shaved_ice',
    category: 'foods',
    description: 'shaved ice',
    tags: [],
    icon: '🍧'
  }, {
    code: '1F368',
    shortname: 'ice_cream',
    category: 'foods',
    description: 'ice cream',
    tags: [],
    icon: '🍨'
  }, {
    code: '1F366',
    shortname: 'icecream',
    category: 'foods',
    description: 'soft ice cream',
    tags: [],
    icon: '🍦'
  }, {
    code: '1F370',
    shortname: 'cake',
    category: 'foods',
    description: 'shortcake',
    tags: ['dessert'],
    icon: '🍰'
  }, {
    code: '1F382',
    shortname: 'birthday',
    category: 'foods',
    description: 'birthday cake',
    tags: ['party'],
    icon: '🎂'
  }, {
    code: '1F36E',
    shortname: 'custard',
    category: 'foods',
    description: 'custard',
    tags: [],
    icon: '🍮'
  }, {
    code: '1F36D',
    shortname: 'lollipop',
    category: 'foods',
    description: 'lollipop',
    tags: [],
    icon: '🍭'
  }, {
    code: '1F36C',
    shortname: 'candy',
    category: 'foods',
    description: 'candy',
    tags: ['sweet'],
    icon: '🍬'
  }, {
    code: '1F36B',
    shortname: 'chocolate_bar',
    category: 'foods',
    description: 'chocolate bar',
    tags: [],
    icon: '🍫'
  }, {
    code: '1F369',
    shortname: 'doughnut',
    category: 'foods',
    description: 'doughnut',
    tags: [],
    icon: '🍩'
  }, {
    code: '1F36A',
    shortname: 'cookie',
    category: 'foods',
    description: 'cookie',
    tags: [],
    icon: '🍪'
  }, {
    code: '1F37C',
    shortname: 'baby_bottle',
    category: 'foods',
    description: 'baby bottle',
    tags: ['milk'],
    icon: '🍼'
  }, {
    code: '2615',
    shortname: 'coffee',
    category: 'foods',
    description: 'hot beverage',
    tags: ['cafe', 'espresso'],
    icon: '☕'
  }, {
    code: '1F375',
    shortname: 'tea',
    category: 'foods',
    description: 'teacup without handle',
    tags: ['green', 'breakfast'],
    icon: '🍵'
  }, {code: '1F376', shortname: 'sake', category: 'foods', description: 'sake', tags: [], icon: '🍶'}, {
    code: '1F37A',
    shortname: 'beer',
    category: 'foods',
    description: 'beer mug',
    tags: ['drink'],
    icon: '🍺'
  }, {
    code: '1F37B',
    shortname: 'beers',
    category: 'foods',
    description: 'clinking beer mugs',
    tags: ['drinks'],
    icon: '🍻'
  }, {
    code: '1F377',
    shortname: 'wine_glass',
    category: 'foods',
    description: 'wine glass',
    tags: [],
    icon: '🍷'
  }, {
    code: '1F378',
    shortname: 'cocktail',
    category: 'foods',
    description: 'cocktail glass',
    tags: ['drink'],
    icon: '🍸'
  }, {
    code: '1F379',
    shortname: 'tropical_drink',
    category: 'foods',
    description: 'tropical drink',
    tags: ['summer', 'vacation'],
    icon: '🍹'
  }, {
    code: '1F374',
    shortname: 'fork_and_knife',
    category: 'foods',
    description: 'fork and knife',
    tags: ['cutlery'],
    icon: '🍴'
  }]},
  {name: 'activity', code: '26bd', data: [
    {
    code: '26BD',
    shortname: 'soccer',
    category: 'activity',
    description: 'soccer ball',
    tags: ['sports'],
    icon: '⚽'
  }, {
    code: '1F3C0',
    shortname: 'basketball',
    category: 'activity',
    description: 'basketball',
    tags: ['sports'],
    icon: '🏀'
  }, {
    code: '1F3C8',
    shortname: 'football',
    category: 'activity',
    description: 'american football',
    tags: ['sports'],
    icon: '🏈'
  }, {
    code: '26BE',
    shortname: 'baseball',
    category: 'activity',
    description: 'baseball',
    tags: ['sports'],
    icon: '⚾'
  }, {
    code: '1F3BE',
    shortname: 'tennis',
    category: 'activity',
    description: 'tennis',
    tags: ['sports'],
    icon: '🎾'
  }, {
    code: '1F3C9',
    shortname: 'rugby_football',
    category: 'activity',
    description: 'rugby football',
    tags: [],
    icon: '🏉'
  }, {
    code: '1F3B1',
    shortname: '8ball',
    category: 'activity',
    description: 'pool 8 ball',
    tags: ['pool', 'billiards'],
    icon: '🎱'
  }, {
    code: '26F3',
    shortname: 'golf',
    category: 'activity',
    description: 'flag in hole',
    tags: [],
    icon: '⛳'
  }, {
    code: '1F3A3',
    shortname: 'fishing_pole_and_fish',
    category: 'activity',
    description: 'fishing pole',
    tags: [],
    icon: '🎣'
  }, {
    code: '1F3BF',
    shortname: 'ski',
    category: 'activity',
    description: 'skis',
    tags: [],
    icon: '🎿'
  }, {
    code: '1F3C2',
    shortname: 'snowboarder',
    category: 'activity',
    description: 'snowboarder',
    tags: [],
    icon: '🏂'
  }, {
    code: '1F3C7',
    shortname: 'horse_racing',
    category: 'activity',
    description: 'horse racing',
    tags: [],
    icon: '🏇'
  }, {
    code: '1F3BD',
    shortname: 'running_shirt_with_sash',
    category: 'activity',
    description: 'running shirt',
    tags: ['marathon'],
    icon: '🎽'
  }, {
    code: '1F3C6',
    shortname: 'trophy',
    category: 'activity',
    description: 'trophy',
    tags: ['award', 'contest', 'winner'],
    icon: '🏆'
  }, {
    code: '1F3AB',
    shortname: 'ticket',
    category: 'activity',
    description: 'ticket',
    tags: [],
    icon: '🎫'
  }, {
    code: '1F3AA',
    shortname: 'circus_tent',
    category: 'activity',
    description: 'circus tent',
    tags: [],
    icon: '🎪'
  }, {
    code: '1F3AD',
    shortname: 'performing_arts',
    category: 'activity',
    description: 'performing arts',
    tags: ['theater', 'drama'],
    icon: '🎭'
  }, {
    code: '1F3A8',
    shortname: 'art',
    category: 'activity',
    description: 'artist palette',
    tags: ['design', 'paint'],
    icon: '🎨'
  }, {
    code: '1F3AC',
    shortname: 'clapper',
    category: 'activity',
    description: 'clapper board',
    tags: ['film'],
    icon: '🎬'
  }, {
    code: '1F3A4',
    shortname: 'microphone',
    category: 'activity',
    description: 'microphone',
    tags: ['sing'],
    icon: '🎤'
  }, {
    code: '1F3A7',
    shortname: 'headphones',
    category: 'activity',
    description: 'headphone',
    tags: ['music', 'earphones'],
    icon: '🎧'
  }, {
    code: '1F3BC',
    shortname: 'musical_score',
    category: 'activity',
    description: 'musical score',
    tags: [],
    icon: '🎼'
  }, {
    code: '1F3B9',
    shortname: 'musical_keyboard',
    category: 'activity',
    description: 'musical keyboard',
    tags: ['piano'],
    icon: '🎹'
  }, {
    code: '1F3B7',
    shortname: 'saxophone',
    category: 'activity',
    description: 'saxophone',
    tags: [],
    icon: '🎷'
  }, {
    code: '1F3BA',
    shortname: 'trumpet',
    category: 'activity',
    description: 'trumpet',
    tags: [],
    icon: '🎺'
  }, {
    code: '1F3B8',
    shortname: 'guitar',
    category: 'activity',
    description: 'guitar',
    tags: ['rock'],
    icon: '🎸'
  }, {
    code: '1F3BB',
    shortname: 'violin',
    category: 'activity',
    description: 'violin',
    tags: [],
    icon: '🎻'
  }, {
    code: '1F3B2',
    shortname: 'game_die',
    category: 'activity',
    description: 'game die',
    tags: ['dice', 'gambling'],
    icon: '🎲'
  }, {
    code: '1F3AF',
    shortname: 'dart',
    category: 'activity',
    description: 'direct hit',
    tags: ['target'],
    icon: '🎯'
  }, {
    code: '1F3B3',
    shortname: 'bowling',
    category: 'activity',
    description: 'bowling',
    tags: [],
    icon: '🎳'
  }, {
    code: '1F3AE',
    shortname: 'video_game',
    category: 'activity',
    description: 'video game',
    tags: ['play', 'controller', 'console'],
    icon: '🎮'
  }, {
    code: '1F3B0',
    shortname: 'slot_machine',
    category: 'activity',
    description: 'slot machine',
    tags: [],
    icon: '🎰'
  }]},
  {name: 'places', code: '1f695', data: [
    {
    code: '1F695',
    shortname: 'taxi',
    category: 'places',
    description: 'taxi',
    tags: [],
    icon: '🚕'
  }, {
    code: '1F699',
    shortname: 'blue_car',
    category: 'places',
    description: 'sport utility vehicle',
    tags: [],
    icon: '🚙'
  }, {code: '1F68C', shortname: 'bus', category: 'places', description: 'bus', tags: [], icon: '🚌'}, {
    code: '1F68E',
    shortname: 'trolleybus',
    category: 'places',
    description: 'trolleybus',
    tags: [],
    icon: '🚎'
  }, {
    code: '1F693',
    shortname: 'police_car',
    category: 'places',
    description: 'police car',
    tags: [],
    icon: '🚓'
  }, {
    code: '1F691',
    shortname: 'ambulance',
    category: 'places',
    description: 'ambulance',
    tags: [],
    icon: '🚑'
  }, {
    code: '1F692',
    shortname: 'fire_engine',
    category: 'places',
    description: 'fire engine',
    tags: [],
    icon: '🚒'
  }, {
    code: '1F690',
    shortname: 'minibus',
    category: 'places',
    description: 'minibus',
    tags: [],
    icon: '🚐'
  }, {
    code: '1F69A',
    shortname: 'truck',
    category: 'places',
    description: 'delivery truck',
    tags: [],
    icon: '🚚'
  }, {
    code: '1F69B',
    shortname: 'articulated_lorry',
    category: 'places',
    description: 'articulated lorry',
    tags: [],
    icon: '🚛'
  }, {
    code: '1F69C',
    shortname: 'tractor',
    category: 'places',
    description: 'tractor',
    tags: [],
    icon: '🚜'
  }, {
    code: '1F6B2',
    shortname: 'bike',
    category: 'places',
    description: 'bicycle',
    tags: ['bicycle'],
    icon: '🚲'
  }, {
    code: '1F6A8',
    shortname: 'rotating_light',
    category: 'places',
    description: 'police car light',
    tags: ['911', 'emergency'],
    icon: '🚨'
  }, {
    code: '1F694',
    shortname: 'oncoming_police_car',
    category: 'places',
    description: 'oncoming police car',
    tags: [],
    icon: '🚔'
  }, {
    code: '1F68D',
    shortname: 'oncoming_bus',
    category: 'places',
    description: 'oncoming bus',
    tags: [],
    icon: '🚍'
  }, {
    code: '1F698',
    shortname: 'oncoming_automobile',
    category: 'places',
    description: 'oncoming automobile',
    tags: [],
    icon: '🚘'
  }, {
    code: '1F696',
    shortname: 'oncoming_taxi',
    category: 'places',
    description: 'oncoming taxi',
    tags: [],
    icon: '🚖'
  }, {
    code: '1F6A1',
    shortname: 'aerial_tramway',
    category: 'places',
    description: 'aerial tramway',
    tags: [],
    icon: '🚡'
  }, {
    code: '1F6A0',
    shortname: 'mountain_cableway',
    category: 'places',
    description: 'mountain cableway',
    tags: [],
    icon: '🚠'
  }, {
    code: '1F69F',
    shortname: 'suspension_railway',
    category: 'places',
    description: 'suspension railway',
    tags: [],
    icon: '🚟'
  }, {
    code: '1F683',
    shortname: 'railway_car',
    category: 'places',
    description: 'railway car',
    tags: [],
    icon: '🚃'
  }, {
    code: '1F68B',
    shortname: 'train',
    category: 'places',
    description: 'tram car',
    tags: [],
    icon: '🚋'
  }, {
    code: '1F69E',
    shortname: 'mountain_railway',
    category: 'places',
    description: 'mountain railway',
    tags: [],
    icon: '🚞'
  }, {
    code: '1F69D',
    shortname: 'monorail',
    category: 'places',
    description: 'monorail',
    tags: [],
    icon: '🚝'
  }, {
    code: '1F684',
    shortname: 'bullettrain_side',
    category: 'places',
    description: 'high-speed train',
    tags: ['train'],
    icon: '🚄'
  }, {
    code: '1F685',
    shortname: 'bullettrain_front',
    category: 'places',
    description: 'high-speed train with bullet nose',
    tags: ['train'],
    icon: '🚅'
  }, {
    code: '1F688',
    shortname: 'light_rail',
    category: 'places',
    description: 'light rail',
    tags: [],
    icon: '🚈'
  }, {
    code: '1F682',
    shortname: 'steam_locomotive',
    category: 'places',
    description: 'locomotive',
    tags: ['train'],
    icon: '🚂'
  }, {
    code: '1F686',
    shortname: 'train2',
    category: 'places',
    description: 'train',
    tags: [],
    icon: '🚆'
  }, {
    code: '1F687',
    shortname: 'metro',
    category: 'places',
    description: 'metro',
    tags: [],
    icon: '🚇'
  }, {
    code: '1F68A',
    shortname: 'tram',
    category: 'places',
    description: 'tram',
    tags: [],
    icon: '🚊'
  }, {
    code: '1F689',
    shortname: 'station',
    category: 'places',
    description: 'station',
    tags: [],
    icon: '🚉'
  }, {
    code: '1F681',
    shortname: 'helicopter',
    category: 'places',
    description: 'helicopter',
    tags: [],
    icon: '🚁'
  }, {
    code: '2708',
    shortname: 'airplane',
    category: 'places',
    description: 'airplane',
    tags: ['flight'],
    icon: '✈'
  }, {
    code: '1F680',
    shortname: 'rocket',
    category: 'places',
    description: 'rocket',
    tags: ['ship', 'launch'],
    icon: '🚀'
  }, {
    code: '1F4BA',
    shortname: 'seat',
    category: 'places',
    description: 'seat',
    tags: [],
    icon: '💺'
  }, {
    code: '1F6A4',
    shortname: 'speedboat',
    category: 'places',
    description: 'speedboat',
    tags: ['ship'],
    icon: '🚤'
  }, {code: '1F6A2', shortname: 'ship', category: 'places', description: 'ship', tags: [], icon: '🚢'}, {
    code: '2693',
    shortname: 'anchor',
    category: 'places',
    description: 'anchor',
    tags: ['ship'],
    icon: '⚓'
  }, {
    code: '1F6A7',
    shortname: 'construction',
    category: 'places',
    description: 'construction',
    tags: ['wip'],
    icon: '🚧'
  }, {
    code: '26FD',
    shortname: 'fuelpump',
    category: 'places',
    description: 'fuel pump',
    tags: [],
    icon: '⛽'
  }, {
    code: '1F68F',
    shortname: 'busstop',
    category: 'places',
    description: 'bus stop',
    tags: [],
    icon: '🚏'
  }, {
    code: '1F6A6',
    shortname: 'vertical_traffic_light',
    category: 'places',
    description: 'vertical traffic light',
    tags: ['semaphore'],
    icon: '🚦'
  }, {
    code: '1F6A5',
    shortname: 'traffic_light',
    category: 'places',
    description: 'horizontal traffic light',
    tags: [],
    icon: '🚥'
  }, {
    code: '1F5FF',
    shortname: 'moyai',
    category: 'places',
    description: 'moai',
    tags: ['stone'],
    icon: '🗿'
  }, {
    code: '1F5FD',
    shortname: 'statue_of_liberty',
    category: 'places',
    description: 'Statue of Liberty',
    tags: [],
    icon: '🗽'
  }, {
    code: '26F2',
    shortname: 'fountain',
    category: 'places',
    description: 'fountain',
    tags: [],
    icon: '⛲'
  }, {
    code: '1F5FC',
    shortname: 'tokyo_tower',
    category: 'places',
    description: 'Tokyo tower',
    tags: [],
    icon: '🗼'
  }, {
    code: '1F3F0',
    shortname: 'european_castle',
    category: 'places',
    description: 'castle',
    tags: [],
    icon: '🏰'
  }, {
    code: '1F3EF',
    shortname: 'japanese_castle',
    category: 'places',
    description: 'Japanese castle',
    tags: [],
    icon: '🏯'
  }, {
    code: '1F3A1',
    shortname: 'ferris_wheel',
    category: 'places',
    description: 'ferris wheel',
    tags: [],
    icon: '🎡'
  }, {
    code: '1F3A2',
    shortname: 'roller_coaster',
    category: 'places',
    description: 'roller coaster',
    tags: [],
    icon: '🎢'
  }, {
    code: '1F3A0',
    shortname: 'carousel_horse',
    category: 'places',
    description: 'carousel horse',
    tags: [],
    icon: '🎠'
  }, {
    code: '1F5FB',
    shortname: 'mount_fuji',
    category: 'places',
    description: 'mount fuji',
    tags: [],
    icon: '🗻'
  }, {
    code: '1F30B',
    shortname: 'volcano',
    category: 'places',
    description: 'volcano',
    tags: [],
    icon: '🌋'
  }, {
    code: '26FA',
    shortname: 'tent',
    category: 'places',
    description: 'tent',
    tags: ['camping'],
    icon: '⛺'
  }, {
    code: '1F3ED',
    shortname: 'factory',
    category: 'places',
    description: 'factory',
    tags: [],
    icon: '🏭'
  }, {
    code: '1F3E0',
    shortname: 'house',
    category: 'places',
    description: 'house',
    tags: [],
    icon: '🏠'
  }, {
    code: '1F3E1',
    shortname: 'house_with_garden',
    category: 'places',
    description: 'house with garden',
    tags: [],
    icon: '🏡'
  }, {
    code: '1F3E2',
    shortname: 'office',
    category: 'places',
    description: 'office building',
    tags: [],
    icon: '🏢'
  }, {
    code: '1F3EC',
    shortname: 'department_store',
    category: 'places',
    description: 'department store',
    tags: [],
    icon: '🏬'
  }, {
    code: '1F3E3',
    shortname: 'post_office',
    category: 'places',
    description: 'Japanese post office',
    tags: [],
    icon: '🏣'
  }, {
    code: '1F3E4',
    shortname: 'european_post_office',
    category: 'places',
    description: 'post office',
    tags: [],
    icon: '🏤'
  }, {
    code: '1F3E5',
    shortname: 'hospital',
    category: 'places',
    description: 'hospital',
    tags: [],
    icon: '🏥'
  }, {
    code: '1F3E6',
    shortname: 'bank',
    category: 'places',
    description: 'bank',
    tags: [],
    icon: '🏦'
  }, {
    code: '1F3E8',
    shortname: 'hotel',
    category: 'places',
    description: 'hotel',
    tags: [],
    icon: '🏨'
  }, {
    code: '1F3EA',
    shortname: 'convenience_store',
    category: 'places',
    description: 'convenience store',
    tags: [],
    icon: '🏪'
  }, {
    code: '1F3EB',
    shortname: 'school',
    category: 'places',
    description: 'school',
    tags: [],
    icon: '🏫'
  }, {
    code: '1F3E9',
    shortname: 'love_hotel',
    category: 'places',
    description: 'love hotel',
    tags: [],
    icon: '🏩'
  }, {
    code: '1F492',
    shortname: 'wedding',
    category: 'places',
    description: 'wedding',
    tags: ['marriage'],
    icon: '💒'
  }, {
    code: '26EA',
    shortname: 'church',
    category: 'places',
    description: 'church',
    tags: [],
    icon: '⛪'
  }, {
    code: '1F5FE',
    shortname: 'japan',
    category: 'places',
    description: 'map of Japan',
    tags: [],
    icon: '🗾'
  }, {
    code: '1F391',
    shortname: 'rice_scene',
    category: 'places',
    description: 'moon viewing ceremony',
    tags: [],
    icon: '🎑'
  }, {
    code: '1F305',
    shortname: 'sunrise',
    category: 'places',
    description: 'sunrise',
    tags: [],
    icon: '🌅'
  }, {
    code: '1F304',
    shortname: 'sunrise_over_mountains',
    category: 'places',
    description: 'sunrise over mountains',
    tags: [],
    icon: '🌄'
  }, {
    code: '1F320',
    shortname: 'stars',
    category: 'places',
    description: 'shooting star',
    tags: [],
    icon: '🌠'
  }, {
    code: '1F387',
    shortname: 'sparkler',
    category: 'places',
    description: 'sparkler',
    tags: [],
    icon: '🎇'
  }, {
    code: '1F386',
    shortname: 'fireworks',
    category: 'places',
    description: 'fireworks',
    tags: ['festival', 'celebration'],
    icon: '🎆'
  }, {
    code: '1F307',
    shortname: 'city_sunset',
    category: 'places',
    description: 'cityscape at dusk',
    tags: [],
    icon: '🌇'
  }, {
    code: '1F303',
    shortname: 'night_with_stars',
    category: 'places',
    description: 'night with stars',
    tags: [],
    icon: '🌃'
  }, {
    code: '1F30C',
    shortname: 'milky_way',
    category: 'places',
    description: 'milky way',
    tags: [],
    icon: '🌌'
  }, {
    code: '1F309',
    shortname: 'bridge_at_night',
    category: 'places',
    description: 'bridge at night',
    tags: [],
    icon: '🌉'
  }, {code: '1F301', shortname: 'foggy', category: 'places', description: 'foggy', tags: ['karl'], icon: '🌁'}]},
  {name: 'objects',  code: '1f4b0', data: [
    {
    code: '231A',
    shortname: 'watch',
    category: 'objects',
    description: 'watch',
    tags: ['time'],
    icon: '⌚'
  }, {
    code: '1F4F1',
    shortname: 'iphone',
    category: 'objects',
    description: 'mobile phone',
    tags: ['smartphone', 'mobile'],
    icon: '📱'
  }, {
    code: '1F4F2',
    shortname: 'calling',
    category: 'objects',
    description: 'mobile phone with arrow',
    tags: ['call', 'incoming'],
    icon: '📲'
  }, {
    code: '1F4BB',
    shortname: 'computer',
    category: 'objects',
    description: 'laptop computer',
    tags: ['desktop', 'screen'],
    icon: '💻'
  }, {
    code: '1F4BD',
    shortname: 'minidisc',
    category: 'objects',
    description: 'computer disk',
    tags: [],
    icon: '💽'
  }, {
    code: '1F4BE',
    shortname: 'floppy_disk',
    category: 'objects',
    description: 'floppy disk',
    tags: ['save'],
    icon: '💾'
  }, {
    code: '1F4BF',
    shortname: 'cd',
    category: 'objects',
    description: 'optical disk',
    tags: [],
    icon: '💿'
  }, {code: '1F4C0', shortname: 'dvd', category: 'objects', description: 'dvd', tags: [], icon: '📀'}, {
    code: '1F4FC',
    shortname: 'vhs',
    category: 'objects',
    description: 'videocassette',
    tags: [],
    icon: '📼'
  }, {
    code: '1F4F7',
    shortname: 'camera',
    category: 'objects',
    description: 'camera',
    tags: ['photo'],
    icon: '📷'
  }, {
    code: '1F4F9',
    shortname: 'video_camera',
    category: 'objects',
    description: 'video camera',
    tags: [],
    icon: '📹'
  }, {
    code: '1F3A5',
    shortname: 'movie_camera',
    category: 'objects',
    description: 'movie camera',
    tags: ['film', 'video'],
    icon: '🎥'
  }, {
    code: '1F4DE',
    shortname: 'telephone_receiver',
    category: 'objects',
    description: 'telephone receiver',
    tags: ['phone', 'call'],
    icon: '📞'
  }, {
    code: '1F4DF',
    shortname: 'pager',
    category: 'objects',
    description: 'pager',
    tags: [],
    icon: '📟'
  }, {
    code: '1F4E0',
    shortname: 'fax',
    category: 'objects',
    description: 'fax machine',
    tags: [],
    icon: '📠'
  }, {
    code: '1F4FA',
    shortname: 'tv',
    category: 'objects',
    description: 'television',
    tags: [],
    icon: '📺'
  }, {
    code: '1F4FB',
    shortname: 'radio',
    category: 'objects',
    description: 'radio',
    tags: ['podcast'],
    icon: '📻'
  }, {
    code: '23F0',
    shortname: 'alarm_clock',
    category: 'objects',
    description: 'alarm clock',
    tags: ['morning'],
    icon: '⏰'
  }, {
    code: '231B',
    shortname: 'hourglass',
    category: 'objects',
    description: 'hourglass',
    tags: ['time'],
    icon: '⌛'
  }, {
    code: '23F3',
    shortname: 'hourglass_flowing_sand',
    category: 'objects',
    description: 'hourglass with flowing sand',
    tags: ['time'],
    icon: '⏳'
  }, {
    code: '1F4E1',
    shortname: 'satellite',
    category: 'objects',
    description: 'satellite antenna',
    tags: ['signal'],
    icon: '📡'
  }, {
    code: '1F50B',
    shortname: 'battery',
    category: 'objects',
    description: 'battery',
    tags: ['power'],
    icon: '🔋'
  }, {
    code: '1F50C',
    shortname: 'electric_plug',
    category: 'objects',
    description: 'electric plug',
    tags: [],
    icon: '🔌'
  }, {
    code: '1F4A1',
    shortname: 'bulb',
    category: 'objects',
    description: 'light bulb',
    tags: ['idea', 'light'],
    icon: '💡'
  }, {
    code: '1F526',
    shortname: 'flashlight',
    category: 'objects',
    description: 'flashlight',
    tags: [],
    icon: '🔦'
  }, {
    code: '1F4B8',
    shortname: 'money_with_wings',
    category: 'objects',
    description: 'money with wings',
    tags: ['dollar'],
    icon: '💸'
  }, {
    code: '1F4B5',
    shortname: 'dollar',
    category: 'objects',
    description: 'dollar banknote',
    tags: ['money'],
    icon: '💵'
  }, {
    code: '1F4B4',
    shortname: 'yen',
    category: 'objects',
    description: 'yen banknote',
    tags: [],
    icon: '💴'
  }, {
    code: '1F4B6',
    shortname: 'euro',
    category: 'objects',
    description: 'euro banknote',
    tags: [],
    icon: '💶'
  }, {
    code: '1F4B7',
    shortname: 'pound',
    category: 'objects',
    description: 'pound banknote',
    tags: [],
    icon: '💷'
  }, {
    code: '1F4B0',
    shortname: 'moneybag',
    category: 'objects',
    description: 'money bag',
    tags: ['dollar', 'cream'],
    icon: '💰'
  }, {
    code: '1F4B3',
    shortname: 'credit_card',
    category: 'objects',
    description: 'credit card',
    tags: ['subscription'],
    icon: '💳'
  }, {
    code: '1F48E',
    shortname: 'gem',
    category: 'objects',
    description: 'gem stone',
    tags: ['diamond'],
    icon: '💎'
  }, {
    code: '1F527',
    shortname: 'wrench',
    category: 'objects',
    description: 'wrench',
    tags: ['tool'],
    icon: '🔧'
  }, {
    code: '1F528',
    shortname: 'hammer',
    category: 'objects',
    description: 'hammer',
    tags: ['tool'],
    icon: '🔨'
  }, {
    code: '1F529',
    shortname: 'nut_and_bolt',
    category: 'objects',
    description: 'nut and bolt',
    tags: [],
    icon: '🔩'
  }, {
    code: '1F52B',
    shortname: 'gun',
    category: 'objects',
    description: 'pistol',
    tags: ['shoot', 'weapon'],
    icon: '🔫'
  }, {
    code: '1F4A3',
    shortname: 'bomb',
    category: 'objects',
    description: 'bomb',
    tags: ['boom'],
    icon: '💣'
  }, {
    code: '1F6AC',
    shortname: 'smoking',
    category: 'objects',
    description: 'cigarette',
    tags: ['cigarette'],
    icon: '🚬'
  }, {
    code: '1F52E',
    shortname: 'crystal_ball',
    category: 'objects',
    description: 'crystal ball',
    tags: ['fortune'],
    icon: '🔮'
  }, {
    code: '1F488',
    shortname: 'barber',
    category: 'objects',
    description: 'barber pole',
    tags: [],
    icon: '💈'
  }, {
    code: '1F52D',
    shortname: 'telescope',
    category: 'objects',
    description: 'telescope',
    tags: [],
    icon: '🔭'
  }, {
    code: '1F52C',
    shortname: 'microscope',
    category: 'objects',
    description: 'microscope',
    tags: ['science', 'laboratory', 'investigate'],
    icon: '🔬'
  }, {
    code: '1F48A',
    shortname: 'pill',
    category: 'objects',
    description: 'pill',
    tags: ['health', 'medicine'],
    icon: '💊'
  }, {
    code: '1F489',
    shortname: 'syringe',
    category: 'objects',
    description: 'syringe',
    tags: ['health', 'hospital', 'needle'],
    icon: '💉'
  }, {
    code: '1F6BD',
    shortname: 'toilet',
    category: 'objects',
    description: 'toilet',
    tags: ['wc'],
    icon: '🚽'
  }, {
    code: '1F6B0',
    shortname: 'potable_water',
    category: 'objects',
    description: 'potable water',
    tags: [],
    icon: '🚰'
  }, {
    code: '1F6BF',
    shortname: 'shower',
    category: 'objects',
    description: 'shower',
    tags: ['bath'],
    icon: '🚿'
  }, {
    code: '1F6C1',
    shortname: 'bathtub',
    category: 'objects',
    description: 'bathtub',
    tags: [],
    icon: '🛁'
  }, {
    code: '1F6C0',
    shortname: 'bath',
    category: 'objects',
    description: 'person taking bath',
    tags: ['shower'],
    icon: '🛀'
  }, {
    code: '1F511',
    shortname: 'key',
    category: 'objects',
    description: 'key',
    tags: ['lock', 'password'],
    icon: '🔑'
  }, {
    code: '1F6AA',
    shortname: 'door',
    category: 'objects',
    description: 'door',
    tags: [],
    icon: '🚪'
  }, {
    code: '1F381',
    shortname: 'gift',
    category: 'objects',
    description: 'wrapped gift',
    tags: ['present', 'birthday', 'christmas'],
    icon: '🎁'
  }, {
    code: '1F388',
    shortname: 'balloon',
    category: 'objects',
    description: 'balloon',
    tags: ['party', 'birthday'],
    icon: '🎈'
  }, {
    code: '1F38F',
    shortname: 'flags',
    category: 'objects',
    description: 'carp streamer',
    tags: [],
    icon: '🎏'
  }, {
    code: '1F380',
    shortname: 'ribbon',
    category: 'objects',
    description: 'ribbon',
    tags: [],
    icon: '🎀'
  }, {
    code: '1F38A',
    shortname: 'confetti_ball',
    category: 'objects',
    description: 'confetti ball',
    tags: [],
    icon: '🎊'
  }, {
    code: '1F389',
    shortname: 'tada',
    category: 'objects',
    description: 'party popper',
    tags: ['hooray', 'party'],
    icon: '🎉'
  }, {
    code: '1F38E',
    shortname: 'dolls',
    category: 'objects',
    description: 'Japanese dolls',
    tags: [],
    icon: '🎎'
  }, {
    code: '1F3EE',
    shortname: 'izakaya_lantern',
    category: 'objects',
    description: 'red paper lantern',
    tags: [],
    icon: '🏮'
  }, {
    code: '1F390',
    shortname: 'wind_chime',
    category: 'objects',
    description: 'wind chime',
    tags: [],
    icon: '🎐'
  }, {
    code: '1F4E9',
    shortname: 'envelope_with_arrow',
    category: 'objects',
    description: 'envelope with arrow',
    tags: [],
    icon: '📩'
  }, {
    code: '1F4E8',
    shortname: 'incoming_envelope',
    category: 'objects',
    description: 'incoming envelope',
    tags: [],
    icon: '📨'
  }, {
    code: '1F4E7',
    shortname: 'e-mail',
    category: 'objects',
    description: 'e-mail',
    tags: [],
    icon: '📧'
  }, {
    code: '1F48C',
    shortname: 'love_letter',
    category: 'objects',
    description: 'love letter',
    tags: ['email', 'envelope'],
    icon: '💌'
  }, {
    code: '1F4E5',
    shortname: 'inbox_tray',
    category: 'objects',
    description: 'inbox tray',
    tags: [],
    icon: '📥'
  }, {
    code: '1F4E4',
    shortname: 'outbox_tray',
    category: 'objects',
    description: 'outbox tray',
    tags: [],
    icon: '📤'
  }, {
    code: '1F4E6',
    shortname: 'package',
    category: 'objects',
    description: 'package',
    tags: ['shipping'],
    icon: '📦'
  }, {
    code: '1F4EA',
    shortname: 'mailbox_closed',
    category: 'objects',
    description: 'closed mailbox with lowered flag',
    tags: [],
    icon: '📪'
  }, {
    code: '1F4EB',
    shortname: 'mailbox',
    category: 'objects',
    description: 'closed mailbox with raised flag',
    tags: [],
    icon: '📫'
  }, {
    code: '1F4EC',
    shortname: 'mailbox_with_mail',
    category: 'objects',
    description: 'open mailbox with raised flag',
    tags: [],
    icon: '📬'
  }, {
    code: '1F4ED',
    shortname: 'mailbox_with_no_mail',
    category: 'objects',
    description: 'open mailbox with lowered flag',
    tags: [],
    icon: '📭'
  }, {
    code: '1F4EE',
    shortname: 'postbox',
    category: 'objects',
    description: 'postbox',
    tags: [],
    icon: '📮'
  }, {
    code: '1F4EF',
    shortname: 'postal_horn',
    category: 'objects',
    description: 'postal horn',
    tags: [],
    icon: '📯'
  }, {
    code: '1F4DC',
    shortname: 'scroll',
    category: 'objects',
    description: 'scroll',
    tags: ['document'],
    icon: '📜'
  }, {
    code: '1F4C3',
    shortname: 'page_with_curl',
    category: 'objects',
    description: 'page with curl',
    tags: [],
    icon: '📃'
  }, {
    code: '1F4C4',
    shortname: 'page_facing_up',
    category: 'objects',
    description: 'page facing up',
    tags: ['document'],
    icon: '📄'
  }, {
    code: '1F4D1',
    shortname: 'bookmark_tabs',
    category: 'objects',
    description: 'bookmark tabs',
    tags: [],
    icon: '📑'
  }, {
    code: '1F4CA',
    shortname: 'bar_chart',
    category: 'objects',
    description: 'bar chart',
    tags: ['stats', 'metrics'],
    icon: '📊'
  }, {
    code: '1F4C8',
    shortname: 'chart_with_upwards_trend',
    category: 'objects',
    description: 'chart increasing',
    tags: ['graph', 'metrics'],
    icon: '📈'
  }, {
    code: '1F4C9',
    shortname: 'chart_with_downwards_trend',
    category: 'objects',
    description: 'chart decreasing',
    tags: ['graph', 'metrics'],
    icon: '📉'
  }, {
    code: '1F4C6',
    shortname: 'calendar',
    category: 'objects',
    description: 'tear-off calendar',
    tags: ['schedule'],
    icon: '📆'
  }, {
    code: '1F4C5',
    shortname: 'date',
    category: 'objects',
    description: 'calendar',
    tags: ['calendar', 'schedule'],
    icon: '📅'
  }, {
    code: '1F4C7',
    shortname: 'card_index',
    category: 'objects',
    description: 'card index',
    tags: [],
    icon: '📇'
  }, {
    code: '1F4CB',
    shortname: 'clipboard',
    category: 'objects',
    description: 'clipboard',
    tags: [],
    icon: '📋'
  }, {
    code: '1F4C1',
    shortname: 'file_folder',
    category: 'objects',
    description: 'file folder',
    tags: ['directory'],
    icon: '📁'
  }, {
    code: '1F4C2',
    shortname: 'open_file_folder',
    category: 'objects',
    description: 'open file folder',
    tags: [],
    icon: '📂'
  }, {
    code: '1F4F0',
    shortname: 'newspaper',
    category: 'objects',
    description: 'newspaper',
    tags: ['press'],
    icon: '📰'
  }, {
    code: '1F4D3',
    shortname: 'notebook',
    category: 'objects',
    description: 'notebook',
    tags: [],
    icon: '📓'
  }, {
    code: '1F4D4',
    shortname: 'notebook_with_decorative_cover',
    category: 'objects',
    description: 'notebook with decorative cover',
    tags: [],
    icon: '📔'
  }, {
    code: '1F4D2',
    shortname: 'ledger',
    category: 'objects',
    description: 'ledger',
    tags: [],
    icon: '📒'
  }, {
    code: '1F4D5',
    shortname: 'closed_book',
    category: 'objects',
    description: 'closed book',
    tags: [],
    icon: '📕'
  }, {
    code: '1F4D7',
    shortname: 'green_book',
    category: 'objects',
    description: 'green book',
    tags: [],
    icon: '📗'
  }, {
    code: '1F4D8',
    shortname: 'blue_book',
    category: 'objects',
    description: 'blue book',
    tags: [],
    icon: '📘'
  }, {
    code: '1F4D9',
    shortname: 'orange_book',
    category: 'objects',
    description: 'orange book',
    tags: [],
    icon: '📙'
  }, {
    code: '1F4DA',
    shortname: 'books',
    category: 'objects',
    description: 'books',
    tags: ['library'],
    icon: '📚'
  }, {
    code: '1F4D6',
    shortname: 'book',
    category: 'objects',
    description: 'open book',
    tags: [],
    icon: '📖'
  }, {
    code: '1F516',
    shortname: 'bookmark',
    category: 'objects',
    description: 'bookmark',
    tags: [],
    icon: '🔖'
  }, {
    code: '1F517',
    shortname: 'link',
    category: 'objects',
    description: 'link',
    tags: [],
    icon: '🔗'
  }, {
    code: '1F4CE',
    shortname: 'paperclip',
    category: 'objects',
    description: 'paperclip',
    tags: [],
    icon: '📎'
  }, {
    code: '1F4D0',
    shortname: 'triangular_ruler',
    category: 'objects',
    description: 'triangular ruler',
    tags: [],
    icon: '📐'
  }, {
    code: '1F4CF',
    shortname: 'straight_ruler',
    category: 'objects',
    description: 'straight ruler',
    tags: [],
    icon: '📏'
  }, {
    code: '1F4CC',
    shortname: 'pushpin',
    category: 'objects',
    description: 'pushpin',
    tags: ['location'],
    icon: '📌'
  }, {
    code: '1F4CD',
    shortname: 'round_pushpin',
    category: 'objects',
    description: 'round pushpin',
    tags: ['location'],
    icon: '📍'
  }, {
    code: '2702',
    shortname: 'scissors',
    category: 'objects',
    description: 'scissors',
    tags: ['cut'],
    icon: '✂'
  }, {
    code: '2712',
    shortname: 'black_nib',
    category: 'objects',
    description: 'black nib',
    tags: [],
    icon: '✒'
  }, {
    code: '270F',
    shortname: 'pencil2',
    category: 'objects',
    description: 'pencil',
    tags: [],
    icon: '✏'
  }, {
    code: '1F50D',
    shortname: 'mag',
    category: 'objects',
    description: 'left-pointing magnifying glass',
    tags: ['search', 'zoom'],
    icon: '🔍'
  }, {
    code: '1F50E',
    shortname: 'mag_right',
    category: 'objects',
    description: 'right-pointing magnifying glass',
    tags: [],
    icon: '🔎'
  }, {
    code: '1F50F',
    shortname: 'lock_with_ink_pen',
    category: 'objects',
    description: 'locked with pen',
    tags: [],
    icon: '🔏'
  }, {
    code: '1F510',
    shortname: 'closed_lock_with_key',
    category: 'objects',
    description: 'locked with key',
    tags: ['security'],
    icon: '🔐'
  }, {
    code: '1F512',
    shortname: 'lock',
    category: 'objects',
    description: 'locked',
    tags: ['security', 'private'],
    icon: '🔒'
  }, {
    code: '1F513',
    shortname: 'unlock',
    category: 'objects',
    description: 'unlocked',
    tags: ['security'],
    icon: '🔓'
  }]},
  {name: 'symbols', code: '26a0', data: [
    {
    code: '2764',
    shortname: 'heart',
    category: 'symbols',
    description: 'red heart',
    tags: ['love'],
    icon: '❤'
  }, {
    code: '1F49B',
    shortname: 'yellow_heart',
    category: 'symbols',
    description: 'yellow heart',
    tags: [],
    icon: '💛'
  }, {
    code: '1F49A',
    shortname: 'green_heart',
    category: 'symbols',
    description: 'green heart',
    tags: [],
    icon: '💚'
  }, {
    code: '1F499',
    shortname: 'blue_heart',
    category: 'symbols',
    description: 'blue heart',
    tags: [],
    icon: '💙'
  }, {
    code: '1F49C',
    shortname: 'purple_heart',
    category: 'symbols',
    description: 'purple heart',
    tags: [],
    icon: '💜'
  }, {
    code: '1F494',
    shortname: 'broken_heart',
    category: 'symbols',
    description: 'broken heart',
    tags: [],
    icon: '💔'
  }, {
    code: '1F495',
    shortname: 'two_hearts',
    category: 'symbols',
    description: 'two hearts',
    tags: [],
    icon: '💕'
  }, {
    code: '1F49E',
    shortname: 'revolving_hearts',
    category: 'symbols',
    description: 'revolving hearts',
    tags: [],
    icon: '💞'
  }, {
    code: '1F493',
    shortname: 'heartbeat',
    category: 'symbols',
    description: 'beating heart',
    tags: [],
    icon: '💓'
  }, {
    code: '1F497',
    shortname: 'heartpulse',
    category: 'symbols',
    description: 'growing heart',
    tags: [],
    icon: '💗'
  }, {
    code: '1F496',
    shortname: 'sparkling_heart',
    category: 'symbols',
    description: 'sparkling heart',
    tags: [],
    icon: '💖'
  }, {
    code: '1F498',
    shortname: 'cupid',
    category: 'symbols',
    description: 'heart with arrow',
    tags: ['love', 'heart'],
    icon: '💘'
  }, {
    code: '1F49D',
    shortname: 'gift_heart',
    category: 'symbols',
    description: 'heart with ribbon',
    tags: ['chocolates'],
    icon: '💝'
  }, {
    code: '1F49F',
    shortname: 'heart_decoration',
    category: 'symbols',
    description: 'heart decoration',
    tags: [],
    icon: '💟'
  }, {
    code: '1F52F',
    shortname: 'six_pointed_star',
    category: 'symbols',
    description: 'dotted six-pointed star',
    tags: [],
    icon: '🔯'
  }, {
    code: '26CE',
    shortname: 'ophiuchus',
    category: 'symbols',
    description: 'Ophiuchus',
    tags: [],
    icon: '⛎'
  }, {
    code: '2648',
    shortname: 'aries',
    category: 'symbols',
    description: 'Aries',
    tags: [],
    icon: '♈'
  }, {
    code: '2649',
    shortname: 'taurus',
    category: 'symbols',
    description: 'Taurus',
    tags: [],
    icon: '♉'
  }, {
    code: '264A',
    shortname: 'gemini',
    category: 'symbols',
    description: 'Gemini',
    tags: [],
    icon: '♊'
  }, {
    code: '264B',
    shortname: 'cancer',
    category: 'symbols',
    description: 'Cancer',
    tags: [],
    icon: '♋'
  }, {code: '264C', shortname: 'leo', category: 'symbols', description: 'Leo', tags: [], icon: '♌'}, {
    code: '264D',
    shortname: 'virgo',
    category: 'symbols',
    description: 'Virgo',
    tags: [],
    icon: '♍'
  }, {
    code: '264E',
    shortname: 'libra',
    category: 'symbols',
    description: 'Libra',
    tags: [],
    icon: '♎'
  }, {
    code: '264F',
    shortname: 'scorpius',
    category: 'symbols',
    description: 'Scorpius',
    tags: [],
    icon: '♏'
  }, {
    code: '2650',
    shortname: 'sagittarius',
    category: 'symbols',
    description: 'Sagittarius',
    tags: [],
    icon: '♐'
  }, {
    code: '2651',
    shortname: 'capricorn',
    category: 'symbols',
    description: 'Capricorn',
    tags: [],
    icon: '♑'
  }, {
    code: '2652',
    shortname: 'aquarius',
    category: 'symbols',
    description: 'Aquarius',
    tags: [],
    icon: '♒'
  }, {
    code: '2653',
    shortname: 'pisces',
    category: 'symbols',
    description: 'Pisces',
    tags: [],
    icon: '♓'
  }, {
    code: '1F194',
    shortname: 'id',
    category: 'symbols',
    description: 'ID button',
    tags: [],
    icon: '🆔'
  }, {
    code: '1F251',
    shortname: 'accept',
    category: 'symbols',
    description: 'Japanese “acceptable” button',
    tags: [],
    icon: '🉑'
  }, {
    code: '1F4F4',
    shortname: 'mobile_phone_off',
    category: 'symbols',
    description: 'mobile phone off',
    tags: ['mute', 'off'],
    icon: '📴'
  }, {
    code: '1F4F3',
    shortname: 'vibration_mode',
    category: 'symbols',
    description: 'vibration mode',
    tags: [],
    icon: '📳'
  }, {
    code: '1F236',
    shortname: 'u6709',
    category: 'symbols',
    description: 'Japanese “not free of charge” button',
    tags: [],
    icon: '🈶'
  }, {
    code: '1F21A',
    shortname: 'u7121',
    category: 'symbols',
    description: 'Japanese “free of charge” button',
    tags: [],
    icon: '🈚'
  }, {
    code: '1F238',
    shortname: 'u7533',
    category: 'symbols',
    description: 'Japanese “application” button',
    tags: [],
    icon: '🈸'
  }, {
    code: '1F23A',
    shortname: 'u55b6',
    category: 'symbols',
    description: 'Japanese “open for business” button',
    tags: [],
    icon: '🈺'
  }, {
    code: '1F237',
    shortname: 'u6708',
    category: 'symbols',
    description: 'Japanese “monthly amount” button',
    tags: [],
    icon: '🈷'
  }, {
    code: '2734',
    shortname: 'eight_pointed_black_star',
    category: 'symbols',
    description: 'eight-pointed star',
    tags: [],
    icon: '✴'
  }, {
    code: '1F19A',
    shortname: 'vs',
    category: 'symbols',
    description: 'VS button',
    tags: [],
    icon: '🆚'
  }, {
    code: '1F4AE',
    shortname: 'white_flower',
    category: 'symbols',
    description: 'white flower',
    tags: [],
    icon: '💮'
  }, {
    code: '1F250',
    shortname: 'ideograph_advantage',
    category: 'symbols',
    description: 'Japanese “bargain” button',
    tags: [],
    icon: '🉐'
  }, {
    code: '3299',
    shortname: 'secret',
    category: 'symbols',
    description: 'Japanese “secret” button',
    tags: [],
    icon: '㊙'
  }, {
    code: '3297',
    shortname: 'congratulations',
    category: 'symbols',
    description: 'Japanese “congratulations” button',
    tags: [],
    icon: '㊗'
  }, {
    code: '1F234',
    shortname: 'u5408',
    category: 'symbols',
    description: 'Japanese “passing grade” button',
    tags: [],
    icon: '🈴'
  }, {
    code: '1F235',
    shortname: 'u6e80',
    category: 'symbols',
    description: 'Japanese “no vacancy” button',
    tags: [],
    icon: '🈵'
  }, {
    code: '1F239',
    shortname: 'u5272',
    category: 'symbols',
    description: 'Japanese “discount” button',
    tags: [],
    icon: '🈹'
  }, {
    code: '1F232',
    shortname: 'u7981',
    category: 'symbols',
    description: 'Japanese “prohibited” button',
    tags: [],
    icon: '🈲'
  }, {
    code: '1F170',
    shortname: 'a',
    category: 'symbols',
    description: 'A button (blood type)',
    tags: [],
    icon: '🅰'
  }, {
    code: '1F171',
    shortname: 'b',
    category: 'symbols',
    description: 'B button (blood type)',
    tags: [],
    icon: '🅱'
  }, {
    code: '1F18E',
    shortname: 'ab',
    category: 'symbols',
    description: 'AB button (blood type)',
    tags: [],
    icon: '🆎'
  }, {
    code: '1F191',
    shortname: 'cl',
    category: 'symbols',
    description: 'CL button',
    tags: [],
    icon: '🆑'
  }, {
    code: '1F17E',
    shortname: 'o2',
    category: 'symbols',
    description: 'O button (blood type)',
    tags: [],
    icon: '🅾'
  }, {
    code: '1F198',
    shortname: 'sos',
    category: 'symbols',
    description: 'SOS button',
    tags: ['help', 'emergency'],
    icon: '🆘'
  }, {
    code: '274C',
    shortname: 'x',
    category: 'symbols',
    description: 'cross mark',
    tags: [],
    icon: '❌'
  }, {
    code: '2B55',
    shortname: 'o',
    category: 'symbols',
    description: 'heavy large circle',
    tags: [],
    icon: '⭕'
  }, {
    code: '26D4',
    shortname: 'no_entry',
    category: 'symbols',
    description: 'no entry',
    tags: ['limit'],
    icon: '⛔'
  }, {
    code: '1F4DB',
    shortname: 'name_badge',
    category: 'symbols',
    description: 'name badge',
    tags: [],
    icon: '📛'
  }, {
    code: '1F6AB',
    shortname: 'no_entry_sign',
    category: 'symbols',
    description: 'prohibited',
    tags: ['block', 'forbidden'],
    icon: '🚫'
  }, {
    code: '1F4AF',
    shortname: '100',
    category: 'symbols',
    description: 'hundred points',
    tags: ['score', 'perfect'],
    icon: '💯'
  }, {
    code: '1F4A2',
    shortname: 'anger',
    category: 'symbols',
    description: 'anger symbol',
    tags: ['angry'],
    icon: '💢'
  }, {
    code: '2668',
    shortname: 'hotsprings',
    category: 'symbols',
    description: 'hot springs',
    tags: [],
    icon: '♨'
  }, {
    code: '1F6B7',
    shortname: 'no_pedestrians',
    category: 'symbols',
    description: 'no pedestrians',
    tags: [],
    icon: '🚷'
  }, {
    code: '1F6AF',
    shortname: 'do_not_litter',
    category: 'symbols',
    description: 'no littering',
    tags: [],
    icon: '🚯'
  }, {
    code: '1F6B3',
    shortname: 'no_bicycles',
    category: 'symbols',
    description: 'no bicycles',
    tags: [],
    icon: '🚳'
  }, {
    code: '1F6B1',
    shortname: 'non-potable_water',
    category: 'symbols',
    description: 'non-potable water',
    tags: [],
    icon: '🚱'
  }, {
    code: '1F51E',
    shortname: 'underage',
    category: 'symbols',
    description: 'no one under eighteen',
    tags: [],
    icon: '🔞'
  }, {
    code: '1F4F5',
    shortname: 'no_mobile_phones',
    category: 'symbols',
    description: 'no mobile phones',
    tags: [],
    icon: '📵'
  }, {
    code: '1F6AD',
    shortname: 'no_smoking',
    category: 'symbols',
    description: 'no smoking',
    tags: [],
    icon: '🚭'
  }, {
    code: '2757',
    shortname: 'exclamation',
    category: 'symbols',
    description: 'exclamation mark',
    tags: ['bang'],
    icon: '❗'
  }, {
    code: '2755',
    shortname: 'grey_exclamation',
    category: 'symbols',
    description: 'white exclamation mark',
    tags: [],
    icon: '❕'
  }, {
    code: '2753',
    shortname: 'question',
    category: 'symbols',
    description: 'question mark',
    tags: ['confused'],
    icon: '❓'
  }, {
    code: '2754',
    shortname: 'grey_question',
    category: 'symbols',
    description: 'white question mark',
    tags: [],
    icon: '❔'
  }, {
    code: '203C',
    shortname: 'bangbang',
    category: 'symbols',
    description: 'double exclamation mark',
    tags: [],
    icon: '‼'
  }, {
    code: '2049',
    shortname: 'interrobang',
    category: 'symbols',
    description: 'exclamation question mark',
    tags: [],
    icon: '⁉'
  }, {
    code: '1F505',
    shortname: 'low_brightness',
    category: 'symbols',
    description: 'dim button',
    tags: [],
    icon: '🔅'
  }, {
    code: '1F506',
    shortname: 'high_brightness',
    category: 'symbols',
    description: 'bright button',
    tags: [],
    icon: '🔆'
  }, {
    code: '303D',
    shortname: 'part_alternation_mark',
    category: 'symbols',
    description: 'part alternation mark',
    tags: [],
    icon: '〽'
  }, {
    code: '26A0',
    shortname: 'warning',
    category: 'symbols',
    description: 'warning',
    tags: ['wip'],
    icon: '⚠'
  }, {
    code: '1F6B8',
    shortname: 'children_crossing',
    category: 'symbols',
    description: 'children crossing',
    tags: [],
    icon: '🚸'
  }, {
    code: '1F531',
    shortname: 'trident',
    category: 'symbols',
    description: 'trident emblem',
    tags: [],
    icon: '🔱'
  }, {
    code: '1F530',
    shortname: 'beginner',
    category: 'symbols',
    description: 'Japanese symbol for beginner',
    tags: [],
    icon: '🔰'
  }, {
    code: '267B',
    shortname: 'recycle',
    category: 'symbols',
    description: 'recycling symbol',
    tags: ['environment', 'green'],
    icon: '♻'
  }, {
    code: '2705',
    shortname: 'white_check_mark',
    category: 'symbols',
    description: 'white heavy check mark',
    tags: [],
    icon: '✅'
  }, {
    code: '1F22F',
    shortname: 'u6307',
    category: 'symbols',
    description: 'Japanese “reserved” button',
    tags: [],
    icon: '🈯'
  }, {
    code: '1F4B9',
    shortname: 'chart',
    category: 'symbols',
    description: 'chart increasing with yen',
    tags: [],
    icon: '💹'
  }, {
    code: '2747',
    shortname: 'sparkle',
    category: 'symbols',
    description: 'sparkle',
    tags: [],
    icon: '❇'
  }, {
    code: '2733',
    shortname: 'eight_spoked_asterisk',
    category: 'symbols',
    description: 'eight-spoked asterisk',
    tags: [],
    icon: '✳'
  }, {
    code: '274E',
    shortname: 'negative_squared_cross_mark',
    category: 'symbols',
    description: 'cross mark button',
    tags: [],
    icon: '❎'
  }, {
    code: '1F310',
    shortname: 'globe_with_meridians',
    category: 'symbols',
    description: 'globe with meridians',
    tags: ['world', 'global', 'international'],
    icon: '🌐'
  }, {
    code: '1F4A0',
    shortname: 'diamond_shape_with_a_dot_inside',
    category: 'symbols',
    description: 'diamond with a dot',
    tags: [],
    icon: '💠'
  }, {
    code: '24C2',
    shortname: 'm',
    category: 'symbols',
    description: 'circled M',
    tags: [],
    icon: 'Ⓜ'
  }, {
    code: '1F300',
    shortname: 'cyclone',
    category: 'symbols',
    description: 'cyclone',
    tags: ['swirl'],
    icon: '🌀'
  }, {
    code: '1F4A4',
    shortname: 'zzz',
    category: 'symbols',
    description: 'zzz',
    tags: ['sleeping'],
    icon: '💤'
  }, {
    code: '1F3E7',
    shortname: 'atm',
    category: 'symbols',
    description: 'ATM sign',
    tags: [],
    icon: '🏧'
  }, {
    code: '1F6BE',
    shortname: 'wc',
    category: 'symbols',
    description: 'water closet',
    tags: ['toilet', 'restroom'],
    icon: '🚾'
  }, {
    code: '267F',
    shortname: 'wheelchair',
    category: 'symbols',
    description: 'wheelchair symbol',
    tags: ['accessibility'],
    icon: '♿'
  }, {
    code: '1F17F',
    shortname: 'parking',
    category: 'symbols',
    description: 'P button',
    tags: [],
    icon: '🅿'
  }, {
    code: '1F233',
    shortname: 'u7a7a',
    category: 'symbols',
    description: 'Japanese “vacancy” button',
    tags: [],
    icon: '🈳'
  }, {
    code: '1F202',
    shortname: 'sa',
    category: 'symbols',
    description: 'Japanese “service charge” button',
    tags: [],
    icon: '🈂'
  }, {
    code: '1F6C2',
    shortname: 'passport_control',
    category: 'symbols',
    description: 'passport control',
    tags: [],
    icon: '🛂'
  }, {
    code: '1F6C3',
    shortname: 'customs',
    category: 'symbols',
    description: 'customs',
    tags: [],
    icon: '🛃'
  }, {
    code: '1F6C4',
    shortname: 'baggage_claim',
    category: 'symbols',
    description: 'baggage claim',
    tags: ['airport'],
    icon: '🛄'
  }, {
    code: '1F6C5',
    shortname: 'left_luggage',
    category: 'symbols',
    description: 'left luggage',
    tags: [],
    icon: '🛅'
  }, {
    code: '1F6B9',
    shortname: 'mens',
    category: 'symbols',
    description: 'men’s room',
    tags: [],
    icon: '🚹'
  }, {
    code: '1F6BA',
    shortname: 'womens',
    category: 'symbols',
    description: 'women’s room',
    tags: [],
    icon: '🚺'
  }, {
    code: '1F6BC',
    shortname: 'baby_symbol',
    category: 'symbols',
    description: 'baby symbol',
    tags: [],
    icon: '🚼'
  }, {
    code: '1F6BB',
    shortname: 'restroom',
    category: 'symbols',
    description: 'restroom',
    tags: ['toilet'],
    icon: '🚻'
  }, {
    code: '1F6AE',
    shortname: 'put_litter_in_its_place',
    category: 'symbols',
    description: 'litter in bin sign',
    tags: [],
    icon: '🚮'
  }, {
    code: '1F3A6',
    shortname: 'cinema',
    category: 'symbols',
    description: 'cinema',
    tags: ['film', 'movie'],
    icon: '🎦'
  }, {
    code: '1F4F6',
    shortname: 'signal_strength',
    category: 'symbols',
    description: 'antenna bars',
    tags: ['wifi'],
    icon: '📶'
  }, {
    code: '1F201',
    shortname: 'koko',
    category: 'symbols',
    description: 'Japanese “here” button',
    tags: [],
    icon: '🈁'
  }, {
    code: '1F523',
    shortname: 'symbols',
    category: 'symbols',
    description: 'input symbols',
    tags: [],
    icon: '🔣'
  }, {
    code: '2139',
    shortname: 'information_source',
    category: 'symbols',
    description: 'information',
    tags: [],
    icon: 'ℹ'
  }, {
    code: '1F524',
    shortname: 'abc',
    category: 'symbols',
    description: 'input latin letters',
    tags: ['alphabet'],
    icon: '🔤'
  }, {
    code: '1F521',
    shortname: 'abcd',
    category: 'symbols',
    description: 'input latin lowercase',
    tags: [],
    icon: '🔡'
  }, {
    code: '1F520',
    shortname: 'capital_abcd',
    category: 'symbols',
    description: 'input latin uppercase',
    tags: ['letters'],
    icon: '🔠'
  }, {
    code: '1F196',
    shortname: 'ng',
    category: 'symbols',
    description: 'NG button',
    tags: [],
    icon: '🆖'
  }, {
    code: '1F197',
    shortname: 'ok',
    category: 'symbols',
    description: 'OK button',
    tags: ['yes'],
    icon: '🆗'
  }, {
    code: '1F199',
    shortname: 'up',
    category: 'symbols',
    description: 'UP! button',
    tags: [],
    icon: '🆙'
  }, {
    code: '1F192',
    shortname: 'cool',
    category: 'symbols',
    description: 'COOL button',
    tags: [],
    icon: '🆒'
  }, {
    code: '1F195',
    shortname: 'new',
    category: 'symbols',
    description: 'NEW button',
    tags: ['fresh'],
    icon: '🆕'
  }, {
    code: '1F193',
    shortname: 'free',
    category: 'symbols',
    description: 'FREE button',
    tags: [],
    icon: '🆓'
  }, {
    code: '1F51F',
    shortname: 'keycap_ten',
    category: 'symbols',
    description: 'keycap 10',
    tags: [],
    icon: '🔟'
  }, {
    code: '1F522',
    shortname: '1234',
    category: 'symbols',
    description: 'input numbers',
    tags: ['numbers'],
    icon: '🔢'
  }, {
    code: '25B6',
    shortname: 'arrow_forward',
    category: 'symbols',
    description: 'play button',
    tags: [],
    icon: '▶'
  }, {
    code: '23E9',
    shortname: 'fast_forward',
    category: 'symbols',
    description: 'fast-forward button',
    tags: [],
    icon: '⏩'
  }, {
    code: '23EA',
    shortname: 'rewind',
    category: 'symbols',
    description: 'fast reverse button',
    tags: [],
    icon: '⏪'
  }, {
    code: '23EB',
    shortname: 'arrow_double_up',
    category: 'symbols',
    description: 'fast up button',
    tags: [],
    icon: '⏫'
  }, {
    code: '23EC',
    shortname: 'arrow_double_down',
    category: 'symbols',
    description: 'fast down button',
    tags: [],
    icon: '⏬'
  }, {
    code: '25C0',
    shortname: 'arrow_backward',
    category: 'symbols',
    description: 'reverse button',
    tags: [],
    icon: '◀'
  }, {
    code: '1F53C',
    shortname: 'arrow_up_small',
    category: 'symbols',
    description: 'up button',
    tags: [],
    icon: '🔼'
  }, {
    code: '1F53D',
    shortname: 'arrow_down_small',
    category: 'symbols',
    description: 'down button',
    tags: [],
    icon: '🔽'
  }, {
    code: '27A1',
    shortname: 'arrow_right',
    category: 'symbols',
    description: 'right arrow',
    tags: [],
    icon: '➡'
  }, {
    code: '2B05',
    shortname: 'arrow_left',
    category: 'symbols',
    description: 'left arrow',
    tags: [],
    icon: '⬅'
  }, {
    code: '2B06',
    shortname: 'arrow_up',
    category: 'symbols',
    description: 'up arrow',
    tags: [],
    icon: '⬆'
  }, {
    code: '2B07',
    shortname: 'arrow_down',
    category: 'symbols',
    description: 'down arrow',
    tags: [],
    icon: '⬇'
  }, {
    code: '2197',
    shortname: 'arrow_upper_right',
    category: 'symbols',
    description: 'up-right arrow',
    tags: [],
    icon: '↗'
  }, {
    code: '2198',
    shortname: 'arrow_lower_right',
    category: 'symbols',
    description: 'down-right arrow',
    tags: [],
    icon: '↘'
  }, {
    code: '2199',
    shortname: 'arrow_lower_left',
    category: 'symbols',
    description: 'down-left arrow',
    tags: [],
    icon: '↙'
  }, {
    code: '2196',
    shortname: 'arrow_upper_left',
    category: 'symbols',
    description: 'up-left arrow',
    tags: [],
    icon: '↖'
  }, {
    code: '2195',
    shortname: 'arrow_up_down',
    category: 'symbols',
    description: 'up-down arrow',
    tags: [],
    icon: '↕'
  }, {
    code: '2194',
    shortname: 'left_right_arrow',
    category: 'symbols',
    description: 'left-right arrow',
    tags: [],
    icon: '↔'
  }, {
    code: '21AA',
    shortname: 'arrow_right_hook',
    category: 'symbols',
    description: 'left arrow curving right',
    tags: [],
    icon: '↪'
  }, {
    code: '21A9',
    shortname: 'leftwards_arrow_with_hook',
    category: 'symbols',
    description: 'right arrow curving left',
    tags: ['return'],
    icon: '↩'
  }, {
    code: '2934',
    shortname: 'arrow_heading_up',
    category: 'symbols',
    description: 'right arrow curving up',
    tags: [],
    icon: '⤴'
  }, {
    code: '2935',
    shortname: 'arrow_heading_down',
    category: 'symbols',
    description: 'right arrow curving down',
    tags: [],
    icon: '⤵'
  }, {
    code: '1F500',
    shortname: 'twisted_rightwards_arrows',
    category: 'symbols',
    description: 'shuffle tracks button',
    tags: ['shuffle'],
    icon: '🔀'
  }, {
    code: '1F501',
    shortname: 'repeat',
    category: 'symbols',
    description: 'repeat button',
    tags: ['loop'],
    icon: '🔁'
  }, {
    code: '1F502',
    shortname: 'repeat_one',
    category: 'symbols',
    description: 'repeat single button',
    tags: [],
    icon: '🔂'
  }, {
    code: '1F504',
    shortname: 'arrows_counterclockwise',
    category: 'symbols',
    description: 'anticlockwise arrows button',
    tags: ['sync'],
    icon: '🔄'
  }, {
    code: '1F503',
    shortname: 'arrows_clockwise',
    category: 'symbols',
    description: 'clockwise vertical arrows',
    tags: [],
    icon: '🔃'
  }, {
    code: '1F3B5',
    shortname: 'musical_note',
    category: 'symbols',
    description: 'musical note',
    tags: [],
    icon: '🎵'
  }, {
    code: '1F3B6',
    shortname: 'notes',
    category: 'symbols',
    description: 'musical notes',
    tags: ['music'],
    icon: '🎶'
  }, {
    code: '2795',
    shortname: 'heavy_plus_sign',
    category: 'symbols',
    description: 'heavy plus sign',
    tags: [],
    icon: '➕'
  }, {
    code: '2796',
    shortname: 'heavy_minus_sign',
    category: 'symbols',
    description: 'heavy minus sign',
    tags: [],
    icon: '➖'
  }, {
    code: '2797',
    shortname: 'heavy_division_sign',
    category: 'symbols',
    description: 'heavy division sign',
    tags: [],
    icon: '➗'
  }, {
    code: '2716',
    shortname: 'heavy_multiplication_x',
    category: 'symbols',
    description: 'heavy multiplication x',
    tags: [],
    icon: '✖'
  }, {
    code: '1F4B2',
    shortname: 'heavy_dollar_sign',
    category: 'symbols',
    description: 'heavy dollar sign',
    tags: [],
    icon: '💲'
  }, {
    code: '1F4B1',
    shortname: 'currency_exchange',
    category: 'symbols',
    description: 'currency exchange',
    tags: [],
    icon: '💱'
  }, {
    code: '2122',
    shortname: 'tm',
    category: 'symbols',
    description: 'trade mark',
    tags: ['trademark'],
    icon: '™'
  }, {
    code: '3030',
    shortname: 'wavy_dash',
    category: 'symbols',
    description: 'wavy dash',
    tags: [],
    icon: '〰'
  }, {
    code: '27B0',
    shortname: 'curly_loop',
    category: 'symbols',
    description: 'curly loop',
    tags: [],
    icon: '➰'
  }, {
    code: '27BF',
    shortname: 'loop',
    category: 'symbols',
    description: 'double curly loop',
    tags: [],
    icon: '➿'
  }, {
    code: '1F51A',
    shortname: 'end',
    category: 'symbols',
    description: 'END arrow',
    tags: [],
    icon: '🔚'
  }, {
    code: '1F519',
    shortname: 'back',
    category: 'symbols',
    description: 'BACK arrow',
    tags: [],
    icon: '🔙'
  }, {
    code: '1F51B',
    shortname: 'on',
    category: 'symbols',
    description: 'ON! arrow',
    tags: [],
    icon: '🔛'
  }, {
    code: '1F51D',
    shortname: 'top',
    category: 'symbols',
    description: 'TOP arrow',
    tags: [],
    icon: '🔝'
  }, {
    code: '1F51C',
    shortname: 'soon',
    category: 'symbols',
    description: 'SOON arrow',
    tags: [],
    icon: '🔜'
  }, {
    code: '2714',
    shortname: 'heavy_check_mark',
    category: 'symbols',
    description: 'heavy check mark',
    tags: [],
    icon: '✔'
  }, {
    code: '2611',
    shortname: 'ballot_box_with_check',
    category: 'symbols',
    description: 'ballot box with check',
    tags: [],
    icon: '☑'
  }, {
    code: '1F518',
    shortname: 'radio_button',
    category: 'symbols',
    description: 'radio button',
    tags: [],
    icon: '🔘'
  }, {
    code: '26AA',
    shortname: 'white_circle',
    category: 'symbols',
    description: 'white circle',
    tags: [],
    icon: '⚪'
  }, {
    code: '26AB',
    shortname: 'black_circle',
    category: 'symbols',
    description: 'black circle',
    tags: [],
    icon: '⚫'
  }, {
    code: '1F534',
    shortname: 'red_circle',
    category: 'symbols',
    description: 'red circle',
    tags: [],
    icon: '🔴'
  }, {
    code: '1F53A',
    shortname: 'small_red_triangle',
    category: 'symbols',
    description: 'red triangle pointed up',
    tags: [],
    icon: '🔺'
  }, {
    code: '1F53B',
    shortname: 'small_red_triangle_down',
    category: 'symbols',
    description: 'red triangle pointed down',
    tags: [],
    icon: '🔻'
  }, {
    code: '1F538',
    shortname: 'small_orange_diamond',
    category: 'symbols',
    description: 'small orange diamond',
    tags: [],
    icon: '🔸'
  }, {
    code: '1F539',
    shortname: 'small_blue_diamond',
    category: 'symbols',
    description: 'small blue diamond',
    tags: [],
    icon: '🔹'
  }, {
    code: '1F536',
    shortname: 'large_orange_diamond',
    category: 'symbols',
    description: 'large orange diamond',
    tags: [],
    icon: '🔶'
  }, {
    code: '1F537',
    shortname: 'large_blue_diamond',
    category: 'symbols',
    description: 'large blue diamond',
    tags: [],
    icon: '🔷'
  }, {
    code: '1F533',
    shortname: 'white_square_button',
    category: 'symbols',
    description: 'white square button',
    tags: [],
    icon: '🔳'
  }, {
    code: '1F532',
    shortname: 'black_square_button',
    category: 'symbols',
    description: 'black square button',
    tags: [],
    icon: '🔲'
  }, {
    code: '25AA',
    shortname: 'black_small_square',
    category: 'symbols',
    description: 'black small square',
    tags: [],
    icon: '▪'
  }, {
    code: '25AB',
    shortname: 'white_small_square',
    category: 'symbols',
    description: 'white small square',
    tags: [],
    icon: '▫'
  }, {
    code: '25FE',
    shortname: 'black_medium_small_square',
    category: 'symbols',
    description: 'black medium-small square',
    tags: [],
    icon: '◾'
  }, {
    code: '25FD',
    shortname: 'white_medium_small_square',
    category: 'symbols',
    description: 'white medium-small square',
    tags: [],
    icon: '◽'
  }, {
    code: '25FC',
    shortname: 'black_medium_square',
    category: 'symbols',
    description: 'black medium square',
    tags: [],
    icon: '◼'
  }, {
    code: '25FB',
    shortname: 'white_medium_square',
    category: 'symbols',
    description: 'white medium square',
    tags: [],
    icon: '◻'
  }, {
    code: '2B1B',
    shortname: 'black_large_square',
    category: 'symbols',
    description: 'black large square',
    tags: [],
    icon: '⬛'
  }, {
    code: '2B1C',
    shortname: 'white_large_square',
    category: 'symbols',
    description: 'white large square',
    tags: [],
    icon: '⬜'
  }, {
    code: '1F508',
    shortname: 'speaker',
    category: 'symbols',
    description: 'speaker low volume',
    tags: [],
    icon: '🔈'
  }, {
    code: '1F507',
    shortname: 'mute',
    category: 'symbols',
    description: 'muted speaker',
    tags: ['sound', 'volume'],
    icon: '🔇'
  }, {
    code: '1F509',
    shortname: 'sound',
    category: 'symbols',
    description: 'speaker medium volume',
    tags: ['volume'],
    icon: '🔉'
  }, {
    code: '1F50A',
    shortname: 'loud_sound',
    category: 'symbols',
    description: 'speaker high volume',
    tags: ['volume'],
    icon: '🔊'
  }, {
    code: '1F514',
    shortname: 'bell',
    category: 'symbols',
    description: 'bell',
    tags: ['sound', 'notification'],
    icon: '🔔'
  }, {
    code: '1F515',
    shortname: 'no_bell',
    category: 'symbols',
    description: 'bell with slash',
    tags: ['volume', 'off'],
    icon: '🔕'
  }, {
    code: '1F4E3',
    shortname: 'mega',
    category: 'symbols',
    description: 'megaphone',
    tags: [],
    icon: '📣'
  }, {
    code: '1F4E2',
    shortname: 'loudspeaker',
    category: 'symbols',
    description: 'loudspeaker',
    tags: ['announcement'],
    icon: '📢'
  }, {
    code: '1F4AC',
    shortname: 'speech_balloon',
    category: 'symbols',
    description: 'speech balloon',
    tags: ['comment'],
    icon: '💬'
  }, {
    code: '1F4AD',
    shortname: 'thought_balloon',
    category: 'symbols',
    description: 'thought balloon',
    tags: ['thinking'],
    icon: '💭'
  }, {
    code: '2660',
    shortname: 'spades',
    category: 'symbols',
    description: 'spade suit',
    tags: [],
    icon: '♠'
  }, {
    code: '2663',
    shortname: 'clubs',
    category: 'symbols',
    description: 'club suit',
    tags: [],
    icon: '♣'
  }, {
    code: '2665',
    shortname: 'hearts',
    category: 'symbols',
    description: 'heart suit',
    tags: [],
    icon: '♥'
  }, {
    code: '2666',
    shortname: 'diamonds',
    category: 'symbols',
    description: 'diamond suit',
    tags: [],
    icon: '♦'
  }, {
    code: '1F0CF',
    shortname: 'black_joker',
    category: 'symbols',
    description: 'joker',
    tags: [],
    icon: '🃏'
  }, {
    code: '1F3B4',
    shortname: 'flower_playing_cards',
    category: 'symbols',
    description: 'flower playing cards',
    tags: [],
    icon: '🎴'
  }, {
    code: '1F004',
    shortname: 'mahjong',
    category: 'symbols',
    description: 'mahjong red dragon',
    tags: [],
    icon: '🀄'
  }, {
    code: '1F550',
    shortname: 'clock1',
    category: 'symbols',
    description: 'one o’clock',
    tags: [],
    icon: '🕐'
  }, {
    code: '1F551',
    shortname: 'clock2',
    category: 'symbols',
    description: 'two o’clock',
    tags: [],
    icon: '🕑'
  }, {
    code: '1F552',
    shortname: 'clock3',
    category: 'symbols',
    description: 'three o’clock',
    tags: [],
    icon: '🕒'
  }, {
    code: '1F553',
    shortname: 'clock4',
    category: 'symbols',
    description: 'four o’clock',
    tags: [],
    icon: '🕓'
  }, {
    code: '1F554',
    shortname: 'clock5',
    category: 'symbols',
    description: 'five o’clock',
    tags: [],
    icon: '🕔'
  }, {
    code: '1F555',
    shortname: 'clock6',
    category: 'symbols',
    description: 'six o’clock',
    tags: [],
    icon: '🕕'
  }, {
    code: '1F556',
    shortname: 'clock7',
    category: 'symbols',
    description: 'seven o’clock',
    tags: [],
    icon: '🕖'
  }, {
    code: '1F557',
    shortname: 'clock8',
    category: 'symbols',
    description: 'eight o’clock',
    tags: [],
    icon: '🕗'
  }, {
    code: '1F558',
    shortname: 'clock9',
    category: 'symbols',
    description: 'nine o’clock',
    tags: [],
    icon: '🕘'
  }, {
    code: '1F559',
    shortname: 'clock10',
    category: 'symbols',
    description: 'ten o’clock',
    tags: [],
    icon: '🕙'
  }, {
    code: '1F55A',
    shortname: 'clock11',
    category: 'symbols',
    description: 'eleven o’clock',
    tags: [],
    icon: '🕚'
  }, {
    code: '1F55B',
    shortname: 'clock12',
    category: 'symbols',
    description: 'twelve o’clock',
    tags: [],
    icon: '🕛'
  }, {
    code: '1F55C',
    shortname: 'clock130',
    category: 'symbols',
    description: 'one-thirty',
    tags: [],
    icon: '🕜'
  }, {
    code: '1F55D',
    shortname: 'clock230',
    category: 'symbols',
    description: 'two-thirty',
    tags: [],
    icon: '🕝'
  }, {
    code: '1F55E',
    shortname: 'clock330',
    category: 'symbols',
    description: 'three-thirty',
    tags: [],
    icon: '🕞'
  }, {
    code: '1F55F',
    shortname: 'clock430',
    category: 'symbols',
    description: 'four-thirty',
    tags: [],
    icon: '🕟'
  }, {
    code: '1F560',
    shortname: 'clock530',
    category: 'symbols',
    description: 'five-thirty',
    tags: [],
    icon: '🕠'
  }, {
    code: '1F561',
    shortname: 'clock630',
    category: 'symbols',
    description: 'six-thirty',
    tags: [],
    icon: '🕡'
  }, {
    code: '1F562',
    shortname: 'clock730',
    category: 'symbols',
    description: 'seven-thirty',
    tags: [],
    icon: '🕢'
  }, {
    code: '1F563',
    shortname: 'clock830',
    category: 'symbols',
    description: 'eight-thirty',
    tags: [],
    icon: '🕣'
  }, {
    code: '1F564',
    shortname: 'clock930',
    category: 'symbols',
    description: 'nine-thirty',
    tags: [],
    icon: '🕤'
  }, {
    code: '1F565',
    shortname: 'clock1030',
    category: 'symbols',
    description: 'ten-thirty',
    tags: [],
    icon: '🕥'
  }, {
    code: '1F566',
    shortname: 'clock1130',
    category: 'symbols',
    description: 'eleven-thirty',
    tags: [],
    icon: '🕦'
  }, {
    code: '1F567',
    shortname: 'clock1230',
    category: 'symbols',
    description: 'twelve-thirty',
    tags: [],
    icon: '🕧'
  }]},
  {name: 'flags', code: '1f6a9', data: [
    {
    code: '1F3C1',
    shortname: 'checkered_flag',
    category: 'flags',
    description: 'chequered flag',
    tags: ['milestone', 'finish'],
    icon: '🏁'
  }, {
    code: '1F6A9',
    shortname: 'triangular_flag_on_post',
    category: 'flags',
    description: 'triangular flag',
    tags: [],
    icon: '🚩'
  }, {
    code: '1F38C',
    shortname: 'crossed_flags',
    category: 'flags',
    description: 'crossed flags',
    tags: [],
    icon: '🎌'
  }]
}];

const peopleCat = EMOJI_DATA.find(cat => cat.name === 'people');

export const COMMON_EMOJIS =
  [
    find(peopleCat.data, {shortname: 'grinning'}),
    find(peopleCat.data, {shortname: 'joy'}),
    find(peopleCat.data, {shortname: 'scream'}),
    find(peopleCat.data, {shortname: 'thumbs_up' }),
    find(peopleCat.data, {shortname: 'thumbs_down' }),
    find(peopleCat.data, {shortname: 'clap' }),
    find(EMOJI_DATA.find(cat => cat.name === 'foods').data, {shortname: 'beers' }),
    find(EMOJI_DATA.find(cat => cat.name === 'symbols').data, {shortname: 'heart' })
  ];
