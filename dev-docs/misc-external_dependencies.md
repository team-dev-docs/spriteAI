# External Dependencies

This project relies on several external libraries to enhance its functionality. Here's an overview of the main dependencies, their purposes, and how they are integrated into the codebase:

## OpenAI

**Purpose:** Enables interaction with OpenAI's API for image generation.

**Integration:** The project uses the OpenAI SDK to generate images based on text prompts. It's primarily used in the `generateCharacterSpritesheet` and `generateLandscapeSprite` functions to create pixel art character spritesheets and landscape sprites.

```javascript
import OpenAI from "openai";

const openAiObject = new OpenAI();
const response = await openAiObject.images.generate({
  model: "dall-e-3",
  prompt: prompt,
  size: size,
  n: 1
});
```

## Axios

**Purpose:** Facilitates HTTP requests to download generated images.

**Integration:** After generating images with OpenAI, Axios is used to download the resulting image data. This allows the project to process and manipulate the images locally.

```javascript
import axios from "axios";

const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
const imgBuffer = Buffer.from(res.data);
```

## Sharp

**Purpose:** Provides image processing capabilities for resizing, formatting, and saving images.

**Integration:** Sharp is used to process the generated images, particularly for saving the final spritesheet to a file.

```javascript
import sharp from "sharp";

await sharp(spritesheet).toFile(filename);
```

## Jimp

**Purpose:** Offers image manipulation functions, specifically used for removing background colors.

**Integration:** Jimp is utilized in the `removeBackgroundColor` function to process images pixel by pixel and remove specific background colors.

```javascript
import Jimp from "jimp";

const image = await Jimp.read(inputPath);
image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
  // Image processing logic
});
```

## fs (File System)

**Purpose:** Provides file system operations for reading and writing files.

**Integration:** While not an external dependency (it's a Node.js built-in module), `fs` is used for file operations such as creating directories, saving files, and cleaning up temporary files.

```javascript
import fs from "fs";

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}
```

## path

**Purpose:** Offers utilities for working with file and directory paths.

**Integration:** Similar to `fs`, `path` is a Node.js built-in module used to handle file paths in a cross-platform manner.

```javascript
import path from "path";

const filename = path.join(assetsDir, `${description.replace(/\s+/g, '_')}_landscape.png`);
```

These dependencies are essential for the project's core functionalities, enabling image generation, manipulation, and file handling. They are integrated seamlessly into the codebase to provide a robust set of tools for creating and processing game-ready sprite assets.