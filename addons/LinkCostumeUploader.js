// id: P7LinkCostumeUploader

(function(addons) {
	'use strict';

	class P7SVGtext {
		constructor() {
			this.active = false;
			this.GetFile = (file) => { return "//scriptkitten.pages.dev/addons/LinkCostumeUploader/" + file; }
		}

		options = {
			enabled: true
		}

		getInfo() {
			return {
				id: 'P7LinkCostumeUploader',
				name: 'Link Costume Uploader',
				author: ['pooiod7', 'https://github.com/pooiod'],
				description: 'Import costumes from links',
				icon: this.GetFile('exticon.svg'),
				screenshots: [],
				requiresRestart: false,
			};
		}

		init() {}

		event(type, data) {
			switch (type) {
			case "TabChanged":
				if (data.TAB == "costumes") {
					if (!this.active) return;

					addons.costumes.addCreationButton(
						'P7CostumeImportButton',
						'Import image from url',
						this.GetFile('buttonicon.svg'),

						async () => {
							var [overlay, frame, title] = addons.makeWidget("", "Image importer", "400px", "190px");

							frame.style.textAlign = 'center';
					
							const promptInput = document.createElement('input');
							promptInput.type = 'text';
							promptInput.placeholder = 'https://example.com/randomimage.png';
							promptInput.style.margin = '10px 0';
							promptInput.style.padding = '10px';
							promptInput.style.width = 'calc(100% - 60px)';
							promptInput.style.border = '1px solid #ccc';
							promptInput.style.borderRadius = '5px';
							promptInput.style.marginTop = '20px';
							frame.appendChild(promptInput);
							setTimeout(() => promptInput.focus(), 100);

							const confirmButton = document.createElement('button');
							confirmButton.textContent = 'Import';
							confirmButton.style.padding = '10px 15px';
							confirmButton.style.float = "right";
							confirmButton.style.marginRight = '18px';
							confirmButton.style.backgroundColor = 'rgb(0, 195, 255)';
							confirmButton.style.border = "1px solid rgb(0, 181, 236)";
							confirmButton.style.color = '#fff';
							confirmButton.style.cursor = 'pointer';
							confirmButton.style.borderRadius = '5px';
							confirmButton.style.marginTop = '10px';
							confirmButton.style.transition = 'background-color 0.3s';
							confirmButton.addEventListener('mouseenter', () => {
								confirmButton.style.backgroundColor = 'rgb(0, 159, 207)';
							});
							confirmButton.addEventListener('mouseleave', () => {
								confirmButton.style.backgroundColor = 'rgb(0, 195, 255)';
							});
							frame.appendChild(confirmButton);

							async function finishAndImportImageFromURL() {
								var url9248 = promptInput.value || `https://picsum.photos/${window.stageWidth}/${window.stageHeight}?${Math.random()*100}`;
								title.innerHTML = "Importing image";

								if (!url9248.startsWith("data") && !url.startsWith("/") && !addons.isCorsDomain(url9248)){
									url9248 = "https://api.allorigins.win/raw?url=" + url9248;
								}

								frame.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;"><div style="border:8px solid rgba(130, 130, 130, 0.07);border-top:8px solid #3498db;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;"></div></div><style>@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}</style>`;

								await addons.costumes.add("Import", url)

								document.body.removeChild(overlay);
							}

							promptInput.addEventListener('keydown', function(event) {
								if (event.key === 'Enter') {
									finishAndImportImageFromURL()
								}
							});

							confirmButton.addEventListener('click', async () => {
								finishAndImportImageFromURL()
							});
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
			addons.costumes.removeCreationButton("P7CostumeImportButton");
		}
	}

	addons.register(new P7SVGtext());
})(addons);
