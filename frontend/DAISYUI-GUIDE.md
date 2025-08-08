# DaisyUI Component Guide

This project uses [daisyUI](https://daisyui.com/) as the component library on top of Tailwind CSS, with the **Nord theme** as the default design system.

## Theme Configuration

The app uses the Nord theme by default, configured in:
- `tailwind.config.js` - daisyUI plugin and theme setup
- `index.html` - `data-theme="nord"` attribute on html element

## Available Themes

While Nord is the default, these themes are also available:
- `nord` (default) - Nordic-inspired color palette
- `light` - Clean light theme
- `dark` - Modern dark theme

To switch themes, change the `data-theme` attribute in `index.html`.

## Component Usage

### Buttons
```jsx
// Primary button
<button className="btn btn-primary">Primary Action</button>

// Success/Error buttons
<button className="btn btn-success">Finish</button>
<button className="btn btn-error">Cancel</button>

// Outline buttons
<button className="btn btn-outline">Secondary Action</button>

// Size variants
<button className="btn btn-sm">Small</button>
<button className="btn btn-xs">Extra Small</button>
```

### Form Elements
```jsx
// Text inputs
<input className="input input-bordered" placeholder="Enter text" />

// Select dropdowns
<select className="select select-bordered">
  <option>Option 1</option>
</select>

// Checkboxes
<input type="checkbox" className="checkbox checkbox-sm" />
```

### Layout Components
```jsx
// Cards
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Card content</p>
  </div>
</div>

// Navigation
<div className="navbar bg-base-100 shadow-lg">
  <div className="navbar-start">Brand</div>
  <div className="navbar-end">Actions</div>
</div>
```

### Tables
```jsx
<div className="overflow-x-auto">
  <table className="table table-zebra">
    <thead>
      <tr><th>Header</th></tr>
    </thead>
    <tbody>
      <tr><td>Data</td></tr>
    </tbody>
  </table>
</div>
```

### Badges and Indicators
```jsx
// Status badges
<div className="badge badge-info">Info</div>
<div className="badge badge-warning">Warning</div>
<div className="badge badge-error">Error</div>

// Size variants
<div className="badge badge-lg">Large</div>
<div className="badge badge-xs">Small</div>
```

## Color System (Nord Theme)

The Nord theme provides these semantic colors:
- `primary` - Blue accent color
- `secondary` - Purple/violet accent
- `accent` - Teal accent
- `neutral` - Gray tones
- `base-100` - Background color
- `base-200` - Secondary background
- `base-300` - Tertiary background
- `base-content` - Text color on base backgrounds
- `info` - Information blue
- `success` - Success green
- `warning` - Warning orange
- `error` - Error red

Access colors with opacity: `text-base-content/60` for 60% opacity.

## Mobile-First Design

All components are designed mobile-first:
- Use responsive grid: `grid-cols-1 md:grid-cols-2`
- Stack elements on mobile: `flex-col sm:flex-row`
- Responsive button sizing: `w-full sm:w-auto`
- Proper touch targets for mobile interaction

## Accessibility Features

DaisyUI components include built-in accessibility:
- Proper ARIA attributes
- Focus states and keyboard navigation
- High contrast ratios in Nord theme
- Screen reader friendly markup

## Best Practices

1. **Use semantic HTML**: DaisyUI enhances standard HTML elements
2. **Combine with Tailwind utilities**: Mix daisyUI components with Tailwind spacing, sizing, etc.
3. **Mobile-first responsive design**: Always test on mobile devices first
4. **Consistent spacing**: Use Tailwind's spacing scale (gap-3, p-4, etc.)
5. **Semantic colors**: Use `primary`, `success`, `error` instead of color names

## Component Reference

For complete component documentation, visit:
- [daisyUI Components](https://daisyui.com/components/)
- [Nord Theme Preview](https://daisyui.com/theme-generator/?theme=nord)