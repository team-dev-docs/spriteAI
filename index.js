import OpenAI from "openai";
import axios from "axios";
import sharp from "sharp";
import Jimp from "jimp";
import fs from "fs"
import path from "path";

async function removeBackgroundColor(inputPath, outputPath, targetColor, colorThreshold = 0, options = {}) {
  //yeah fdsatea!
  const image = await Jimp.read(inputPath);

    //upadte please!
    const colorToReplace = Jimp.cssColorToHex(targetColor); // e.g., '#FFFFFF'

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        const currentColor = Jimp.rgbaToInt(red, green, blue, 255);

        // Calculate the color difference
        const colorDiff = Jimp.colorDiff({ r: red, g: green, b: blue }, Jimp.intToRGBA(colorToReplace));

        // If the color difference is less than the threshold, make it transparent
        if (colorDiff <= colorThreshold) {
            this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
        }
    });

   let result =  await image.writeAsync(outputPath);
   return result
}

function encodeImage(imagePath) {
  //very cool hey tim and andrewsdfdasf
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
  }



async function getUniqueColors(imagePath, options = {}) {
  //addd some things test test test test test test booooo
    const image = await Jimp.read(imagePath);
    const colorSet = new Set();
    //adds more stuff dude lol
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];
      if (alpha !== 0) { // Ignore fully transparent pixels
        const colorInt = Jimp.rgbaToInt(red, green, blue, alpha);
        // const hex = Jimp.intToRGBA(colorInt);
        colorSet.add(colorInt);
      }
    });

    return Array.from(colorSet);
  }

// New utility functions

async function rotateSpritesheet(inputBuffer, degrees) {
  return await sharp(inputBuffer)
    .rotate(degrees)
    .toBuffer();
}

async function tintSprite(inputBuffer, color) {
  return await sharp(inputBuffer)
    .tint(color)
    .toBuffer();
}

async function calculateOptimalAnimationSpeed(frameCount) {
  // Standard frame rate for smooth animation
  const baseFrameRate = 60;
  return Math.floor(baseFrameRate / frameCount);
}

async function generateSpriteMetadata(imageBuffer, frameWidth, frameHeight) {
  const metadata = await sharp(imageBuffer).metadata();
  return {
    frames: {
      columns: Math.floor(metadata.width / frameWidth),
      rows: Math.floor(metadata.height / frameHeight),
      total: (Math.floor(metadata.width / frameWidth) * Math.floor(metadata.height / frameHeight))
    },
    dimensions: {
      original: {
        width: metadata.width,
        height: metadata.height
      },
      frame: {
        width: frameWidth,
        height: frameHeight
      }
    },
    recommendedFPS: await calculateOptimalAnimationSpeed(6)
  };
}

// Add these new utility functions before the sprite object
async function createParticleEffect(imageBuffer, particleCount = 10) {
  const metadata = await sharp(imageBuffer).metadata();
  const particles = [];
  
  // Create smaller versions of the sprite for particles
  for (let i = 0; i < particleCount; i++) {
    const size = Math.max(metadata.width / (4 + Math.random() * 4), 4);
    const particle = await sharp(imageBuffer)
      .resize(Math.round(size), Math.round(size))
      .rotate(Math.random() * 360)
      .toBuffer();
    particles.push(particle);
  }
  
  return particles;
}

async function flipSprite(imageBuffer, direction = 'horizontal') {
  return await sharp(imageBuffer)
    .flip(direction === 'vertical')
    .flop(direction === 'horizontal')
    .toBuffer();
}

async function createColorCyclingAnimation(imageBuffer, colorShift = 30) {
  const frames = [];
  for (let i = 0; i < 360; i += colorShift) {
    const frame = await sharp(imageBuffer)
      .modulate({
        hue: i
      })
      .toBuffer();
    frames.push(frame);
  }
  return frames;
}

async function combineSprites(spriteBufferA, spriteBufferB, position = 'overlay') {
  const composite = [];
  
  switch (position) {
    case 'side-by-side':
      return await sharp(spriteBufferA)
        .extend({
          right: (await sharp(spriteBufferB).metadata()).width,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .composite([{ input: spriteBufferB, gravity: 'east' }])
        .toBuffer();
    case 'stacked':
      return await sharp(spriteBufferA)
        .extend({
          bottom: (await sharp(spriteBufferB).metadata()).height,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .composite([{ input: spriteBufferB, gravity: 'south' }])
        .toBuffer();
    default: // overlay
      return await sharp(spriteBufferA)
        .composite([{ input: spriteBufferB, gravity: 'center' }])
        .toBuffer();
  }
}

// Usage

export const sprite = {
    async generateSprite(description, options = {}) {
      // for feature friday purposes oo!!!
      if(options.iterations) {
        let i = 0;
        let iterations = []
        while (i < options.iterations) {
          const openAiObject = new OpenAI();
          const dalle3 = openAiObject.images
          const response = await dalle3.generate({
              model: "dall-e-3",
              prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS.
              Generate 6 frames of a 24-bit character of the requested character of ${description}, optimized for walking animations.
              Other Instructions:

              -The top half of the image should be the frames and the bottom half should be a blank white background with nothing in it.
              -Style should be retro pixel art.
              -The background of the image, and frame should just be the color white, with no extra items, lines, text, or grids.
              -The frames should be two rows with 3 columns each, so a 2 by 3 table.
              `,
              n: 1,
              size: options?.size || "1024x1024",
            });
            console.log(response)


          //   console.log("this is the result", result.choices)
            console.log(response.data[0])
            const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
            let imgBuffer = Buffer.from(res.data)
          //   const colorsArray = await getUniqueColors(imgBuffer)
          //   console.log(colorsArray)
          if(options?.save) {
              const currentWorkingDirectory = process.cwd()
              let pictureName = description.replace(/\s+/g, '');
              let pictureFilename = `${currentWorkingDirectory}${path.sep}assets${path.sep}${pictureName}.png`
              await sharp(imgBuffer).ensureAlpha().greyscale().toFile(pictureFilename)
          }
          let grayImageBuffer = await sharp(imgBuffer).ensureAlpha().greyscale().toBuffer()
          let base64Image = grayImageBuffer.toString('base64');

          // If you need a data URL, you can prepend the appropriate prefix
          let imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
          // const base64Image = encodeImage("./test.png");
          const result = await openAiObject.chat.completions.create({
              model: "gpt-4-vision-preview",
              max_tokens: 1000,
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: `For this 1024x1024 image, what would be the frameWidth and frameHeight if I was to use this image as a spritesheet for this phaser js function:

                    this.load.spritesheet('test', path to png, { frameWidth: 115, frameHeight: 380 });
                    `
                  },
                    {
                      type: "image_url",
                      image_url: imageDataUrl,
                    },
                  ],
                },
              ],
            });
            let framesResponse = result[0]
            const jsonFrameResponse = await openAiObject.chat.completions.create({
              model: "gpt-3.5-turbo-1106",
              response_format: { type: "json_object" },
              max_tokens: 1000,
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: `Return a JSON with best the frameHeight and Framewidth from this description: ${result.choices[0].message}` },
                  ],
                },
              ],
            });

            // Enhanced options handling
            const enhancedOptions = {
              ...options,
              rotate: options.rotate || 0,
              tint: options.tint || null,
              scale: options.scale || 1.0,
              generateMetadata: options.generateMetadata || false
            };

            // Inside the main generation logic, before returning:
            if (enhancedOptions.rotate) {
              imgBuffer = await rotateSpritesheet(imgBuffer, enhancedOptions.rotate);
            }

            if (enhancedOptions.tint) {
              imgBuffer = await tintSprite(imgBuffer, enhancedOptions.tint);
            }

            if (enhancedOptions.scale !== 1.0) {
              imgBuffer = await sharp(imgBuffer)
                .resize(Math.round(metadata.width * enhancedOptions.scale), 
                        Math.round(metadata.height * enhancedOptions.scale))
                .toBuffer();
            }

            // Add metadata if requested
            if (enhancedOptions.generateMetadata) {
              const metadata = await generateSpriteMetadata(imgBuffer, 
                jsonFrameResponse.frameWidth, 
                jsonFrameResponse.frameHeight);
              iterations.push({
                messages: jsonFrameResponse.choices[0].message,
                image: imageDataUrl,
                metadata: metadata
              });
            } else {
              iterations.push({
                messages: jsonFrameResponse.choices[0].message,
                image: imageDataUrl
              });
            }
        }
        return iterations
      } else {
        const openAiObject = new OpenAI();
        const dalle3 = openAiObject.images
        const response = await dalle3.generate({
            model: "dall-e-3",
            prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS.
            Generate 6 frames of a 24-bit character of the requested character of ${description}, optimized for walking animations.
            Other Instructions:

            -The top half of the image should be the frames and the bottom half should be a blank white background with nothing in it.
            -Style should be retro pixel art.
            -The background of the image, and frame should just be the color white, with no extra items, lines, text, or grids.
            -The frames should be two rows with 3 columns each, so a 2 by 3 table.
            `,
            n: 1,
            size: options?.size || "1024x1024",
          });
          console.log(response)


        //   console.log("this is the result", result.choices)
          console.log(response.data[0])
          const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
          let imgBuffer = Buffer.from(res.data)
        //   const colorsArray = await getUniqueColors(imgBuffer)
        //   console.log(colorsArray)
        if(options?.save) {
            const currentWorkingDirectory = process.cwd()
            let pictureName = description.replace(/\s+/g, '');
            let pictureFilename = `${currentWorkingDirectory}${path.sep}assets${path.sep}${pictureName}.png`
            await sharp(imgBuffer).ensureAlpha().greyscale().toFile(pictureFilename)
        }
        let grayImageBuffer = await sharp(imgBuffer).ensureAlpha().greyscale().toBuffer()
        let base64Image = grayImageBuffer.toString('base64');

        // If you need a data URL, you can prepend the appropriate prefix, lets change this, try again
        let imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
        // const base64Image = encodeImage("./test.png");
        const result = await openAiObject.chat.completions.create({
            model: "gpt-4-vision-preview",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: `For this 1024x1024 image, what would be the frameWidth and frameHeight if I was to use this image as a spritesheet for this phaser js function:

                  this.load.spritesheet('test', path to png, { frameWidth: 115, frameHeight: 380 });
                  `
                },
                  {
                    type: "image_url",
                    image_url: imageDataUrl,
                  },
                ],
              },
            ],
          });
          let framesResponse = result[0]
          const jsonFrameResponse = await openAiObject.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            response_format: { type: "json_object" },
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: `Return a JSON with best the frameHeight and Framewidth from this description: ${result.choices[0].message}` },
                ],
              },
            ],
          });

          // Enhanced options handling
          const enhancedOptions = {
            ...options,
            rotate: options.rotate || 0,
            tint: options.tint || null,
            scale: options.scale || 1.0,
            generateMetadata: options.generateMetadata || false
          };

          // Inside the main generation logic, before returning:
          if (enhancedOptions.rotate) {
            imgBuffer = await rotateSpritesheet(imgBuffer, enhancedOptions.rotate);
          }

          if (enhancedOptions.tint) {
            imgBuffer = await tintSprite(imgBuffer, enhancedOptions.tint);
          }

          if (enhancedOptions.scale !== 1.0) {
            imgBuffer = await sharp(imgBuffer)
              .resize(Math.round(metadata.width * enhancedOptions.scale), 
                      Math.round(metadata.height * enhancedOptions.scale))
              .toBuffer();
          }

          // Add metadata if requested
          if (enhancedOptions.generateMetadata) {
            const metadata = await generateSpriteMetadata(imgBuffer, 
              jsonFrameResponse.frameWidth, 
              jsonFrameResponse.frameHeight);
            return {
              messages: jsonFrameResponse.choices[0].message,
              image: imageDataUrl,
              metadata: metadata
            };
          }

          return {messages: jsonFrameResponse.choices[0].message, image: imageDataUrl}
      }

        //   image_url = response.data.data[0].url; nice!
        //   return image_url
    },

    async generatePixelArt(description, options = {}) {
        const openAiObject = new OpenAI();
        const response = await openAiObject.images.generate({
            model: "dall-e-3",
            prompt: `Create a pixel art sprite of ${description}. The sprite should be:
            - Strictly pixel art style, maximum 32x32 pixels
            - Clean, distinct pixels
            - No anti-aliasing
            - Using a limited color palette
            - Single frame, centered
            - Pure white background`,
            size: "1024x1024",
            n: 1
        });
        
        return await this._processGeneratedImage(response, options);
    },

    async generateIsometric(description, options = {}) {
        const openAiObject = new OpenAI();
        const response = await openAiObject.images.generate({
            model: "dall-e-3",
            prompt: `Create an isometric sprite of ${description}. The sprite should be:
            - Perfect isometric angle (45 degrees)
            - Clean, game-ready style
            - Single frame viewed from top-down 3/4 perspective
            - Pure white background
            - Suitable for isometric game graphics`,
            size: "1024x1024",
            n: 1
        });
        
        return await this._processGeneratedImage(response, options);
    },

    async generateAnimatedEmoji(description, options = {}) {
        const openAiObject = new OpenAI();
        const response = await openAiObject.images.generate({
            model: "dall-e-3",
            prompt: `Create a 4-frame emoji animation of ${description}. Requirements:
            - Simple, clean emoji style
            - 2x2 grid layout
            - Each frame should be part of a smooth animation
            - White background
            - Consistent size across frames`,
            size: "1024x1024",
            n: 1
        });
        
        return await this._processGeneratedImage(response, options);
    },

    async generateRetroConsole(description, consoleType, options = {}) {
        const consoleLimits = {
            'genesis': { colors: 512, resolution: '320x224' },
            'msx': { colors: 16, resolution: '256x192' },
            'commodore64': { colors: 16, resolution: '320x200' }
        };

        const console = consoleLimits[consoleType.toLowerCase()] || consoleLimits.genesis;
        
        const openAiObject = new OpenAI();
        const response = await openAiObject.images.generate({
            model: "dall-e-3",
            prompt: `Create a ${consoleType} style sprite of ${description}. Must follow:
            - Exact ${consoleType} technical limitations
            - Maximum ${console.colors} colors
            - Native resolution ${console.resolution}
            - Authentic ${consoleType} art style
            - Pure white background`,
            size: "1024x1024",
            n: 1
        });
        
        return await this._processGeneratedImage(response, options);
    },

    async splitSpriteSheet(imageBuffer, columns, rows, options = {}) {
        const metadata = await sharp(imageBuffer).metadata();
        const frameWidth = Math.floor(metadata.width / columns);
        const frameHeight = Math.floor(metadata.height / rows);
        const frames = [];

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                const frame = await sharp(imageBuffer)
                    .extract({
                        left: x * frameWidth,
                        top: y * frameHeight,
                        width: frameWidth,
                        height: frameHeight
                    })
                    .toBuffer();
                frames.push(frame);
            }
        }

        return {
            frames,
            metadata: {
                frameWidth,
                frameHeight,
                totalFrames: frames.length,
                originalDimensions: {
                    width: metadata.width,
                    height: metadata.height
                }
            }
        };
    },

    // Helper method to process generated images
    async _processGeneratedImage(response, options) {
        const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
        const imgBuffer = Buffer.from(res.data);
        
        if (options.save) {
            const currentWorkingDirectory = process.cwd();
            const filename = `${currentWorkingDirectory}${path.sep}assets${path.sep}${Date.now()}.png`;
            await sharp(imgBuffer).toFile(filename);
        }

        const base64Image = imgBuffer.toString('base64');
        return {
            image: `data:image/png;base64,${base64Image}`,
            url: response.data[0].url
        };
    },

    // Add these new methods to the sprite object
    async generateParticleEffect(description, particleCount = 10, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const particles = await createParticleEffect(imgBuffer, particleCount);
      
      return {
        baseSprite: baseSprite.image,
        particles: particles.map(p => `data:image/png;base64,${p.toString('base64')}`)
      };
    },

    async createColorCycle(description, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const frames = await createColorCyclingAnimation(imgBuffer);
      
      return {
        baseSprite: baseSprite.image,
        frames: frames.map(f => `data:image/png;base64,${f.toString('base64')}`)
      };
    },

    async combineSprites(description1, description2, position = 'overlay', options = {}) {
      const sprite1 = await this.generatePixelArt(description1, options);
      const sprite2 = await this.generatePixelArt(description2, options);
      
      const buffer1 = Buffer.from(sprite1.image.split(',')[1], 'base64');
      const buffer2 = Buffer.from(sprite2.image.split(',')[1], 'base64');
      
      const combined = await combineSprites(buffer1, buffer2, position);
      
      return {
        image: `data:image/png;base64,${combined.toString('base64')}`
      };
    }
};
