// ==UserScript==
// @name         ScriptKitten
// @namespace    https://scriptkitten.pages.dev
// @version      08-31-2025
// @description  Adds a custom addon manager to Penguinmod, Turbowarp, and a few other mods
// @author       pooiod7
// @updateURL    https://scriptkitten.pages.dev/manager.meta.js
// @downloadURL  https://scriptkitten.pages.dev/manager.user.js
// @include      https://studio.penguinmod.com/*
// @include      https://mirror.turbowarp.xyz/*
// @include      https://turbowarp.org/*
// @include      https://dinosaurmod.github.io/*
// @include      https://snail-ide.js.org/*
// @include      https://librekitten.org/*
// @include      https://alpha.unsandboxed.org/*
// @include      https://ampmod.codeberg.page/*
// @icon         https://scriptkitten.pages.dev/favicon.ico
// @grant        none
// ==/UserScript==

var InAddonManager = window.location.pathname.includes("/addons.html") || window.location.pathname.includes("/addons")

if (InAddonManager) {
	window.addons = {
		registered: {},
		scripts: [],

		getSettings: () => {
			return JSON.parse(localStorage.getItem("3rdPartyAddonSettings") || `{ "scripts": [] }`); 
		},
		setSettings: (settings) => {
			localStorage.setItem("3rdPartyAddonSettings", JSON.stringify(settings));

			for (const id in addons.registered) {
				var addon = addons.registered[id];
				if (addon.options) {
					addon.options = settings[id] || addon.options;
				}
			}
		},
	}
} else {
	window.addons = {
		registered: {},
		scripts: [],

		sendEvent: (type, data) => {
			for (const key in addons.registered) {
				const addon = addons.registered[key];
				if (addon.options.enabled) {
					addon.event(type, data);
				}
			}
		},

		getSettings: () => {
			return JSON.parse(localStorage.getItem("3rdPartyAddonSettings") || `{ "scripts": [] }`); 
		},
		setSettings: (settings) => {
			localStorage.setItem("3rdPartyAddonSettings", JSON.stringify(settings));

			for (const id in addons.registered) {
				var addon = addons.registered[id];
				var oldoptions = addon.options;
				if (addon.options) {
					if (oldoptions != settings[id] && (settings[id].enabled && !oldoptions.enabled)) {
						setTimeout(() => {
							addon.sendEvent("OptionsChanged", {});
						}, 100);
					}
					addon.options = settings[id] || addon.options;
				}

				if (oldoptions.enabled != addon.options.enabled) {
					if (addon.options.enabled) {
						if (addon.firstStart) {
							addon.init();
							addon.firstStart = false;
						}
						addon.start();
					} else {
						addon.stop();
					}
				}
			}
		},

		getTheme: () => {
			function standardizeColor(color) {
				if (color.startsWith('#')) {
					let r = parseInt(color.slice(1, 3), 16);
					let g = parseInt(color.slice(3, 5), 16);
					let b = parseInt(color.slice(5, 7), 16);
					return `rgb(${r}, ${g}, ${b})`;
				} else if (color.startsWith('rgb')) {
					return color;
				} else if (color.startsWith('rgba')) {
					return color.slice(0, color.length - 4) + '1)';
				}
				return color;
			}

			var accent = "#e01f1f";
			var theme = "light";
			var backColor = "rgba(0, 0, 0, 0.7)";
			var background = "rgb(255, 255, 255)"

			try {
				var themeSetting = localStorage.getItem('tw:theme');
				var parsed;
				try {
					parsed = JSON.parse(parsed);
				} catch(e) {
					parsed = { gui: parsed, accent: false }
				}

				function isPrimaryColorDark() {
					const rgb = background.match(/\d+/g);
					const r = parseInt(rgb[0]);
					const g = parseInt(rgb[1]);
					const b = parseInt(rgb[2]);
					const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
					return luminance < 0.5;
				}

				background = getComputedStyle(document.documentElement).getPropertyValue("--ui-primary").trim() || "rgb(255, 255, 255)";

				if (parsed.gui) {
					theme = parsed.gui;
				} else {
					if (isPrimaryColorDark()) {
						theme == "dark";
					}
				}

				if (parsed.accent === 'purple') {
					accent = '#855cd6';
				} else if (parsed.accent === 'blue') {
					accent = '#4c97ff';
				}
			} catch (err) {
				err = err;
			}

			if (document.querySelector("#app > div > div > div > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp")) {
				var accent2 = window.getComputedStyle(document.querySelector("#app > div > div > div > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp")).backgroundColor;
				if (accent2 && accent != "transparent") {
					accent = accent2;
				}
			}

			backColor = standardizeColor(accent).replace('rgb', 'rgba').replace(')', ', 0.7)');

			return [theme, accent, background, backColor];
		},

		makeWidget: (html, pageTitle, width, height) => {
			var [theme, accent, _, backColor] = addons.getTheme();

			const overlay = document.createElement('div');
			overlay.style.position = 'fixed';
			overlay.style.top = '0';
			overlay.style.left = '0';
			overlay.style.width = '100%';
			overlay.style.height = '100%';
			overlay.style.backgroundColor = backColor;
			overlay.style.zIndex = '9999';
			overlay.id = "widgetoverlay";

			const wrapper = document.createElement('div');
			wrapper.style.position = 'absolute';
			wrapper.style.top = "50%";
			wrapper.style.left = "50%";
			wrapper.style.transform = 'translate(-50%, -50%)';
			wrapper.style.border = '4px solid rgba(255, 255, 255, 0.25)';
			wrapper.style.borderRadius = '13px';
			wrapper.style.padding = '0px';
			wrapper.style.width = width || '70vw';
			wrapper.style.height = height || '80vh';

			const modal = document.createElement('div');
			modal.style.padding = '0px';
			modal.style.borderRadius = '10px';
			modal.style.width = '100%';
			modal.style.height = '100%';
			modal.style.textAlign = 'center';

			wrapper.appendChild(modal);

			const title = document.createElement('div');
			title.style.position = 'absolute';
			title.style.top = '0';
			title.style.left = '0';
			title.style.width = '100%';
			title.style.height = '50px';
			title.style.backgroundColor = accent;
			title.style.display = 'flex';
			title.style.justifyContent = 'center';
			title.style.alignItems = 'center';
			title.style.color = 'white';
			title.style.fontSize = '24px';
			title.style.borderTopLeftRadius = '10px';
			title.style.borderTopRightRadius = '10px';   
			title.id = "WidgetTitle";
			title.innerHTML = pageTitle || "Widget";

			const widgetframe = document.createElement((html.startsWith("http")||html.startsWith("//"))?'iframe':'div');
			widgetframe.style.width = '100%';
			widgetframe.style.height = `calc(100% - 50px)`;
			widgetframe.style.marginTop = '50px';
			widgetframe.style.border = 'none'; 
			widgetframe.id = "Widgetframe";
			widgetframe.name = 'Widgetframe';
			widgetframe.style.borderBottomLeftRadius = '10px';
			widgetframe.style.borderBottomRightRadius = '10px';
			widgetframe.style.backgroundColor = theme=="light"?"white":"black";
			if (html.startsWith("http")||html.startsWith("//")) {
				widgetframe.src = html;
			} else {
				widgetframe.innerHTML = html;
			}
			modal.appendChild(widgetframe);

			const closeButton = document.createElement('div');
			closeButton.setAttribute('aria-label', 'Close');
			closeButton.classList.add('close-button_close-button_lOp2G', 'close-button_large_2oadS');
			closeButton.setAttribute('role', 'button');
			closeButton.setAttribute('tabindex', '0');
			closeButton.innerHTML = '<img class="close-button_close-icon_HBCuO" src="data:image/svg+xml,%3Csvg%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%207.48%207.48%22%3E%3Cpath%20d%3D%22M3.74%206.48V1M1%203.74h5.48%22%20style%3D%22fill%3Anone%3Bstroke%3A%23fff%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-width%3A2px%22%2F%3E%3C%2Fsvg%3E">';
			closeButton.style.position = 'absolute';
			closeButton.style.top = '50%';
			closeButton.style.right = '10px';
			closeButton.id = "WidgetCloseButton"
			closeButton.style.transform = 'translateY(-50%)';
			closeButton.style.zIndex = '1000';
			closeButton.addEventListener('click', () => {
				document.body.removeChild(overlay);
			});
			title.appendChild(closeButton);

			modal.appendChild(title);
			overlay.appendChild(wrapper);
			document.body.appendChild(overlay);

			overlay.addEventListener('click', (e) => {
				if (e.target === overlay) {
					document.body.removeChild(overlay);
				}
			});

			return [overlay, widgetframe, title, () => document.getElementById("widgetoverlay"), closeButton];
		},

		code: {
			isActive: () => {
				return ReduxStore.getState().scratchGui.editorTab.activeTabIndex == 0
			},

			loadExtensionURL: vm.extensionManager.loadExtensionURL,
		},

		costumes: {
			isActive: () => {
				return ReduxStore.getState().scratchGui.editorTab.activeTabIndex == 1
			},

			removeCreationButton: (id) => {
				document.getElementById(`btn-costume-add-${id}`)?.remove();
			},

			addCreationButton: (id, tooltip, image, callback, t) => {
				if (!t) t = 0;
				var buttonId = 'btn-costume-add-' + id;

				const target = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_new-buttons_2qHDd.box_box_2jjDp > div > div.action-menu_more-buttons-outer_3J9yZ > div');

				if (target) {
					const newDiv = document.createElement('div');
					const button = document.createElement('button');
					let tooltipElement = null;

					button.id = buttonId;
					button.className = 'action-menu_button_1qbot action-menu_more-button_1fMGZ';
					button.innerHTML = `<img class="action-menu_more-icon_TJUQ7" draggable="false" src="${image}">`;

					button.addEventListener('click', callback);

					button.addEventListener('mouseenter', () => {
						tooltipElement = document.createElement('div');
						tooltipElement.className = '__react_component_tooltip show place-right type-dark action-menu_tooltip_3Bkh5';
						tooltipElement.id = 'tooltip-' + buttonId;
						tooltipElement.dataset.id = 'tooltip';
						tooltipElement.textContent = tooltip;

						document.body.appendChild(tooltipElement);

						tooltipElement.style.position = 'fixed';
						tooltipElement.style.pointerEvents = 'none';
						tooltipElement.style.transition = 'opacity 0.2s ease-in-out';
						tooltipElement.style.opacity = '1';

						const buttonRect = button.getBoundingClientRect();
						const tooltipRect = tooltipElement.getBoundingClientRect();

						const top = buttonRect.top + (buttonRect.height / 2) - (tooltipRect.height / 2);
						const left = buttonRect.right + 8;

						tooltipElement.style.top = `${top}px`;
						tooltipElement.style.left = `${left}px`;

						setTimeout(() => {
							if (tooltipElement) {
								tooltipElement.style.opacity = '1';
							}
						}, 10);
					});

					button.addEventListener('mouseleave', () => {
						if (tooltipElement) {
							const currentTooltip = tooltipElement;

							if (currentTooltip) {
								currentTooltip.remove();
							}

							tooltipElement = null;
						}
					});

					button.addEventListener('mouseleave', () => {
						if (tooltipElement) {
							const currentTooltip = tooltipElement;
							currentTooltip.style.opacity = '0';

							currentTooltip.addEventListener('transitionend', () => {
								currentTooltip.remove();
							}, {
								once: true
							});

							tooltipElement = null;
						}
					});

					newDiv.appendChild(button);
					target.appendChild(newDiv);
				} else if (t < 20) {
					setTimeout(() => {
						if (typeof addons !== 'undefined' && addons.costumes) {
							addons.costumes.addCreationButton(id, tooltip, image, callback, t + 1);
						}
					}, 100);
				}
			},

			removeCreationButton: (id) => {
				document.getElementById("btn-costume-add-" + id)?.remove();
			},

			add: async (name, url) => {
				await fetch(url)
					.then((r) => r.arrayBuffer())
					.then((arrayBuffer) => {
						const storage = vm.runtime.storage;
						const u8 = new Uint8Array(arrayBuffer);
						let type;

						const str = String.fromCharCode(...u8.slice(0, 50))
						if (str.includes('<svg')) type = storage.DataFormat.SVG
						else if (u8[0] === 0x89 && u8[1] === 0x50) type = storage.DataFormat.PNG
						else if (u8[0] === 0xff && u8[1] === 0xd8) type = storage.DataFormat.JPG
						else type = storage.DataFormat.PNG

						const asset = new storage.Asset(
							type == storage.DataFormat.SVG ? storage.AssetType.ImageVector : storage.AssetType.ImageBitmap,
							null,
							type,
							new Uint8Array(arrayBuffer),
							true
						);
						const newCostumeObject = {
							md5: asset.assetId + '.' + asset.dataFormat,
							asset: asset,
							name: name
						};
						vm.addCostume(newCostumeObject.md5, newCostumeObject);
					});
			},
		},

		sounds: {
			isActive: () => {
				return ReduxStore.getState().scratchGui.editorTab.activeTabIndex == 2
			},
		}
	}

	var prevredux553 = window.ReduxStore.getState();
	window.ReduxStore.subscribe(()=>{
		var state8925 = window.ReduxStore.getState();

		// if (state8925 != prevredux553) {
		// 	addons.sendEvent("", {
		// 		THING: true
		// 	});
		// }

		if (state8925.scratchGui.editorTab.activeTabIndex != prevredux553.scratchGui.editorTab.activeTabIndex) {
			addons.sendEvent("TabChanged", {
				INDEX:state8925.scratchGui.editorTab.activeTabIndex,
				TAB:["code", "costumes", "sounds", "variables"][state8925.scratchGui.editorTab.activeTabIndex]
			});
		}

		prevredux553 = state8925;
	});

	var prevsettings = addons.getSettings();
	function updateVM() {
		addons.VM = window.vm;
		addons.ScratchBlocks = window.ScratchBlocks;
		addons.paper = window.paper;
		addons.ReduxStore = window.ReduxStore;
		addons.Runtime = vm.runtime;

		addons.EverOpenedEditor = !!window.ScratchBlocks;

		if (document.cookie.includes("reload2784=true")) {
			setTimeout(() => {
				document.cookie = "reload2784=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
				location.reload();
			}, 500);
		}

		if (prevsettings != addons.getSettings()) {
			newSettings = addons.getSettings();

			for (const id in addons.registered) {
				var addon = addons.registered[id];
				var oldoptions = addon.options;
				if (addon.options) {
					if (oldoptions != newSettings[id] && (newSettings[id].enabled && !oldoptions.enabled)) {
						setTimeout(() => {
							addon.sendEvent("OptionsChanged", {});
						}, 100);
					}
					addon.options = newSettings[id] || addon.options;
				}

				if (oldoptions.enabled != addon.options.enabled) {
					if (addon.options.enabled) {
						if (addon.firstStart) {
							addon.init();
							addon.firstStart = false;
						}
						addon.start();
					} else {
						addon.stop();
					}
				}
			}

			prevsettings = newSettings;
		}
	} updateVM();
	setInterval(updateVM, 1000);
}

addons.register = (addon) => {
	if (!addon.getInfo || !addon.getInfo().id || !addon.init || !addon.start || !addon.event) {
		console.error("Addon is not valid");
		return false;
	}

	if (!addon.stop) {
		addon.requiresRestart = true;
		addon.stop = () => {};
	}

	var settings = addons.getSettings();

	var info = addon.getInfo();
	addon.firstStart = true;
	addons.registered[info.id] = addon;

	if (!addon.options) {
		addon.options = { enabled: false };
	}
	if (!settings[info.id]) {
		settings[info.id] = addon.options;
	} else {
		addon.options = settings[info.id];
	}

	if (addon.options.enabled == true && !InAddonManager) {
		addon.init();
		addon.start();
	}

	addons.setSettings(settings);

	if (InAddonManager) updateAddons()
};

addons.getSettings()["scripts"].forEach(function(url) {
	fetch(url)
		.then(function(response) {
			if (!response.ok) throw new Error("Network response was not ok");
			return response.text();
		})
		.then(function(code) {
			if (code.includes("addons.register") && code.includes("getInfo()")) {
				addons.scripts.push([url, true]);
			} else {
				addons.scripts.push([url, false]);
			}

			var oldScratch = window.Scratch;
			if (code.includes("Scratch.extensions.register") && !code.includes("addons.register")) {
				var Scratch = {};
				Scratch.vm = vm;
				Scratch.runtime = vm.runtime,
				Scratch.renderer = vm.runtime.renderer,
				Scratch.extensions = {};

				Scratch.extensions.register = function() {};

				Scratch.extensions.unsandboxed = true;
				Scratch.extensions.noblocks = true;
				Scratch.extensions.version = "lib";
				Scratch.extensions.lib = true;

				Scratch.BlockType = {
					COMMAND: "command",
					REPORTER: "reporter",
					BUTTON: "button",
					BOOLEAN: "boolean",
					HAT: "hat",
					STACK: "stack"
				};

				Scratch.ArgumentType = {
					STRING: "string",
					NUMBER: "number",
					BOOLEAN: "boolean",
					MATRIX: "matrix",
					COLOR: "color"
				};

				window.Scratch = Scratch;
			}

			eval(code);

			if (window.Scratch != oldScratch) window.Scratch = oldScratch
		})
		.catch(function(error) {
			console.error("Failed to load 3rd party script " + url, error);
		});
});

function displayAddonReloadButton() {
	const div=document.createElement("div");
	div.className="settings_dirty-outer_WmNYy";
	div.innerHTML=`<div class="settings_dirty-inner_2tglM">Reload tabs to apply settings.<button class="settings_button_2ovv0 settings_dirty-button_2adjE">Reload now</button></div>`;
	div.style.position="fixed";
	div.style.top="-100px";
	div.style.left="50%";
	div.style.transform="translateX(-50%)";
	div.style.transition="top 0.5s ease";
	document.querySelector("#app").appendChild(div);
	setTimeout(()=>{div.style.top="50px"},50);
	div.querySelector("button").onclick=()=>{
		document.cookie="reload2784=true; max-age=1; path=/";
		location.reload();
	}
}

function displayAddons() {
	let el = document.querySelector('.settings_no-results_3bDSs')
	if (el && el.textContent.includes('No results.')) {
		return;
	}

	const addonGroupDiv = document.createElement('div');
	addonGroupDiv.className = 'settings_addon-group_3d-ZB';
	addonGroupDiv.id = '3rdPartyGroup';

	const button = document.createElement('button');
	button.className = 'settings_addon-group-name_1h56B';
	button.textContent = 'Third party';

	const img = document.createElement('img');
	img.className = 'settings_addon-group-expand_1G6_X';
	img.src = 'static/assets/7c9434c4f1f44e3d198db3bc77305fff.svg';
	img.setAttribute('data-open', 'true');
	img.alt = '';

	// button.prepend(img);
	addonGroupDiv.appendChild(button);

	document.querySelector('#app > div > div.settings_addons_2LLFF > div > div:nth-child(1)').appendChild(addonGroupDiv);

	if (!addons.registered || Object.keys(addons.registered).length < 1) {
		const noscriptsbutton = document.createElement('button');
		noscriptsbutton.classList.add("settings_button_2ovv0", "settings_import-button_1NMJN");
		noscriptsbutton.innerText = "Add";
		noscriptsbutton.style.marginTop = "10px";
		noscriptsbutton.style.marginLeft = "5px";
		noscriptsbutton.style.marginBottom = "30px";

		noscriptsbutton.onclick=()=>{
			ManageScripts();
		}

		document.getElementById('3rdPartyGroup').appendChild(noscriptsbutton);
	} else {
		for (const id in addons.registered) {
			var addon = addons.registered[id];
			var info = addon.getInfo();
			createAddon(info.id, info.name, info.description, info.author, addon.options)
		}
	}
}

function updateAddons() {
	document.getElementById('3rdPartyGroup')?.remove();
	displayAddons();
}

function createAddon(id, title, desc, creator, options) {
	const addonContainer = document.createElement('div');
	addonContainer.className = 'settings_addon_3Oi_z';

	const headerDiv = document.createElement('div');
	headerDiv.className = 'settings_addon-header_271wJ';

	const label = document.createElement('label');
	label.className = 'settings_addon-title_6MhRl';

	const switchDiv = document.createElement('div');
	switchDiv.className = 'settings_addon-switch_2bf3g';
	const switchButton = document.createElement('button');
	switchButton.className = 'settings_switch_2V1f5';
	switchButton.setAttribute('state', options.enabled ? 'on' : 'off');
	switchButton.setAttribute('role', 'checkbox');
	switchButton.setAttribute('aria-checked', options.enabled);
	switchDiv.appendChild(switchButton);

	switchButton.addEventListener('click', () => {
		const allSettings = addons.getSettings();
		const currentVal = allSettings[id].enabled;
		const newVal = !currentVal;

		allSettings[id].enabled = newVal;

		addons.setSettings(allSettings);
		if (addons.registered[id].getInfo().requiresRestart) {
			showRestartPopup();
		}

		switchButton.setAttribute('state', newVal ? 'on' : 'off');
		switchButton.setAttribute('aria-checked', newVal);
	});

	const image = document.createElement('img');
	image.className = 'settings_extension-image_1HlEn';
	image.src = 'static/assets/6f52bcc0310181641bac6fec51c69e13.svg';
	image.draggable = false;

	const titleText = document.createElement('div');
	titleText.className = 'settings_addon-title-text_3QjlP';
	titleText.textContent = title;

	label.appendChild(switchDiv);
	label.appendChild(image);
	label.appendChild(titleText);

	const tagContainer = document.createElement('span');
	tagContainer.className = 'settings_tag-container_3yFc4';
	const operationsDiv = document.createElement('div');
	operationsDiv.className = 'settings_addon-operations_28nBd';

	const resetButton = document.createElement('button');
	resetButton.className = 'settings_reset-button_1onc-';
	resetButton.title = 'Reset';

	const resetButtonImage = document.createElement('img');
	resetButtonImage.src = 'static/assets/1640b6d968e0a0e13bc3c309a616deaa.svg';
	resetButtonImage.className = 'settings_reset-button-image_2Tgqe';
	resetButtonImage.alt = 'Reset';
	resetButtonImage.draggable = false;

	resetButton.appendChild(resetButtonImage);

	resetButton.addEventListener('click', () => {
		const allSettings = addons.getSettings();

		if (allSettings[id]) {
			delete allSettings[id];
			addons.setSettings(allSettings);

			showRestartPopup();
			addonContainer.remove();
		} else {
			alert('No settings found for this addon.');
			location.reload();
		}
	});

	operationsDiv.appendChild(resetButton);

	headerDiv.appendChild(label);
	headerDiv.appendChild(tagContainer);
	headerDiv.appendChild(operationsDiv);

	const detailsDiv = document.createElement('div');
	detailsDiv.className = 'settings_addon-details_2CKwd';

	const descriptionDiv = document.createElement('div');
	descriptionDiv.className = 'settings_description_2MbZo';
	descriptionDiv.textContent = desc;

	const creditContainer = document.createElement('div');
	creditContainer.className = 'settings_credit-container_2mHq7';
	const creditTitle = document.createElement('span');
	creditTitle.className = 'settings_credit-title_3f-yX';
	creditTitle.textContent = 'Credits:';
	const creditName = document.createElement('span');
	creditName.className = 'settings_credit_3grR6';
	const creditLink = document.createElement('a');
	creditLink.href = creator[1];
	creditLink.target = '_blank';
	creditLink.rel = 'noreferrer';
	creditLink.textContent = creator[0];
	creditName.appendChild(creditLink);
	creditContainer.appendChild(creditTitle);
	creditContainer.appendChild(creditName);

	detailsDiv.appendChild(descriptionDiv);
	detailsDiv.appendChild(creditContainer);

	const optionsDiv = document.createElement('div');
	optionsDiv.className = 'settings_setting-container_2BA7o';

	for (const key in options) {
		if (key === 'enabled') continue;

		const option = options[key];
		const settingDiv = document.createElement('div');
		settingDiv.className = 'settings_setting_2i2j-';

		const settingLabel = document.createElement('label');
		settingLabel.className = 'settings_setting-label_2w3mJ';
		settingLabel.textContent = option.label;
		settingLabel.setAttribute('for', `setting/${id}/${key}`);

		settingDiv.appendChild(settingLabel);

		switch (option.type) {
			case 'boolean':
				const checkbox = document.createElement('input');
				checkbox.id = `setting/${id}/${key}`;
				checkbox.type = 'checkbox';
				checkbox.checked = option.value;
				checkbox.addEventListener('change', (e) => {
					const allSettings = addons.getSettings();
					allSettings[id][key] = e.target.checked;
					addons.setSettings(allSettings);
					if (addons.registered[id].getInfo().requiresRestart) {
						showRestartPopup();
					}
				});
				settingDiv.appendChild(checkbox);
				break;

			case 'string':
				const textInput = document.createElement('input');
				textInput.id = `setting/${id}/${key}`;
				textInput.type = 'text';
				textInput.value = option.value;
				textInput.addEventListener('change', (e) => {
					const allSettings = addons.getSettings();
					allSettings[id][key] = e.target.value;
					addons.setSettings(allSettings);
					if (addons.registered[id].getInfo().requiresRestart) {
						showRestartPopup();
					}
				});
				settingDiv.appendChild(textInput);
				break;

			case 'selector':
				const selectorContainer = document.createElement('div');
				selectorContainer.className = 'settings_select_sIZno';
				option.items.forEach(item => {
					const button = document.createElement('button');
					button.className = 'settings_select-option_32Zqa';
					if (item === option.value) {
						button.classList.add('settings_selected_38WtW');
					}
					button.textContent = item;
					button.addEventListener('click', () => {
						const allSettings = addons.getSettings();
						allSettings[id][key] = item;
						addons.setSettings(allSettings);
						if (addons.registered[id].getInfo().requiresRestart) {
							showRestartPopup();
						}

						selectorContainer.querySelector('.settings_selected_38WtW')?.classList.remove('settings_selected_38WtW');
						button.classList.add('settings_selected_38WtW');
					});
					selectorContainer.appendChild(button);
				});
				settingDiv.appendChild(selectorContainer);
				break;

			case 'number':
				const numberInput = document.createElement('input');
				numberInput.id = `setting/${id}/${key}`;
				numberInput.type = 'number';
				if (option.min !== undefined) numberInput.min = option.min;
				if (option.max !== undefined) numberInput.max = option.max;
				if (option.step !== undefined) numberInput.step = option.step;
				numberInput.value = option.value;

				numberInput.style.borderRadius = "1000px"

				numberInput.addEventListener('change', (e) => {
					const allSettings = addons.getSettings();
					allSettings[id][key] = Number(e.target.value);
					addons.setSettings(allSettings);
					if (addons.registered[id].getInfo().requiresRestart) {
						showRestartPopup();
					}
				});

				settingDiv.appendChild(numberInput);
				break;

			case 'color':
				const colorInput = document.createElement('input');
				colorInput.id = `setting/${id}/${key}`;
				colorInput.type = 'color';
				colorInput.value = option.value;
				colorInput.addEventListener('change', (e) => {
					const allSettings = addons.getSettings();
					allSettings[id][key] = e.target.value;
					addons.setSettings(allSettings);
					if (addons.registered[id].getInfo().requiresRestart) {
						showRestartPopup();
					}
				});
				settingDiv.appendChild(colorInput);
				break;
		}
		optionsDiv.appendChild(settingDiv);
	}

	addonContainer.appendChild(headerDiv);
	addonContainer.appendChild(detailsDiv);
	addonContainer.appendChild(optionsDiv);

	document.getElementById('3rdPartyGroup').appendChild(addonContainer);
}

function showRestartPopup() {
	if (document.getElementById("restartpopup")) return;

	const div=document.createElement("div");
	div.className="settings_dirty-outer_WmNYy";
	div.innerHTML=`<div class="settings_dirty-inner_2tglM">Reload tabs to apply settings.<button class="settings_button_2ovv0 settings_dirty-button_2adjE">Reload now</button></div>`;
	div.style.position="fixed";
	div.style.top="-100px";
	div.style.left="50%";
	div.id="restartpopup";
	div.style.transform="translateX(-50%)";
	div.style.transition="top 0.5s ease";
	document.querySelector("#app").appendChild(div);
	setTimeout(()=>{div.style.top="20px"},50);
	div.querySelector("button").onclick=()=>{
		document.cookie="reload2784=true; max-age=10; path=/";
		location.reload();
	}
}

function ManageScripts() {
	const css = `
		@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

		body {
			font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		}

		.scratch-popup-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.4);
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20px;
			box-sizing: border-box;
			z-index: 1000;
		}

		.scratch-popup {
			background-color: #ffffff;
			border-radius: 12px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			width: 90vw;
			height: 80vh;
			max-width: 600px;
			max-height: 500px;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}

		.scratch-popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #F9F9F9;
			color: #575E75;
			padding: 15px 20px;
			font-size: 20px;
			font-weight: bold;
			border-bottom: 1px solid #E9EAEC;
		}

		.scratch-popup-content {
			padding: 20px;
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		.script-list-container {
			flex-grow: 1;
			overflow-y: auto;
			border: 1px solid #dcdcdc;
			border-radius: 8px;
			margin-bottom: 15px;
		}

		.script-list {
			list-style: none;
			padding: 0;
			margin: 0;
		}

		.script-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 12px;
			border-bottom: 1px solid #E9EAEC;
			word-break: break-all;
		}

		.script-item:last-child {
			border-bottom: none;
		}
		
		.icon-btn {
			background-color: transparent;
			border: none;
			cursor: pointer;
			font-size: 22px;
			padding: 5px;
			line-height: 1;
			transition: color 0.2s ease-in-out;
		}

		.remove-btn {
			color: #888;
		}
		.remove-btn:hover {
			color: #ff6961;
		}
		
		.close-btn {
			font-size: 28px;
			color: #888;
		}
		.close-btn:hover {
			color: #575E75;
		}

		.add-script-container {
			display: flex;
			gap: 10px;
			align-items: center;
		}

		.script-input {
			flex-grow: 1;
			border: 1px solid #dcdcdc;
			border-radius: 8px;
			padding: 10px;
			font-size: 14px;
		}
		.script-input:focus {
			outline: none;
			border-color: #4C97FF;
		}

		.add-btn {
			color: #888;
		}
		.add-btn:hover {
			color: #4C97FF;
		}
	`;
	var shouldReload = false;

	const styleSheet = document.createElement("style");
	styleSheet.innerText = css;
	document.head.appendChild(styleSheet);
	
	const overlay = document.createElement('div');
	overlay.className = 'scratch-popup-overlay';

	function saveScriptsToLocalStorage() {
		const scripts = [];
		document.querySelectorAll('.script-list .script-item span').forEach(span => {
			scripts.push(span.textContent);
		});
		
		const settings = JSON.parse(localStorage.getItem("3rdPartyAddonSettings")) || {};
		settings.scripts = scripts;
		localStorage.setItem("3rdPartyAddonSettings", JSON.stringify(settings));
	}

	const scriptList = document.createElement('ul');
	scriptList.className = 'script-list';
	scriptList.id = 'script-list';

	function removeScript(button) {
		const listItem = button.closest('.script-item');
		listItem.remove();
		saveScriptsToLocalStorage();
		shouldReload = true;
	}

	function createScriptItem(url) {
		const listItem = document.createElement('li');
		listItem.className = 'script-item';

		const span = document.createElement('span');
		span.textContent = url;

		const removeButton = document.createElement('button');
		removeButton.className = 'icon-btn remove-btn';
		removeButton.onclick = () => removeScript(removeButton);

		const removeIcon = document.createElement('i');
		removeIcon.className = 'bi bi-x-lg';

		removeButton.appendChild(removeIcon);
		listItem.appendChild(span);
		listItem.appendChild(removeButton);
		
		return listItem;
	}

	function addScript() {
		const scriptUrlInput = document.getElementById('script-url-input');
		const scriptUrl = scriptUrlInput.value.trim();

		shouldReload = true;

		if (scriptUrl && (scriptUrl.startsWith('http://') || scriptUrl.startsWith('https://') || scriptUrl.startsWith('//'))) {
			const newItem = createScriptItem(scriptUrl);
			scriptList.appendChild(newItem);
			scriptUrlInput.value = '';
			saveScriptsToLocalStorage();
		} else {
			alert('Please enter a valid URL (starting with http:// or https://)');
		}
	}

	function closePopup() {
		document.body.removeChild(overlay);
		document.head.removeChild(styleSheet);
		if (shouldReload) showRestartPopup();
	}

	overlay.onclick = function(event) {
		if (event.target === overlay) {
			closePopup();
		}
	};

	const popup = document.createElement('div');
	popup.className = 'scratch-popup';

	const header = document.createElement('div');
	header.className = 'scratch-popup-header';
	
	const headerTitle = document.createElement('span');
	headerTitle.textContent = 'Manage Scripts';
	
	const closeButton = document.createElement('button');
	closeButton.className = 'icon-btn close-btn';
	closeButton.onclick = closePopup;
	
	const closeIcon = document.createElement('i');
	closeIcon.className = 'bi bi-x';
	
	closeButton.appendChild(closeIcon);
	header.appendChild(headerTitle);
	header.appendChild(closeButton);

	const content = document.createElement('div');
	content.className = 'scratch-popup-content';
	
	const listContainer = document.createElement('div');
	listContainer.className = 'script-list-container';
	
	const storedSettings = JSON.parse(localStorage.getItem("3rdPartyAddonSettings"));
	const initialScripts = storedSettings?.scripts || [];
	initialScripts.forEach(url => {
		const item = createScriptItem(url);
		scriptList.appendChild(item);
	});
	listContainer.appendChild(scriptList);

	const addContainer = document.createElement('div');
	addContainer.className = 'add-script-container';

	const input = document.createElement('input');
	input.type = 'text';
	input.id = 'script-url-input';
	input.className = 'script-input';
	input.placeholder = 'https://supercoolscripts.com/addon.js';
	input.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			addScript();
		}
	});

	const addButton = document.createElement('button');
	addButton.className = 'icon-btn add-btn';
	addButton.onclick = addScript;
	
	const addIcon = document.createElement('i');
	addIcon.className = 'bi bi-plus-circle-fill';

	addButton.appendChild(addIcon);
	addContainer.appendChild(input);
	addContainer.appendChild(addButton);
	
	content.appendChild(listContainer);
	content.appendChild(addContainer);

	popup.appendChild(header);
	popup.appendChild(content);

	overlay.appendChild(popup);

	document.body.appendChild(overlay);
}

function addScriptButtons() {
	const addScript = document.createElement('button');
	addScript.classList.add("settings_button_2ovv0", "settings_import-button_1NMJN");
	addScript.id = "addScriptButton";
	addScript.innerText = "Manage scripts";
	addScript.addEventListener('click', () => {
		ManageScripts();
	});

	const exportScript = document.createElement('button');
	exportScript.classList.add("settings_button_2ovv0", "settings_import-button_1NMJN");
	exportScript.innerText = "Export custom";

	const importScript = document.createElement('button');
	importScript.classList.add("settings_button_2ovv0", "settings_import-button_1NMJN");
	importScript.innerText = "Import custom";

	const resetCustom = document.createElement('button');
	resetCustom.classList.add("settings_button_2ovv0", "settings_import-button_1NMJN");
	resetCustom.innerText = "Reset custom";
	resetCustom.addEventListener('click', () => {
		if (!window.confirm("Do you want to clear all 3rd party addon settings?")) return;
		const settings = addons.getSettings();

		for (const key in settings) {
			if (key !== 'scripts') {
				delete settings[key];
			}
		}

		addons.setSettings(settings);
		showRestartPopup();
	});

	document.querySelector(".settings_footer-buttons_xTSXH").appendChild(addScript);
	// document.querySelector(".settings_footer-buttons_xTSXH").appendChild(exportScript);
	// document.querySelector(".settings_footer-buttons_xTSXH").appendChild(importScript);
	document.querySelector(".settings_footer-buttons_xTSXH").appendChild(resetCustom);
}

if (InAddonManager) {
	const observer = new MutationObserver(() => {
		if (!document.getElementById('3rdPartyGroup') && document.querySelector('#app > div > div.settings_addons_2LLFF > div > div:nth-child(1)')) displayAddons();
		if (document.querySelector('#app > div > div.settings_addons_2LLFF > div > div.settings_footer-buttons_xTSXH') && !document.getElementById('addScriptButton')) addScriptButtons();
	});

	observer.observe(document.body, { childList: true, subtree: true });
	if (!document.getElementById('3rdPartyGroup') && document.querySelector('#app > div > div.settings_addons_2LLFF > div > div:nth-child(1)')) displayAddons();
	if (document.querySelector('#app > div > div.settings_addons_2LLFF > div > div.settings_footer-buttons_xTSXH') && !document.getElementById('addScriptButton')) addScriptButtons();
}

console.log("Custom addon manager loaded");
