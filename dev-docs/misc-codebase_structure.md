# SpriteAI Codebase Overview

This document provides an overview of the SpriteAI codebase structure, explaining the purpose of each main file and how the different components interact.

## Project Structure

```
spriteAI/
├── index.js
├── package.json
└── spriteAI/
    └── index.js
```

## Main Files

### /index.js

This is the main entry point for the SpriteAI library. It contains the core functionality for generating character spritesheets and landscape sprites using AI. Key functions include:

- `removeBackgroundColor`: Utility function to remove background colors from images
- `generateCharacterSpritesheet`: Generates a character spritesheet based on a description and options
- `generateLandscapeSprite`: Generates a landscape sprite based on a description and options

### /package.json

This file defines the project metadata and dependencies. Key dependencies include:

- `axios`: For making HTTP requests to fetch generated images
- `jimp`: For image processing tasks
- `openai`: To interact with the OpenAI API for image generation
- `sharp`: For additional image manipulation capabilities

### /spriteAI/index.js

This file contains an SDK version of the SpriteAI functionality, with some modifications:

- Includes the `generateCharacterSpritesheet` function with similar functionality to the main index.js
- Adds a new `fetchAvailableAnimationStates` function to retrieve available animation states

## Component Interactions

1. The main `index.js` file serves as the primary interface for users of the SpriteAI library.

2. When generating sprites, the library uses the OpenAI API to create initial images based on descriptions and specified options.

3. The generated images are then processed using `axios` to download, and `sharp` or `jimp` for manipulation (e.g., removing backgrounds, organizing spritesheets).

4. The `spriteAI/index.js` file provides an alternative SDK interface, potentially for use in different contexts or with slight modifications to the core functionality.

5. Both versions of the library use similar underlying processes for sprite generation, leveraging the OpenAI API and image processing libraries.

6. The `package.json` file ensures that all necessary dependencies are properly defined and can be installed for the project to function correctly.

## Key Functions

- `generateCharacterSpritesheet`: Creates a character spritesheet with multiple animation states.
- `generateLandscapeSprite`: Generates a landscape sprite suitable for game backgrounds.
- `removeBackgroundColor`: Utility function for transparent background creation.
- `fetchAvailableAnimationStates`: SDK function to retrieve available animation states.

This structure allows for flexible use of the SpriteAI library, whether through direct use of the main index.js file or via the SDK interface in spriteAI/index.js.