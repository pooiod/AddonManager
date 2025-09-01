# Event Handling
To make your addon interactive and responsive to what the user is doing, you need to handle events. ScriptKitten provides a simple yet powerful event system that pushes notifications to your addon when certain actions occur within the editor.

## The `event()` Method
All events are routed through a single, required method in your addon's class: `event(type, data)`.

*   `type` (String): A string that identifies the kind of event that occurred, such as `"TabChanged"`.
*   `data` (Object): An object containing information specific to that event.

The most effective way to handle different events is to use a `switch` statement on the `type` parameter.

```javascript
event(type, data) {
    switch (type) {
        case "TabChanged":
            // Code to run when the editor tab changes
            console.log(`Switched to the ${data.TAB} tab!`);
            break;
        // You can add more cases here as more events are introduced.
        default:
            // Optional: code to run for unhandled events
            break;
    }
}
```

# Sending events
Events are not limited to the default functions of the editor. Addons can also send events by using the `addons.sendEvent(event, data)` function.

This will send any custom event to all enabled addons.

Here is an example:
```javascript
addons.sendEvent("ChatRecived", { MESSAGE: "Hello, world!" });
```

---

## Available Events
Here are all available events, and what they do:

### `"TabChanged"`
This event fires whenever the user switches between the "Code," "Costumes," and "Sounds" tabs in the editor.

*   `data.TAB` (String): The name of the tab that was just opened.
    *   `"code"`
    *   `"costumes"`
    *   `"sounds"`
*   `data.INDEX` (Number): The numerical index of the tab.
    *   `0`: Code
    *   `1`: Costumes
    *   `2`: Sounds

### `"OptionsChanged"`
This event fires whenever the user changes any options in your addon. 
It does not return any data

> More events coming soon

# Next steps
[addon options](#/addon-options)
