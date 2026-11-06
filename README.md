<h1>Selah Plugin Registry</h1>
<p>This repository is the official registry for Selah community plugins. </p>

<h2>📥 How to Install a Plugin</h2>
<p>The safest and easiest way to install plugins is directly inside Selah:</p>
<ol>
  <li>Open Selah and go to <strong>Settings &gt; Plugins</strong>.</li>
  <li>Click <strong>Browse Community Plugins</strong>.</li>
  <li>Find a plugin and click <strong>Install</strong>. Selah handles the download and verification automatically.</li>
</ol>

<p><strong>Manual Installation:</strong> If a plugin is not in the registry yet, you can download it directly from the developer's GitHub. Extract the folder, then click the <strong>Import Plugin</strong> button in Selah's Settings menu to install it.</p>

<hr>

<h2>🛠️ Submitting a Plugin</h2>
<p>We use a strict, commit-pinned, hash-verified registry to keep users safe. If you have built a plugin and want it listed in the Community tab, follow these steps:</p>
<ol>
  <li><strong>Publish your plugin</strong> in a public GitHub repo. It can be a dedicated repo, or a folder inside a monorepo (e.g., <code>my-plugins/daily-stats</code>).</li>
  <li><strong>Get the commit SHA</strong> you want to publish: 
    <pre><code class="language-bash">git rev-parse HEAD</code></pre>
  </li>
  <li><strong>Fork this repo</strong> and run the hash script. 
    <ul>
      <li>For a dedicated repo: <code>node scripts/hash.mjs owner/repo &lt;commit-sha&gt;</code></li>
      <li>For a monorepo folder: <code>node scripts/hash.mjs owner/repo &lt;commit-sha&gt; &lt;folder-name&gt;</code></li>
    </ul>
  </li>
  <li>Save the output as <code>plugins/&lt;your-plugin-id&gt;.json</code>.</li>
  <li>Open a Pull Request. </li>
  <li>Our CI will automatically download your files at that exact commit, verify the hashes, and check for malicious code. </li>
  <li>Once a maintainer merges the PR, it will appear in Selah within minutes.</li>
</ol>

<h2>📚 Documentation</h2>
<p>For detailed guides on the Plugin API, creating custom blocks, and UI styling, please read the <strong><a href="https://github.com/El3ctricFX/selah-plugins/wiki/API-Reference">Selah Plugin Wiki</a></strong>.</p>
