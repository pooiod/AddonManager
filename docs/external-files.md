# Referencing External Files
Many addons need to use external files for things like icons, screenshots, or the HTML content for a custom widget. The ScriptKitten API is flexible and allows you to load these resources from any publicly accessible URL.

## Hosting Your Files

Your addon's files (images, SVGs, HTML files, etc.) must be hosted online. 
It is reccomended to create a folder in /addons named after your addons id. 
In this folder, you can place all your files.

**Important:** If hosting externally, all of your assets must be served over **HTTPS** to prevent security warnings. Most versions of scratch host on HTTPS, and will deny any HTTP request

## The `GetFile` Helper Function
While you can hardcode full URLs directly into your addon, a cleaner and more maintainable approach is to create a helper method within your addon's class. This pattern is demonstrated in the example addon.

Let's look at how it's implemented in the `constructor`:
```javascript
class P7SVGtext {
    constructor() {
        // ... other properties
        
        // This helper function builds a full URL to a file in your addon's folder.
        this.GetFile = (file) => { return `//scriptkitten.pages.dev/addons/${"SVGtext"}/${file}`; }
    }
    // ... rest of the class
}
```

### How it Works
1.  **Base URL:** You define a base URL that points to the directory where your addon's assets are hosted. In the example, it's `//scriptkitten.pages.dev/addons/${AddonID}/`.
    > **Tip:** Starting the URL with `//` creates a protocol-relative URL. It will automatically use `https` if the page is loaded securely, which is recommended.

2.  **File Name:** The function takes a single argument, `file`, which is the name of the file you want to access (e.g., `'icon.png'`).

3.  **Concatenation:** It returns the base URL, then adds the addon id, then adds the file name, creating a complete, valid URL to your resource.

This pattern is highly recommended because it lets you quickly change the the host to look for your assets on, letting you test without uploading everything to the ScriptKitten repository.

## Usage Examples
Once you have your `GetFile` helper, you can use it throughout your addon to reference your external files easily.

### In `getInfo()`
Use it to provide URLs for your addon's icon and screenshots.

```javascript
getInfo() {
    return {
        // ...
        icon: this.GetFile('exticon.png'),
        screenshots: [this.GetFile("screenshot.png")],
        // ...
    };
}
```

### For UI Elements
When creating a new button in the costumes tab, you can use it for the button's icon.

```javascript
addons.costumes.addCreationButton(
    'P7SVGTextButton',
    'Add text as SVG',
    this.GetFile('AddTextIcon.svg'),
    async () => {
        // ... callback function
    }
);
```

### For Widgets
When opening a custom widget, provide the URL to your widget's HTML file.

```javascript
addons.makeWidget(
    this.GetFile("embed.html"),
    "Text import"
);
```