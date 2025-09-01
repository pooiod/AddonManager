# UI Widgets
For complex user interactions that a simple button or input field can't handle, ScriptKitten provides a powerful `addons.makeWidget()` function. This function allows you to open a modal overlay widget that can display any HTML content, including content from an external file.

This is perfect for creating custom user interfaces, forms, or interactive tools directly within the editor.

## The `addons.makeWidget()` Function
This function creates and displays a styled modal overlay on top of the editor interface.

### Syntax
```javascript
var [overlay, widgetframe, title, isopen, closeButton] = addons.makeWidget(html, pageTitle, width, height)
```

### Parameters
*   `html` (String): **(Required)** This can be either:
    *   A URL to an external HTML file.
    *   A string containing raw HTML content.
*   `pageTitle` (String): **(Optional)** The title displayed in the widget's header bar. Defaults to `"Widget"`.
*   `width` (String): **(Optional)** The CSS width of the widget. Defaults to `'70vw'`.
*   `height` (String): **(Optional)** The CSS height of the widget. Defaults to `'80vh'`.

### Return Value
The function returns an `Array` containing direct references to the DOM elements it created, allowing for advanced manipulation:
`[overlay, widgetframe, title, isOpen, closeButton]`
*   `overlay`: The main semi-transparent background element.
*   `widgetframe`: The `<iframe>` or `<div>` that contains your HTML content.
*   `title`: The title bar element.
*   `isOpen`: A function that returns if the widget is currently open.
*   `closeButton`: The close button element in the title bar.

## How to Use It
The most common way to use widgets is to have a button that, when clicked, calls `addons.makeWidget()`.

```javascript
// Inside a button's callback function
async () => {
    addons.makeWidget(
        this.GetFile("embed.html"), // URL to our custom UI
        "My Custom Widget"
    );
}
```

When this code runs, a modal will appear, displaying the content of `embed.html`.

## Communicating from the Widget to the Addon
Your addon exists in the main editor window, but your widget's HTML is loaded inside an `<iframe>`. To get data from your widget back to your addon, you must use `window.postMessage()`.

This creates a secure, one-way communication channel from the iframe to its parent.

### Step 1: Sending the Message (Widget's HTML/JS)
In your `embed.html` file, you need a script that sends a message to the parent window when the user completes an action.

**Example `embed.html`:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Text Input</title>
</head>
<body>
    <input type="text" id="text-input" placeholder="Enter some text">
    <button id="submit-button">Send to Addon</button>

    <script>
        document.getElementById('submit-button').addEventListener('click', () => {
            const textValue = document.getElementById('text-input').value;
            
            // Send the text value to the parent window (the editor)
            window.parent.postMessage(textValue, '*');
        });
    </script>
</body>
</html>
```

### Step 2: Receiving the Message (Addon's Code)
In your addon's `init()` method, you need to set up a listener to "catch" messages sent from any window, including your widget's iframe.

```javascript
init() {
    window.addEventListener('message', (event) => {
        const receivedMessage = event.data;

        // Important: Check if the message is what you expect!
        // This prevents conflicts with other messages.
        if (receivedMessage && typeof receivedMessage === 'string') {
            // We received the text from our widget!
            console.log("Addon received:", receivedMessage);
            
            // Now, we can close the widget.
            const overlay = document.getElementById("widgetoverlay");
            if (overlay) {
                document.body.removeChild(overlay);
            }
        }
    });
}
```

In the `SVG Text` example, the addon listens for a message that starts with `"data:image/svg+xml;charset=utf-8,"`. When it receives this, it knows the user has finished creating their text, so it adds the SVG as a costume and then removes the widget overlay.

## Closing the Widget
There are two ways a widget can be closed:
1.  **By the User:** The user can click the 'X' button in the top-right corner or click on the dark overlay outside the widget.
2.  **Programmatically:** Your addon can close the widget at any time by finding the overlay element and removing it from the DOM. This is useful for when the user completes an action in the widget.

```javascript
// This is the recommended way to close the widget from your addon code.
document.getElementById("widgetoverlay")?.remove();
```

## Theming
You don't need to worry about styling the widget's container. The title bar color, background color (light/dark), and fonts are all automatically styled to match the user's current editor theme. You only need to style the content *inside* your `embed.html`.

# Next steps
When making custom elements, you will need to learn how to use the [theming system](#/theming).
