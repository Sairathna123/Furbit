# Furbit Color Scheme Guide

## Primary Colors

### Violet (Primary Brand Color)
- **Primary Violet**: `#3e0061` - Main brand color, used for headers, primary text
- **Secondary Violet**: `#5c1a8b` - Accent color, used in gradients and hover states
- **Usage**: 
  - Navbar background gradient
  - Section headers
  - Primary text elements
  - Card borders and accents

### Yellow (Accent Color)
- **Primary Yellow**: `#ffb400` - Bright accent color
- **Secondary Yellow**: `#ffd500` - Lighter accent for gradients
- **Usage**:
  - Call-to-action buttons
  - Feature sections background
  - Highlights and badges
  - Photo placeholders

### White & Neutrals
- **White**: `#ffffff` - Background and text on dark sections
- **Light Background**: `#f5f5f5` - Page backgrounds
- **Dark Text**: `#333333` - Primary text on light backgrounds
- **Light Text**: `#666666` - Secondary text

## Gradient Combinations

### Violet Gradient (Headers & Primary Elements)
```css
background: linear-gradient(135deg, #3e0061, #5c1a8b);
```
- Used for: Navbar, page headers, section backgrounds

### Yellow Gradient (CTAs & Highlights)
```css
background: linear-gradient(135deg, #ffb400, #ffd500);
```
- Used for: Buttons, badges, photo placeholders, feature sections

## Application Across Components

### Navbar
- Background: Violet gradient
- Text: White
- Buttons: Yellow gradient for signup, white outline for login

### Dashboard
- Hero: Violet gradient background
- CTA Buttons: Yellow gradient
- Feature Cards: Violet gradient with flip animation
- Feature Section Background: Yellow gradient
- Pet Cards: White with violet accents

### Forms (Login, Signup, CreatePassport)
- Headers: Violet gradient
- Submit Buttons: Violet gradient
- Input Focus: Violet border
- Background: White cards on gradient background

### PetPassport & PublicPassport
- Headers: Violet gradient
- Action Buttons: Yellow gradient for add, Violet gradient for submit
- Delete Buttons: Red (#dc3545) for destructive actions
- Borders: Yellow accents on medical sections, Violet on condition cards

### Profile
- Background: Violet gradient
- Card: White with violet text
- Logout Button: Yellow gradient

## Shadow Effects
- **Light Shadow**: `0 2px 8px rgba(0, 0, 0, 0.1)` - Cards and containers
- **Medium Shadow**: `0 4px 12px rgba(62, 0, 97, 0.2)` - Elevated elements
- **Yellow Shadow**: `0 2px 8px rgba(255, 180, 0, 0.3)` - Yellow elements
- **Hover Effects**: Increased shadow on hover for interactive elements

## CSS Variables (Global)
```css
:root {
  --primary-violet: #3e0061;
  --secondary-violet: #5c1a8b;
  --primary-yellow: #ffb400;
  --secondary-yellow: #ffd500;
  --white: #ffffff;
  --light-bg: #f5f5f5;
  --text-dark: #333;
  --text-light: #666;
}
```

## Design Principles
1. **Consistency**: All interactive elements use gradients for depth
2. **Contrast**: High contrast between violet and yellow for accessibility
3. **Hierarchy**: Violet for structure, yellow for actions
4. **Whitespace**: Clean white backgrounds for readability
5. **Shadows**: Subtle shadows for depth, enhanced on hover
6. **Transitions**: Smooth 0.3s transitions on all interactive elements
