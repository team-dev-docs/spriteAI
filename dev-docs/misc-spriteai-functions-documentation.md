# SpriteAI Functions Documentation

## Overview
This guide covers the main functions in the SpriteAI module, located in `/index.js`.

## Functions

### 1. removeBackgroundColor
**Location**: `/index.js`

Removes a specified background color from an image.

```javascript
async function removeBackgroundColor(inputPath, outputPath, targetColor, colorThreshold = 0, options = {})
```

### 2. encodeImage
**Location**: `/index.js`

Encodes an image file to base64.

```javascript
function encodeImage(imagePath)
```

### 3. getUniqueColors
**Location**: `/index.js`

Extracts unique colors from an image.

```javascript
async function getUniqueColors(imagePath, options = {})
```

### 4. generateSprite
**Location**: `/index.js`

Generates a sprite sheet based on a description.

```javascript
async generateSprite(description, options = {})
```

### 5. generateSpriteWithBorder
**Location**: `/index.js`

Generates a pixel art sprite with a customizable border.

```javascript
async function generateSpriteWithBorder(description, borderColor = { r: 0, g: 0, b: 0, alpha: 255 }, borderThickness = 1, options = {})
```

#### Parameters:
- `description` (string): Description of the sprite to generate.
- `borderColor` (object): Color of the border in RGBA format.
- `borderThickness` (number): Thickness of the border in pixels.
- `options` (object): Additional options for sprite generation.

#### Example Usage:
```javascript
const spriteWithBorder = await sprite.generateSpriteWithBorder('knight', { r: 255, g: 0, b: 0, alpha: 255 }, 5);
console.log(spriteWithBorder);
```

### 6. generateEnvironmentSprites
**Location**: `/spriteAI/index.js`

Generates environment tilesets based on a description.

```javascript
async function generateEnvironmentSprites(description, options = {})
```

#### Parameters:
- `description` (string): Description of the environment to generate.
- `options` (object): Configuration options for the tileset generation.

#### Options:
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| elements | number | 4 | Number of different elements in the tileset |
| size | string | '1024x1024' | Output image size |
| style | string | 'pixel-art' | Art style to use |
| padding | number | 1 | Padding between tiles |
| theme | string | 'fantasy' | Theme of the environment |

#### Example Usage:
```javascript
const environmentSprites = await generateEnvironmentSprites('a fantasy forest', {
  elements: 6,
  size: '1024x1024',
  style: 'pixel-art',
  padding: 2,
  theme: 'fantasy',
  save: true
});
console.log(environmentSprites.tileset);
```

### 7. generateItemSprites
**Location**: `/spriteAI/index.js`

Generates item collections based on a description.

```javascript
async function generateItemSprites(description, options = {})
```

#### Parameters:
- `description` (string): Description of the items to generate.
- `options` (object): Configuration options for the item generation.

#### Options:
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| itemCount | number | 4 | Number of different items in the collection |
| size | string | '1024x1024' | Output image size |
| style | string | 'pixel-art' | Art style to use |
| padding | number | 1 | Padding between items |
| itemType | string | 'equipment' | Type of items to generate |
| background | string | 'white' | Background color of the items |

#### Example Usage:
```javascript
const itemSprites = await generateItemSprites('medieval weapons', {
  itemCount: 8,
  size: '1024x1024',
  style: 'pixel-art',
  padding: 2,
  itemType: 'weapon',
  background: 'transparent',
  save: true
});
console.log(itemSprites.itemSheet);
```

### 8. fetchAvailableAnimationStates
**Location**: `/spriteAI/index.js`

Fetches available animation states.

```javascript
async function fetchAvailableAnimationStates()
```

#### Example Usage:
```javascript
const animationStates = await fetchAvailableAnimationStates();
console.log(animationStates);
```

### 9. fetchAvailableSpriteStyles
**Location**: `/spriteAI/index.js`

Fetches available sprite styles.

```javascript
async function fetchAvailableSpriteStyles()
```

#### Example Usage:
```javascript
const spriteStyles = await fetchAvailableSpriteStyles();
console.log(spriteStyles);
```

## How to Extend

1. **Add New Image Processing Function**
   - Create a new function in `/index.js`
   - Use existing libraries like `Jimp` or `sharp`

2. **Enhance generateSprite**
   - Modify the DALL-E prompt in `generateSprite`
   - Add new options to customize sprite generation

3. **Implement Error Handling**
   - Add try-catch blocks in async functions
   - Create custom error messages for specific scenarios

4. **Optimize Performance**
   - Use caching for repeated operations
   - Implement parallel processing for multiple sprites

5. **Add New AI Model Integration**
   - Import a new AI model in `/index.js`
   - Create a new function to interact with the model

Example:
```javascript
async function newAIFeature(input) {
  const newAIModel = new AIModel();
  const result = await newAIModel.process(input);
  return result;
}
```
