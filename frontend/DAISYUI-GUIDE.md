# daisyUI Usage Guide

This project uses [daisyUI](https://daisyui.com/), a component library built on top of Tailwind CSS, with the Nord theme for consistent UI design.

## Theme Configuration

The app uses the **Nord theme** as the default theme. The theme is applied globally via the `data-theme="nord"` attribute on the HTML element.

### Theme Colors (Nord)
- **Primary**: Purple/violet colors
- **Secondary**: Green/teal colors
- **Accent**: Orange colors
- **Neutral**: Gray colors
- **Base**: Background colors
- **Info**: Blue colors
- **Success**: Green colors
- **Warning**: Yellow colors
- **Error**: Red colors

## Component Usage

### Buttons
```jsx
// Primary button
<button className="btn btn-primary">Primary Button</button>

// Secondary/outline button
<button className="btn btn-outline">Outline Button</button>

// Small button
<button className="btn btn-sm">Small Button</button>

// Success/error buttons
<button className="btn btn-success">Success</button>
<button className="btn btn-error">Cancel</button>
```

### Form Controls
```jsx
// Text input
<input className="input input-bordered" placeholder="Enter text" />

// Select dropdown
<select className="select select-bordered">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

// Checkbox
<input type="checkbox" className="checkbox checkbox-sm" />

// Label with checkbox
<label className="label cursor-pointer">
  <input type="checkbox" className="checkbox" />
  <span className="label-text">Label text</span>
</label>
```

### Cards
```jsx
<div className="card bg-base-100 shadow">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Card content goes here</p>
  </div>
</div>
```

### Tables
```jsx
<div className="overflow-x-auto">
  <table className="table table-zebra table-sm">
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Navigation
```jsx
<div className="navbar bg-base-100">
  <div className="navbar-start">
    <h1 className="text-xl font-bold">App Title</h1>
  </div>
  <div className="navbar-end">
    <button className="btn btn-primary">Action</button>
  </div>
</div>
```

### Badges
```jsx
// Info badge
<div className="badge badge-info">Info</div>

// Error badge
<div className="badge badge-error">Error</div>

// Outline badge
<div className="badge badge-outline">Outline</div>
```

## Mobile-First Design

All components are designed mobile-first (320-480px) and scale up responsively:

- Use responsive grid classes: `grid-cols-1 md:grid-cols-2`
- Flex direction: `flex-col sm:flex-row`
- Container max-width: `container mx-auto max-w-4xl`
- Proper spacing: `space-y-3` for mobile, `gap-3` for larger screens

## Theme Management

To change themes:

1. Update the `data-theme` attribute in `index.html`
2. Available themes: `light`, `dark`, `cupcake`, `bumblebee`, `emerald`, `corporate`, `synthwave`, `retro`, `cyberpunk`, `valentine`, `halloween`, `garden`, `forest`, `aqua`, `lofi`, `pastel`, `fantasy`, `wireframe`, `black`, `luxury`, `dracula`, `cmyk`, `autumn`, `business`, `acid`, `lemonade`, `night`, `coffee`, `winter`, `dim`, `nord`, `sunset`

Current configuration in `tailwind.config.js`:
```js
daisyui: {
  themes: ['nord'], // Only Nord theme is enabled
  base: true,
  styled: true,
  utils: true,
}
```

## Accessibility

daisyUI components include proper ARIA attributes and focus states:
- Use semantic HTML elements
- Include proper labels for form controls
- Maintain color contrast ratios
- Ensure keyboard navigation works

## Development Tips

1. **Bundle Size**: daisyUI is tree-shaken by Tailwind's JIT compiler
2. **Customization**: Use Tailwind utilities alongside daisyUI classes
3. **Debugging**: Use browser dev tools to inspect applied classes
4. **Documentation**: Refer to [daisyUI docs](https://daisyui.com/components/) for all available components

## Color Reference

Use semantic color classes for consistency:
- `text-primary` - Primary text color
- `bg-base-100` - Base background
- `text-base-content` - Default text color
- `text-base-content/70` - Muted text (70% opacity)
- `border-base-300` - Subtle borders