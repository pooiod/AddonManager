# Global Variables & Editor Internals
For advanced addons that need to interact directly with the Scratch editor's core components, ScriptKitten exposes several global objects under the main `addons` object. These provide direct access to the virtual machine, the block workspace, the state manager, and more.

## `addons.VM`
*   **What it is:** A direct reference to the core Scratch Virtual Machine instance (`window.vm`).

The VM is the heart of Scratch. It is responsible for running the project, managing sprites (targets), handling extensions, and processing blocks. You can use it to programmatically interact with the user's project.

### Example: Getting the name of the currently selected sprite.
```javascript
if (addons.VM && addons.VM.editingTarget) {
    const currentSpriteName = addons.VM.editingTarget.sprite.name;
    console.log(`The user is currently editing: ${currentSpriteName}`);
}
```



## `addons.Runtime`
*   **What it is:** A reference to the VM's runtime property (`vm.runtime`).

The Runtime manages the "live" state of a running project. It keeps track of all the threads (running scripts), handles events like "when green flag clicked," and deals with sensing, operators, and other block execution logic.



## `addons.ScratchBlocks`
*   **What it is:** A reference to the Scratch Blocks workspace instance (`window.ScratchBlocks`).

This is the instance of Google's Blockly library, customized for Scratch. It gives you full control over the code editor's workspace. You could potentially use it to add, remove, or modify blocks on the workspace.

**Note:** This object only exists when the user has visited the "Code" tab at least once.

### Example: Logging the number of blocks on the workspace.
```javascript
if (addons.ScratchBlocks) {
    const blockCount = addons.ScratchBlocks.mainWorkspace.getAllBlocks(false).length;
    console.log(`There are ${blockCount} blocks on the workspace.`);
}
```



## `addons.paper`
*   **What it is:** A reference to the Paper.js library instance (`window.paper`).

Paper.js is the vector graphics scripting framework used by the Scratch costume editor. When the user is editing a vector costume, this object gives you access to the Paper.js project, allowing you to inspect or even manipulate the vector shapes on the canvas.

**Note:** This object only exists when the user is on the "Costumes" tab and has selected a vector costume.



## `addons.ReduxStore`
*   **What it is:** A reference to the editor's Redux state management store (`window.ReduxStore`).

The Scratch GUI uses Redux to manage its entire state, including which tab is open, which sprite is selected, the position of the scrollbars, and much more. You can use this to `getState()` and read any part of the editor's current state.

Dispatching actions (`dispatch()`) is possible but **extremely dangerous** and highly likely to cause problems if not done with a deep understanding of the Scratch GUI's internal architecture.

### Example: Checking if the backpack is open.
```javascript
if (addons.ReduxStore) {
    const isBackpackOpen = addons.ReduxStore.getState().scratchGui.backpack.expanded;
    console.log(`Is the backpack open? ${isBackpackOpen}`);
}
```

# Next steps
[custom apis](#/custom-apis)
