import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRibbonPolygonPoints,
  computePointerRipple,
  computeScanlineGrid,
  smoothSamples,
} from './scanlineEngine';

test('smoothSamples preserves array length and clamps values to [0, 1]', () => {
  const smoothed = smoothSamples([0, 1, 1, 0, 1.4, -0.2]);
  assert.equal(smoothed.length, 6);
  for (const val of smoothed) {
    assert.ok(val >= 0 && val <= 1, `Expected value in [0,1], got ${val}`);
  }
  // Center of block should stay high, edges should taper smoothly
  assert.ok(smoothed[0] > 0 && smoothed[0] < smoothed[1]);
  assert.ok(smoothed[1] > smoothed[0]);
});

test('computePointerRipple returns 0 when inactive or outside radius', () => {
  assert.equal(
    computePointerRipple(100, 100, { x: 100, y: 100, active: false }, 150, 0),
    0
  );
  assert.equal(
    computePointerRipple(400, 100, { x: 100, y: 100, active: true }, 150, 0),
    0
  );
  const centerRipple = computePointerRipple(
    100,
    100,
    { x: 100, y: 100, active: true },
    150,
    0
  );
  assert.ok(centerRipple > 0.5 && centerRipple <= 1);
});

test('computeScanlineGrid maps bright mask regions to thicker ribbons than empty regions', () => {
  const maskWidth = 40;
  const maskHeight = 20;
  const maskData = new Uint8Array(maskWidth * maskHeight);

  // Fill center rectangle (x: 15..25, y: 6..14) with full intensity 255
  for (let y = 6; y < 14; y++) {
    for (let x = 15; x < 25; x++) {
      maskData[y * maskWidth + x] = 255;
    }
  }

  const ribbons = computeScanlineGrid({
    maskData,
    maskWidth,
    maskHeight,
    canvasWidth: 800,
    canvasHeight: 200,
    timeSec: 0,
    animated: false,
    pointer: { x: 0, y: 0, active: false },
    config: { totalLines: 10, sampleColumns: 20, baseHalfHeight: 0.5 },
  });

  assert.equal(ribbons.length, 10);

  // Top row (row 0) is outside mask -> uniform thin baseHalfHeight
  const topMax = Math.max(...ribbons[0].samples.map((s) => s.halfHeight));
  assert.equal(topMax, 0.5);

  // Middle row (row 5) intersects center block -> center samples much thicker than outer samples
  const midRow = ribbons[5];
  const edgeSample = midRow.samples[0].halfHeight;
  const centerSample = midRow.samples[10].halfHeight;
  assert.equal(edgeSample, 0.5);
  assert.ok(centerSample > 4, `Expected center sample thickness > 4, got ${centerSample}`);
});

test('buildRibbonPolygonPoints generates symmetric closed top/bottom vertices', () => {
  const points = buildRibbonPolygonPoints({
    rowIndex: 0,
    yCenter: 100,
    maxIntensity: 1,
    samples: [
      { x: 0, halfHeight: 1, intensity: 0 },
      { x: 50, halfHeight: 5, intensity: 1 },
      { x: 100, halfHeight: 1, intensity: 0 },
    ],
  });

  assert.equal(points.length, 6);
  assert.deepEqual(points[0], { x: 0, y: 99 });
  assert.deepEqual(points[1], { x: 50, y: 95 });
  assert.deepEqual(points[2], { x: 100, y: 99 });
  assert.deepEqual(points[3], { x: 100, y: 101 });
  assert.deepEqual(points[4], { x: 50, y: 105 });
  assert.deepEqual(points[5], { x: 0, y: 101 });
});
