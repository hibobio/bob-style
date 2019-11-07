import {
  randomNumber,
  randomFromArray,
  padWith0,
  simpleUID,
} from './services/utils/functional-utils';
import { Icons } from './icons/icons.enum';

export const mockNamesList = [
  'Nada Gish',
  'Mathilde Vogler',
  'Casie Wadkins',
  'Kisha Dick',
  'Claudie Redick',
  'Dorthey Tollison',
  'Manual Dedios',
  'Melania Burruel',
  'Nida Audia',
  'Shawanna Petree',
  'Florance Wolfson',
  'America Danz',
  'Mendy Mcsherry',
  'Valencia Dantin',
  'Ted Medrano',
  'Abby Hance',
  'Nakia Joplin',
  'Nilda Seneca',
  'Amal Ralphs',
  'Allan Nicoll',
  'Jasper Grass',
  'Sharleen Callanan',
  'Leatha Chiodo',
  'Micki Skinner',
  'Kristine Seyfried',
  'Isaura Stork',
  'Dusty Avina',
  'Shira Chilson',
  'Lane Kerbs',
  'Viola Netzer',
  'Elma Strawn',
  'Allene Crupi',
  'Eloisa Ostler',
  'Sandee Snellgrove',
  'Gordon Kukowski',
  'Darcie Pickle',
  'Elicia Skiba',
  'Ngan Winsett',
  'Reyna Marvel',
  'Tyson Avey',
  'Craig Sher',
  'Pa Locicero',
  'Forrest Deshazo',
  'Krystina Adrian',
  'Violeta Jacobo',
  'Arlena Rempel',
  'Herlinda Prochnow',
  'Shavonda Chumley',
  'Lacresha Hyre',
  'Richard Sosnowski',
  'Arturo Boldt',
  'Tammy Bolin',
  'Mohamed Grist',
  'Thad Vos',
  'Delphine Cammack',
  'Laine Rolls',
  'Sybil Urso',
  'Anastacia Felipe',
  'Laree Hammock',
  'Stefania Dollinger',
];

export const mockFirstNamesList = mockNamesList.map(name => name.split(' ')[0]);
export const mockSecondNamesList = mockNamesList.map(
  name => name.split(' ')[1]
);

export const mockJobsList = [
  'A/B tester',
  'Application analyst',
  'Business analyst',
  'Computer operator',
  'Computer repair technician',
  'Computer scientist',
  'Computer analyst',
  'Data entry clerk',
  'Database administrator',
  'Data analyst',
  'Data designer',
  'Data scientist',
  'Hardware engineer',
  'Information systems technician',
  'IT assistant',
  'Network analyst',
  'Network administrator',
  'Programmer',
  'Product manager',
  'Project manager',
  'Rapid prototyper',
  'Scrum master',
  'Security engineer',
  'Software analyst',
  'Software architect',
  'Software design',
  'Software engineer',
  'Software project manager',
  'Software quality analyst',
  'Software test engineer (Tester)',
  'Solution architect',
  'Support technician (Help Desk)',
  'System administrator',
  'Systems analyst',
  'Test engineer',
  'User experience designer',
  'User interaction designer',
  'User researcher',
  'Visual designer',
  'Web developer',
  'Website administrator',
];

export const mockHobbiesList = [
  'Aircraft Spotting',
  'Airbrushing',
  'Airsofting',
  'Acting',
  'Aeromodeling',
  'Amateur Astronomy',
  'Amateur Radio',
  'Animals/pets/dogs',
  'Archery',
  'Arts',
  'Aquarium',
  'Astrology',
  'Astronomy',
  'Backgammon',
  'Badminton',
  'Baseball',
  'Base Jumping',
  'Basketball',
  'Beach/Sun tanning',
  'Beachcombing',
  'Beadwork',
  'Beatboxing',
  'Becoming A Child Advocate',
  'Bell Ringing',
  'Belly Dancing',
  'Bicycling',
  'Bicycle Polo',
  'Bird watching',
  'Birding',
  'BMX',
  'Blacksmithing',
  'Blogging',
  'BoardGames',
  'Boating',
  'Body Building',
  'Bonsai Tree',
  'Bookbinding',
  'Boomerangs',
  'Bowling',
  'Brewing Beer',
  'Bridge Building',
  'Bringing Food To The Disabled',
  'Building A House For Habitat For Humanity',
  'Building Dollhouses',
  'Butterfly Watching',
  'Button Collecting',
  'Cake Decorating',
  'Calligraphy',
  'Camping',
  'Candle Making',
  'Canoeing',
  'Cartooning',
  'Car Racing',
  'Casino Gambling',
  'Cave Diving',
  'Ceramics',
  'Cheerleading',
  'Chess',
  'Church/church activities',
  'Cigar Smoking',
  'Cloud Watching',
  'Coin Collecting',
  'Collecting',
  'Collecting Antiques',
  'Collecting Artwork',
  'Collecting Hats',
  'Collecting Music Albums',
  'Collecting RPM Records',
  'Collecting Sports Cards (Baseball, Football, Basketball, Hockey)',
  'Collecting Swords',
  'Coloring',
  'Compose Music',
  'Computer activities',
  'Conworlding',
  'Cooking',
  'Cosplay',
  'Crafts',
  'Crafts (unspecified)',
  'Crochet',
  'Crocheting',
  'Cross-Stitch',
  'Crossword Puzzles',
  'Dancing',
  'Darts',
  'Diecast Collectibles',
  'Digital Photography',
  'Dodgeball',
  'Dolls',
  'Dominoes',
  'Drawing',
  'Dumpster Diving',
  'Eating out',
  'Educational Courses',
  'Electronics',
  'Embroidery',
  'Entertaining',
  'Exercise (aerobics, weights)',
  'Falconry',
  'Fast cars',
  'Felting',
  'Fencing',
  'Fire Poi',
  'Fishing',
  'Floorball',
  'Floral Arrangements',
  'Fly Tying',
  'Football',
  'Four Wheeling',
  'Freshwater Aquariums',
  'Frisbee Golf – Frolf',
  'Games',
  'Gardening',
  'Garage Saleing',
  'Genealogy',
  'Geocaching',
  'Ghost Hunting',
  'Glowsticking',
  'Gnoming',
  'Going to movies',
  'Golf',
  'Go Kart Racing',
  'Grip Strength',
  'Guitar',
  'Gunsmithing',
  'Gun Collecting',
  'Gymnastics',
  'Gyotaku',
  'Handwriting Analysis',
  'Hang gliding',
  'Herping',
  'Hiking',
  'Home Brewing',
  'Home Repair',
  'Home Theater',
  'Horse riding',
  'Hot air ballooning',
  'Hula Hooping',
  'Hunting',
  'Iceskating',
  'Illusion',
  'Impersonations',
  'Internet',
  'Inventing',
  'Jet Engines',
  'Jewelry Making',
  'Jigsaw Puzzles',
  'Juggling',
  'Keep A Journal',
  'Jump Roping',
  'Kayaking',
  'Kitchen Chemistry',
  'Kites',
  'Kite Boarding',
  'Knitting',
  'Knotting',
  'Lasers',
  'Lawn Darts',
  'Learn to Play Poker',
  'Learning A Foreign Language',
  'Learning An Instrument',
  'Learning To Pilot A Plane',
  'Leathercrafting',
  'Legos',
  'Letterboxing',
  'Listening to music',
  'Locksport',
  'Lacrosse',
  'Macramé',
  'Magic',
  'Making Model Cars',
  'Marksmanship',
  'Martial Arts',
  'Matchstick Modeling',
  'Meditation',
  'Microscopy',
  'Metal Detecting',
  'Model Railroading',
  'Model Rockets',
  'Modeling Ships',
  'Models',
  'Motorcycles',
  'Mountain Biking',
  'Mountain Climbing',
  'Musical Instruments',
  'Nail Art',
  'Needlepoint',
  'Owning An Antique Car',
  'Origami',
  'Painting',
  'Paintball',
  'Papermaking',
  'Papermache',
  'Parachuting',
  'Paragliding or Power Paragliding',
  'Parkour',
  'People Watching',
  'Photography',
  'Piano',
  'Pinochle',
  'Pipe Smoking',
  'Planking',
  'Playing music',
  'Playing team sports',
  'Pole Dancing',
  'Pottery',
  'Powerboking',
  'Protesting',
  'Puppetry',
  'Pyrotechnics',
  'Quilting',
  'Racing Pigeons',
  'Rafting',
  'Railfans',
  'Rapping',
  'R/C Boats',
  'R/C Cars',
  'R/C Helicopters',
  'R/C Planes',
  'Reading',
  'Reading To The Elderly',
  'Relaxing',
  'Renaissance Faire',
  'Renting movies',
  'Rescuing Abused Or Abandoned Animals',
  'Robotics',
  'Rock Balancing',
  'Rock Collecting',
  'Rockets',
  'Rocking AIDS Babies',
  'Roleplaying',
  'Running',
  'Saltwater Aquariums',
  'Sand Castles',
  'Scrapbooking',
  'Scuba Diving',
  'Self Defense',
  'Sewing',
  'Shark Fishing',
  'Skeet Shooting',
  'Skiing',
  'Shopping',
  'Singing In Choir',
  'Skateboarding',
  'Sketching',
  'Sky Diving',
  'Slack Lining',
  'Sleeping',
  'Slingshots',
  'Slot Car Racing',
  'Snorkeling',
  'Snowboarding',
  'Soap Making',
  'Soccer',
  'Socializing with friends/neighbors',
  'Speed Cubing (rubix cube)',
  'Spelunkering',
  'Spending time with family/kids',
  'Stamp Collecting',
  'Storm Chasing',
  'Storytelling',
  'String Figures',
  'Surfing',
  'Surf Fishing',
  'Survival',
  'Swimming',
  'Tatting',
  'Taxidermy',
  'Tea Tasting',
  'Tennis',
  'Tesla Coils',
  'Tetris',
  'Texting',
  'Textiles',
  'Tombstone Rubbing',
  'Tool Collecting',
  'Toy Collecting',
  'Train Collecting',
  'Train Spotting',
  'Traveling',
  'Treasure Hunting',
  'Trekkie',
  'Tutoring Children',
  'TV watching',
  'Ultimate Frisbee',
  'Urban Exploration',
  'Video Games',
  'Violin',
  'Volunteer',
  'Walking',
  'Warhammer',
  'Watching sporting events',
  'Weather Watcher',
  'Weightlifting',
  'Windsurfing',
  'Wine Making',
  'Wingsuit Flying',
  'Woodworking',
  'Working In A Food Pantry',
  'Working on cars',
  'World Record Breaking',
  'Wrestling',
  'Writing',
  'Writing Music',
  'Writing Songs',
  'Yoga',
  'YoYo',
  'Ziplining',
  'Zumba',
];

const lorem =
  // tslint:disable-next-line: max-line-length
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.';

// (c) https://theuselessweb.com/
const uselessURLs = [
  'http://heeeeeeeey.com/',
  'http://tinytuba.com/',
  'http://corndog.io/',
  'http://thatsthefinger.com/',
  'http://cant-not-tweet-this.com/',
  'http://weirdorconfusing.com/',
  'https://www.eyes-only.net/',
  'http://eelslap.com/',
  'http://www.staggeringbeauty.com/',
  'http://burymewithmymoney.com/',
  'http://endless.horse/',
  'http://www.trypap.com/',
  'http://www.republiquedesmangues.fr/',
  'http://www.movenowthinklater.com/',
  'http://www.partridgegetslucky.com/',
  'http://www.rrrgggbbb.com/',
  'http://beesbeesbees.com/',
  'http://www.koalastothemax.com/',
  'http://www.everydayim.com/',
  'http://randomcolour.com/',
  'http://cat-bounce.com/',
  'http://chrismckenzie.com/',
  'http://hasthelargehadroncolliderdestroyedtheworldyet.com/',
  'http://ninjaflex.com/',
  'http://ihasabucket.com/',
  'http://corndogoncorndog.com/',
  'http://www.hackertyper.com/',
  'https://pointerpointer.com',
  'http://imaninja.com/',
  'http://www.ismycomputeron.com/',
  'http://www.nullingthevoid.com/',
  'http://www.muchbetterthanthis.com/',
  'http://www.yesnoif.com/',
  'http://iamawesome.com/',
  'http://www.pleaselike.com/',
  'http://crouton.net/',
  'http://corgiorgy.com/',
  'http://www.wutdafuk.com/',
  'http://unicodesnowmanforyou.com/',
  'http://www.crossdivisions.com/',
  'http://tencents.info/',
  'http://www.patience-is-a-virtue.org/',
  'http://whitetrash.nl/',
  'http://www.theendofreason.com/',
  'http://pixelsfighting.com/',
  'http://isitwhite.com/',
  'http://onemillionlols.com/',
  'http://www.omfgdogs.com/',
  'http://oct82.com/',
  'http://chihuahuaspin.com/',
  'http://www.blankwindows.com/',
  'http://dogs.are.the.most.moe/',
  'http://tunnelsnakes.com/',
  'http://www.trashloop.com/',
  'http://www.ascii-middle-finger.com/',
  'http://spaceis.cool/',
  'http://www.donothingfor2minutes.com/',
  'http://buildshruggie.com/',
  'http://buzzybuzz.biz/',
  'http://yeahlemons.com/',
  'http://burnie.com/',
  'http://wowenwilsonquiz.com',
  'https://thepigeon.org/',
  'http://notdayoftheweek.com/',
  'http://www.amialright.com/',
  'http://nooooooooooooooo.com/',
];

export const mockAvatar = () =>
  `https://randomuser.me/api/portraits/${randomFromArray([
    'men',
    'women',
  ])}/${randomNumber(0, 99)}.jpg`;

export const mockImage = (width, height) =>
  `https://picsum.photos/id/${randomNumber(0, 99)}/${width}/${height}`;

export const mockNames = (num = null) => {
  if (num === 1) {
    return `${randomFromArray(mockFirstNamesList, num)} ${randomFromArray(
      mockSecondNamesList,
      num
    )}`;
  }
  const fns = randomFromArray(mockFirstNamesList, num);
  const sns = randomFromArray(mockSecondNamesList, num);
  return fns.map((n, i) => `${n} ${sns[i]}`);
};

export const mockJobs = (num = null) => randomFromArray(mockJobsList, num);

export const mockHobbies = (num = null) =>
  randomFromArray(mockHobbiesList, num);

export const mockDate = () =>
  `${padWith0(randomNumber(1, 31))}/${padWith0(
    randomNumber(1, 12)
  )}/${new Date().getFullYear()}`;

export const mockDateRange = (length = 0) => {
  const year = new Date().getFullYear();
  const month = randomNumber(1, 12);
  const day1 = randomNumber(1, 15);
  if (!length) {
    length = randomNumber(2, 14);
  }
  const day2 = day1 + length;

  return `${padWith0(day1)}/${padWith0(month)}/${year} - ${padWith0(
    day2
  )}/${padWith0(month)}/${year}`;
};

export const loremText = (words = null) => {
  if (typeof words === 'number') {
    return lorem
      .split(' ')
      .slice(0, words)
      .join(' ');
  }
  return lorem;
};

export const mockText = (words = 100) => {
  let text = lorem
    .split(' ')
    .sort(() => 0.5 - Math.random())
    .slice(0, words)
    .join(' ')
    .replace(/,/g, '')
    .replace(/\./g, '');
  text = text.charAt(0).toUpperCase() + text.toLocaleLowerCase().slice(1);

  if (text.length < 5) {
    return mockText(words);
  }
  return text;
};

export const uselessSite = () => randomFromArray(uselessURLs);

export const mockUrl = (type = 'any') => {
  const pref = 'http://www.';
  switch (type) {
    case 'facebook':
      return `${pref}facebook.com/${simpleUID('id', 6)}/`;
      break;
    case 'linkedin':
      return `${pref}linkedin.com/in/${simpleUID('id', 6)}/`;
      break;
    case 'twitter':
      return `${pref}twitter.com/${simpleUID('id', 6)}/`;
      break;
    case 'youtube':
      return `${pref}youtube.com/watch?v=${simpleUID('', 8)}/`;
      break;
    case 'vimeo':
      return `${pref}vimeo.com/${simpleUID('', 8)}/`;
      break;
    default:
      return uselessSite();
  }
};

export const randomIcon = () => randomFromArray(Object.values(Icons));
