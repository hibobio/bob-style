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

export const rteMockHtml = `<br><br> <br><br> <span> <br> </span> <div><br></div> <span><br></span>

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
