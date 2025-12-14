# Contributing to AI DevOps Commander

Thank you for your interest in contributing! This project was built for the AI Agents Assemble Hackathon and demonstrates clean OSS practices.

## 🎯 CodeRabbit Integration (Captain Code Award)

All pull requests are automatically reviewed by CodeRabbit AI to ensure:
- Code quality and best practices
- Documentation completeness
- Test coverage
- Security considerations

## 📝 Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update README if needed

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: Add autonomous scaling feature"
   ```

   Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `refactor:` Code refactoring
   - `test:` Adding tests

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Wait for CodeRabbit review**
   - CodeRabbit will automatically review your PR
   - Address any feedback
   - Once approved, maintainers will merge

## 🛠️ Development Setup

```bash
# Clone repository
git clone <repo-url>
cd ai-devops-commander

# Install dependencies
cd dashboard && npm install

# Start development
docker-compose -f kestra/docker-compose.yml up -d
cd dashboard && npm run dev
```

## 🧪 Testing

```bash
# Run dashboard tests
cd dashboard
npm test

# Run Python tests
cd oumi
pytest
```

## 📚 Code Style

- **TypeScript/JavaScript:** Follow Prettier + ESLint config
- **Python:** Follow PEP 8
- **YAML:** 2-space indentation
- **Markdown:** Use proper headings and formatting

## 🎯 Areas for Contribution

- **Workflow Templates:** New Kestra workflow patterns
- **ML Models:** Improved RL training algorithms
- **Integrations:** Support for more cloud providers
- **Documentation:** Tutorials, guides, examples
- **Testing:** Unit tests, integration tests
- **UI Improvements:** Better visualizations

## 📞 Getting Help

- **Issues:** Open an issue for bugs or features
- **Discussions:** Use GitHub Discussions for questions
- **Discord:** Join WeMakeDevs Discord for community support

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Invited to future hackathons

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Built with ❤️ for AI Agents Assemble Hackathon**
