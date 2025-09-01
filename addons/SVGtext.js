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
			removeCreationButton("P7SVGTextButton");
		}
	}

	addons.register(new P7SVGtext());
})(addons);
