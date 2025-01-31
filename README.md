# Semantic Commit Validator

A free online tool to validate and lint git commit messages according to the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## 🚀 Features

- Real-time commit message validation
- Detailed error messages and suggestions
- SemVer impact analysis
- Support for breaking changes
- Scope validation
- Character length checking
- Body and footer validation

## 🎯 Use Cases

- Validate commit messages before pushing
- Learn conventional commits format
- Ensure team consistency in commit messages
- Understand SemVer impact of your changes

## 📋 Supported Commit Types

### Required Types
- `feat`: A new feature (MINOR in SemVer)
- `fix`: A bug fix (PATCH in SemVer)

### Optional Types
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test updates
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Maintenance tasks
- `revert`: Revert previous changes

## 🔍 Validation Rules

1. Commit messages must start with a type and description
2. First line must not exceed 100 characters
3. Body must begin with a blank line
4. Breaking changes must be marked with `!` or `BREAKING CHANGE`
5. Scope must be a valid identifier
6. Footer must follow the conventional format

## 💻 Tech Stack

- React
- conventional-commits-parser
- Pure CSS (no external dependencies)

## 🤖 Built with AI

This tool was created through a collaboration between human and artificial intelligence, using GitHub Copilot and ChatGPT for rapid development and refinement.

## 🌟 Contributing

Contributions are welcome! Feel free to:
1. Report bugs
2. Suggest new features
3. Submit pull requests

## ☕ Support

If you find this tool helpful, consider supporting the development:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ennismachta)

## 📜 License

MIT License - feel free to use this tool in your projects.
