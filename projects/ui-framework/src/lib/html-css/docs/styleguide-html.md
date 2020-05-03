<!-- // code: language=html -->

<style>
  table,
  thead,
  tbody,
  tr {
    width: 100%;
  }


  td {
    position: relative;
  }

  td:nth-child(2):before,
  td:nth-child(3):before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    position: absolute;
    top: 0;
    left: 0;
  }

  table:nth-of-type(1) td:nth-child(2):before {
    background-color: red;
  }

  table:nth-of-type(2) td:nth-child(2):before {
    background-color: orange;
  }

  td:nth-child(3):before {
    background-color: green;
  }

  tr:first-child td:before {
    display: none !important;
  }

</style>

<table class="doc-table">
  <thead>
    <tr>
      <th>rule</th>
      <th style="background-color: red; color: white;">bad</th>
      <th style="background-color: green; color: white;">good</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td>indentation: 2 spaces</td>
      <td>
        <pre><code>&lt;section&gt;
    &lt;article&gt;Hello&lt;/article&gt;
&lt;/section&gt;

&lt;section&gt;&lt;article&gt;World&lt;/article&gt;&lt;/section&gt;</code></pre>
      </td>
      <td>
        <pre><code>&lt;section&gt;
  &lt;article&gt;Hello&lt;/article&gt;
&lt;/section&gt;

&lt;section&gt;
  &lt;article&gt;World&lt;/article&gt;
&lt;/section&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td>separate logical <br>blocks of elements <br>with empty lines</td>
      <td>
        <pre><code>&lt;section&gt;
    &lt;article&gt;Hello&lt;/article&gt;
&lt;/section&gt;
&lt;section&gt;
  &lt;article&gt;World&lt;/article&gt;
&lt;/section&gt;</code></pre>
      </td>
      <td>
        <pre><code>&lt;section&gt;
  &lt;article&gt;Hello&lt;/article&gt;
&lt;/section&gt;

&lt;section&gt;
  &lt;article&gt;World&lt;/article&gt;
&lt;/section&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td>use semantic elements<br>(including html5):<br>
        button, a, ul, p, h1-h5, section, <br>article, header, footer, etc</td>
      <td>
        <pre><code>&lt;div class="section"&gt;
  &lt;div class="intro"&gt;Some text&lt;/div&gt;

  &lt;div (click)="onClick()"&gt;Click me&lt;/div&gt;
&lt;/div&gt;</code></pre>
      </td>
      <td>
        <pre><code>&lt;section&gt;
  &lt;p class="intro"&gt;Some text&lt;/p&gt;

  &lt;button type="button"
        (click)="onClick()"&gt;Click me&lt;/button&gt;
&lt;/section&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td>when using semantic elements is not possible,<br>add <a
           href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">ARIA</a> role tags </td>
      <td>
        <pre><code>&lt;list-component&gt;

  &lt;list-item-component
        *ngFor="let item of items"&gt;

    &lt;clickable-thing (click)="onClick()"&gt;
      {{ '{' }}{{ '{' }} item.name {{ '}' }}{{ '}' }}
    &lt;/clickable-thing&gt;

  &lt;/list-item-component&gt;

&lt;/list-component&gt;</code></pre>
      </td>
      <td>
        <pre><code>&lt;list-component role="list"&gt;

  &lt;list-item-component role="listitem"
        *ngFor="let item of items"&gt;

    &lt;clickable-thing role="button"
        (click)="onClick()"&gt;
      {{ '{' }}{{ '{' }} item.name {{ '}' }}{{ '}' }}
    &lt;/clickable-thing&gt;

  &lt;/list-item-component&gt;

&lt;/list-component&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td>avoid unnecessary (layout-defining) wrapping elements (angular component host
        elements can play that role themselves)<br>and empty elements (often used for decorative purposes)</td>
      <td>
        <pre><code>&lt;div class="left-column avatar-wrapper"&gt;
  &lt;b-avatar&gt;&lt;/b-avatar&gt;
&lt;/div&gt;

&lt;div class="red-line"&gt;&lt;/div&gt;</code></pre>
      </td>
      <td>
        <pre><code>&lt;b-avatar class="left-colum"&gt;&lt;/b-avatar&gt;

.b-avatar {{ '{' }}
  border-bottom: 1px solid red;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td>Prefix custom attributes with ‘data-‘</td>
      <td>
        <pre><code>&lt;div index="1"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
      <td>
        <pre><code>&lt;div data-index="1"&gt;
  Something
&lt;/div&gt;</code></pre>
      </td>
    </tr>

    <tr>
      <td>Avoid deprecated elements (b, i, center, embed, font, u, etc) and presentational
        attributes (border=, background=, size= etc)
      </td>
      <td>
        <pre><code>&lt;b&gt;bold text&lt;/b&gt;</code></pre>
      </td>
      <td>
        <pre><code>&lt;strong&gt;bold text&lt;/strong&gt;</code></pre>
      </td>
    </tr>

  </tbody>

</table>
