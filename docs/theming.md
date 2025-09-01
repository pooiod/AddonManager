# Theming
To create a seamless experience, your addon's UI should match the user's editor theme (light or dark) and accent color. ScriptKitten provides the `addons.getTheme()` helper function to make this easy.

### How to use it
addons.getTheme() returns an Array containing four string values: `[theme, accent, background, overlay]`

1.  `theme`: A string identifying the current theme. Either `"light"` or `"dark"`.
2.  `accent`: A string containing the primary accent color used in the editor's UI (e.g., the red of the menu bar in default TurboWarp). This will be a CSS color value like `"#e01f1f"` or `"rgb(133, 92, 214)"`.
3.  `background`: The primary background color of the editor's UI. For example, `"rgb(255, 255, 255)"` in light mode.
4.  `overlay`: A semi-transparent version of the `accent` color, suitable for modal backgrounds or overlays (e.g., `"rgba(224, 31, 31, 0.7)"`).

> more color values coming soon

Here is an example:
```javascript
const [theme, accent, background, backColor] = addons.getTheme();

console.log(`Current theme is: ${theme}`);
console.log(`Accent color is: ${accent}`);
```

# Next steps
[globals](#/globals)
