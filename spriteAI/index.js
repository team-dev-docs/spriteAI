// filepath: /spriteAI/index.js
import OpenAI from "openai";
import axios from "axios";
import sharp from "sharp";
import Jimp from "jimp";
import fs from "fs";
import path from "path";

async function removeBackgroundColor(inputPath, outputPath, targetColor, colorThreshold = 0, options = {}) {
  const image = await Jimp.read(inputPath);
  const colorToReplace = Jimp.cssColorToHex(targetColor);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];
    const currentColor = Jimp.rgbaToInt(red, green, blue, 255);
    const colorDiff = Jimp.colorDiff({ r: red, g: green, b: blue }, Jimp.intToRGBA(colorToReplace));

    if (colorDiff <= colorThreshold) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
    }
  });

  let result = await image.writeAsync(outputPath);
  return result;
}

export const generateCharacterSpritesheet = async function(description, options = {}) {
  const {
    states = ['idle', 'walk', 'run', 'attack'],
    framesPerState = 6,
    size = '1024x1024',
    style = 'pixel-art',
    padding = 1,
    direction = 'right'
  } = options;

  const statesDescription = states.map(state => `${state}ing`).join(', ');
  const prompt = `Create a ${style} character spritesheet of ${description} with these animation states: ${statesDescription}.
    Each row should be a different animation state with ${framesPerState} frames.
    Character should face ${direction}.
    Style requirements:
    - Clean pixel art style
    - Consistent character size across all frames
    - White background
    - Clear separation between frames
    - ${states.length} rows of animations
    - ${framesPerState} frames per row
    - Each row represents a different animation state in sequence`;

  const openAiObject = new OpenAI();
  const response = await openAiObject.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: size,
    n: 1
  });

  const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
  const imgBuffer = Buffer.from(res.data);

  const spritesheet = await generateSpritesheet(imgBuffer, {
    rows: states.length,
    framesPerRow: framesPerState,
    padding: padding
  });

  if (options.save) {
    const currentWorkingDirectory = process.cwd();
    const filename = `${currentWorkingDirectory}${path.sep}assets${path.sep}${description.replace(/\s+/g, '_')}_spritesheet.png`;
    await sharp(spritesheet).toFile(filename);
  }

  return {
    original: response.data[0].url,
    spritesheet: `data:image/png;base64,${spritesheet.toString('base64')}`,
    metadata: {
      states: states,
      framesPerState: framesPerState,
      totalFrames: states.length * framesPerState,
      dimensions: {
        width: size.split('x')[0],
        height: size.split('x')[1]
      },
      frameData: states.reduce((acc, state, index) => {
        acc[state] = {
          row: index,
          frames: framesPerState,
          startFrame: index * framesPerState,
          endFrame: (index + 1) * framesPerState - 1
        };
        return acc;
      }, {})
    }
  };
};

// New SDK function to fetch available animation states
export const fetchAvailableAnimationStates = async function() {
  const states = ['idle', 'walk', 'run', 'attack', 'jump', 'fall', 'hurt', 'die'];
  return states;
};

// New SDK function to fetch available sprite styles
export const fetchAvailableSpriteStyles = async function() {
  const styles = ['pixel-art', 'vector', '3d', 'hand-drawn', 'anime'];
  return styles;
};

export const generateEnvironmentSprites = async function(description, options = {}) {
  const {
    elements = 4,
    size = '1024x1024',
    style = 'pixel-art',
    padding = 1,
    theme = 'fantasy'
  } = options;

  const prompt = `Create a ${style} tileset of ${description} environment with ${elements} different elements.
    Style requirements:
    - Clean ${style} style
    - ${theme} theme
    - White background
    - Clear separation between elements
    - ${elements} distinct environment pieces arranged in a grid
    - Consistent scale and art style across all elements
    - Suitable for a game environment`;

  const openAiObject = new OpenAI();
  const response = await openAiObject.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: size,
    n: 1
  });

  const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
  const imgBuffer = Buffer.from(res.data);

  const tileset = await generateSpritesheet(imgBuffer, {
    rows: Math.ceil(elements / 2),
    framesPerRow: 2,
    padding: padding
  });

  if (options.save) {
    const currentWorkingDirectory = process.cwd();
    const filename = `${currentWorkingDirectory}${path.sep}assets${path.sep}${description.replace(/\s+/g, '_')}_environment.png`;
    await sharp(tileset).toFile(filename);
  }

  return {
    original: response.data[0].url,
    tileset: `data:image/png;base64,${tileset.toString('base64')}`,
    metadata: {
      elements: elements,
      theme: theme,
      dimensions: {
        width: size.split('x')[0],
        height: size.split('x')[1]
      },
      tileData: {
        rows: Math.ceil(elements / 2),
        columns: 2,
        totalTiles: elements
      }
    }
  };
};