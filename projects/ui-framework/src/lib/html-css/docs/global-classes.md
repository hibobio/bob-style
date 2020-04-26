<b-heading>Utility</b-heading>

<table class="doc-table">
  <thead>
    <tr>
      <th>class</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td style="white-space: nowrap;">mrg-8, mrg-16, mrg-24, mrg-32, mrg-40</td>
      <td>Add <u>margin</u> on all sides:<br> 8px, 16px, 24px, 32px, 40px
      </td>
      <td>
        <pre><code>&lt;div class="box mrg-16"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">mrg-l-8, mrg-l-16, mrg-l-24, mrg-l-32, mrg-l-40<br>
        mrg-r-8, mrg-r-16, mrg-r-24, mrg-r-32, mrg-r-40
      </td>
      <td>Add <u>margin</u> left or right:<br> 8px, 16px, 24px, 32px, 40px
      </td>
      <td>
        <pre><code>&lt;div class="box mrg-l-8 mrg-r-8"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">mrg-t-8, mrg-t-16, mrg-t-24, mrg-t-32, mrg-t-40<br>
        mrg-b-8, mrg-b-16, mrg-b-24, mrg-b-32, mrg-b-40
      </td>
      <td>Add <u>margin</u> top or bottom:<br> 8px, 16px, 24px, 32px, 40px
      </td>
      <td>
        <pre><code>&lt;div class="box mrg-t-8 mrg-b-16"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">pad-8, pad-16, pad-24, pad-32, pad-40</td>
      <td>Add <u>padding</u> on all sides:<br> 8px, 16px, 24px, 32px, 40px
      </td>
      <td>
        <pre><code>&lt;div class="box pad-16"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">pad-l-8, pad-l-16, pad-l-24, pad-l-32, pad-l-40<br>
        pad-r-8, pad-r-16, pad-r-24, pad-r-32, pad-r-40
      </td>
      <td>Add <u>padding</u> left or right:<br> 8px, 16px, 24px, 32px, 40px
      </td>
      <td>
        <pre><code>&lt;div class="box pad-l-8 pad-r-8"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">pad-t-8, pad-t-16, pad-t-24, pad-t-32, pad-t-40<br>
        pad-b-8, pad-b-16, pad-b-24, pad-b-32, pad-b-40
      </td>
      <td>Add <u>padding</u> top or bottom:<br> 8px, 16px, 24px, 32px, 40px
      </td>
      <td>
        <pre><code>&lt;div class="box pad-t-8 pad-b-16"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">brd, brd-l, brd-r, brd-t, brd-b
      </td>
      <td>Adds border: on all sides, left, right, top, bottom
      </td>
      <td>
        <pre><code>&lt;div class="box brd-r"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">brd-alt, brd-alt-l, brd-alt-r, brd-alt-t, brd-alt-b
      </td>
      <td>Adds lighter-color border: on all sides, left, right, top, bottom
      </td>
      <td>
        <pre><code>&lt;div class="box brd-alt-r"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">rounded
      </td>
      <td>Add border-radius of 4px
      </td>
      <td>
        <pre><code>&lt;div class="box brd-b rounded"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

  </tbody>

</table>

<b-heading>Misc</b-heading>

<table class="doc-table">
  <thead>
    <tr>
      <th>class</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td style="white-space: nowrap;">preloading</td>
      <td>While element has this class, its children (if any) will be hidden (invisible, but dimentions are kept) and a
        <u>mini-preloader</u> will be shown
        instead
      </td>
      <td>
        <pre><code>&lt;div [ngClass]="{{ '{' }} preloading: isLoading {{ '}' }}"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">preloading-collapsed</td>
      <td>Same as .preloading, but will also collapse the contents (invisible and height 0).
      </td>
      <td>
        <pre><code>&lt;div [ngClass]="{{ '{' }}
        'preloading-collapsed': isLoading
      {{ '}' }}"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

  </tbody>

</table>

<b-heading>Responsive</b-heading>

<table class="doc-table">
  <thead>
    <tr>
      <th>class</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td style="white-space: nowrap;">b-mobile</td>
      <td>Element with this class will be hidden on devices wider than 768px</td>
      <td>
        <pre><code>&lt;b-button class="b-mobile"&gt;
  Call Me
&lt;/b-button&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-desktop</td>
      <td>Element with this class will be hidden on devices with screen width less than 768px</td>
      <td>
        <pre><code>&lt;b-button class="b-desktop"&gt;
  Print Me
&lt;/b-button&gt;</code></pre>
      </td>
    </tr>

  </tbody>

</table>

<b-heading>Typography</b-heading>

<table class="doc-table">
  <thead>
    <tr>
      <th>class</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td style="white-space: nowrap;">b-body</td>
      <td>Equivalent of using <u>b-body</u> component</td>
      <td>
        <pre><code>&lt;p class="b-body"&gt;
  Some text
&lt;/p&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-big-body</td>
      <td>Equivalent of using <u>b-big-body</u> component</td>
      <td>
        <pre><code>&lt;p class="b-big-body"&gt;
  Bigger text
&lt;/p&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-bold-body</td>
      <td>Equivalent of using <u>b-bold-body</u> component</td>
      <td>
        <pre><code>&lt;strong class="b-bold-body"&gt;
  Bold text
&lt;/strong&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-caption</td>
      <td>Equivalent of using <u>b-caption</u> component</td>
      <td>
        <pre><code>&lt;p class="b-big-body"&gt;
  Smaller text
&lt;/p&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-display-1</td>
      <td>Equivalent of using <u>b-display-1</u> component</td>
      <td>
        <pre><code>&lt;h1 class="b-display-1"&gt;
  Page title
&lt;/h1&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-display-2</td>
      <td>Equivalent of using <u>b-display-2</u> component</td>
      <td>
        <pre><code>&lt;h2 class="b-display-2"&gt;
  Section title
&lt;/h2&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-display-3</td>
      <td>Equivalent of using <u>b-display-3</u> component</td>
      <td>
        <pre><code>&lt;h3 class="b-display-3"&gt;
  Article title
&lt;/h3&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-display-4</td>
      <td>Equivalent of using <u>b-display-4</u> component</td>
      <td>
        <pre><code>&lt;h4 class="b-display-4"&gt;
  Item title
&lt;/h4&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">b-heading</td>
      <td>Equivalent of using <u>b-heading</u> component</td>
      <td>
        <pre><code>&lt;h5 class="b-heading"&gt;
  Subtitle
&lt;/h5&gt;</code></pre>
      </td>
    </tr>

  </tbody>

</table>
