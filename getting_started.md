# Getting Started with SpriteAI

SpriteAI is a powerful library that allows you to generate game assets, including character spritesheets and environment sprites, using AI-powered image generation. This guide will help you get started with SpriteAI, covering installation, basic setup, and a simple example of generating a character spritesheet.

## Installation

To install SpriteAI, you'll need Node.js and npm (Node Package Manager) installed on your system. Once you have these prerequisites, you can install SpriteAI using npm:

```bash
npm install spriteai
```

## Basic Setup

After installation, you need to set up your project to use SpriteAI. Here's a basic setup:

1. Create a new JavaScript file (e.g., `app.js`) in your project directory.

2. Import the necessary functions from SpriteAI:

```javascript
import { generateCharacterSpritesheet } from 'spriteai';
```

3. Make sure you have an OpenAI API key. You'll need to set this as an environment variable named `OPENAI_API_KEY`. You can do this in your terminal or add it to a `.env` file in your project root:

```
OPENAI_API_KEY=your_api_key_here
```

## Generating a Character Spritesheet

Let's create a simple example to generate a character spritesheet:

```javascript
import { generateCharacterSpritesheet } from 'spriteai';

async function generateSprite() {
  try {
    const result = await generateCharacterSpritesheet('a cute pixel art cat', {
      states: ['idle', 'walk', 'run'],
      framesPerState: 4,
      size: '512x512',
      save: true
    });

    console.log('Spritesheet generated successfully!');
    console.log('Original image URL:', result.original);
    console.log('Spritesheet data URL:', result.spritesheet);
    console.log('Metadata:', result.metadata);
  } catch (error) {
    console.error('Error generating spritesheet:', error);
  }
}

generateSprite();
```

This script will generate a spritesheet of a cute pixel art cat with idle, walk, and run animations, each having 4 frames. The resulting image will be 512x512 pixels and will be saved to the `assets` folder in your project directory.

## Core Concepts

### Character Spritesheets

SpriteAI can generate character spritesheets with multiple animation states. Key concepts include:

- **States**: Different animation sequences (e.g., idle, walk, run, attack).
- **Frames**: Individual images that make up an animation sequence.
- **Style**: The visual style of the sprite (e.g., pixel-art, vector, 3D).

### Environment Sprites

SpriteAI can also generate environment sprites and tilesets. These are useful for creating game backgrounds and level elements.

### API Structure

The main functions provided by SpriteAI are:

- `generateCharacterSpritesheet`: Creates character spritesheets with multiple animation states.
- `generateEnvironmentSprites`: Generates environment sprites or tilesets.
- `fetchAvailableAnimationStates`: Retrieves available animation states.
- `fetchAvailableSpriteStyles`: Retrieves available sprite styles.

## Next Steps

Now that you've got the basics, you can explore more advanced features of SpriteAI:

- Try generating different types of characters and animations.
- Experiment with environment sprite generation.
- Integrate the generated sprites into your game development workflow.

For more detailed information on each function and its options, refer to the API documentation (coming soon).

Happy sprite generating!