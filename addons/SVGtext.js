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
				requiresRestart: true,
			};
		}

		init() {
			console.log("addon init");
			window.addEventListener('message', (event) => {
				const receivedMessage = event.data;

				if (receivedMessage && receivedMessage.startsWith("data:image/svg+xml;charset=utf-8,")) {
					addImage("Text import", receivedMessage);
					document.body.removeChild(document.getElementById("svgtextoverlay"));
				}
			});
		}

		event(type, data) {}

		start() {
			console.log("addon start");
			addons.tab.costumes.addCreationButton(
				'P7SVGTextButton',
				'Add text as SVG',
				'//p7scratchextensions.pages.dev/extras/images/icons/AddTextIcon.svg',

				async () => {
					const overlay = document.createElement('div');
					overlay.style.position = 'fixed';
					overlay.style.top = '0';
					overlay.style.left = '0';
					overlay.style.width = '100%';
					overlay.style.height = '100%';
					overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
					overlay.style.zIndex = '9999';
					overlay.id = "svgtextoverlay";
					
					const wrapper = document.createElement('div');
					wrapper.style.position = 'absolute';
					wrapper.style.top = '50%';
					wrapper.style.left = '50%';
					wrapper.style.transform = 'translate(-50%, -50%)';
					wrapper.style.border = '4px solid rgba(255, 255, 255, 0.25)';
					wrapper.style.borderRadius = '13px';
					wrapper.style.padding = '0px';
					
					const modal = document.createElement('div');
					modal.style.backgroundColor = 'white';
					modal.style.padding = '0px';
					modal.style.borderRadius = '10px';
					modal.style.width = '70vw';
					modal.style.height = '70vh';
					modal.style.textAlign = 'center';

					wrapper.appendChild(modal);

					const iframe = document.createElement('iframe');
					iframe.src = '//p7scratchextensions.pages.dev/extras/html/SVGtext';
					iframe.style.width = '100%';
					iframe.style.height = '100%';
					iframe.style.border = 'none';
					iframe.style.borderRadius = '10px';
					modal.appendChild(iframe);

					overlay.appendChild(wrapper);
					document.body.appendChild(overlay);

					overlay.addEventListener('click', (e) => {
						if (e.target === overlay) {
							document.body.removeChild(overlay);
						}
					});
				}
			);
		}
		stop() {
			console.log("addon stop");
			addons.tab.costumes.removeCreationButton('P7SVGTextButton');
		}
	}

	addons.register(new P7SVGtext());
})(addons);
