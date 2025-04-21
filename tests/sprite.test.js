const sprite = require('./index').sprite;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { generateEnvironmentSprites, generateItemSprites, fetchAvailableAnimationStates, fetchAvailableSpriteStyles } = require('../spriteAI/index');

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

    // Add more test cases as needed
  });

  describe('generateHouseAsset', () => {
    it('should generate a house asset', async () => {
      const description = 'house';
      const options = { iterations: 1 };
      const result = await sprite.generateHouseAsset(description, options);

      expect(result).toBeDefined();
      expect(result.length).toBe(1);

      const asset = result[0];
      expect(asset.data).toBeDefined();
      expect(asset.data.length).toBeGreaterThan(0);
    });

    // Add more test cases as needed
  });
});

describe('generateEnvironmentSprites', () => {
  it('should generate environment sprites with the correct dimensions', async () => {
    const description = 'a fantasy forest';
    const options = {
      elements: 6,
      size: '1024x1024',
      style: 'pixel-art',
      padding: 2,
      theme: 'fantasy',
      save: false
    };
    const result = await generateEnvironmentSprites(description, options);

    expect(result).toBeDefined();
    expect(result.tileset).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.metadata.elements).toBe(options.elements);
    expect(result.metadata.theme).toBe(options.theme);
  });
});

describe('generateItemSprites', () => {
  it('should generate item sprites with the correct dimensions', async () => {
    const description = 'medieval weapons';
    const options = {
      itemCount: 8,
      size: '1024x1024',
      style: 'pixel-art',
      padding: 2,
      itemType: 'weapon',
      background: 'transparent',
      save: false
    };
    const result = await generateItemSprites(description, options);

    expect(result).toBeDefined();
    expect(result.itemSheet).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.metadata.itemCount).toBe(options.itemCount);
    expect(result.metadata.itemType).toBe(options.itemType);
  });
});

describe('fetchAvailableAnimationStates', () => {
  it('should fetch available animation states', async () => {
    const result = await fetchAvailableAnimationStates();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('fetchAvailableSpriteStyles', () => {
  it('should fetch available sprite styles', async () => {
    const result = await fetchAvailableSpriteStyles();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
