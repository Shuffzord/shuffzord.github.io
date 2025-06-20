# Principles - Personal Knowledge Management System

[![Hugo](https://img.shields.io/badge/Hugo-0.111+-blue.svg)](https://gohugo.io/)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-green.svg)](https://shuffzord.github.io)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

> **Live Site**: [https://shuffzord.github.io](https://shuffzord.github.io)

A comprehensive personal knowledge management system built with Hugo, featuring automated stock analysis, study notes, project showcases, and curated content collections. This site serves as a structured approach to organizing learning materials, investment research, and personal development insights.

## 🚀 Quick Start

```bash
# Clone the repository with submodules
git clone --recurse-submodules https://github.com/shuffzord/shuffzord.github.io.git
cd shuffzord.github.io

# Initialize submodules (if not cloned with --recurse-submodules)
git submodule update --init --recursive

# Install Hugo (if not already installed)
# On macOS: brew install hugo
# On Windows: choco install hugo-extended
# On Linux: snap install hugo

# Start local development server
hugo server -D

# Visit http://localhost:1313
```

## 📋 Prerequisites

- **Hugo Extended** (v0.111.3 or later)
- **Git** (for submodule management)
- **Node.js** (optional, for advanced customizations)
- **Python 3.x** (for analytics automation)

## 🎯 Project Overview

### Purpose
This project implements a structured approach to personal knowledge management, combining:
- **Investment Research**: Stock analysis, technical indicators, and trading strategies
- **Learning Documentation**: Machine learning studies, cheat sheets, and technical notes
- **Project Portfolio**: Showcasing personal projects and achievements
- **Content Curation**: Quotes, insights, and daily journal entries

### Key Features
- 📊 **Automated Analytics**: Python-based stock analysis with HTML visualization
- 📚 **Organized Content**: Structured sections for different knowledge domains
- 🎨 **Custom Theming**: Tailored hello-friend-ng theme with custom styling
- 🔄 **CI/CD Integration**: Automated builds and deployments via GitHub Actions
- 📱 **Responsive Design**: Mobile-friendly interface with dark/light theme support
- 🔍 **SEO Optimized**: Google Analytics integration and meta optimization

## 🏗️ Architecture & Structure

### File Structure
```
shuffzord.github.io/
├── 📁 content/                    # Main content directory
│   ├── 📁 CheatSheets/           # Technical cheat sheets and quick references
│   ├── 📁 Projects/              # Project showcases and documentation
│   │   ├── 📁 n8n/              # N8N automation projects
│   │   └── 📁 smarterloan/      # SmarterLoan project documentation
│   ├── 📁 Quotes/               # Curated quotes and insights
│   ├── 📁 Stock/                # Investment research and analysis
│   └── 📁 Study/                # Learning materials and notes
├── 📁 data/                      # JSON data files
│   ├── journal.json             # Personal journal entries
│   ├── quotesbackup.json        # Quotes backup
│   ├── stockjournal.json        # Stock trading journal
│   └── WantToBuy.json          # Stock watchlist
├── 📁 layouts/                   # Custom Hugo layouts
│   ├── 📁 Quotes/               # Quote-specific layouts
│   └── 📁 _default/             # Default page layouts
├── 📁 static/                    # Static assets
│   ├── 📁 css/                  # Custom stylesheets
│   ├── 📁 js/                   # JavaScript files
│   ├── 📁 Images/               # Image assets
│   └── 📁 pdf/                  # Document files
├── 📁 themes/                    # Hugo themes (submodules)
│   ├── 📁 ananke/               # Ananke theme
│   └── 📁 hello-friend-ng/      # Primary theme
├── 📁 assets/                    # Build assets
├── 📁 resources/                 # Hugo resources
├── config.toml                   # Hugo configuration
└── StockAnalysisPlan.md         # Analytics automation plan
```

### Hugo Configuration
The site uses [`config.toml`](config.toml) with the following key settings:
- **Base URL**: `https://shuffzord.github.io`
- **Theme**: `hello-friend-ng`
- **Language**: English (en-us)
- **Analytics**: Google Analytics integration
- **Custom Assets**: Math CSS and custom JavaScript

### Data Schema
JSON files in [`data/`](data/) directory follow these structures:

**Journal Entries** ([`journal.json`](data/journal.json)):
```json
{
  "id": "string",
  "date": "DD.MM.YYYY",
  "entry": "string"
}
```

**Stock Journal** ([`stockjournal.json`](data/stockjournal.json)):
```json
{
  "symbol": "string",
  "date": "string",
  "action": "buy|sell",
  "price": "number",
  "notes": "string"
}
```

## 📝 Content Management

### Adding New Content

#### Stock Analysis Posts
```bash
# Create new stock analysis
hugo new Stock/new-analysis.md

# Add to content/Stock/ directory
# Include frontmatter:
---
title: "Stock Analysis Title"
date: 2024-01-01
tags: ["stocks", "analysis"]
---
```

#### Study Notes & Cheat Sheets
```bash
# Create cheat sheet
hugo new CheatSheets/new-cheatsheet.md

# Create study material
hugo new Study/new-topic.md
```

#### Project Showcases
```bash
# Create project documentation
hugo new Projects/project-name/_index.md

# Add subpages
hugo new Projects/project-name/subpages/feature.md
```

### Managing Data Files

#### Adding Journal Entries
Edit [`data/journal.json`](data/journal.json):
```json
{
  "id": "next_id",
  "date": "DD.MM.YYYY",
  "entry": "Your journal entry here"
}
```

#### Updating Stock Watchlist
Modify [`data/WantToBuy.json`](data/WantToBuy.json) with stock symbols and analysis notes.

### Custom Layouts
- **Quote Layout**: [`layouts/Quotes/list.html`](layouts/Quotes/list.html)
- **Base Template**: [`layouts/_default/baseof.html`](layouts/_default/baseof.html)
- **Custom Styling**: [`assets/scss/custom.scss`](assets/scss/custom.scss)

## 💻 Development Setup

### Local Development
```bash
# Start development server with drafts
hugo server -D --bind 0.0.0.0 --port 1313

# Build for production
hugo --minify

# Clean build cache
hugo mod clean
```

### Theme Management
```bash
# Update themes (submodules)
git submodule update --remote --merge

# Add new theme
git submodule add https://github.com/theme-repo themes/theme-name

# Initialize submodules after clone
git submodule update --init --recursive
```

### Custom Styling
- Edit [`assets/scss/custom.scss`](assets/scss/custom.scss) for theme customizations
- Modify [`static/css/`](static/css/) files for additional styles
- JavaScript customizations in [`static/js/custom.js`](static/js/custom.js)

## 🚀 Deployment & Automation

### GitHub Pages Setup
The site automatically deploys to GitHub Pages when changes are pushed to the main branch.

**Repository Settings**:
- Source: Deploy from a branch
- Branch: `gh-pages` (auto-generated)
- Folder: `/` (root)

### Analytics Integration
Following the [`StockAnalysisPlan.md`](StockAnalysisPlan.md), the project implements:

#### Planned GitHub Actions Workflow
```yaml
# .github/workflows/daily-build.yml
name: Daily Analytics & Site Rebuild
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 06:00 UTC
  push:
    branches: [ main ]
```

#### Analytics Submodule Structure
```
analytics/ (planned submodule)
├── scripts/
│   └── analyze.py           # Python analysis scripts
├── requirements.txt         # Python dependencies
└── outputs/html/           # Generated HTML visualizations
```

#### HTML Integration
- **Shortcodes**: Custom Hugo shortcodes for embedding analytics
- **Static Plots**: Generated HTML files in [`static/plots/`](static/plots/)
- **Automated Updates**: Daily regeneration of analysis content

### Environment Variables
Required for full automation:
- `GITHUB_TOKEN`: For automated commits and deployments
- `GOOGLE_ANALYTICS_ID`: For analytics tracking

## 🤝 Contributing

### Content Contributions
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-content`)
3. **Add** your content following the established structure
4. **Test** locally with `hugo server -D`
5. **Submit** a pull request

### Code Contributions
1. Follow Hugo best practices
2. Test theme compatibility
3. Ensure responsive design
4. Update documentation as needed

### Issue Reporting
- Use GitHub Issues for bug reports
- Include Hugo version and browser information
- Provide steps to reproduce issues

## 🔧 Maintenance & Troubleshooting

### Common Issues

#### Submodule Problems
```bash
# Reset submodules
git submodule deinit --all -f
git submodule update --init --recursive

# Update to latest
git submodule update --remote --merge
git submodule update --remote --merge StockStrategiest
```

#### Build Failures
```bash
# Clear Hugo cache
hugo mod clean

# Rebuild with verbose output
hugo --verbose --debug
```

#### Theme Issues
- Ensure theme compatibility with Hugo version
- Check [`config.toml`](config.toml) theme settings
- Verify custom CSS doesn't conflict with theme

### Performance Optimization
- **Image Optimization**: Use Hugo's image processing
- **Minification**: Enable `--minify` flag for production
- **Caching**: Leverage browser caching for static assets

### Backup Strategy
- **Git History**: Full version control
- **Data Files**: Regular backup of [`data/`](data/) directory
- **Static Assets**: Backup [`static/`](static/) directory

## 📚 Documentation & Resources

### Hugo Resources
- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Themes](https://themes.gohugo.io/)
- [Hugo Community](https://discourse.gohugo.io/)

### Theme Documentation
- [Hello Friend NG Theme](https://github.com/rhazdon/hugo-theme-hello-friend-ng)
- [Ananke Theme](https://github.com/theNewDynamic/gohugo-theme-ananke)

### Development Tools
- [Hugo Extended Installation](https://gohugo.io/getting-started/installing/)
- [Git Submodules Guide](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## 📄 License & Contact

### License
This project is licensed under [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

### Contact
- **Website**: [https://shuffzord.github.io](https://shuffzord.github.io)
- **GitHub**: [@shuffzord](https://github.com/shuffzord)
- **Email**: Available in CV at [`static/pdf/CV_WozniakMateusz.pdf`](static/pdf/CV_WozniakMateusz.pdf)

### Acknowledgments
- **Hugo Team**: For the excellent static site generator
- **Theme Authors**: hello-friend-ng and Ananke theme creators
- **Community**: Hugo and GitHub Pages communities for support and resources

---

**Last Updated**: January 2025  
**Hugo Version**: 0.111.3+  
**Theme Version**: hello-friend-ng (latest)

> 💡 **Tip**: Star this repository if you find the knowledge management approach useful for your own projects!