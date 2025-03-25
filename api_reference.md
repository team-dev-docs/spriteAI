# SpriteAI API Reference

This document provides a comprehensive API reference for the SpriteAI library. It includes detailed documentation for all public functions, their parameters, return values, and example usage.

## Table of Contents

1. [generateCharacterSpritesheet](#generatecharacterspritesheet)
2. [generateLandscapeSprite](#generatelandscapesprite)
3. [fetchAvailableAnimationStates](#fetchavailableanimationstates)
4. [fetchAvailableSpriteStyles](#fetchavailablespritestyles)
5. [generateEnvironmentSprites](#generateenvironmentsprites)

## generateCharacterSpritesheet

Generates a character spritesheet based on the provided description and options.

### Parameters

- `description` (string): A detailed description of the character to generate.
- `options` (object, optional): Configuration options for the spritesheet generation.
  - `states` (array of strings, default: `['idle', 'walk', 'run', 'attack']`): Animation states to generate.
  - `framesPerState` (number, default: 6): Number of frames per animation state.
  - `size` (string, default: '1024x1024'): Output size of the spritesheet.
  - `style` (string, default: 'pixel-art'): Art style of the character.
  - `padding` (number, default: 1): Padding between sprites.
  - `direction` (string, default: 'right'): Base direction of the character.
  - `save` (boolean, default: false): Whether to save the generated image to disk.

### Returns

An object containing:
- `original` (string): URL of the original generated image.
- `spritesheet` (string): Base64-encoded PNG data of the processed spritesheet.
- `metadata` (object): Metadata about the generated spritesheet, including:
  - `states` (array): List of animation states.
  - `framesPerState` (number): Number of frames per state.
  - `totalFrames` (number): Total number of frames in the spritesheet.
  - `dimensions` (object): Width and height of the spritesheet.
  - `frameData` (object): Detailed information about each animation state's frames.

### Example Usage

```javascript
const spriteAI = require('spriteai');

const result = await spriteAI.generateCharacterSpritesheet('A brave knight in shining armor', {
  states: ['idle', 'walk', 'attack'],
  framesPerState: 8,
  size: '2048x2048',
  style: 'pixel-art',
  save: true
});

console.log(result.metadata);
```

## generateLandscapeSprite

Generates a landscape sprite based on the provided description and options.

### Parameters

- `description` (string): A detailed description of the landscape to generate.
- `options` (object, optional): Configuration options for the landscape generation.
  - `size` (string, default: '1024x1024'): Output size of the sprite.
  - `style` (string, default: 'pixel-art'): Art style of the landscape.
  - `timeOfDay` (string, default: 'day'): Time of day setting (day, night, sunset, dawn).
  - `weather` (string, default: 'clear'): Weather conditions (clear, rainy, foggy, snowy).
  - `perspective` (string, default: 'side-scrolling'): Perspective of the landscape (side-scrolling, top-down, isometric).
  - `save` (boolean, default: false): Whether to save the generated image to disk.
  - `removeBackground` (boolean, optional): Whether to remove the background color.
  - `backgroundColor` (string, optional): Background color to remove (if removeBackground is true).
  - `colorThreshold` (number, optional): Threshold for background color removal.

### Returns

An object containing:
- `original` (string): URL of the original generated image.
- `landscape` (string): Base64-encoded PNG data of the processed landscape sprite.
- `metadata` (object): Metadata about the generated landscape, including:
  - `description` (string): The original description.
  - `style` (string): The art style used.
  - `timeOfDay` (string): The time of day setting.
  - `weather` (string): The weather conditions.
  - `perspective` (string): The perspective used.
  - `dimensions` (object): Width and height of the sprite.

### Example Usage

```javascript
const spriteAI = require('spriteai');

const result = await spriteAI.generateLandscapeSprite('A lush forest with a winding river', {
  size: '2048x1024',
  style: 'pixel-art',
  timeOfDay: 'sunset',
  weather: 'clear',
  perspective: 'side-scrolling',
  save: true,
  removeBackground: true,
  backgroundColor: '#FFFFFF',
  colorThreshold: 0.1
});

console.log(result.metadata);
```

## fetchAvailableAnimationStates

Retrieves a list of available animation states for character spritesheets.

### Parameters

None

### Returns

An array of strings representing available animation states.

### Example Usage

```javascript
const spriteAI = require('spriteai');

const states = await spriteAI.fetchAvailableAnimationStates();
console.log(states); // ['idle', 'walk', 'run', 'attack', 'jump', 'fall', 'hurt', 'die']
```

## fetchAvailableSpriteStyles

Retrieves a list of available sprite styles.

### Parameters

None

### Returns

An array of strings representing available sprite styles.

### Example Usage

```javascript
const spriteAI = require('spriteai');

const styles = await spriteAI.fetchAvailableSpriteStyles();
console.log(styles); // ['pixel-art', 'vector', '3d', 'hand-drawn', 'anime']
```

## generateEnvironmentSprites

Generates a tileset of environment sprites based on the provided description and options.

### Parameters

- `description` (string): A detailed description of the environment to generate.
- `options` (object, optional): Configuration options for the environment sprite generation.
  - `elements` (number, default: 4): Number of different elements to generate.
  - `size` (string, default: '1024x1024'): Output size of the tileset.
  - `style` (string, default: 'pixel-art'): Art style of the environment sprites.
  - `padding` (number, default: 1): Padding between sprites.
  - `theme` (string, default: 'fantasy'): Theme of the environment.
  - `save` (boolean, default: false): Whether to save the generated image to disk.

### Returns

An object containing:
- `original` (string): URL of the original generated image.
- `tileset` (string): Base64-encoded PNG data of the processed environment tileset.
- `metadata` (object): Metadata about the generated tileset, including:
  - `elements` (number): Number of different elements generated.
  - `theme` (string): The theme of the environment.
  - `dimensions` (object): Width and height of the tileset.
  - `tileData` (object): Information about the tile arrangement.

### Example Usage

```javascript
const spriteAI = require('spriteai');

const result = await spriteAI.generateEnvironmentSprites('A medieval village', {
  elements: 6,
  size: '2048x2048',
  style: 'pixel-art',
  theme: 'medieval',
  save: true
});

console.log(result.metadata);
```

This API reference provides a comprehensive overview of the main functions available in the SpriteAI library. Developers can use these functions to generate character spritesheets, landscape sprites, and environment tilesets programmatically. The library also offers utility functions to fetch available animation states and sprite styles, allowing for more dynamic and flexible sprite generation workflows.