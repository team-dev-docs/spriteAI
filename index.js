import OpenAI from "openai";
import axios from "axios";
import sharp from "sharp";
import Jimp from "jimp";
import fs from "fs"
import path from "path";




async function removeBackgroundColor(inputPath, outputPath, targetColor, colorThreshold = 0) {
    const image = await Jimp.read(inputPath);

    // Define the color you want to replace (e.g., white)
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

    await image.writeAsync(outputPath);
}

function encodeImage(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
  }



async function getUniqueColors(imagePath) {
    const image = await Jimp.read(imagePath);
    const colorSet = new Set();
  
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

// Usage


export const sprite = {
    async generateSprite(description, options = {}) {
        const openAiObject = new OpenAI();
        const dalle3 = openAiObject.images
        const response = await dalle3.generate({
            model: "dall-e-3",
            prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS. Generate a 24 bit character spritesheet with at least 7 frames of ${description} walking.  
            Make sure all frames fit in the image and are the same size.
            `,
            n: 1,
            size: options?.size || "1024x1024",
          });
          console.log(response)

  
        //   console.log("this is the result", result.choices)
          console.log(response.data[0])
          const res = await axios.get(response.data[0].url, { responseType: 'arraybuffer' });
          const imgBuffer = Buffer.from(res.data)
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


   
          return {messages: jsonFrameResponse.choices[0].message, image: imageDataUrl}
        //   image_url = response.data.data[0].url;
        //   return image_url
    },
    async generateHouseAsset(description, options) {
        const dalle3 = openAiObject.images
        const response = await dalle3.generate({
            model: "dall-e-3",
            prompt: `Generate a 2D asset that I could use with a phaser JS game depitcing a (an) ${description}.
            `,
            n: 1,
            size: options?.size || "1024x1024",
          });
          console.log(response)
    }
}



