# fetchAvailableAnimationStates Function

The `fetchAvailableAnimationStates` function is a part of the SpriteAI SDK that provides a list of predefined animation states commonly used in character sprite animations. This function can be used in conjunction with the sprite generation features to create more dynamic and comprehensive character spritesheets.

## Function Signature

```javascript
export const fetchAvailableAnimationStates = async function() {
  // Function implementation
};
```

## Description

The `fetchAvailableAnimationStates` function returns an array of string values representing different animation states for a character sprite. These states include:

- idle
- walk
- run
- attack
- jump
- fall
- hurt
- die

## Usage with Sprite Generation

The `fetchAvailableAnimationStates` function can be used in combination with the `generateCharacterSpritesheet` function to create more versatile and comprehensive character animations. Here's how you can integrate these functions:

1. Fetch available animation states:
   ```javascript
   const availableStates = await fetchAvailableAnimationStates();
   ```

2. Use the fetched states in the `generateCharacterSpritesheet` options:
   ```javascript
   const spritesheet = await generateCharacterSpritesheet("A cute robot character", {
     states: availableStates,
     framesPerState: 8,
     size: '1024x1024',
     style: 'pixel-art'
   });
   ```

By using the `fetchAvailableAnimationStates` function, you ensure that your spritesheet includes all the standard animation states, making your character more versatile for various game scenarios.

## Benefits

- **Consistency**: Ensures that all generated spritesheets have a standard set of animation states.
- **Flexibility**: Allows developers to easily include all available states or select specific ones as needed.
- **Extensibility**: As new animation states are added to the SDK, they will automatically be available to use in sprite generation.

## Example

```javascript
import { fetchAvailableAnimationStates, generateCharacterSpritesheet } from 'spriteAI';

async function createCompleteCharacterSpritesheet(description) {
  const allStates = await fetchAvailableAnimationStates();
  const selectedStates = allStates.filter(state => state !== 'die'); // Exclude 'die' animation

  const spritesheet = await generateCharacterSpritesheet(description, {
    states: selectedStates,
    framesPerState: 6,
    size: '1024x1024',
    style: 'pixel-art',
    save: true
  });

  console.log('Generated spritesheet with states:', selectedStates);
  console.log('Spritesheet metadata:', spritesheet.metadata);
}

createCompleteCharacterSpritesheet("A futuristic space explorer");
```

This example demonstrates how to fetch all available animation states, customize the selection, and use them to generate a comprehensive character spritesheet.