import test from 'node:test';
import assert from 'node:assert/strict';
import {
  stitchElevations,
  stitchSurfaceTokens,
  stitchStateLayers,
  stitchShapes,
} from '../src/theme/stitch';

test('Google Stitch Elevation scale defines all 6 material levels', () => {
  assert.ok(stitchElevations.level0 !== undefined);
  assert.ok(stitchElevations.level1 !== undefined);
  assert.ok(stitchElevations.level2 !== undefined);
  assert.ok(stitchElevations.level3 !== undefined);
  assert.ok(stitchElevations.level4 !== undefined);
  assert.ok(stitchElevations.level5 !== undefined);
});

test('Google Stitch Surface Container tokens define low, standard, and high tiers', () => {
  assert.ok(stitchSurfaceTokens.surfaceContainerLow);
  assert.ok(stitchSurfaceTokens.surfaceContainer);
  assert.ok(stitchSurfaceTokens.surfaceContainerHigh);
  assert.ok(stitchSurfaceTokens.glassBackground);
  assert.ok(stitchSurfaceTokens.glassBorder);
});

test('Google Stitch Shapes scale defines Material rounded curves', () => {
  assert.equal(stitchShapes.none, 0);
  assert.equal(stitchShapes.small, 8);
  assert.equal(stitchShapes.medium, 12);
  assert.equal(stitchShapes.large, 16);
  assert.equal(stitchShapes.extraLarge, 28);
  assert.equal(stitchShapes.full, 9999);
});

test('Google Stitch State Layers define interaction opacity', () => {
  assert.equal(stitchStateLayers.hover, 0.08);
  assert.equal(stitchStateLayers.focus, 0.12);
  assert.equal(stitchStateLayers.press, 0.16);
  assert.equal(stitchStateLayers.drag, 0.20);
});
