import {
  mockNames,
  mockAvatar,
  mockText,
  makeArray,
  randomNumber,
  simpleUID,
  SelectGroupOption,
  selectOptionsMock,
} from 'bob-style';
import { RteMentionsOption } from './rte.interface';

const separator = '##%%';

export const mentionsOptions = mockNames(200).map(
  (name: string): RteMentionsOption => ({
    displayName: name,
    link: 'https://www.google.com/search?q=' + mockText(1),
    avatar: mockAvatar(),
    attributes: {
      'mention-employee-id': simpleUID(),
      class: 'employee-mention',
    },
  })
);

export const placeholderMock: SelectGroupOption[] = selectOptionsMock
  .map((group) => ({
    ...group,
    options: group.options.map((option) => ({
      ...option,
      id: (option.id as string).replace('/', separator),
    })),
  }))
  .concat(
    makeArray(15).map((i) => {
      const groupId = simpleUID();
      return {
        groupName: mockText(randomNumber(1, 2)),
        key: groupId,
        options: makeArray(randomNumber(10, 25)).map((i) => ({
          id: groupId + separator + simpleUID(),
          value: mockText(randomNumber(1, 2)),
        })),
      };
    })
  );

placeholderMock.splice(0, 0, {
  groupName: 'Employee',
  key: 'employee',
  options: [
    {
      // prettier-ignore
      value: 'מספר רישיון עו\“ד',
      // prettier-ignore
      id: 'employee##%%identification/custom/מספר רישיון עו\“ד_Tdncm'
    },
  ],
});

export const mock1 = `<br><br> <br><br> <span> <br> </span> <div><br></div> <span><br></span>

<div>
  <span style="color: red;">Hello</span> http://Google.com!
  Some <em>funky</em> <strong>bold</strong> text
  of <span style="font-size: 18px;">large 🔍</span> size.
</div>

<div><br class="222"></div> <span><br></span> <div><br></div>

<h1><em>Hooray!</em></h1>

<p><br>
 {{root##%%firstName}} is {{work##%%title}} of the month! <br>His {{employee##%%identification/custom/מספר רישיון עו\“ד_Tdncm}} is 1234567890.
 </p>

<p>More details at: https://longlink.com/gohere/thenthere/onemore/page#hash?query=bigBen</p>

<div><br></div>

<h2>Here's an important list of things to remember:</h2>

<ul>
  <li> <br> <br>
  Watch artist <a style="font-size: 20px; font-weight: 600; text-decoration: underline; color: red;" href="https://www.youtube.com/watch?v=k2JPwJuM8fE" \
  mention-employee-id="777">@Jim lee</a> drawing \
  <span style="font-size: 18px;">🦇👨 & 🐱👩</span> from his studio
  <a href="https://www.youtube.com/watch?v=k2JPwJuM8fE" \
  target="_blank">here!</a></li>
  <li>All <b>bold</b> and <u>underline</u> emphasis.</li>
  <li>танцуй пока молодой <span style="font-size: 18px;">💃</span></li>
  <li>אם תרצו אין זו אגדה</li>
</ul>

<div><br></div> <span><br></span>
`;

export const mock3 = `<div>"Something" is widely viewed by music historians as having marked Harrison's ascendancy as a composer to the level
  of the Beatles' principal songwriters, <a class="fr-deletable"
     href="https://en.wikipedia.org/wiki/John_Lennon"
     rel="noopener noreferrer"
     spellcheck="false"
     tabindex="-1"
     target="_blank">John Lennon</a> and <a class="fr-deletable"
     href="https://en.wikipedia.org/wiki/Paul_McCartney"
     rel="noopener noreferrer"
     spellcheck="false"
     tabindex="-1"
     target="_blank">Paul McCartney</a>. It is described as a love song to <a class="fr-deletable"
     href="https://en.wikipedia.org/wiki/Pattie_Boyd"
     rel="noopener noreferrer"
     spellcheck="false"
     tabindex="-1"
     target="_blank">Pattie Boyd</a>, Harrison's first wife, although Harrison offered alternative sources of
  inspiration in later interviews.</div>

<div><br></div>

<strong></strong>

<div>Due to the difficulty he faced in getting more than two of his compositions onto each Beatles album, Harrison first
  offered "Something" to <a class="fr-deletable"
     href="https://en.wikipedia.org/wiki/Joe_Cocker"
     rel="noopener noreferrer"
     spellcheck="false"
     tabindex="-1"
     target="_blank">Joe Cocker</a>. As recorded by the Beatles, the track features a guitar solo that several music
  critics identify among Harrison's finest playing. The song also drew praise from the other Beatles and their producer,
  <a class="fr-deletable"
     href="https://en.wikipedia.org/wiki/George_Martin"
     rel="noopener noreferrer"
     spellcheck="false"
     tabindex="-1"
     target="_blank">George Martin</a>, with Lennon stating that it was the best song on <em>Abbey Road</em>.<a
     class="fr-deletable"
     href="https://en.wikipedia.org/wiki/Something_%28Beatles_song%29#cite_note-quotes-2"
     rel="noopener noreferrer"
     spellcheck="false"
     tabindex="-1"
     target="_blank">[2]</a> The promotional film for the single combined footage of each of the Beatles with their
  respective wife, reflecting the estrangement in the band during the months preceding the official announcement of <a
     class="fr-deletable"
     href="https://en.wikipedia.org/wiki/Break-up_of_the_Beatles"
     rel="noopener noreferrer"
     spellcheck="false"
     tabindex="-1"
     target="_blank">their break-up</a> in April 1970.</div>
`;

export const wordMock4 = `

<div>
<p class=MsoNormal dir=RTL>
mmmm
 </p>

    <p class=MsoNormal dir=RTL>
      <span lang=HE>
        aaa aaaa
        <strong style='color:black'>
         <span>bbb bbb</span>
        </strong>
      </span>
   </p>

   <p>

   <span><span>
   hello
   <br>
   </span></span>
   </p>

   <p class=MsoNormal dir=RTL>
    <span>
      <span lang=HE>
        ccc ccc

        <span style='font-weight: bold; color:black'>
         ddd ddd
        </span>
      </span>
    </span>

    </p>
  ooo


  </div>
`;

export const rteMockHtml = mock1;
