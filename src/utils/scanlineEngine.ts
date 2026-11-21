export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

export interface ScanlineConfig {
  totalLines: number;
  sampleColumns: number;
  baseHalfHeight: number;
  maxFillRatio: number;
  waveAmplitude: number;
  pointerRadius: number;
  pointerStrength: number;
}

export interface ScanlineSample {
  x: number;
  halfHeight: number;
  intensity: number;
}

export interface ScanlineRibbon {
  rowIndex: number;
  yCenter: number;
  maxIntensity: number;
  samples: ScanlineSample[];
}

export const DEFAULT_SCANLINE_CONFIG: ScanlineConfig = {
  totalLines: 26,
  sampleColumns: 136,
  baseHalfHeight: 0.5,
  maxFillRatio: 0.44,
  waveAmplitude: 0.11,
  pointerRadius: 190,
  pointerStrength: 0.45,
};

/**
 * Computes normalized radial pointer influence in [0, 1] with smooth cosine falloff.
 */
export function computePointerRipple(
  sampleX: number,
  sampleY: number,
  pointer: PointerState,
  radius: number,
  timeSec: number
): number {
  if (!pointer.active || radius <= 0) {
    return 0;
  }

  const dx = sampleX - pointer.x;
  const dy = sampleY - pointer.y;
  const dist = Math.hypot(dx, dy);

  if (dist >= radius) {
    return 0;
  }

  const normalized = 1 - dist / radius;
  const smoothFalloff = 0.5 * (1 - Math.cos(Math.PI * normalized));
  const ripple = 0.82 + 0.18 * Math.sin(dist * 0.045 - timeSec * 5.2);
  return Math.max(0, Math.min(1, smoothFalloff * ripple));
}

/**
 * Smooths a 1D array of sample intensities with a tight [0.15, 0.70, 0.15] kernel
 * to create crisp faceted/chamfered scanline ends without blurring letter counters.
 */
export function smoothSamples(values: ReadonlyArray<number>): number[] {
  const len = values.length;
  if (len === 0) return [];
  if (len === 1) return [values[0]];

  const result = new Array<number>(len);
  for (let i = 0; i < len; i++) {
    const prev = i > 0 ? values[i - 1] : 0;
    const curr = values[i];
    const next = i < len - 1 ? values[i + 1] : 0;
    const blended = prev * 0.15 + curr * 0.7 + next * 0.15;
    result[i] = Math.max(0, Math.min(1, blended));
  }
  return result;
}

/**
 * Samples a 2D grayscale/alpha mask (values 0..255) into scanline ribbon geometry.
 */
export function computeScanlineGrid(params: {
  maskData: Uint8ClampedArray | Uint8Array;
  maskWidth: number;
  maskHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  timeSec: number;
  animated: boolean;
  pointer: PointerState;
  config?: Partial<ScanlineConfig>;
}): ScanlineRibbon[] {
  const {
    maskData,
    maskWidth,
    maskHeight,
    canvasWidth,
    canvasHeight,
    timeSec,
    animated,
    pointer,
    config: overrides,
  } = params;

  const config: ScanlineConfig = { ...DEFAULT_SCANLINE_CONFIG, ...overrides };
  const totalLines = Math.max(8, Math.round(config.totalLines));
  const cols = Math.max(16, Math.round(config.sampleColumns));

  if (canvasWidth <= 0 || canvasHeight <= 0 || maskWidth <= 0 || maskHeight <= 0) {
    return [];
  }

  const lineSpacing = canvasHeight / totalLines;
  const maxHalfHeight = Math.max(config.baseHalfHeight + 0.5, lineSpacing * config.maxFillRatio);
  const ribbons: ScanlineRibbon[] = [];

  for (let row = 0; row < totalLines; row++) {
    const yCenter = (row + 0.5) * lineSpacing;
    const yNorm = yCenter / canvasHeight;

    // Sample tight vertical band in mask space around yNorm so counters remain open
    const maskCenterY = yNorm * maskHeight;
    const bandRadius = Math.max(1, (maskHeight / totalLines) * 0.28);
    const yStart = Math.max(0, Math.floor(maskCenterY - bandRadius));
    const yEnd = Math.min(maskHeight - 1, Math.ceil(maskCenterY + bandRadius));

    const rawIntensities = new Array<number>(cols + 1);

    for (let col = 0; col <= cols; col++) {
      const xNorm = col / cols;
      const sampleX = xNorm * canvasWidth;
      const maskCenterX = xNorm * maskWidth;
      const colRadius = Math.max(1, (maskWidth / cols) * 0.35);
      const xStart = Math.max(0, Math.floor(maskCenterX - colRadius));
      const xEnd = Math.min(maskWidth - 1, Math.ceil(maskCenterX + colRadius));

      let sum = 0;
      let count = 0;

      for (let my = yStart; my <= yEnd; my++) {
        const rowOffset = my * maskWidth;
        for (let mx = xStart; mx <= xEnd; mx++) {
          sum += maskData[rowOffset + mx];
          count++;
        }
      }

      const baseMask = count > 0 ? sum / (count * 255) : 0;

      // Subtle organic kinetic wave distortion along letter edges
      const phase = animated ? timeSec * 1.45 : 0.65;
      const organicWave =
        Math.sin(xNorm * 11.5 + row * 0.45 + phase) * 0.5 +
        Math.cos(xNorm * 22.0 - row * 0.33 + phase * 0.8) * 0.5;

      const pointerEffect = computePointerRipple(
        sampleX,
        yCenter,
        pointer,
        config.pointerRadius,
        timeSec
      );

      let modulated = baseMask;
      if (baseMask > 0.14) {
        modulated = Math.min(
          1,
          Math.max(0.18, baseMask + organicWave * config.waveAmplitude * (0.25 + baseMask * 0.75))
        );
      } else {
        modulated = 0;
      }

      if (pointerEffect > 0) {
        modulated = Math.min(
          1,
          modulated + pointerEffect * config.pointerStrength * (baseMask > 0.15 ? 0.35 : 0.78)
        );
      }

      rawIntensities[col] = modulated;
    }

    const smoothed = smoothSamples(rawIntensities);
    let maxIntensity = 0;

    const samples: ScanlineSample[] = smoothed.map((intensity, col) => {
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
      }
      // Steep S-curve keeps interior strokes thick and background hairlines razor thin
      const shaped = intensity > 0.08 ? Math.min(1, Math.pow(intensity, 0.58)) : 0;
      const halfHeight =
        config.baseHalfHeight + shaped * (maxHalfHeight - config.baseHalfHeight);
      return {
        x: (col / cols) * canvasWidth,
        halfHeight,
        intensity,
      };
    });

    ribbons.push({
      rowIndex: row,
      yCenter,
      maxIntensity,
      samples,
    });
  }

  return ribbons;
}

/**
 * Generates closed polygon points (top edge left-to-right, bottom edge right-to-left)
 * for a single scanline ribbon.
 */
export function buildRibbonPolygonPoints(ribbon: ScanlineRibbon): Array<{ x: number; y: number }> {
  const { yCenter, samples } = ribbon;
  if (samples.length === 0) return [];

  const points: Array<{ x: number; y: number }> = new Array(samples.length * 2);
  const n = samples.length;

  for (let i = 0; i < n; i++) {
    points[i] = {
      x: samples[i].x,
      y: yCenter - samples[i].halfHeight,
    };
  }
  for (let i = 0; i < n; i++) {
    const rev = n - 1 - i;
    points[n + i] = {
      x: samples[rev].x,
      y: yCenter + samples[rev].halfHeight,
    };
  }

  return points;
}
