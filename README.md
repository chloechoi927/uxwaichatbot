# UX Writing Assistant Pro

A comprehensive Figma plugin for UX writing assistance with AI-powered text analysis, multi-language translation, and Google Sheets integration.

## ✨ Features

### 🔍 Text Scanning & Analysis
- **Automatic Text Detection**: Scans selected text layers in Figma
- **UI Type Detection**: Automatically categorizes text as buttons, labels, descriptions, etc.
- **UX Writing Guidelines**: Built-in rules for tone, length, and clarity
- **Violation Detection**: Identifies jargon, passive voice, negative language, and unclear text
- **Real-time Scoring**: Provides UX writing scores with actionable feedback

### 🤖 AI-Powered Suggestions
- **Claude AI Integration**: Advanced text analysis and improvement suggestions
- **Tone Analysis**: Detects friendly, professional, casual, or urgent tones
- **Smart Corrections**: Suggests specific improvements for better UX writing
- **Accessibility Considerations**: AI-powered accessibility recommendations

### 🌐 Multi-Language Translation
- **15+ Languages**: Support for English, Korean, Japanese, Chinese, Spanish, French, German, Italian, Portuguese, Russian, Arabic, Hindi, Thai, Vietnamese, and more
- **Quality Assessment**: Each translation includes quality indicators and length validation
- **UX-Optimized**: Translations consider UX writing best practices for each language
- **Cultural Adaptation**: AI ensures culturally appropriate translations

### 📊 Google Sheets Integration
- **Content Management**: Store and manage multilingual content in Google Sheets
- **Collaboration**: Share content with team members and stakeholders
- **Code Generation**: Automatic generation of unique codes for content tracking
- **Duplicate Detection**: Prevents duplicate content entries

### 🎨 Modern UI/UX
- **Intuitive Interface**: Clean, modern design with gradient headers and smooth animations
- **Real-time Feedback**: Live analysis results with visual indicators
- **Responsive Design**: Optimized for different screen sizes
- **Accessibility**: High contrast colors and clear typography

## 🚀 Quick Start

### Prerequisites
- Figma account
- Node.js 18+ (for development)
- Claude API key
- Google Sheets API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ux-writing-assistant-pro.git
   cd ux-writing-assistant-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo "CLAUDE_API_KEY=your_claude_api_key_here" > .env
   echo "GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here" >> .env
   ```

4. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

5. **Install in Figma**
   - Open Figma
   - Go to Plugins → Development → Import plugin from URL
   - Enter your Vercel deployment URL
   - The plugin will appear in your plugins list

## 📖 Usage

### Basic Text Analysis
1. Select text layers in your Figma design
2. Open the UX Writing Assistant Pro plugin
3. Click "Scan Selected Text"
4. Review the analysis results and suggestions
5. Apply corrections or codes as needed

### Multi-Language Translation
1. Select text layers to translate
2. Choose target languages from the interface
3. Click "Scan Selected Text"
4. Review translations with quality indicators
5. Apply the best translation to your design

### Google Sheets Integration
1. Set up your Google Sheets with the required columns
2. Configure the sheet ID in the plugin settings
3. Use the plugin to automatically sync content
4. Collaborate with team members through shared sheets

## ⚙️ Configuration

### Google Sheets Setup
Create a Google Sheet with the following columns:
- Column C: Code
- Column D: Status
- Column E: Korean (KO)
- Column F: English (EN)
- Column G: Japanese (JA)
- Column H: Chinese Simplified (ZH-CN)
- Column I: Chinese Traditional (ZH-TW)
- Column J: Spanish (ES)

### API Keys Setup
1. **Claude API Key**: Get from [Anthropic Console](https://console.anthropic.com/)
2. **Google Sheets API Key**: Get from [Google Cloud Console](https://console.cloud.google.com/)

## 🛠️ Development

### Local Development
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
ux-writing-assistant-pro/
├── api/
│   └── claude.js          # Vercel API endpoint
├── code.js                # Figma plugin main code
├── ui.html               # Plugin UI interface
├── manifest.json         # Figma plugin manifest
├── package.json          # Dependencies and scripts
├── vercel.json           # Vercel configuration
└── README.md             # This file
```

### Key Files
- **`code.js`**: Main plugin logic with text scanning and analysis
- **`ui.html`**: Modern UI with comprehensive features
- **`api/claude.js`**: Backend API for AI processing
- **`manifest.json`**: Figma plugin configuration

## 🎯 Features in Detail

### Text Analysis Engine
- **Length Guidelines**: Different limits for buttons, labels, descriptions, etc.
- **Tone Detection**: Analyzes text for appropriate tone and voice
- **Violation Patterns**: Detects common UX writing issues
- **Scoring System**: 0-100 score with detailed breakdown

### Translation Quality
- **AI-Generated**: High-quality translations using Claude AI
- **UX-Optimized**: Considers UX writing best practices
- **Length Validation**: Ensures translations fit UI constraints
- **Cultural Adaptation**: Appropriate for target culture and context

### Google Sheets Integration
- **Automatic Sync**: Real-time content synchronization
- **Code Generation**: Unique codes for content tracking
- **Duplicate Prevention**: Prevents duplicate entries
- **Team Collaboration**: Shared access for team members

## 🔧 Customization

### Adding New Languages
1. Update `SUPPORTED_LANGUAGES` in `code.js`
2. Add language names in `ui.html`
3. Update Google Sheets columns if needed

### Modifying UX Guidelines
1. Edit `UX_WRITING_GUIDE` in `code.js`
2. Adjust length limits and tone detection
3. Add new violation patterns

### Styling Changes
1. Modify CSS in `ui.html`
2. Update color schemes and layouts
3. Add new UI components

## 📊 Performance

- **Fast Analysis**: Local analysis for immediate feedback
- **Efficient API**: Optimized Claude API calls
- **Caching**: Smart caching for repeated operations
- **Error Handling**: Robust error handling and fallbacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join community discussions for help

## 🔮 Roadmap

- [ ] Voice-to-text input
- [ ] Advanced accessibility analysis
- [ ] Integration with design systems
- [ ] Batch processing capabilities
- [ ] Custom rule creation
- [ ] Team collaboration features
- [ ] Analytics and reporting

## 🙏 Acknowledgments

- **Claude AI** by Anthropic for powerful text analysis
- **Figma** for the amazing plugin platform
- **Vercel** for seamless deployment
- **Google Sheets API** for content management

---

**Made with ❤️ for the UX writing community**
