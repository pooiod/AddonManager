# Custom APIs
ScriptKitten provides several specialized API objects under the `addons` global. These APIs are designed to help your addon interact with specific parts of the editor, such as the costume editor, the sound editor, or the code workspace, in a safe and structured way.

---

## Costumes API (`addons.costumes`)
This API provides functions for interacting with the Costumes tab.

### `isActive()`
Checks if the Costumes tab is currently the active tab in the editor.
*   **Returns:** `Boolean` - `true` if the Costumes tab is active, otherwise `false`.

#### Example
```javascript
if (addons.costumes.isActive()) {
    console.log("The user is currently on the Costumes tab.");
}
```



### `addCreationButton(id, tooltip, image, callback)`
Adds a new circular button to the "Choose a Costume" menu, next to the "Upload Costume" and "Surprise" buttons.

*   `id` (String): A unique ID for your button. This is used to identify the button later, for example, to remove it.
*   `tooltip` (String): The text that appears when the user hovers over the button.
*   `image` (String): A URL pointing to the icon for the button. An SVG or transparent PNG is recommended.
*   `callback` (Function): The function that will be executed when the user clicks the button.

#### Example
```javascript
// This is typically called in response to the "TabChanged" event when the tab is "costumes".
addons.costumes.addCreationButton(
    'MyAddon-AddCircleButton',       // Unique ID
    'Add a new circle costume',      // Tooltip text
    this.GetFile('circle-icon.svg'), // URL to the button's icon
    () => {                          // Callback function
        console.log("Circle button was clicked!");
        // You could call addons.costumes.add() here to add a new costume.
    }
);
```



### `removeCreationButton(id)`
Removes a button that was previously added with `addCreationButton`. It's crucial to call this in your addon's `stop()` method to clean up the UI when your addon is disabled.

This function will not error if the button does not exist.

*   `id` (String): The unique ID of the button you want to remove.

#### Example
```javascript
// In your addon's stop() method
stop() {
    this.active = false;
    addons.costumes.removeCreationButton("MyAddon-AddCircleButton");
}
```



### `add(name, url)`
Fetches an image from a URL, creates a new costume from it, and adds it to the currently selected sprite. The function automatically detects if the image is an SVG, PNG, or JPG.

*   `name` (String): The name for the new costume.
*   `url` (String): The URL of the image file to add.

#### Example
The `P7SVGtext` addon uses this function to add the SVG it receives from its widget.
```javascript
// A message listener inside the init() method
window.addEventListener('message', (event) => {
    const receivedMessage = event.data;

    // Check if the message is a valid SVG data URL
    if (receivedMessage && receivedMessage.startsWith("data:image/svg+xml;charset=utf-8,")) {
        // Add the received SVG as a new costume
        addons.costumes.add("Text import", receivedMessage);
        
        // Close the widget
        document.body.removeChild(document.getElementById("widgetoverlay"));
    }
});
```

---

## Sounds API (`addons.sounds`)
This API provides functions for interacting with the Sounds tab.

### `isActive()`
Checks if the Sounds tab is currently the active tab in the editor.
*   **Returns:** `Boolean` - `true` if the Sounds tab is active, otherwise `false`.

#### Example
```javascript
if (addons.sounds.isActive()) {
    console.log("The user is currently on the Sounds tab.");
}
```

---

## Code API (`addons.code`)
This API provides functions for interacting with the Code tab and its extensions.

### `isActive()`
Checks if the Code tab is currently the active tab in the editor.
*   **Returns:** `Boolean` - `true` if the Code tab is active, otherwise `false`.

#### Example
```javascript
if (addons.code.isActive()) {
    console.log("The user is currently on the Code tab.");
}
```

---

### `loadExtensionURL()`
A direct reference to the editor's underlying `vm.extensionManager.loadExtensionURL` function. This allows you to load custom Scratch extensions (with custom blocks) from a URL.

> Note: This block will only load sandboxed extension, unless the mod your using has the domain listed as trusted.

* **This is an advanced feature.** Creating custom extensions is a complex process and is documented separately in the [official TurboWarp documentation](https://docs.turbowarp.org/development/extensions/introduction).

#### Example
```javascript
addons.code.loadExtensionURL('https://example.com/my-scratch-extension.js');
```

> More apis coming soon
