import OpenAI from "openai";
import axios from "axios";
import sharp from "sharp";
import Jimp from "jimp";
import fs from "fs"
import path from "path";

async function removeBackgroundColor(inputPath, outputPath, targetColor, colorThreshold = 0, options = {}) {
  //yeah fdsatea!fdsafdsafds
  const image = await Jimp.read(inputPath);

    //upadte please!trgfggfh
    const colorToReplace = Jimp.cssColorToHex(targetColor); // e.g.lol, '#FFFFFF'

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        const currentColor = Jimp.rgbaToInt(red, green, blue, 255);

        // Calculate the color difference lolololooooo
        const colorDiff = Jimp.colorDiff({ r: red, g: green, b: blue }, Jimp.intToRGBA(colorToReplace));

        // If the color difference is less than the threshold, make it transparent
        if (colorDiff <= colorThreshold) {
            this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
        }
    });

   let result =  await image.writeAsync(outputPath);
   return result
}

export const generateCharacterSpritesheet = async function(description, options = {}) {
  const {
    states = ['idle', 'walk', 'run', 'attack'],  // Animation states to generate
    framesPerState = 6,                          // Frames per animation state
    size = '1024x1024',                          // Output size
    style = 'pixel-art',                         // Art style
    padding = 1,                                 // Padding between sprites
    direction = 'right'                          // Base direction of character
  } = options;

  // Generate the complete prompt for DALL-E
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

  // Process the generated image
  const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
  const imgBuffer = Buffer.from(res.data);

  // Generate the organized spritesheet with padding
  const spritesheet = await generateSpritesheet(imgBuffer, {
    rows: states.length,
    framesPerRow: framesPerState,
    padding: padding
  });

  // Save if requested
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

export const generateLandscapeSprite = async function(description, options = {}) {
  const {
    size = '1024x1024',               // Output size
    style = 'pixel-art',              // Art style
    timeOfDay = 'day',                // Time of day: day, night, sunset, dawn
    weather = 'clear',                // Weather conditions: clear, rainy, foggy, snowy
    perspective = 'side-scrolling',   // Perspective: side-scrolling, top-down, isometric
    save = false                      // Whether to save the generated image
  } = options;

  // Generate the complete prompt for DALL-E
  const prompt = `Create a ${style} landscape scene of ${description}.
    Style requirements:
    - Clean ${style} style
    - ${timeOfDay} time setting
    - ${weather} weather conditions
    - ${perspective} perspective
    - Perfect for use as a game background
    - White background around the sprite elements
    - Rich in detail but with clear silhouettes
    - Cohesive color palette appropriate for ${timeOfDay} and ${weather}`;

  const openAiObject = new OpenAI();
  const response = await openAiObject.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: size,
    n: 1
  });

  // Process the generated image
  const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
  const imgBuffer = Buffer.from(res.data);
  
  // Save if requested
  if (save) {
    const currentWorkingDirectory = process.cwd();
    const assetsDir = path.join(currentWorkingDirectory, 'assets');
    
    // Create assets directory if it doesn't exist
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    const filename = path.join(assetsDir, `${description.replace(/\s+/g, '_')}_landscape.png`);
    await sharp(imgBuffer).toFile(filename);
  }
  
  // Option to remove background if specified
  let processedImage = imgBuffer;
  if (options.removeBackground) {
    const tempInputPath = path.join(process.cwd(), 'temp_input.png');
    const tempOutputPath = path.join(process.cwd(), 'temp_output.png');
    
    // Write the buffer to a temporary file
    fs.writeFileSync(tempInputPath, imgBuffer);
    
    // Remove the background
    await removeBackgroundColor(
      tempInputPath, 
      tempOutputPath, 
      options.backgroundColor || '#FFFFFF', 
      options.colorThreshold || 0.1
    );
    
    // Read the processed image back
    processedImage = fs.readFileSync(tempOutputPath);
    
    // Clean up temporary files
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);
  }

  return {
    original: response.data[0].url,
    landscape: `data:image/png;base64,${processedImage.toString('base64')}`,
    metadata: {
      description,
      style,
      timeOfDay,
      weather,
      perspective,
      dimensions: {
        width: size.split('x')[0],
        height: size.split('x')[1]
      }
    }
  };
};
