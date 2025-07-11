# Contributing to Laberit Intelligence

Thank you for your interest in contributing to Laberit Intelligence! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Issues

1. Check existing issues to avoid duplicates
2. Use issue templates when available
3. Include:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python version, etc.)

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests if applicable
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

```bash
# Clone repository
git clone https://github.com/Percevals/Laberit-intelligence.git
cd Laberit-intelligence

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# For development dependencies
pip install pytest black flake8
```

### Code Style

- Follow PEP 8 guidelines
- Use Black for code formatting
- Add docstrings to functions and classes
- Keep line length under 88 characters

### Testing

- Add tests for new features
- Ensure existing tests pass
- Run tests with: `pytest tests/`

### Documentation

- Update README.md if needed
- Add docstrings to new code
- Update CHANGELOG.md for significant changes

## Project Structure

```
Laberit-intelligence/
├── data/              # Data files and generators
├── docs/              # Documentation
├── intelligence/      # Intelligence generation modules
├── quick-assessment/  # PWA application
├── scripts/           # Utility scripts
├── templates/         # Document templates
└── tests/            # Test files
```

## Areas for Contribution

- **Data Analysis**: Improve analysis scripts
- **Visualizations**: Enhance dashboard components
- **Documentation**: Improve guides and examples
- **Testing**: Add test coverage
- **Translations**: Add multi-language support
- **Security**: Report vulnerabilities responsibly

## Questions?

Feel free to open an issue for discussion or reach out to the maintainers.

Thank you for contributing to building better digital immunity!