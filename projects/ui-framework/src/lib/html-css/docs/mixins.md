<b-heading>Functions</b-heading>

<table class="doc-table">
  <thead>
    <tr>
      <th>function</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td style="white-space: nowrap;">base8($number)</td>
      <td>
        converts a unitless number to a pixel value, divisible by 8
      </td>
      <td>
        <pre><code>margin-top: base8(40);</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">times8($number)</td>
      <td>
        returns pixel value of unitless $number multipled by 8
      </td>
      <td>
        <pre><code>margin-bottom: times8(2);</code></pre>
      </td>
    </tr>

  </tbody>

</table>

<b-heading>Basic mixins</b-heading>

<table class="doc-table">
  <thead>
    <tr>
      <th>mixin</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td style="white-space: nowrap;">pseudo</td>
      <td>
        Adds:
        <pre><code>content: '';
display: block;</code></pre>
      </td>
      <td>
        <pre><code>.lunch:before {{ '{' }}
  @include pseudo;
  background-color: red;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">size($width, $height)</td>
      <td>
        Shortcut to set width & height of element. If height is not provided, it will be set to same value as width;
      </td>
      <td>
        <pre><code>.box {{ '{' }}
  @include size(100%);
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">position($coordinates, $position)</td>
      <td>
        Shortcut to set element position. <br>
        Coordinates must be provided in a list of 'top right bottom left' (use 'null'
        to skip value). <br>Defaults to absolute, top 0, left 0.
      </td>
      <td>
        <pre><code>.left-eye {{ '{' }}
  @include position;
{{ '}' }}

.right-eye {{ '{' }}
  @include position(0 0 null null, fixed);
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">flex-align</td>
      <td>
        Aligns element's content horizontally & vertically. Adds:
        <pre><code>display: flex;
justify-content: center;
align-items: center;</code></pre>
      </td>
      <td>
        <pre><code>.centrism {{ '{' }}
  @include flex-align;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">visually-hidden</td>
      <td>
        Hides element without using display none.
      </td>
      <td>
        <pre><code>.invisible-man {{ '{' }}
  @include visually-hidden;
{{ '}' }}</code></pre>
      </td>
    </tr>

  </tbody>

</table>

<b-heading>Text mixins</b-heading>

<table class="doc-table">
  <thead>
    <tr>
      <th>mixin</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td style="white-space: nowrap;">text-truncate</td>
      <td>
        Adds:
        <pre><code>white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;</code></pre>
        Use to cut single line of text and add an ellipsis.
      </td>
      <td>
        <pre><code>.long-line {{ '{' }}
  @include text-truncate;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">text-hyphenate($enable)</td>
      <td>
        Will break words that don't fit (with '-'). Pass false to not hyphenate but only break long words that overflow.
      </td>
      <td>
        <pre><code>.text-in-a-small-box {{ '{' }}
  @include text-hyphenate;
{{ '}' }}

.long-word {{ '{' }}
  @include text-hyphenate(false);
{{ '}' }}
</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">text-hide</td>
      <td>
        Hides text. Basically
        <pre><code>font-size: 0;</code></pre>
      </td>
      <td>
        <pre><code>.screenreader-text {{ '{' }}
  @include text-hide;
{{ '}' }}</code></pre>
      </td>
    </tr>

  </tbody>

</table>

<b-heading>Responsive mixins</b-heading>

<table class="doc-table">
  <thead>
    <tr>
      <th>mixin</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td style="white-space: nowrap;">mobile {{ '{' }} ...styles... {{ '}' }}</td>
      <td>
        Apply styles only on devices with screen width less than 768px
      </td>
      <td>
        <pre><code>.image {{ '{' }}
  @include mobile {{ '{' }}
    width: 100%;
  {{ '}' }}
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">desktop {{ '{' }} ...styles... {{ '}' }}</td>
      <td>
        Apply styles only on devices wider than 768px.
      </td>
      <td>
        <pre><code>.image {{ '{' }}
  @include desktop {{ '{' }}
    width: 90vw;
    max-width: 1000px;
  {{ '}' }}
{{ '}' }}</code></pre>
      </td>
    </tr>

  </tbody>

</table>
