# Troubleshooting Guide for SpriteAI Library

This guide addresses common issues you might encounter when using the SpriteAI library. It covers API errors, image processing problems, and unexpected output. Follow the step-by-step solutions and explanations for each issue.

## Table of Contents
1. [API Errors](#api-errors)
2. [Image Processing Problems](#image-processing-problems)
3. [Unexpected Output](#unexpected-output)

## API Errors

### Error: OpenAI API Key Not Found

**Problem**: The library fails to connect to the OpenAI API, throwing an error about missing API key.

**Solution**:
1. Ensure you have set up your OpenAI API key correctly.
2. Check if the API key is properly set in your environment variables:
   ```
   export OPENAI_API_KEY='your-api-key-here'
   ```
3. If using a configuration file, verify that the API key is correctly specified.

### Error: Invalid API Key

**Problem**: The library reports an invalid API key error when trying to generate images.

**Solution**:
1. Double-check your API key for any typos or extra spaces.
2. Ensure you're using the correct API key for the OpenAI service.
3. Verify that your OpenAI account is active and has sufficient credits.

## Image Processing Problems

### Error: Unable to Process Generated Image

**Problem**: The library successfully generates an image but fails during the processing step.

**Solution**:
1. Check if you have the required dependencies installed:
   ```
   npm install sharp jimp
   ```
2. Ensure you have write permissions in the directory where you're trying to save the image.
3. Verify that the generated image URL is accessible and valid.

### Error: Background Removal Failure

**Problem**: The `removeBackgroundColor` function is not removing the background as expected.

**Solution**:
1. Check if you're providing the correct color to remove:
   ```javascript
   await removeBackgroundColor(inputPath, outputPath, '#FFFFFF', 0.1);
   ```
2. Adjust the `colorThreshold` parameter to be more lenient if needed.
3. Ensure the input image has a consistent background color.

## Unexpected Output

### Issue: Inconsistent Character Size in Spritesheet

**Problem**: The generated character spritesheet has inconsistent character sizes across frames.

**Solution**:
1. Refine your prompt to emphasize consistent character size:
   ```javascript
   const prompt = `Create a ${style} character spritesheet of ${description} with these animation states: ${statesDescription}.
     Each row should be a different animation state with ${framesPerState} frames.
     Character should face ${direction}.
     Style requirements:
     - Clean pixel art style
     - Strictly consistent character size and proportions across all frames
     - White background
     - Clear separation between frames
     - ${states.length} rows of animations
     - ${framesPerState} frames per row
     - Each row represents a different animation state in sequence`;
   ```
2. If the issue persists, try generating the spritesheet with fewer frames or states and manually adjust if needed.

### Issue: Unexpected Art Style

**Problem**: The generated sprites don't match the requested art style.

**Solution**:
1. Be more specific in your style description:
   ```javascript
   const style = 'pixel-art with 16x16 pixel characters';
   ```
2. Provide example images or references in your prompt if possible.
3. Experiment with different prompts to find the one that produces the desired style consistently.

### Issue: Missing Animation States

**Problem**: Some requested animation states are missing from the generated spritesheet.

**Solution**:
1. Verify that you're not exceeding the maximum number of states the model can handle in a single generation.
2. Break down complex spritesheets into multiple generations if needed.
3. Use the `fetchAvailableAnimationStates` function to check supported states:
   ```javascript
   const availableStates = await fetchAvailableAnimationStates();
   console.log(availableStates);
   ```

If you encounter any issues not covered in this guide, please refer to the API documentation or reach out to our support team for further assistance.