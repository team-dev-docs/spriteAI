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

// New utility functions
async function generateOutline(imageBuffer, outlineColor = { r: 0, g: 0, b: 0, alpha: 255 }, thickness = 1) {
  const original = await sharp(imageBuffer).toBuffer();
  const dilated = await sharp(imageBuffer)
    .dilate(thickness)
    .toBuffer();
  
  return await sharp(dilated)
    .composite([{ input: original, blend: 'dest-out' }])
    .negate({ alpha: false })
    .tint(outlineColor)
    .toBuffer();
}

async function pixelSort(imageBuffer, sortMode = 'brightness') {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: data[i + 3],
      index: i
    });
  }

  pixels.sort((a, b) => {
    if (sortMode === 'brightness') {
      return ((a.r + a.g + a.b) / 3) - ((b.r + b.g + b.b) / 3);
    }
    return a.r - b.r;
  });

  const sortedData = Buffer.from(data);
  pixels.forEach((pixel, idx) => {
    const targetIdx = idx * 4;
    sortedData[targetIdx] = pixel.r;
    sortedData[targetIdx + 1] = pixel.g;
    sortedData[targetIdx + 2] = pixel.b;
    sortedData[targetIdx + 3] = pixel.a;
  });

  return await sharp(sortedData, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).toBuffer();
}

async function addNoise(imageBuffer, noiseAmount = 10) {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // Only add noise to non-transparent pixels
      const noise = (Math.random() * 2 - 1) * noiseAmount;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }

  return await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).toBuffer();
}

// New utility functions
async function extractPalette(imageBuffer, maxColors = 16) {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const colorMap = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // Skip transparent pixels
      const color = `${data[i]},${data[i + 1]},${data[i + 2]}`;
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }
  }
  
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map(([color]) => color.split(',').map(Number));
}

async function pixelPerfectScale(imageBuffer, scale = 2) {
  const metadata = await sharp(imageBuffer).metadata();
  return await sharp(imageBuffer)
    .resize(metadata.width * scale, metadata.height * scale, {
      kernel: 'nearest'
    })
    .toBuffer();
}

async function generateShadow(imageBuffer, shadowOptions = {}) {
  const { 
    opacity = 0.5,
    blur = 3,
    offsetX = 5,
    offsetY = 5,
    color = { r: 0, g: 0, b: 0 }
  } = shadowOptions;

  const shadow = await sharp(imageBuffer)
    .negate()
    .linear(opacity, 0)
    .blur(blur)
    .tint(color)
    .extend({
      top: Math.max(0, -offsetY),
      bottom: Math.max(0, offsetY),
      left: Math.max(0, -offsetX),
      right: Math.max(0, offsetX),
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  return await sharp(shadow)
    .composite([{ 
      input: imageBuffer,
      top: Math.max(0, offsetY),
      left: Math.max(0, offsetX)
    }])
    .toBuffer();
}

async function createMirrorEffect(imageBuffer, direction = 'horizontal', fade = true) {
  const original = await sharp(imageBuffer).toBuffer();
  const flipped = await sharp(imageBuffer)
    .flip(direction === 'vertical')
    .flop(direction === 'horizontal')
    .toBuffer();

  if (fade) {
    return await sharp(flipped)
      .linear(0.5, 0)
      .composite([{ input: original }])
      .toBuffer();
  }
  return await sharp(original)
    .composite([{ input: flipped }])
    .toBuffer();
}

async function interpolateFrames(frame1Buffer, frame2Buffer, steps = 5) {
  const frames = [];
  for (let i = 0; i <= steps; i++) {
    const opacity = i / steps;
    const frame = await sharp(frame1Buffer)
      .composite([{
        input: frame2Buffer,
        blend: 'over',
        linear: opacity
      }])
      .toBuffer();
    frames.push(frame);
  }
  return frames;
}

async function createReflection(imageBuffer, reflectionOptions = {}) {
  const {
    opacity = 0.3,
    fade = true,
    flipY = true,
    height = 0.5, // percentage of original height
    offset = 0
  } = reflectionOptions;

  const metadata = await sharp(imageBuffer).metadata();
  const reflectionHeight = Math.round(metadata.height * height);

  // Create the reflection
  let reflection = await sharp(imageBuffer)
    .flip(flipY)
    .resize({ height: reflectionHeight, fit: 'contain' })
    .toBuffer();

  if (fade) {
    // Create a gradient for fading
    const gradient = Buffer.alloc(metadata.width * reflectionHeight * 4);
    for (let y = 0; y < reflectionHeight; y++) {
      const alpha = Math.round(255 * (1 - (y / reflectionHeight)) * opacity);
      for (let x = 0; x < metadata.width; x++) {
        const idx = (y * metadata.width + x) * 4;
        gradient[idx + 3] = alpha;
      }
    }

    reflection = await sharp(reflection)
      .composite([{
        input: {
          create: {
            width: metadata.width,
            height: reflectionHeight,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
        },
        blend: 'multiply',
        raw: {
          width: metadata.width,
          height: reflectionHeight,
          channels: 4
        },
        data: gradient
      }])
      .toBuffer();
  }

  // Combine original image with reflection
  return await sharp(imageBuffer)
    .extend({
      bottom: reflectionHeight + offset,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .composite([{
      input: reflection,
      top: metadata.height + offset
    }])
    .toBuffer();
}

async function createWaveDistortion(imageBuffer, waveOptions = {}) {
  const {
    amplitude = 10,
    frequency = 0.1,
    phase = 0,
    direction = 'horizontal',
    animationFrames = 1
  } = waveOptions;

  const metadata = await sharp(imageBuffer).metadata();
  const frames = [];

  for (let frame = 0; frame < animationFrames; frame++) {
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const newData = Buffer.alloc(data.length);
    const framePhase = phase + (frame * Math.PI * 2 / animationFrames);

    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const sourceIdx = (y * info.width + x) * 4;
        
        // Skip if pixel is fully transparent
        if (data[sourceIdx + 3] === 0) {
          newData[sourceIdx] = 0;
          newData[sourceIdx + 1] = 0;
          newData[sourceIdx + 2] = 0;
          newData[sourceIdx + 3] = 0;
          continue;
        }

        // Calculate wave offset
        const waveOffset = Math.sin(
          (direction === 'horizontal' ? y : x) * frequency + framePhase
        ) * amplitude;

        // Apply offset
        const targetX = Math.round(x + (direction === 'horizontal' ? waveOffset : 0));
        const targetY = Math.round(y + (direction === 'vertical' ? waveOffset : 0));

        // Check bounds
        if (targetX >= 0 && targetX < info.width && targetY >= 0 && targetY < info.height) {
          const targetIdx = (targetY * info.width + targetX) * 4;
          newData[targetIdx] = data[sourceIdx];
          newData[targetIdx + 1] = data[sourceIdx + 1];
          newData[targetIdx + 2] = data[sourceIdx + 2];
          newData[targetIdx + 3] = data[sourceIdx + 3];
        }
      }
    }

    const frame = await sharp(newData, {
      raw: { width: info.width, height: info.height, channels: 4 }
    }).toBuffer();

    frames.push(frame);
  }

  return frames;
}

async function createPixelationEffect(imageBuffer, pixelationOptions = {}) {
  const {
    pixelSize = 8,
    preserveAlpha = true,
    mode = 'average'  // 'average' or 'dominant'
  } = pixelationOptions;

  const metadata = await sharp(imageBuffer).metadata();
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Calculate new dimensions
  const blockWidth = Math.max(1, Math.floor(info.width / pixelSize));
  const blockHeight = Math.max(1, Math.floor(info.height / pixelSize));

  const newData = Buffer.alloc(data.length);

  for (let blockY = 0; blockY < blockHeight; blockY++) {
    for (let blockX = 0; blockX < blockWidth; blockX++) {
      const colors = [];
      const alphas = [];

      // Sample pixels in this block
      for (let y = blockY * pixelSize; y < Math.min((blockY + 1) * pixelSize, info.height); y++) {
        for (let x = blockX * pixelSize; x < Math.min((blockX + 1) * pixelSize, info.width); x++) {
          const idx = (y * info.width + x) * 4;
          if (data[idx + 3] > 0) { // Only consider non-transparent pixels
            colors.push({
              r: data[idx],
              g: data[idx + 1],
              b: data[idx + 2]
            });
            alphas.push(data[idx + 3]);
          }
        }
      }

      // Calculate block color
      let blockColor;
      if (mode === 'dominant' && colors.length > 0) {
        // Simple mode: use the most frequent color
        const colorMap = new Map();
        colors.forEach(c => {
          const key = `${c.r},${c.g},${c.b}`;
          colorMap.set(key, (colorMap.get(key) || 0) + 1);
        });
        const dominant = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])[0][0]
          .split(',')
          .map(Number);
        blockColor = { r: dominant[0], g: dominant[1], b: dominant[2] };
      } else {
        // Average mode
        blockColor = colors.reduce((acc, c) => ({
          r: acc.r + c.r / colors.length,
          g: acc.g + c.g / colors.length,
          b: acc.b + c.b / colors.length
        }), { r: 0, g: 0, b: 0 });
      }

      // Calculate block alpha
      const blockAlpha = preserveAlpha
        ? alphas.reduce((a, b) => a + b, 0) / alphas.length
        : Math.max(...alphas);

      // Fill the block with the calculated color
      for (let y = blockY * pixelSize; y < Math.min((blockY + 1) * pixelSize, info.height); y++) {
        for (let x = blockX * pixelSize; x < Math.min((blockX + 1) * pixelSize, info.width); x++) {
          const idx = (y * info.width + x) * 4;
          newData[idx] = Math.round(blockColor.r);
          newData[idx + 1] = Math.round(blockColor.g);
          newData[idx + 2] = Math.round(blockColor.b);
          newData[idx + 3] = Math.round(blockAlpha || 0);
        }
      }
    }
  }

  return await sharp(newData, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).toBuffer();
}

async function createMosaicEffect(imageBuffer, mosaicOptions = {}) {
  const {
    tileSize = 32,          // Size of each tile
    columns = 3,            // Number of columns in the mosaic
    rows = 3,               // Number of rows in the mosaic
    rotation = true,        // Whether to randomly rotate tiles
    scale = true,          // Whether to randomly scale tiles
    spacing = 0            // Spacing between tiles
  } = mosaicOptions;

  const metadata = await sharp(imageBuffer).metadata();
  const fullWidth = (tileSize * columns) + (spacing * (columns - 1));
  const fullHeight = (tileSize * rows) + (spacing * (rows - 1));

  // Create base canvas
  const canvas = {
    create: {
      width: fullWidth,
      height: fullHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  };

  // Prepare tile overlays
  const overlays = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      let tile = await sharp(imageBuffer)
        .resize(tileSize, tileSize, { fit: 'contain' });

      // Apply random rotation if enabled
      if (rotation) {
        const angle = Math.floor(Math.random() * 4) * 90;
        tile = tile.rotate(angle);
      }

      // Apply random scale if enabled
      if (scale) {
        const scaleFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        tile = tile.resize(
          Math.round(tileSize * scaleFactor),
          Math.round(tileSize * scaleFactor),
          { fit: 'contain' }
        );
      }

      const tileBuffer = await tile.toBuffer();

      overlays.push({
        input: tileBuffer,
        left: col * (tileSize + spacing) + (tileSize - metadata.width) / 2,
        top: row * (tileSize + spacing) + (tileSize - metadata.height) / 2
      });
    }
  }

  // Combine all tiles
  return await sharp(canvas)
    .composite(overlays)
    .toBuffer();
}

async function createDissolveEffect(imageBuffer, dissolveOptions = {}) {
  const {
    steps = 10,           // Number of dissolution steps
    pattern = 'random',   // 'random', 'cellular', or 'gradient'
    direction = 'out',    // 'in' or 'out'
    seed = Date.now()     // Random seed for reproducible patterns
  } = dissolveOptions;

  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const frames = [];
  const rng = new Math.seedrandom(seed);

  // Create dissolution map
  const dissolutionMap = new Float32Array(info.width * info.height);
  switch (pattern) {
    case 'cellular':
      // Create cellular noise pattern
      const points = Array(20).fill().map(() => ({
        x: Math.floor(rng() * info.width),
        y: Math.floor(rng() * info.height)
      }));
      
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          const minDist = Math.min(...points.map(p => 
            Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2))
          ));
          dissolutionMap[y * info.width + x] = minDist / Math.sqrt(info.width * info.height);
        }
      }
      break;

    case 'gradient':
      // Create linear gradient
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          dissolutionMap[y * info.width + x] = y / info.height;
        }
      }
      break;

    default: // random
      for (let i = 0; i < dissolutionMap.length; i++) {
        dissolutionMap[i] = rng();
      }
  }

  // Generate frames
  for (let step = 0; step < steps; step++) {
    const threshold = direction === 'in' ? step / steps : 1 - (step / steps);
    const frameData = Buffer.alloc(data.length);

    for (let i = 0; i < dissolutionMap.length; i++) {
      const pixelIndex = i * 4;
      if (dissolutionMap[i] < threshold) {
        frameData[pixelIndex] = data[pixelIndex];
        frameData[pixelIndex + 1] = data[pixelIndex + 1];
        frameData[pixelIndex + 2] = data[pixelIndex + 2];
        frameData[pixelIndex + 3] = data[pixelIndex + 3];
      } else {
        frameData[pixelIndex + 3] = 0; // Transparent
      }
    }

    const frame = await sharp(frameData, {
      raw: { width: info.width, height: info.height, channels: 4 }
    }).toBuffer();

    frames.push(frame);
  }

  return frames;
}

async function createSplashEffect(imageBuffer, splashOptions = {}) {
  const {
    intensity = 30,        // Intensity of the splash distortion
    rippleCount = 3,       // Number of ripple rings
    frames = 10,           // Number of animation frames
    speed = 1,            // Speed of ripple expansion
    center = null         // Custom center point, or null for center
  } = splashOptions;

  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const centerX = center?.x || Math.floor(info.width / 2);
  const centerY = center?.y || Math.floor(info.height / 2);
  const animationFrames = [];

  for (let frame = 0; frame < frames; frame++) {
    const frameData = Buffer.alloc(data.length);
    const time = frame / frames;

    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate ripple displacement
        let offset = 0;
        for (let i = 0; i < rippleCount; i++) {
          const ripplePhase = (distance / 50 - time * speed) * Math.PI * 2;
          offset += Math.sin(ripplePhase + i * Math.PI / rippleCount) 
                   * intensity 
                   * Math.exp(-distance / (info.width / 2))
                   * (1 - time);
        }

        // Calculate source pixel position with ripple effect
        const angle = Math.atan2(dy, dx);
        const sourceX = Math.round(x + Math.cos(angle) * offset);
        const sourceY = Math.round(y + Math.sin(angle) * offset);

        // Copy pixel if within bounds
        if (sourceX >= 0 && sourceX < info.width && sourceY >= 0 && sourceY < info.height) {
          const sourceIdx = (sourceY * info.width + sourceX) * 4;
          const targetIdx = (y * info.width + x) * 4;
          frameData[targetIdx] = data[sourceIdx];
          frameData[targetIdx + 1] = data[sourceIdx + 1];
          frameData[targetIdx + 2] = data[sourceIdx + 2];
          frameData[targetIdx + 3] = data[sourceIdx + 3];
        }
      }
    }

    const frame = await sharp(frameData, {
      raw: { width: info.width, height: info.height, channels: 4 }
    }).toBuffer();

    animationFrames.push(frame);
  }

  return animationFrames;
}

async function createShatterEffect(imageBuffer, shatterOptions = {}) {
  const {
    pieces = 12,           // Number of shatter pieces
    spread = 100,          // How far pieces spread
    rotation = true,       // Whether pieces should rotate
    gravity = 0.5,        // Gravity effect on pieces
    frames = 15,          // Number of animation frames
    pattern = 'radial'    // 'radial' or 'grid'
  } = shatterOptions;

  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const centerX = info.width / 2;
  const centerY = info.height / 2;
  const animationFrames = [];

  // Generate shatter pieces
  const shatterPieces = [];
  if (pattern === 'grid') {
    const cols = Math.floor(Math.sqrt(pieces));
    const rows = Math.ceil(pieces / cols);
    const pieceWidth = Math.floor(info.width / cols);
    const pieceHeight = Math.floor(info.height / rows);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (shatterPieces.length < pieces) {
          const piece = {
            x: x * pieceWidth,
            y: y * pieceHeight,
            width: pieceWidth,
            height: pieceHeight,
            rotation: rotation ? Math.random() * 360 : 0,
            velocityX: (Math.random() - 0.5) * spread,
            velocityY: (Math.random() - 0.5) * spread,
            data: Buffer.alloc(pieceWidth * pieceHeight * 4)
          };
          
          // Copy piece data
          for (let py = 0; py < pieceHeight; py++) {
            for (let px = 0; px < pieceWidth; px++) {
              const sourceIdx = ((y * pieceHeight + py) * info.width + (x * pieceWidth + px)) * 4;
              const targetIdx = (py * pieceWidth + px) * 4;
              piece.data[targetIdx] = data[sourceIdx];
              piece.data[targetIdx + 1] = data[sourceIdx + 1];
              piece.data[targetIdx + 2] = data[sourceIdx + 2];
              piece.data[targetIdx + 3] = data[sourceIdx + 3];
            }
          }
          shatterPieces.push(piece);
        }
      }
    }
  } else { // radial
    const angleStep = (Math.PI * 2) / pieces;
    const radius = Math.min(info.width, info.height) / 4;
    
    for (let i = 0; i < pieces; i++) {
      const angle = angleStep * i;
      const pieceWidth = Math.floor(info.width / Math.sqrt(pieces));
      const pieceHeight = Math.floor(info.height / Math.sqrt(pieces));
      const centerPieceX = centerX + Math.cos(angle) * radius;
      const centerPieceY = centerY + Math.sin(angle) * radius;
      
      const piece = {
        x: Math.floor(centerPieceX - pieceWidth / 2),
        y: Math.floor(centerPieceY - pieceHeight / 2),
        width: pieceWidth,
        height: pieceHeight,
        rotation: rotation ? Math.random() * 360 : 0,
        velocityX: Math.cos(angle) * spread,
        velocityY: Math.sin(angle) * spread,
        data: Buffer.alloc(pieceWidth * pieceHeight * 4)
      };
      
      // Copy piece data
      for (let y = 0; y < pieceHeight; y++) {
        for (let x = 0; x < pieceWidth; x++) {
          const sourceX = Math.min(Math.max(Math.floor(piece.x + x), 0), info.width - 1);
          const sourceY = Math.min(Math.max(Math.floor(piece.y + y), 0), info.height - 1);
          const sourceIdx = (sourceY * info.width + sourceX) * 4;
          const targetIdx = (y * pieceWidth + x) * 4;
          piece.data[targetIdx] = data[sourceIdx];
          piece.data[targetIdx + 1] = data[sourceIdx + 1];
          piece.data[targetIdx + 2] = data[sourceIdx + 2];
          piece.data[targetIdx + 3] = data[sourceIdx + 3];
        }
      }
      shatterPieces.push(piece);
    }
  }

  // Generate animation frames
  for (let frame = 0; frame < frames; frame++) {
    const frameData = Buffer.alloc(data.length);
    const progress = frame / frames;
    
    // Update and draw pieces
    shatterPieces.forEach(piece => {
      // Update position
      piece.x += piece.velocityX * progress;
      piece.y += piece.velocityY * progress + (gravity * progress * progress * 50);
      piece.rotation += rotation ? 5 : 0;
      
      // Draw piece
      const transform = sharp(piece.data, {
        raw: { width: piece.width, height: piece.height, channels: 4 }
      })
        .rotate(piece.rotation)
        .resize(piece.width, piece.height, { fit: 'contain' });
      
      // Composite piece onto frame
      const pieceBuffer = transform.toBuffer();
      const composite = [{
        input: pieceBuffer,
        top: Math.round(piece.y),
        left: Math.round(piece.x)
      }];
      
      sharp(frameData, { raw: { width: info.width, height: info.height, channels: 4 } })
        .composite(composite)
        .toBuffer()
        .then(composited => {
          frameData.set(composited);
        });
    });

    const frame = await sharp(frameData, {
      raw: { width: info.width, height: info.height, channels: 4 }
    }).toBuffer();

    animationFrames.push(frame);
  }

  return animationFrames;
}

async function createKaleidoscopeEffect(imageBuffer, kaleidoscopeOptions = {}) {
  const {
    segments = 8,           // Number of repeated segments
    rotation = 0,          // Base rotation angle
    zoom = 1.0,           // Zoom factor
    centerX = 0.5,        // Center point X (0-1)
    centerY = 0.5,        // Center point Y (0-1)
    frames = 1            // Number of animation frames
  } = kaleidoscopeOptions;

  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const animationFrames = [];
  const angleStep = (Math.PI * 2) / segments;
  
  for (let frame = 0; frame < frames; frame++) {
    const frameData = Buffer.alloc(data.length);
    const frameRotation = rotation + (frame * Math.PI * 2 / frames);
    
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        // Convert to polar coordinates relative to center
        const dx = (x / info.width - centerX) / zoom;
        const dy = (y / info.height - centerY) / zoom;
        const r = Math.sqrt(dx * dx + dy * dy);
        let theta = Math.atan2(dy, dx) - frameRotation;
        
        // Wrap angle to segment
        theta = (theta % angleStep + angleStep) % angleStep;
        if (theta > angleStep / 2) {
          theta = angleStep - theta; // Mirror within segment
        }
        
        // Convert back to cartesian coordinates
        const sourceX = Math.round((r * Math.cos(theta + frameRotation) * zoom + centerX) * info.width);
        const sourceY = Math.round((r * Math.sin(theta + frameRotation) * zoom + centerY) * info.height);
        
        // Copy pixel if within bounds
        if (sourceX >= 0 && sourceX < info.width && sourceY >= 0 && sourceY < info.height) {
          const sourceIdx = (sourceY * info.width + sourceX) * 4;
          const targetIdx = (y * info.width + x) * 4;
          frameData[targetIdx] = data[sourceIdx];
          frameData[targetIdx + 1] = data[sourceIdx + 1];
          frameData[targetIdx + 2] = data[sourceIdx + 2];
          frameData[targetIdx + 3] = data[sourceIdx + 3];
        }
      }
    }
    
    const frame = await sharp(frameData, {
      raw: { width: info.width, height: info.height, channels: 4 }
    }).toBuffer();
    
    animationFrames.push(frame);
  }
  
  return animationFrames;
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
    },

    async addOutline(description, outlineOptions = {}, options = {}) {
        const baseSprite = await this.generatePixelArt(description, options);
        const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
        
        const outlined = await generateOutline(imgBuffer, 
            outlineOptions.color || { r: 0, g: 0, b: 0, alpha: 255 },
            outlineOptions.thickness || 1
        );
        
        return {
            original: baseSprite.image,
            outlined: `data:image/png;base64,${outlined.toString('base64')}`
        };
    },

    async createGlitchArt(description, glitchOptions = {}, options = {}) {
        const baseSprite = await this.generatePixelArt(description, options);
        const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
        
        const sorted = await pixelSort(imgBuffer, glitchOptions.sortMode || 'brightness');
        const noisy = await addNoise(sorted, glitchOptions.noiseAmount || 10);
        
        return {
            original: baseSprite.image,
            glitched: `data:image/png;base64,${noisy.toString('base64')}`
        };
    },

    async generateSpriteVariations(description, variations = 3, options = {}) {
        const results = await Promise.all(Array(variations).fill().map(async () => {
            const sprite = await this.generatePixelArt(description, options);
            return sprite.image;
        }));

        return {
            variations: results,
            count: variations
        };
    },

    async optimizePalette(description, maxColors = 16, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const palette = await extractPalette(imgBuffer, maxColors);
      
      return {
        original: baseSprite.image,
        palette,
        paletteSize: palette.length
      };
    },

    async createPixelPerfect(description, scale = 2, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const scaled = await pixelPerfectScale(imgBuffer, scale);
      
      return {
        original: baseSprite.image,
        scaled: `data:image/png;base64,${scaled.toString('base64')}`
      };
    },

    async addShadow(description, shadowOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const withShadow = await generateShadow(imgBuffer, shadowOptions);
      
      return {
        original: baseSprite.image,
        withShadow: `data:image/png;base64,${withShadow.toString('base64')}`
      };
    },

    async createMirrorSprite(description, direction = 'horizontal', options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const mirrored = await createMirrorEffect(imgBuffer, direction, options.fade);
      
      return {
        original: baseSprite.image,
        mirrored: `data:image/png;base64,${mirrored.toString('base64')}`
      };
    },

    async createSpriteAnimation(description, frameCount = 2, options = {}) {
      const frames = await Promise.all(
        Array(frameCount).fill().map(() => this.generatePixelArt(description, options))
      );
      
      const interpolatedFrames = [];
      for (let i = 0; i < frames.length - 1; i++) {
        const buffer1 = Buffer.from(frames[i].image.split(',')[1], 'base64');
        const buffer2 = Buffer.from(frames[i + 1].image.split(',')[1], 'base64');
        const tweens = await interpolateFrames(buffer1, buffer2, options.steps || 3);
        interpolatedFrames.push(...tweens.map(f => `data:image/png;base64,${f.toString('base64')}`));
      }
      
      return {
        originalFrames: frames.map(f => f.image),
        interpolatedFrames,
        totalFrames: interpolatedFrames.length
      };
    },

    async addReflectionEffect(description, reflectionOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const withReflection = await createReflection(imgBuffer, reflectionOptions);
      
      return {
        original: baseSprite.image,
        withReflection: `data:image/png;base64,${withReflection.toString('base64')}`
      };
    },

    async addWaveEffect(description, waveOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const waveFrames = await createWaveDistortion(imgBuffer, waveOptions);
      
      return {
        original: baseSprite.image,
        waveFrames: waveFrames.map(f => `data:image/png;base64,${f.toString('base64')}`),
        frameCount: waveFrames.length
      };
    },

    async addPixelationEffect(description, pixelationOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const pixelated = await createPixelationEffect(imgBuffer, pixelationOptions);
      
      return {
        original: baseSprite.image,
        pixelated: `data:image/png;base64,${pixelated.toString('base64')}`,
        settings: {
          pixelSize: pixelationOptions.pixelSize || 8,
          mode: pixelationOptions.mode || 'average'
        }
      };
    },

    async addMosaicEffect(description, mosaicOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const mosaic = await createMosaicEffect(imgBuffer, mosaicOptions);
      
      return {
        original: baseSprite.image,
        mosaic: `data:image/png;base64,${mosaic.toString('base64')}`,
        settings: {
          tileSize: mosaicOptions.tileSize || 32,
          columns: mosaicOptions.columns || 3,
          rows: mosaicOptions.rows || 3
        }
      };
    },

    async addDissolveEffect(description, dissolveOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const dissolveFrames = await createDissolveEffect(imgBuffer, dissolveOptions);
      
      return {
        original: baseSprite.image,
        dissolveFrames: dissolveFrames.map(f => `data:image/png;base64,${f.toString('base64')}`),
        settings: {
          steps: dissolveOptions.steps || 10,
          pattern: dissolveOptions.pattern || 'random',
          direction: dissolveOptions.direction || 'out'
        }
      };
    },

    async addSplashEffect(description, splashOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const splashFrames = await createSplashEffect(imgBuffer, splashOptions);
      
      return {
        original: baseSprite.image,
        splashFrames: splashFrames.map(f => `data:image/png;base64,${f.toString('base64')}`),
        settings: {
          intensity: splashOptions.intensity || 30,
          rippleCount: splashOptions.rippleCount || 3,
          frames: splashOptions.frames || 10,
          speed: splashOptions.speed || 1
        }
      };
    },

    async addShatterEffect(description, shatterOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const shatterFrames = await createShatterEffect(imgBuffer, shatterOptions);
      
      return {
        original: baseSprite.image,
        shatterFrames: shatterFrames.map(f => `data:image/png;base64,${f.toString('base64')}`),
        settings: {
          pieces: shatterOptions.pieces || 12,
          spread: shatterOptions.spread || 100,
          frames: shatterOptions.frames || 15,
          pattern: shatterOptions.pattern || 'radial'
        }
      };
    }, //lol yeah

    async addKaleidoscopeEffect(description, kaleidoscopeOptions = {}, options = {}) {
      const baseSprite = await this.generatePixelArt(description, options);
      const imgBuffer = Buffer.from(baseSprite.image.split(',')[1], 'base64');
      const kaleidoscopeFrames = await createKaleidoscopeEffect(imgBuffer, kaleidoscopeOptions);
      
      return {
        original: baseSprite.image,
        kaleidoscopeFrames: kaleidoscopeFrames.map(f => `data:image/png;base64,${f.toString('base64')}`),
        settings: {
          segments: kaleidoscopeOptions.segments || 8,
          rotation: kaleidoscopeOptions.rotation || 0,
          zoom: kaleidoscopeOptions.zoom || 1.0,
          frames: kaleidoscopeOptions.frames || 1
        }
      };
    },
};
