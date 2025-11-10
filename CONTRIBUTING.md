# Contributing to Session Multi-App

Thank you for your interest in contributing to this project! This document provides guidelines for contributing to the Session Multi-App project.

## Code of Conduct

This project adheres to professional standards. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/HenriqueBMoura/session-multiapp.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Follow the commit message conventions below
6. Push to your fork and submit a pull request

## Development Setup

Please refer to the README.md for detailed setup instructions including:
- Node.js 20+ and pnpm 9+
- .NET 6 SDK
- Angular CLI 18

## Commit Message Convention

We follow the Conventional Commits specification:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` code style changes (formatting, etc.)
- `refactor:` code refactoring
- `test:` adding or modifying tests
- `chore:` maintenance tasks

### Examples:
```
feat: add user session persistence
fix: resolve CORS issue in production
docs: update API endpoint documentation
refactor: optimize authentication flow
```

## Pull Request Guidelines

1. **Title**: Use a descriptive title following conventional commits
2. **Description**: Clearly describe what your PR does and why
3. **Testing**: Ensure all applications still work correctly
4. **Documentation**: Update documentation if needed

## Code Style

- **TypeScript/JavaScript**: Follow the existing ESLint configuration
- **C#**: Follow standard .NET conventions
- **HTML/CSS**: Use consistent indentation and semantic markup

## Testing

Before submitting:
1. Test all authentication flows
2. Verify cross-app navigation works
3. Check that all applications start correctly
4. Ensure no console errors

## Architecture Considerations

When contributing, keep in mind:
- Session-based authentication must remain consistent across apps
- CORS configuration should support all frontends
- Production considerations for deployment
- Security best practices for cookie handling

## Questions?

Feel free to open an issue for questions or clarifications about contributing to this project.