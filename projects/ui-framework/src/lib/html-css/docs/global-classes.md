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
      <td>While element has this class, its children (if any) will be hidden (invisible, but dimentions are kept) and a <u>mini-preloader</u> will be shown
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
