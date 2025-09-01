# Addon Options
ScriptKitten allows you to add configurable settings to your addons, giving users the power to customize how your addon behaves. These settings are automatically displayed in the addon manager page, complete with UI controls like checkboxes, text fields, and number inputs.

## Defining Options
To define settings for your addon, you must add an `options` property to your addon's class. This property should be an object where each key represents a setting.

The one special, required property is `enabled`, which controls whether your addon is enabled by default when a user first loads it.

```javascript
class MyAddon {
    constructor() {
        // ...
    }

    options = {
        enabled: true, // This addon will be on by default
        // ... your other settings go here
    }

    // ... getInfo(), init(), etc.
}
```

## Structure of a Setting
Each setting (besides `enabled`) is an object with several properties that define its appearance and behavior in the settings panel.

*   `type` (String): The type of control to display. See "Available Option Types" below.
*   `label` (String): The human-readable name for this setting, displayed next to the control.
*   `value`: The default value for this setting. The type of `value` depends on the `type` of the setting.

## Available Option Types
Here are the different types of settings you can create.

### `boolean`
Displays a checkbox.
*   `value` must be `true` or `false`.

```javascript
options = {
    enabled: true,
    showNotifications: {
        type: 'boolean',
        label: 'Show notifications',
        value: true
    }
}
```



### `string`
Displays a single-line text input field.
*   `value` must be a `String`.

```javascript
options = {
    enabled: true,
    username: {
        type: 'string',
        label: 'Default username:',
        value: "User"
    }
}
```



### `number`
Displays a number input field, often with up/down arrows.
*   `value` must be a `Number`.
*   **(Optional)** `min` (Number): The minimum allowed value.
*   **(Optional)** `max` (Number): The maximum allowed value.

```javascript
options = {
    enabled: true,
    maxItems: {
        type: 'number',
        label: 'Maximum items to show:',
        max: 50,
        min: 1,
        value: 10
    }
}
```



### `selector`
Displays a set of buttons, allowing the user to pick one option from a list.
*   `value` must be one of the strings from the `items` array.
*   `items` (Array of Strings): A list of the available choices.

```javascript
options = {
    enabled: true,
    theme: {
        type: 'selector',
        label: 'Theme:',
        items: ["Light", "Dark", "System"],
        value: "System"
    }
}
```



### `color`
Displays a color picker control.
*   `value` must be a `String` representing a hex color (e.g., `"#ff4c4c"`).

```javascript
options = {
    enabled: true,
    highlightColor: {
        type: 'color',
        label: 'Highlight color:',
        value: "#ff8c1a"
    }
}
```



## Accessing Option Values
The addon manager automatically handles saving and loading the user's choices. From within your addon's code, you can access the current value of any setting at any time via `this.options`.

For example, let's say you have a setting `showNotifications`. You can check its value before performing an action.

```javascript
class MyAddon {
    options = {
        enabled: true,
        showNotifications: {
            type: 'boolean',
            label: 'Show notifications',
            value: true
        }
    }

    doSomethingCool() {
        // Check the option's current value
        if (this.options.showNotifications.value) {
            alert('Something cool just happened!');
        }
    }
}
```

The `options` object is kept up-to-date by the manager. When a user changes a setting, `this.options` will reflect that new value the next time your addon's code accesses it.

# Next steps
[ui widgets](#/ui-widgets)
