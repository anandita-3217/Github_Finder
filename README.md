# GitHub User Finder 

An Electron desktop application that fetches and displays GitHub user profiles with their repositories. Built with modern Electron architecture, featuring secure IPC communication and a beautiful, responsive UI.

![GitHub User Finder Demo](https://img.shields.io/badge/Electron-37.3.1-blue?logo=electron)
![Node.js](https://img.shields.io/badge/Node.js-Required-green?logo=node.js)

## ✨ Features

- 🔍 **User Search**: Search GitHub users by username
- 👤 **Profile Display**: View comprehensive user profiles with avatars
- 📊 **Statistics**: See followers, following, repositories, and gists counts
- 📂 **Repository Listing**: Browse user's latest repositories with details
- ⚡ **Smart Caching**: Built-in caching for faster subsequent searches
- 🛡️ **Secure Architecture**: Follows Electron security best practices
- 🎨 **Modern UI**: Clean, responsive interface with smooth animations
- ❌ **Error Handling**: Graceful error handling with user-friendly messages

## 🖥️ Screenshots

*Add screenshots of your app here once you take some!*

## 🏗️ Architecture

This application follows a clean, modular architecture:

```
src/
├── main.js           # Main process (Electron's backend)
├── preload.js        # Secure IPC bridge
├── renderer.js       # UI logic and DOM manipulation
├── githubfinder.js   # GitHub API client class
└── index.html        # Application interface
```

### Key Components

- **Main Process**: Handles window creation and IPC communication
- **Renderer Process**: Manages UI interactions and display logic
- **Preload Script**: Provides secure communication bridge between processes
- **GitHub API Client**: Handles all GitHub API interactions with caching

## 🚀 Getting Started

<!-- ### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js) -->

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/github-finder.git
   cd github-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The app will launch in a new Electron window!

## 📦 Building for Production

### Package the app
```bash
npm run package
```

### Create distributables
```bash
npm run make
```

<!-- This will create platform-specific distributables in the `out/` directory. -->

## 🔧 Development

### Project Structure

```
github-finder/
├── src/                    # Source files
│   ├── main.js            # Main process entry point
│   ├── preload.js         # Security bridge
│   ├── renderer.js        # UI controller
│   ├── githubFinder.js    # API client
│   └── index.html         # Main interface
├── forge.config.js        # Electron Forge configuration
├── package.json           # Project dependencies and scripts
└── README.md             # You are here!
```

### Key Scripts

- `npm start` - Launch development version
- `npm run package` - Package for current platform
- `npm run make` - Create distributables
- `npm run publish` - Publish to configured targets

### Debugging

The app includes comprehensive logging:

- Open Developer Tools: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
- Check console for detailed logs from all processes
- Network tab shows API requests to GitHub

## 🛡️ Security Features

- **Context Isolation**: Renderer process is isolated from Node.js APIs
- **Preload Scripts**: Secure IPC communication bridge
- **Content Security Policy**: Configured to allow necessary resources while blocking malicious content
- **No Node Integration**: Renderer process cannot directly access Node.js APIs

## 📡 API Integration

### GitHub API Usage

This app uses GitHub's public REST API v3:
- **Endpoint**: `https://api.github.com/users/{username}`
- **Rate Limit**: 60 requests per hour (unauthenticated)
- **No API key required** for basic user data

### Caching Strategy

- **Cache Duration**: 5 minutes for user data
- **Memory Storage**: Cached data is stored in memory during app session
- **Auto Cleanup**: Cache automatically manages size to prevent memory leaks

## 🎨 Customization

### Modifying the UI

Edit `index.html` and the CSS within it to customize:
- Colors and themes
- Layout and spacing
- Typography and fonts

### Adding Features

1. **New API Endpoints**: Extend the `GitHubFinder` class in `githubFinder.js`
2. **UI Components**: Add new methods to `GitHubFinderUI` class in `renderer.js`
3. **IPC Handlers**: Register new handlers in `main.js` and expose in `preload.js`

### Configuration Options

The `GitHubFinder` class accepts these options:
```javascript
const finder = new GitHubFinder({
  userAgent: 'Your App Name',
  timeout: 15000,           // Request timeout in ms
  cacheTimeout: 600000,     // Cache duration in ms
  baseUrl: 'api.github.com' // API base URL
});
```

## 🐛 Troubleshooting

### Common Issues

**App won't start**
- Ensure Node.js is installed and up to date
- Run `npm install` to install dependencies
- Check console for error messages

**Images not loading**
- Check your `forge.config.js` for Content Security Policy settings
- Ensure external HTTPS requests are allowed

**API requests failing**
- Check internet connection
- Verify GitHub API is accessible
- Check browser's Developer Tools → Network tab

**Empty results**
- Open Developer Tools and check console for errors
- Verify the username exists on GitHub
- Check if GitHub API rate limit is exceeded

### Debug Mode

Set `NODE_ENV=development` to enable:
- Automatic DevTools opening
- Verbose console logging
- Hot reload capabilities

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add feature-name"`
6. Push: `git push origin feature-name`
7. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add console.log statements for debugging
- Test on multiple platforms if possible
- Update this README if you add features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anandita**
- Email: dakshugarimella@gmail.com
- GitHub: [@anandita-3217](https://github.com/anandita-3217)

## 🙏 Acknowledgments

- [GitHub REST API](https://docs.github.com/en/rest) for providing user data
- [Electron](https://www.electronjs.org/) for the amazing desktop app framework
- [Electron Forge](https://www.electronforge.io/) for build tooling and configuration
- The open-source community for inspiration and best practices

## 📚 Learning Resources

If you're new to Electron, check out:
- [Electron Official Docs](https://www.electronjs.org/docs)
- [Electron Security Guide](https://www.electronjs.org/docs/tutorial/security)
- [Electron Forge Documentation](https://www.electronforge.io/)

## 🔮 Future Enhancements

- [ ] User authentication for higher API rate limits
- [ ] Search history and favorites
- [ ] Organization profile support
- [ ] Repository statistics and insights
- [ ] Dark/light theme toggle
- [ ] Export profile data to PDF
- [ ] Keyboard shortcuts
- [ ] System tray integration

---

**Built with ❤️ using Electron, Node.js, and the GitHub API**

*Happy coding! 🚀*