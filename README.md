# Healthcare Analytics Dashboard

A modern, interactive dashboard for healthcare analytics built with HTML, CSS, and JavaScript. This project showcases a sophisticated UI for visualizing CMS (Centers for Medicare & Medicaid Services) data with advanced analytics features.

![Healthcare Analytics Dashboard](https://via.placeholder.com/1200x600/4361ee/ffffff?text=Healthcare+Analytics+Dashboard)

## Features

### 1. Interactive Dashboard
- Cost-quality quadrant analysis with bubble chart visualization
- Regional performance map
- Top procedures ranking with visual indicators
- Cost trend forecasting with confidence intervals

### 2. Value Insights
- Provider value matrix
- Volume-adjusted comparisons
- Regional filtering capabilities
- Cost-quality quadrant analysis

### 3. Predictive Analytics
- Cost trend forecasting with confidence intervals
- Volume predictions by procedure and region
- Customizable forecast periods
- Interactive visualization of predicted outcomes

### 4. Customizable Reports
- PDF export functionality
- Date range selection
- Provider and procedure filtering
- Multiple data visualization options

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Visualization**: Chart.js, D3.js
- **Icons**: Font Awesome
- **Fonts**: Inter, Poppins (Google Fonts)
- **Responsive Design**: CSS Grid and Flexbox

## Setup Instructions

1. Clone this repository to your local machine
2. Open the `index.html` file in your web browser
3. To deploy to GitHub Pages:
   - Push the code to your GitHub repository
   - Go to repository settings > Pages
   - Select the branch you want to deploy (usually `main`)
   - Your site will be available at `https://[your-username].github.io/[repository-name]/`

## Customization

### Changing Colors
The color scheme can be easily modified by updating the CSS variables in the `:root` selector in `styles.css`:

```css
:root {
  --primary: #4361ee;
  --primary-light: #4895ef;
  --secondary: #3a0ca3;
  --accent: #f72585;
  /* other variables */
}
```

### Adding New Charts
To add new charts, create a new container in the HTML and initialize it in the `script.js` file using Chart.js.

### Dark Mode
The dashboard includes a built-in dark mode toggle. The dark mode styles can be customized in the `.dark-theme` selector in `styles.css`.

## Browser Compatibility

This dashboard is compatible with all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT License

## Acknowledgments

- Chart.js for the interactive charts
- D3.js for the map visualization
- Font Awesome for the icons
- Google Fonts for the typography
