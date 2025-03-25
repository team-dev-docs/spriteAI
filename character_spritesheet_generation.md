# Character Spritesheet Generation

This guide explains how to generate character spritesheets using the SpriteAI library. We'll cover the `generateCharacterSpritesheet` function, its parameters, options, and the structure of the returned data.

## Overview

The `generateCharacterSpritesheet` function allows you to create pixel art character spritesheets with various animation states. It uses AI-powered image generation to produce high-quality, customizable character sprites.

## Function Signature

```javascript
async function generateCharacterSpritesheet(description, options = {})
```

### Parameters

1. `description` (string): A textual description of the character you want to generate.
2. `options` (object): An optional object containing customization parameters.

### Options

The `options` object can include the following properties:

- `states` (array of strings): Animation states to generate. Default: `['idle', 'walk', 'run', 'attack']`
- `framesPerState` (number): Number of frames per animation state. Default: `6`
- `size` (string): Output size of the spritesheet. Default: `'1024x1024'`
- `style` (string): Art style of the character. Default: `'pixel-art'`
- `padding` (number): Padding between sprites. Default: `1`
- `direction` (string): Base direction of the character. Default: `'right'`
- `save` (boolean): Whether to save the generated image to disk. Default: `false`

## Usage Example

```javascript
import { generateCharacterSpritesheet } from 'spriteAI';

const result = await generateCharacterSpritesheet('a cute red dragon', {
  states: ['idle', 'fly', 'breathe fire'],
  framesPerState: 8,
  size: '2048x2048',
  style: 'pixel-art',
  direction: 'left',
  save: true
});

console.log(result);
```

## Returned Data Structure

The function returns an object with the following structure:

```javascript
{
  original: string, // URL of the original generated image
  spritesheet: string, // Base64-encoded PNG data of the processed spritesheet
  metadata: {
    states: string[], // Array of animation states
    framesPerState: number, // Number of frames per state
    totalFrames: number, // Total number of frames in the spritesheet
    dimensions: {
      width: string,
      height: string
    },
    frameData: {
      [stateName]: {
        row: number, // Row index in the spritesheet
        frames: number, // Number of frames for this state
        startFrame: number, // Starting frame index
        endFrame: number // Ending frame index
      }
    }
  }
}
```

## Examples

### Basic Character Generation

```javascript
const warrior = await generateCharacterSpritesheet('a medieval knight in armor');
```

This will generate a default spritesheet with idle, walk, run, and attack animations for a medieval knight character.

### Custom Pixelated Character

```javascript
const pixelatedWizard = await generateCharacterSpritesheet('a wise old wizard', {
  states: ['idle', 'cast spell', 'teleport'],
  framesPerState: 10,
  size: '1536x1536',
  style: 'pixel-art',
  padding: 2
});
```

This example creates a pixelated wizard character with custom animation states and more frames per state.

### Saving the Spritesheet

```javascript
const savedCharacter = await generateCharacterSpritesheet('a stealthy ninja', {
  save: true
});
```

This will generate a ninja character spritesheet and save it to the `assets` folder in your project directory.

## Tips for Best Results

1. Be specific in your character descriptions to get more accurate results.
2. Experiment with different art styles by changing the `style` option.
3. Adjust the `framesPerState` value to create smoother or more detailed animations.
4. Use the `save` option to keep a local copy of the generated spritesheet for further processing or use in your game.

## Available Animation States

You can fetch the list of available animation states using the `fetchAvailableAnimationStates` function:

```javascript
import { fetchAvailableAnimationStates } from 'spriteAI';

const availableStates = await fetchAvailableAnimationStates();
console.log(availableStates);
```

## Available Sprite Styles

To get a list of available sprite styles, use the `fetchAvailableSpriteStyles` function:

```javascript
import { fetchAvailableSpriteStyles } from 'spriteAI';

const availableStyles = await fetchAvailableSpriteStyles();
console.log(availableStyles);
```

By leveraging these functions and customization options, you can create a wide variety of character spritesheets for your game development needs using the SpriteAI library.