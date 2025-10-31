# Climate Action Pledge Microsite

A responsive single-page application that enables individuals to take climate action pledges, receive digital certificates, and join a global community of changemakers.

## Features

- **Hero Section** - Compelling call-to-action with smooth navigation
- **Live KPIs** - Real-time statistics showing community growth
- **Pledge Form** - Comprehensive commitment tracking with 9 themed actions
- **Digital Certificate** - Instant personalized certificates with heart ratings
- **Interactive Pledge Wall** - Advanced visualization with:
  - Interactive India map showing regional participation
  - Live scrolling ticker of recent pledges
  - Flip card effects revealing individual commitments
  - Achievement badges (Green Warrior, Eco Ninja)
- **Privacy-First Design** - Secure handling of personal information

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Data Storage**: localStorage for client-side persistence
- **Styling**: Custom CSS with minimalist white + light blue theme
- **No Framework Dependencies**: Pure JavaScript for maximum compatibility

## Project Structure

```
climate-pledge/
├── public/
│   ├── index.html          # Main HTML structure
│   ├── css/
│   │   └── styles.css      # All styling definitions
│   ├── js/
│   │   ├── app.js          # Main application logic and initialization
│   │   ├── data.js         # Data management and localStorage operations
│   │   ├── certificate.js  # Certificate generation and rendering
│   │   └── pledgeWall.js   # Pledge wall with map, ticker, and cards
│   └── assets/
│       └── (images/icons)
├── server.js               # Express server configuration
├── package.json            # Node.js dependencies
└── README.md              # Documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd climate-pledge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Development

The application uses a simple Express server to serve static files. All client-side logic is in vanilla JavaScript with no build process required.

## Deployment

### Option 1: Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Build settings: Leave empty (static site)
4. Publish directory: `public`

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### Option 3: GitHub Pages (Automated with GitHub Actions)

**Using GitHub Actions (Recommended)**:

1. Push your code to GitHub (including the `.github/workflows/deploy.yml` file)

2. Enable GitHub Pages in your repository:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

3. The workflow will automatically deploy on every push to the `main` branch

4. Your site will be available at: `https://[your-username].github.io/[repository-name]/`

**Manual Method (Alternative)**:

1. Rename the `public` folder to `docs`:
   ```bash
   mv public docs
   git add .
   git commit -m "Rename public to docs for GitHub Pages"
   git push
   ```

2. Go to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose your main branch and `/docs` folder
5. Click **Save**

**Note**: If using the manual method, remember to update `server.js` to reference the `docs` folder instead of `public`.

## WordPress Integration

To integrate with WordPress:

1. **Method A - Custom HTML Block**:
   - Copy contents of `public/index.html` (body only)
   - Paste into WordPress Custom HTML block
   - Upload CSS/JS files to Media Library
   - Link files in HTML block

2. **Method B - Page Template**:
   - Create custom page template in theme
   - Copy HTML structure into template
   - Enqueue CSS/JS files via `wp_enqueue_script`/`wp_enqueue_style`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Data Privacy

- Email and mobile numbers are required for validation but never displayed publicly
- All data is stored locally in the user's browser
- No external data transmission without explicit user consent
- Compliant with privacy-by-design principles

## License

MIT License - Free to use and modify

## Contributing

Contributions welcome! Please follow standard coding conventions and include comments for clarity.
