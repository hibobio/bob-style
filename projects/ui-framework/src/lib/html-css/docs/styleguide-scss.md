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
        <pre><code>.box {{ '{' }}
    color: red;
{{ '}' }}</code></pre>
      </td>
      <td>
        <pre><code>.box {{ '{' }}
  color: green;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td>separate sets of rules<br> for different elements <br>with empty lines</td>
      <td>
        <pre><code>.hex {{ '{' }}
  color: red;
  .pex {{ '{' }}
    color: green;
  {{ '}' }}
{{ '}' }}
.fex {{ '{' }}
  color: blue;
{{ '}' }}</code></pre>
      </td>
      <td>
        <pre><code>.hex {{ '{' }}
  color: red;

  .pex {{ '{' }}
    color: green;
  {{ '}' }}
{{ '}' }}

.fex {{ '{' }}
  color: blue;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td>Classnames:<br>
        All lowercase, separate words with hyphen ‘-‘, <br>no camelCase, no underscore</td>
      <td>
        <pre><code>
.myCoolName
.my_Other_Cool_Name
        </code></pre>
      </td>
      <td>
        <pre><code>
.my-cool-name
.my-other-cool-name
        </code></pre>
      </td>
    </tr>

    <tr>
      <td>no vendor prefixes</td>
      <td>
        <pre><code>.box {{ '{' }}
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
{{ '}' }}</code></pre>
      </td>
      <td>
        <pre><code>.box {{ '{' }}
  align-items: center;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td>Use variables. <br>Values that are used more then once should probably be put in variables.
      </td>
      <td>
        <pre><code>.box {{ '{' }}
  font-size: 12px;
  color: #535353;
{{ '}' }}</code></pre>
      </td>
      <td>
        <pre><code>.box {{ '{' }}
  font-size: $font-size-body;
  color: $grey-700;
{{ '}' }}</code></pre>
      </td>
    </tr>

    <tr>
      <td>put media queries<br> near the rules they correct <br>(not in the end of file/section/etc)</td>
      <td>
        <pre><code>.box {{ '{' }}
  color: red;
{{ '}' }}

.rox {{ '{' }}
  height: 30px;
{{ '}' }}

@media (min-width: 800px) {{ '{' }}
  .box {{ '{' }}
    color: blue;
  {{ '}' }}
{{ '}' }}</code></pre>
      </td>
      <td>
        <pre><code>.box {{ '{' }}
  color: red;

  @media (min-width: 800px) {{ '{' }}
    color: blue;
  {{ '}' }}
{{ '}' }}

.rox {{ '{' }}
  height: 30px;
{{ '}' }}

</code></pre>
      </td>
    </tr>

    <tr>
      <td>nesting:<br> maximum 3 levels</td>
      <td>
        <pre><code>.hex {{ '{' }}
  .pex {{ '{' }}
    .fex {{ '{' }}
      .shmex {{ '{' }}
        color: red;
      {{ '}' }}
    {{ '}' }}
  {{ '}' }}
{{ '}' }}

.hex .pex .fex .shmex {{ '{' }}
  height: 30px;
{{ '}' }}</code></pre>
      </td>
      <td>
        <pre><code>.fex-shmex {{ '{' }}
  color: red;
  height: 30px;
{{ '}' }}</code></pre>
      </td>
    </tr>

  </tbody>

</table>

<table class="doc-table">
  <thead>
    <tr>
      <th>rule</th>
      <th style="background-color: orange; color: white;">meh</th>
      <th style="background-color: green; color: white;">good</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td>favor flat structure</td>
      <td>
        <pre><code>.hex {{ '{' }}
  .pex {{ '{' }}
    color: red;
  {{ '}' }}
{{ '}' }}</code></pre>
      </td>
      <td>
        <pre><code>.hex-pex {{ '{' }}
  color: green;
{{ '}' }}</code></pre>
      </td>
    </tr>


  </tbody>

</table>
