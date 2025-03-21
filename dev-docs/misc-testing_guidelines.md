# Testing Approach

This project uses Jest as the testing framework for writing and running unit tests. The tests are located in the `tests` directory and follow a consistent structure and naming convention.

## Writing Tests

To write tests for this project:

1. Create a new test file in the `tests` directory with the naming convention `[feature].test.js`
2. Import the necessary modules and functions to be tested
3. Use Jest's `describe` and `it` blocks to organize and write your test cases
4. Use Jest's assertion methods like `expect()` to verify the behavior of your code

Here's an example structure for a test file:

```javascript
const { functionToTest } = require('./index');

describe('Feature Name', () => {
  describe('functionToTest', () => {
    it('should do something specific', () => {
      // Test setup
      const input = ...;
      const expectedOutput = ...;

      // Call the function
      const result = functionToTest(input);

      // Assert the result
      expect(result).toEqual(expectedOutput);
    });

    // More test cases...
  });
});
```

## Running Tests

To run the tests:

1. Make sure you have all dependencies installed by running `npm install`
2. Run `npm test` in the terminal from the project root directory

This will execute all test files in the `tests` directory.

## Example: Image Processing Tests

Let's look at an example from the `removeBackground.test.js` file:

```javascript
const removeBackgroundColor = require('./index').removeBackgroundColor;

describe('removeBackgroundColor', () => {
  // ... setup code ...

  it('should remove the background color from the input image', async () => {
    const targetColor = '#FFFFFF'; // White
    const colorThreshold = 0;

    await removeBackgroundColor(inputPath, outputPath, targetColor, colorThreshold);

    const expectedOutput = await Jimp.read(expectedOutputPath);
    const actualOutput = await Jimp.read(outputPath);

    expect(expectedOutput.bitmap.data).toEqual(actualOutput.bitmap.data);
  });

  // ... more test cases ...
});
```

This test:
1. Sets up the test environment
2. Calls the `removeBackgroundColor` function with specific parameters
3. Compares the resulting image with an expected output
4. Uses `expect()` to assert that the image data matches the expected result

## Example: Sprite Generation Tests

Here's an example from the `sprite.test.js` file:

```javascript
const sprite = require('./index').sprite;

describe('sprite', () => {
  describe('generateSprite', () => {
    it('should generate a sprite with the correct frame dimensions', async () => {
      const description = 'knight';
      const options = { iterations: 1 };
      const result = await sprite.generateSprite(description, options);

      expect(result).toBeDefined();
      expect(result.length).toBe(1);

      const { messages, image } = result[0];
      expect(messages).toBeDefined();
      expect(image).toBeDefined();

      const frameInfo = JSON.parse(messages.content);
      expect(frameInfo).toHaveProperty('frameWidth');
      expect(frameInfo).toHaveProperty('frameHeight');

      const buffer = Buffer.from(image.split(',')[1], 'base64');
      const imageData = await sharp(buffer).metadata();
      expect(imageData.width).toBe(1024);
      expect(imageData.height).toBe(1024);
    });

    // ... more test cases ...
  });
});
```

This test:
1. Calls the `generateSprite` function with a description and options
2. Verifies that the result has the expected structure
3. Checks the generated image dimensions
4. Uses multiple `expect()` statements to assert various properties of the result

By following these examples and the overall testing approach, you can write comprehensive tests for your project's functionality.