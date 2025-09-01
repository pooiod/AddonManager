# Addon Structure
Every ScriptKitten addon is a self-contained JavaScript file. The core of an addon is a class that holds its logic and information. This class is then wrapped in a function to ensure it doesn't interfere with other scripts or the page itself.

While most addons are self contained, some addons require external files. You can learn about that [here](#/external-files)

## The Basic Wrapper
Your entire addon code must be wrapped inside an Immediately Invoked Function Expression (IIFE). This looks like `(function(addons) { ... })(addons);`.

This wrapper serves two main purposes:
1.  It prevents your addon's variables and functions from leaking into the global scope.
2.  It provides a safe and reliable way to access the global `addons` API object.

```javascript
(function(addons) {
  'use strict';

  // Your addon code goes here.

})(addons);
```

## The Addon ID
At the very top of your file, you must include a comment that specifies a unique ID for your addon. This ID is used by the addon manager to identify your script. <br>
You can place any more info in comments under it, but the first line must follow this format.

It is recomended that you use your username initials in the begining of the id to prevent other addons from causing issues with your addon.

```javascript
// id: P7SVGtext
```

This ID must be the same as the `id` property you return in the `getInfo()` method.

## The Addon Class
All of your addon's logic is contained within a class. This class organizes the required methods and properties that ScriptKitten interacts with.

```javascript
// id: my-addon-id

(function(addons) {
	'use strict';

	class MyAddon {
		// Methods like getInfo(), init(), start(), stop() go here.
	}

	addons.register(new MyAddon());
```

### The constructor
The constructor is a special method that is used to store vatiables and functions. <br>
The constructor should only be used for variables and functions that don't modify the page.

```javascript
constructor() {
    // This is a variable that gets defined when the addon loads
    this.active = false;

    // This is common a helper function to get asset URLs.
    this.GetFile = (file) => { return "//scriptkitten.pages.dev/addons/my-addon/" + file; }
}
```

## The init function
The init function works like the constructor, but it only runs when the addon is first started.

Here is an example code snip pulled from SVG Text
```javascript
init() {
	window.addEventListener('message', (event) => {
		const receivedMessage = event.data;

		if (receivedMessage && receivedMessage.startsWith("data:image/svg+xml;charset=utf-8,")) {
			addons.costumes.add("Text import", receivedMessage);
			document.body.removeChild(document.getElementById("widgetoverlay"));
		}
	});
}
```

## Complete Boilerplate
Here is a minimal, complete boilerplate you can use as a starting point for your own addons.

```javascript
// id: addon-id

(function(addons) {
	'use strict';

	class MyAddon {
		constructor() {
			// Variables and stuff
		}

		// Returns metadata about your addon
		getInfo() {
			return {
				id: 'addon-id',
				name: 'My New Addon',
				author: ['YourName'],
				description: 'This is a description of what my addon does.',
			};
		}

		// Called once when the addon is first enabled
		init() {
			// Perform one-time setup tasks
			console.log('My addon has been initialized!');
		}
		
		// Called every time an event happens in the editor
		event(type, data) {
			// React to events
		}

		// Called when the addon is enabled by the user
		start() {
			// Activate your addon's features
		}

		// Called when the addon is disabled by the user
		stop() {
			// Deactivate your addon's features and clean up
		}
	}

	// Create a new instance of the class and register it
	addons.register(new MyAddon());
	
})(addons);
```

# Next steps
[getinfo](#/getInfo)
