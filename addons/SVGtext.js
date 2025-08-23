(function(addons) {
	'use strict';

	class P7SVGtext {
		options = {
			enabled: true
		}

		getInfo() {
			return {
				id: 'P7SVGtext',
				name: 'SVG Text',
				author: ['pooiod7', 'https://github.com/pooiod'],
				description: 'Import text as SVG costumes',
				requiresRestart: false,
			};
		}

		init() {
			this.active = false;

			window.addEventListener('message', (event) => {
				const receivedMessage = event.data;

				if (receivedMessage && receivedMessage.startsWith("data:image/svg+xml;charset=utf-8,")) {
					addImage("Text import", receivedMessage);
					document.body.removeChild(document.getElementById("svgtextoverlay"));
				}
			});
		}

		event(type, data) {
			switch (type) {
			case "TabChanged":
				if (data.TAB == "costumes") {
					if (!this.active) return;

					addons.tab.costumes.addCreationButton(
						'P7SVGTextButton',
						'Add text as SVG',
						'//p7scratchextensions.pages.dev/extras/images/icons/AddTextIcon.svg',

						async () => {
							MakeWidget(
								"https://p7scratchextensions.pages.dev/extras/html/SVGtext",
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
		}
	}

	addons.register(new P7SVGtext());
})(addons);
