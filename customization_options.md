---
title: Customization Options for SpriteAI
description: A comprehensive guide on customizing sprite generation using SpriteAI library
---

# Customization Options for SpriteAI

The SpriteAI library offers a wide range of customization options to tailor your sprite generation process. This guide will walk you through the various options available for both character spritesheets and environment sprites, explaining how to use them and their effects on the output.

## Character Spritesheet Customization

When generating character spritesheets using the `generateCharacterSpritesheet` function, you can customize several aspects of the output. Here's an overview of the available options:

### Basic Options

```javascript
const options = {
  states: ['idle', 'walk', 'run', 'attack'],
  framesPerState: 6,
  size: '1024x1024',
  style: 'pixel-art',
  padding: 1,
  direction: 'right'
};

const result = await generateCharacterSpritesheet('a magical wizard', options);
```

Let's break down each option:

1. `states`: An array of animation states to generate. Default: `['idle', 'walk', 'run', 'attack']`
   - You can add or remove states as needed for your character.
   - Example: `['idle', 'walk', 'run', 'attack', 'jump', 'cast']`

2. `framesPerState`: The number of frames for each animation state. Default: `6`
   - Increasing this value will result in smoother animations but larger spritesheets.

3. `size`: The output size of the entire spritesheet. Default: `'1024x1024'`
   - You can adjust this based on your game's requirements.
   - Example: `'2048x2048'` for higher resolution sprites.

4. `style`: The art style of the generated sprites. Default: `'pixel-art'`
   - Other options include: `'vector'`, `'3d'`, `'hand-drawn'`, `'anime'`
   - You can fetch available styles using the `fetchAvailableSpriteStyles()` function.

5. `padding`: The padding between individual sprite frames. Default: `1`
   - Increase this value to add more space between frames.

6. `direction`: The base direction the character is facing. Default: `'right'`
   - Options: `'right'`, `'left'`

### Advanced Options

```javascript
const advancedOptions = {
  ...options,
  save: true,
  removeBackground: true,
  backgroundColor: '#FFFFFF',
  colorThreshold: 0.1
};
```

7. `save`: Whether to save the generated spritesheet to the local filesystem. Default: `false`
   - When set to `true`, the spritesheet will be saved in the `assets` folder.

8. `removeBackground`: Whether to remove the background of the generated sprite. Default: `false`
   - This option is useful for creating sprites with transparent backgrounds.

9. `backgroundColor`: The color to be removed when `removeBackground` is `true`. Default: `'#FFFFFF'` (white)
   - Specify the background color you want to remove.

10. `colorThreshold`: The threshold for color matching when removing the background. Default: `0.1`
    - A higher value will remove colors more aggressively, while a lower value will be more precise.

## Environment Sprite Customization

For generating environment sprites using the `generateEnvironmentSprites` function, you have the following customization options:

```javascript
const options = {
  elements: 4,
  size: '1024x1024',
  style: 'pixel-art',
  padding: 1,
  theme: 'fantasy'
};

const result = await generateEnvironmentSprites('forest', options);
```

Let's explore these options:

1. `elements`: The number of distinct environment pieces to generate. Default: `4`
   - Increase this value to create more varied environment tiles.

2. `size`: The output size of the entire tileset. Default: `'1024x1024'`
   - Similar to character spritesheets, you can adjust this based on your needs.

3. `style`: The art style of the generated environment sprites. Default: `'pixel-art'`
   - Options are the same as for character spritesheets.

4. `padding`: The padding between individual environment elements. Default: `1`
   - Adjust this to control the spacing between tiles.

5. `theme`: The overall theme of the environment. Default: `'fantasy'`
   - You can specify different themes like `'sci-fi'`, `'medieval'`, `'futuristic'`, etc.

6. `save`: Whether to save the generated tileset to the local filesystem. Default: `false`
   - When set to `true`, the tileset will be saved in the `assets` folder.

## Example: Customizing a Character Spritesheet

Here's an example of how to use various customization options to generate a unique character spritesheet:

```javascript
import { generateCharacterSpritesheet } from 'spriteAI';

const options = {
  states: ['idle', 'walk', 'run', 'attack', 'jump'],
  framesPerState: 8,
  size: '2048x2048',
  style: 'hand-drawn',
  padding: 2,
  direction: 'left',
  save: true,
  removeBackground: true,
  backgroundColor: '#F0F0F0',
  colorThreshold: 0.05
};

const result = await generateCharacterSpritesheet('a stealthy ninja', options);
console.log('Generated spritesheet:', result.spritesheet);
console.log('Metadata:', result.metadata);
```

This example will generate a high-resolution, hand-drawn ninja character spritesheet with five animation states, facing left, and with a transparent background.

## Conclusion

By leveraging these customization options, you can fine-tune the output of SpriteAI to match your game's specific requirements. Experiment with different combinations of options to achieve the desired look and feel for your sprites and environment elements.

Remember to use the `fetchAvailableAnimationStates()` and `fetchAvailableSpriteStyles()` functions to get up-to-date information on available animation states and art styles, as these may be expanded in future updates of the SpriteAI library.