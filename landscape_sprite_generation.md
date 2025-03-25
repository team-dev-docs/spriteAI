# Landscape Sprite Generation with SpriteAI

This guide explains how to use the `generateLandscapeSprite` function from the SpriteAI library to create custom landscape sprites for your game or application.

## Table of Contents

1. [Function Overview](#function-overview)
2. [Parameters](#parameters)
3. [Options](#options)
4. [Return Value](#return-value)
5. [Examples](#examples)
6. [Advanced Usage](#advanced-usage)

## Function Overview

The `generateLandscapeSprite` function allows you to create pixel art landscape scenes based on a text description. It uses AI-powered image generation to produce high-quality, customizable landscapes that can be used as game backgrounds or environmental elements.

## Parameters

The function takes two parameters:

1. `description` (string): A text description of the landscape you want to generate.
2. `options` (object, optional): An object containing additional configuration options.

## Options

The `options` object can include the following properties:

- `size` (string, default: '1024x1024'): The output size of the generated image.
- `style` (string, default: 'pixel-art'): The art style of the landscape.
- `timeOfDay` (string, default: 'day'): The time of day setting for the landscape. Options include 'day', 'night', 'sunset', and 'dawn'.
- `weather` (string, default: 'clear'): The weather conditions for the landscape. Options include 'clear', 'rainy', 'foggy', and 'snowy'.
- `perspective` (string, default: 'side-scrolling'): The perspective of the landscape. Options include 'side-scrolling', 'top-down', and 'isometric'.
- `save` (boolean, default: false): Whether to save the generated image to the local filesystem.
- `removeBackground` (boolean, optional): If true, removes the background color from the generated image.
- `backgroundColor` (string, optional): The background color to remove when `removeBackground` is true.
- `colorThreshold` (number, optional): The threshold for color removal when `removeBackground` is true.

## Return Value

The function returns a Promise that resolves to an object with the following structure:

```javascript
{
  original: string, // URL of the original generated image
  landscape: string, // Base64-encoded data URL of the processed image
  metadata: {
    description: string,
    style: string,
    timeOfDay: string,
    weather: string,
    perspective: string,
    dimensions: {
      width: string,
      height: string
    }
  }
}
```

## Examples

### Basic Usage

Generate a simple forest landscape:

```javascript
import { generateLandscapeSprite } from 'spriteai';

const result = await generateLandscapeSprite('lush green forest with tall trees and a winding path');
console.log(result.landscape); // Use this data URL in your application
```

### Customizing Time of Day and Weather

Create a night-time city landscape with rain:

```javascript
const cityNight = await generateLandscapeSprite('futuristic city skyline with neon lights', {
  timeOfDay: 'night',
  weather: 'rainy'
});
```

### Changing Perspective

Generate a top-down view of a desert oasis:

```javascript
const oasis = await generateLandscapeSprite('desert oasis with palm trees and a small pond', {
  perspective: 'top-down'
});
```

## Advanced Usage

### Removing Background

To remove the white background from the generated sprite:

```javascript
const mountainRange = await generateLandscapeSprite('snow-capped mountain range', {
  removeBackground: true,
  backgroundColor: '#FFFFFF',
  colorThreshold: 0.1
});
```

### Saving to File

To save the generated landscape sprite to your local filesystem:

```javascript
const beachScene = await generateLandscapeSprite('tropical beach with palm trees and clear blue water', {
  save: true
});
// The image will be saved in the 'assets' folder with the filename 'tropical_beach_with_palm_trees_and_clear_blue_water_landscape.png'
```

Remember that when `save` is set to `true`, the image will be saved in an 'assets' directory in your current working directory. Make sure this directory exists or handle its creation in your application logic.

By leveraging the `generateLandscapeSprite` function, you can quickly create diverse and visually appealing landscape sprites for your games or applications, saving time and resources in the asset creation process.