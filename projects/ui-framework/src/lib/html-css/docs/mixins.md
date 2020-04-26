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
      <td>position($coordinates, $position)</td>
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

    <tr>
      <td style="white-space: nowrap;">hide-scrollbar</td>
      <td>
        Hides scrollbar. Item can still be scrolled with mousewheel.
      </td>
      <td>
        <pre><code>.no-scrollbar {{ '{' }}
  @include hide-scrollbar;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">normalize-par</td>
      <td>
        Meant to be applied on &lt;p&gt; elements. Removes margin-top from first-child, margin-bottom from last-child
        and all margins from only-child.
      </td>
      <td>
        <pre><code>p {{ '{' }}
  @include normalize-par;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">button-reset</td>
      <td>
        Removes default browser styles from button (border, margin,padding, background etc)
      </td>
      <td>
        <pre><code>.text-button {{ '{' }}
  @include button-reset;
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
      <td><span style="white-space: nowrap;">line-clamp</span>($lines, $font-size, $line-height)</td>
      <td>
        Sets max-height of element to $lines of text, overflowing text will be truncated (cut with ellipsis).<br>
        If $font-size and $line-height values are not provided, default body values are used ($font-size: 12px,
        $line-height: 1.5).
      </td>
      <td>
        <pre><code>.max-2-lines {{ '{' }}
  @include line-clamp(2);
{{ '}' }}

.max-4-lines-display-3 {{ '{' }}
  @include line-clamp(2, $font-size-display-3, $line-height-heading);
{{ '}' }}</code></pre>
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
      <td style="white-space: nowrap;">desktop {{ '{' }} ...styles... {{ '}' }}</td>
      <td>
        Apply styles only on devices wider than 768px.
      </td>
      <td rowspan="2">
        <pre><code>.image {{ '{' }}

  @include desktop {{ '{' }}
    width: 90vw;
    max-width: 1000px;
  {{ '}' }}

  @include mobile {{ '{' }}
    width: 100%;
  {{ '}' }}

{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">mobile {{ '{' }} ...styles... {{ '}' }}</td>
      <td>
        Apply styles only on devices with screen width less than 768px
      </td>
    </tr>

  </tbody>

</table>

<b-heading>Animation mixins</b-heading>

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
      <td style="white-space: nowrap;">animate-collapse</td>
      <td>
        Adds simple 'collapse' animation.
      </td>
      <td rowspan="2">
        <pre><code>&lt;div class="collapsible"
            [ngClass]="{{ '{' }}
              collapsed: !isOpen,
              expanded: isOpen
            {{ '}' }}"&gt;Something&lt;/div&gt;

.collapsible {{ '{' }}

  &.collapsed {{ '{' }}
    @include animate-collapse;
  {{ '}' }}

  &.expanded {{ '{' }}
    @include animate-expand;
  {{ '}' }}

{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">animate-expand</td>
      <td>
        Adds simple 'expand' animation.
      </td>
    </tr>

  </tbody>

</table>


<b-heading>Browser hacks</b-heading>

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
      <td style="white-space: nowrap;">ie-only {{ '{' }} ...styles... {{ '}' }}</td>
      <td>
        Applies styles only if browser is Internet Explorer
      </td>
      <td rowspan="2">
        <pre><code>.fixed-on-chrome {{ '{' }}

  @include ie-only {{ '{' }}
    position: absolute;
  {{ '}' }}

  @include not-ie {{ '{' }}
    position: fixed;
  {{ '}' }}

{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td style="white-space: nowrap;">not-ie {{ '{' }} ...styles... {{ '}' }}</td>
      <td>
        Applies styles only if browser is <u>not</u> Internet Explorer
      </td>
    </tr>

  </tbody>

</table>
