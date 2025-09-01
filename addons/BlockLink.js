// id: P7BlockLink

(function(addons) {
	'use strict';

	class P7SVGtext {
		constructor() {
			this.active = false;
			this.GetFile = (file) => { return "//scriptkitten.pages.dev/addons/BlockLink/" + file; }
		}

		options = {
			enabled: true
		}

		getInfo() {
			return {
				id: 'P7BlockLink',
				name: 'BlockLink',
				author: ['pooiod7', 'https://github.com/pooiod'],
				description: 'A commit based collaberation system',
				icon: this.GetFile('IconMono.svg'),
				screenshots: ["http://web.archive.org/web/20250608044845im_/https://yeetyourfiles.lol/file/3e3963c1/Screenshot%202025-04-01%2012.08.25%20PM.png","http://web.archive.org/web/20250608044845im_/https://yeetyourfiles.lol/file/4f62468e/875398420.png","http://web.archive.org/web/20250608044845im_/https://yeetyourfiles.lol/file/65243614/Screenshot%202025-04-01%2011.47.23%20AM.png","http://web.archive.org/web/20250608044845im_/https://yeetyourfiles.lol/file/2a8456cc/Screenshot%202025-04-02%201.32.30%20PM%20Sigma.png"],
				requiresRestart: true,
			};
		}

		init() {}

		event(type, data) {}

		start() {
			if (this.active) return;
			this.active = true;

			fetch("https://p7scratchextensions.pages.dev/ext/BlockLink/main.js")
				.then(function(response) {
					if (!response.ok) throw new Error("Network response was not ok");
					return response.text();
				})
				.then(function(code) {
					var oldScratch = window.Scratch;

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

					eval(code);

					window.Scratch = oldScratch
				})
				.catch(function(error) {
					console.error("Failed to load 3rd party script " + url, error);
				});
		}
	}

	addons.register(new P7SVGtext());
})(addons);
