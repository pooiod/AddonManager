# ScriptKitten Addon API Documentation
Welcome to the official documentation for ScriptKitten. This guide is designed to provide you with all the information you need to create your own addons using ScriptKitten.

> This documentation assumes you have a basic understanding of JavaScript. If you don't you will have a hard time doing anything.

### What is ScriptKitten?
ScriptKitten is a third-party addon manager that allows you to easily install and manage custom addons for Scratch editors like TurboWarp, PenguinMod, and others.

### What are Addons?
Addons are JavaScript files that interact with the Scratch editor. They are similar to normal scripts except they have configurable options. They can do a wide range of things, such as:

* Adding new buttons and UI elements to the editor.
* Modifying or extending the behavior of the costume and sound editors.
* Automating tasks and workflows.
* Integrating with external services.

Here is a simple example of a complete, functional addon. This addon adds a button to the costume editor that allows users to import text as an SVG costume.

```javascript
// id: P7SVGtext

(function(addons) {
	'use strict';

	class P7SVGtext {
		constructor() {
			this.active = false;
			this.GetFile = (file) => { return "//scriptkitten.pages.dev/addons/SVGtext/" + file; }
		}

		options = {
			enabled: true
		}

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

		init() {
			window.addEventListener('message', (event) => {
				const receivedMessage = event.data;

				if (receivedMessage && receivedMessage.startsWith("data:image/svg+xml;charset=utf-8,")) {
					addons.costumes.add("Text import", receivedMessage);
					document.body.removeChild(document.getElementById("widgetoverlay"));
				}
			});
		}

		event(type, data) {
			switch (type) {
			case "TabChanged":
				if (data.TAB == "costumes") {
					if (!this.active) return;

					addons.costumes.addCreationButton(
						'P7SVGTextButton',
						'Add text as SVG',
						this.GetFile('AddTextIcon.svg'),

						async () => {
							addons.makeWidget(
								this.GetFile("embed.html"),
								"Text import"
							);
						}
					);
				}
			break;
			}
		}

		start() {
			this.active = true;
		}

		stop() {
			this.active = false;
			addons.costumes.removeCreationButton("P7SVGTextButton");
		}
	}

	addons.register(new P7SVGtext());
})(addons);
```

# Next steps
[addon structure](#/addon-structure)
