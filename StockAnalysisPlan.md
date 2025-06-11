## Overview

Automate daily analytics and site rebuild with two Git repos and GitHub Actions, using HTML fragments (not JSON) for direct embedding in Hugo:

1. **Hugo repo** (`website/`): your front-end, ingesting HTML snippets or iframes for each analysis result.
2. **Analytics repo** (`analytics/` submodule): Python scripts generate standalone HTML visualizations and partial templates.
3. **Automation**: a GitHub Actions cron workflow in the Hugo repo that pulls updates from `analytics/`, runs the scripts, commits new HTML fragments into the Hugo project, rebuilds, and deploys.

---

### 1. Repository Layout (Polyrepo via Submodule)

```text
website/
├── analytics/               # Git submodule pointing to analytics repo
├── layouts/shortcodes/      # Hugo shortcodes (for raw HTML embedding)
├── content/                 # Optional markdown pages referencing shortcodes
├── static/plots/            # Static HTML fragments or assets from analytics
├── config.toml              # Hugo configuration
└── .github/workflows/
    └── daily-build.yml      # GitHub Actions workflow

analytics/ (separate repo)
├── scripts/
│   └── analyze.py           # Python analysis producing HTML
├── requirements.txt
└── outputs/html/            # Generated HTML snippets and assets
```

* Add submodule: `cd website && git submodule add <analytics-repo-url> analytics`
* Clone with: `git clone --recurse-submodules <website-repo>`

---

### 2. GitHub Actions Workflow

Place this in `website/.github/workflows/daily-build.yml`:

```yaml
name: Daily Analytics & Site Rebuild
on:
  schedule:
    - cron: '0 6 * * *'  # Runs at 06:00 UTC daily
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.x'

      - name: Install dependencies
        run: |
          cd analytics
          pip install -r requirements.txt

      - name: Run analysis & generate HTML
        run: |
          cd analytics/scripts
          python analyze.py --output ../outputs/html

      - name: Copy HTML fragments into site
        run: |
          cp -R analytics/outputs/html/* ../static/plots/

      - name: Commit HTML updates
        run: |
          git config user.name 'github-actions[bot]'
          git config user.email 'github-actions[bot]@users.noreply.github.com'
          git add static/plots/
          git commit -m 'Daily analytics HTML update' || echo 'No changes'
          git push
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & Deploy Hugo
        uses: peaceiris/actions-hugo@v5
        with:
          hugo-version: '0.111.3'
          publish-dir: './public'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

### 3. HTML Integration in Hugo

Rather than parsing JSON, directly embed your pre-rendered HTML visualizations:

1. **Shortcode**: create `layouts/shortcodes/plot.html`:

   ```go
   {{/* Usage: {{< plot file="plot1.html" >}} */}}
   {{ $file := printf "%s/%s" ("plots") (.Get "file") }}
   {{< rawhtml >}}
   {{ readFile (printf "static/%s" $file) | safeHTML }}
   {{< /rawhtml >}}
   ```

2. **Reference in content**:

   ```markdown
   ## Daily Stock Analysis Results

   {{< plot file="plot1.html" >}}
   ```

3. **Iframes (optional)**: sandbox complex dashboards:

   ```go
   <iframe src="/plots/dashboard.html" width="100%" height="600"></iframe>
   ```

4. **Partial templates**: for reusable UI blocks, place HTML snippets in `layouts/partials/` and include via `{{ partial "stats.html" . }}`.

---

### 4. Benefits of HTML-first Approach

* **Full visual fidelity**: use Python’s rich libs (Plotly, Bokeh, mpld3) with interactive JS intact.
* **Simplicity**: Hugo just includes raw HTML — zero data parsing overhead.
* **Modularity**: analytics team controls HTML look and feel independently.
* **Performance**: static site serves pre-rendered assets directly, reducing client overhead.

---

### 5. Next Steps

* Modify Python scripts to emit complete HTML snippets (and asset folders) under `analytics/outputs/html/`.
* Implement the `plot.html` shortcode and any partials for embedding.
* Test the Actions workflow to ensure HTML files sync and site rebuilds.
* Optionally, fine-tune CSS/scoping to avoid style clashes between embedded HTML and Hugo theme.
