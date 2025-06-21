# GitHub Actions Workflows Documentation

This directory contains GitHub Actions workflows for automated deployment and maintenance of the Hugo-based website with stock analysis reports.

## Workflows Overview

### 1. `daily-stock-reports.yml` - Daily Stock Reports Generation and Deployment

**Purpose**: Automatically generates stock analysis reports daily and deploys the updated site to GitHub Pages.

**Schedule**: 
- Runs daily at 6:00 UTC (after market close)
- Can be triggered manually via GitHub Actions UI

**Workflow Steps**:
1. **Repository Checkout**: Checks out the main repository with all submodules
2. **Python Environment Setup**: Installs Python 3.11 with pip caching
3. **Dependencies Installation**: Installs all required Python packages from `StockStrategiest/requirements.txt`
4. **Report Generation**: Executes `report_generator.py` in the StockStrategiest directory
5. **Report Copying**: Uses `scripts/copy-reports.py` to move HTML reports to `static/reports/`
6. **Change Detection**: Checks if new reports were generated
7. **Git Commit**: Commits changes with timestamp if reports were updated
8. **Hugo Build**: Builds the Hugo site with production settings
9. **GitHub Pages Deployment**: Deploys the updated site to GitHub Pages
10. **Status Notification**: Reports workflow completion status

**Key Features**:
- **Concurrency Control**: Prevents multiple workflow runs from conflicting
- **Smart Change Detection**: Only commits and deploys when reports actually change
- **Error Handling**: Continues deployment even if no new reports are generated
- **Production Optimization**: Uses Hugo's minification and garbage collection
- **Automated Timestamps**: Includes UTC timestamp in commit messages

### 2. `gh-pages.yml` - Manual Hugo Site Deployment

**Purpose**: Deploys the Hugo site to GitHub Pages when changes are pushed to main branch.

**Triggers**:
- Push to main branch
- Manual workflow dispatch

## Required Repository Settings

### Permissions
The workflows require the following permissions to be configured in the repository settings:

1. **Actions > General > Workflow permissions**:
   - Set to "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

2. **Pages > Source**:
   - Set to "GitHub Actions"

### Secrets
No additional secrets are required. The workflows use the built-in `GITHUB_TOKEN` which is automatically provided by GitHub Actions.

### Branch Protection (Optional but Recommended)
Consider setting up branch protection rules for the `main` branch:
- Require status checks to pass before merging
- Require branches to be up to date before merging

## Workflow Dependencies

### Python Dependencies
All Python dependencies are managed through `StockStrategiest/requirements.txt`. Key packages include:
- `pandas`, `numpy` for data manipulation
- `matplotlib`, `seaborn` for visualization
- `yfinance` for financial data
- `backtesting` for strategy analysis
- `Jinja2` for HTML report templating

### Hugo Dependencies
- Hugo Extended v0.147.0 (automatically installed)
- Dart Sass (automatically installed)
- Hugo theme submodules (automatically checked out)

## File Structure Requirements

The workflow expects the following directory structure:

```
├── .github/workflows/
│   ├── daily-stock-reports.yml
│   └── gh-pages.yml
├── StockStrategiest/
│   ├── requirements.txt
│   ├── report_generator.py
│   └── results/              # Generated HTML reports
├── scripts/
│   └── copy-reports.py       # Report copying script
├── static/
│   └── reports/              # Destination for HTML reports
└── content/                  # Hugo content
```

## Monitoring and Troubleshooting

### Workflow Status
- Check the Actions tab in your GitHub repository
- Each workflow run shows detailed logs for each step
- Failed runs will show error messages and stack traces

### Common Issues and Solutions

1. **Python Dependencies Installation Fails**:
   - Check `StockStrategiest/requirements.txt` for syntax errors
   - Verify all package versions are compatible with Python 3.11

2. **Report Generation Fails**:
   - Check `report_generator.py` for runtime errors
   - Verify required data sources are accessible
   - Check Python path and module imports

3. **Hugo Build Fails**:
   - Verify Hugo theme submodules are properly configured
   - Check for syntax errors in Hugo templates or content files
   - Ensure all required Hugo dependencies are available

4. **GitHub Pages Deployment Fails**:
   - Verify repository Pages settings are configured correctly
   - Check that the workflow has proper permissions
   - Ensure the `public` directory is generated correctly by Hugo

### Manual Workflow Execution
Both workflows can be triggered manually:
1. Go to the Actions tab in your GitHub repository
2. Select the desired workflow
3. Click "Run workflow"
4. Choose the branch (usually `main`)
5. Click "Run workflow" button

## Performance Considerations

### Caching
- Python dependencies are cached using `actions/setup-python@v4` with `cache: 'pip'`
- This reduces installation time for subsequent runs

### Concurrency
- The daily reports workflow uses concurrency control to prevent overlapping runs
- This ensures data consistency and prevents conflicts

### Resource Usage
- Workflows run on `ubuntu-latest` runners
- Typical execution time: 5-10 minutes depending on report complexity
- GitHub provides 2,000 free minutes per month for public repositories

## Maintenance

### Regular Updates
- Monitor workflow runs for failures or performance issues
- Update Hugo version in workflows when new releases are available
- Review and update Python dependencies periodically
- Test workflow changes in a fork or feature branch before merging

### Security
- Workflows use minimal required permissions
- No sensitive data is stored in the repository
- All external dependencies are pinned to specific versions where possible

## Support

For issues with the workflows:
1. Check the workflow run logs in the Actions tab
2. Review this documentation for common solutions
3. Verify repository settings and permissions
4. Test components individually (Python scripts, Hugo build, etc.)