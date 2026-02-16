# 📚 Flashcards Master - iPad & Desktop Study App

A beautiful, responsive flashcards application optimized for both iPad and desktop use. Study efficiently with spaced repetition, track your progress, and master any subject!

## 🌟 Features

- ✅ **Cross-Platform**: Works perfectly on iPad, iPhone, and Desktop browsers
- ✅ **Touch-Optimized**: Smooth touch interactions with visual feedback
- ✅ **Offline Support**: Works completely offline with PWA technology
- ✅ **Progress Tracking**: Track mastery with Easy/Medium/Hard ratings
- ✅ **Custom Subjects**: Create unlimited custom study subjects
- ✅ **Pre-loaded Content**: 7 subjects with 466 flashcards included
- ✅ **Local Storage**: All data saves automatically in your browser
- ✅ **Shuffle Mode**: Randomize cards for varied practice
- ✅ **Clean Design**: Beautiful gradient UI with smooth animations

## 🚀 Live Demo

Visit the app: **[https://davsah-1.github.io/FlashCards/](https://davsah-1.github.io/FlashCards/)**

## 📱 Use on iPad

1. Open the link above in Safari
2. Tap the **Share** button
3. Select **"Add to Home Screen"**
4. Launch like a native app!

## 🎓 Pre-loaded Subjects

The app comes with 7 comprehensive study subjects:

1. **Approaches - Psychology** (65 cards)
2. **Biopsychology** (67 cards)
3. **Cardiovascular System** (63 cards)
4. **French - La Famille en voie de changement** (28 cards)
5. **Respiratory System** (71 cards)
6. **Skill Acquisition & Learning Theories** (86 cards)
7. **Social Influence** (86 cards)

**Total: 466 flashcards ready to study!**

## 💻 Local Development

### Prerequisites
- Any modern web browser
- Optional: Python 3 or Node.js for local server

### Run Locally

**Option 1: Python**
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

**Option 2: Node.js**
```bash
npx serve
# Visit the URL shown
```

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## 🛠️ Technical Details

### Technologies Used
- Pure JavaScript (ES6+)
- CSS3 with Flexbox & Grid
- LocalStorage API for data persistence
- Progressive Web App (PWA) features
- Font Awesome icons
- Touch event handling for mobile

### Browser Support
- ✅ Safari (iOS 12+)
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox
- ✅ Edge
- ✅ Opera

### File Structure
```
FlashCards/
├── index.html              # Main page - subject selection
├── study.html              # Study page - flashcard interface
├── style.css               # iPad-optimized styles
├── study-app.js            # Study functionality with touch support
├── subjects-manager.js     # Subject management with touch support
├── embedded-subjects-data.js  # Pre-loaded subject data
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── icons/                  # App icons
├── fonts/                  # Font Awesome files
└── subjects/               # JSON files for pre-loaded subjects
```

## 🎯 How to Use

### Studying
1. **Select a Subject**: Tap any subject card on the home page
2. **Flip Cards**: Tap any card to see the answer
3. **Rate Difficulty**: Choose Easy, Medium, or Hard after reviewing
4. **Navigate**: Use Previous/Next buttons or keyboard arrows
5. **Shuffle**: Mix up the order for varied practice

### Creating Custom Subjects
1. **Tap "Create New Subject"** on the home page
2. **Enter subject name** (e.g., "Spanish Vocabulary")
3. **Add cards** using the "Add Card" button
4. **Start studying!**

### Managing Cards
- **Edit**: Tap the blue edit icon on any card
- **Delete**: Tap the red trash icon
- **Track Progress**: View mastery percentage at the top

## 📊 Progress Tracking

The app tracks your progress with three difficulty levels:
- 🟢 **Easy**: You know it well
- 🟠 **Medium**: Need more practice
- 🔴 **Hard**: Requires review

Progress is saved automatically and persists between sessions.

## 🔒 Privacy

- All data stored locally on your device
- No accounts or sign-up required
- No data sent to external servers
- Complete privacy and control

## 🐛 Troubleshooting

**Cards won't flip on iPad?**
- Tap (don't swipe) the card
- Try clearing Safari cache

**Pre-loaded subjects missing?**
- App must be served via HTTP/HTTPS
- Use GitHub Pages link or local server
- Custom subjects always work!

**Buttons not responding?**
- Ensure JavaScript is enabled
- Try refreshing the page
- Clear browser cache

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share your custom subject templates

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

- Font Awesome for beautiful icons
- Psychology & Biology content for educational purposes
- The open-source community for inspiration

## 📞 Support

Found a bug or have a suggestion? [Open an issue](https://github.com/DavSah-1/FlashCards/issues)

---

**Made by Error417**

Study smarter, not harder! 🎓✨
