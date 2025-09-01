# The getInfo() Method

The `getInfo()` method is a required part of your addon's class. Its purpose is to return an object containing metadata about your addon.

This method takes no arguments and must return an object.

```javascript
getInfo() {
    return {
        id: 'P7SVGtext',
        name: 'SVG Text',
        author: ['pooiod7', 'https://github.com/pooiod'],
        description: 'Import text as SVG costumes',
        icon: this.GetFile('exticon.png'),
        screenshots: [this.GetFile("screenshot.png")],
        requiresRestart: false,
    };
}
```

## Properties
Here are the properties you can include in the returned object:



### `id`
**(Required)**
*   **Type:** `String`

A unique identifier for your addon. This ID is used internally by the manager to save settings. <br>It **must** be the same as the `// id:` comment at the top of your addon file. <br>
It does not need to match the file name of your addon.

`id: 'my-unique-addon-id'`



### `name`
**(Required)**
*   **Type:** `String`

The human-readable name of your addon that will be displayed in the addon list.

`name: 'My Cool Addon'`



### `author`
**(Required)**
*   **Type:** `Array` of `String`s

An array specifying who created the addon. It should contain the author's name (usually you). You can optionally include a second element with a URL to your website or profile, which will be linked in the addon manager, and the community page.

`author: ['YourName', 'https://your-profile.com']`



### `description`
**(Required)**
*   **Type:** `String`

A brief description of what your addon does. This is shown to the user in the addon's details view.

`description: 'This addon adds a button that does something cool.'`



### `icon`
**(Optional)**
*   **Type:** `String` (URL)

A URL pointing to an icon for your addon. This icon is displayed next to the addon's name in the community list. It's recommended to use a small, square image.

`icon: 'https://example.com/my-addon/icon.png'`



### `screenshots`
**(Optional)**
*   **Type:** `Array` of `String`s (URLs)

An array of URLs pointing to screenshots that showcase your addon's features. These will be displayed in the addon's detail page.

`screenshots: ['https://example.com/my-addon/screenshot1.png', 'https://example.com/my-addon/screenshot2.png']`



### `requiresRestart`
**(Optional)**
*   **Type:** `Boolean`
*   **Default:** `false` (or `true` if `stop()` is not defined)

Set this to `true` if the user needs to reload the editor for changes (enabling or disabling the addon) to take full effect. If this is `true`, the user will be prompted to reload.

If your addon does not have a `stop()` method, this property will automatically be treated as `true`.

`requiresRestart: true`

# Next steps
[event handling](#/events)
