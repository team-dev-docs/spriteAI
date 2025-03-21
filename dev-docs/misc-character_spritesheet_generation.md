# generateCharacterSpritesheet

Generates a pixel art character spritesheet with multiple animation states.

## Function Signature

```javascript
async function generateCharacterSpritesheet(description, options = {})
```

## Parameters

- `description` (string): A description of the character to generate.
- `options` (object, optional): Configuration options for the spritesheet generation.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| states | string[] | ['idle', 'walk', 'run', 'attack'] | Animation states to generate |
| framesPerState | number | 6 | Number of frames per animation state |
| size | string | '1024x1024' | Output image size |
| style | string | 'pixel-art' | Art style to use |
| padding | number | 1 | Padding between sprites |
| direction | string | 'right' | Base direction the character faces |
| save | boolean | false | Whether to save the generated spritesheet to disk |

## Return Value

The function returns a Promise that resolves to an object with the following properties:

- `original` (string): URL of the original generated image
- `spritesheet` (string): Base64-encoded PNG data URI of the processed spritesheet
- `metadata` (object): Metadata about the generated spritesheet
  - `states` (string[]): List of animation states
  - `framesPerState` (number): Number of frames per state
  - `totalFrames` (number): Total number of frames in the spritesheet
  - `dimensions` (object): Width and height of the spritesheet
  - `frameData` (object): Information about each animation state's frames

## Examples

### Basic Usage

```javascript
import { generateCharacterSpritesheet } from 'spriteAI';

const result = await generateCharacterSpritesheet('a cute robot');
console.log(result.spritesheet); // Base64 encoded spritesheet
console.log(result.metadata); // Metadata about the spritesheet
```

### Custom Animation States

```javascript
const result = await generateCharacterSpritesheet('a fierce dragon', {
  states: ['idle', 'fly', 'breathe-fire', 'roar'],
  framesPerState: 8
});
```

### Saving to Disk

```javascript
await generateCharacterSpritesheet('a ninja warrior', {
  save: true,
  size: '2048x2048'
});
// Saves to ./assets/ninja_warrior_spritesheet.png
```

## Notes

- The function uses DALL-E 3 to generate the initial spritesheet image.
- The generated spritesheet is organized with each row representing a different animation state.
- When `save` is true, the spritesheet is saved in the `assets` folder of the current working directory.
- The function automatically processes the generated image to create a properly formatted spritesheet with the specified number of frames and states.