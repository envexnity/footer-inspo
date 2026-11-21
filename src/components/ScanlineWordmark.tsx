import React, { useEffect, useRef, useState } from 'react';
import {
  buildRibbonPolygonPoints,
  computeScanlineGrid,
  PointerState,
} from '../utils/scanlineEngine';

interface ScanlineWordmarkProps {
  text: string;
  accentColor: string;
  lineColor: string;
  totalLines: number;
  animated: boolean;
  showBackgroundLines: boolean;
}

export const ScanlineWordmark: React.FC<ScanlineWordmarkProps> = ({
  text,
  accentColor,
  lineColor,
  totalLines,
  animated,
  showBackgroundLines,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const maskCacheRef = useRef<{
    data: Uint8ClampedArray;
    width: number;
    height: number;
  } | null>(null);

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 360,
  });
  const [fontsReady, setFontsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect OS prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Wait for Google Fonts (Barlow Condensed) before rasterizing wordmark mask
  useEffect(() => {
    let active = true;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (active) setFontsReady(true);
      });
    } else {
      setFontsReady(true);
    }
    return () => {
      active = false;
    };
  }, []);

  // Track container dimensions cleanly
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    };

    updateSize();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateSize);
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Pause animation loop when scrolled offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0]?.isIntersecting ?? true);
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Rasterize offscreen wordmark alpha mask whenever text or canvas aspect changes
  useEffect(() => {
    const maskWidth = 840;
    const maskHeight = Math.max(160, Math.round((size.height / Math.max(1, size.width)) * maskWidth));
    const offscreen = document.createElement('canvas');
    offscreen.width = maskWidth;
    offscreen.height = maskHeight;
    const ctx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, maskWidth, maskHeight);

    const displayWord = (text.trim() || 'DARKROOM').toUpperCase();
    const fontFamily = '"Barlow Condensed", "Arial Narrow", Impact, sans-serif';

    // Draw characters individually with explicit letter spacing so gaps & counters stay crisp
    let fontSize = maskHeight * 0.78;
    ctx.font = `800 ${fontSize}px ${fontFamily}`;

    const chars = Array.from(displayWord);
    const trackingRatio = 0.055;
    const measureTrackedWidth = (fs: number) => {
      ctx.font = `800 ${fs}px ${fontFamily}`;
      const widths = chars.map((ch) => ctx.measureText(ch).width);
      const totalGlyphs = widths.reduce((acc, w) => acc + w, 0);
      const totalGaps = Math.max(0, chars.length - 1) * (fs * trackingRatio);
      return { widths, totalWidth: totalGlyphs + totalGaps };
    };

    const targetWidth = maskWidth * 0.94;
    let layout = measureTrackedWidth(fontSize);

    // Scale fontSize or slight horizontal stretch so the wordmark fills ~94% width cleanly
    const rawRatio = targetWidth / Math.max(1, layout.totalWidth);
    const scaleX = Math.min(1.55, Math.max(0.55, rawRatio));
    if (rawRatio < 0.55) {
      fontSize = fontSize * (rawRatio / 0.55);
      layout = measureTrackedWidth(fontSize);
    }

    const scaledTotalWidth = layout.totalWidth * scaleX;
    let cursorX = (maskWidth - scaledTotalWidth) / 2;
    const centerY = maskHeight / 2 + fontSize * 0.04;

    ctx.save();
    ctx.font = `800 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    chars.forEach((ch, idx) => {
      const charW = layout.widths[idx];
      ctx.save();
      ctx.translate(cursorX, centerY);
      ctx.scale(scaleX, 1.0);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      cursorX += (charW + fontSize * trackingRatio) * scaleX;
    });

    ctx.restore();

    const imgData = ctx.getImageData(0, 0, maskWidth, maskHeight);
    const alphaMask = new Uint8ClampedArray(maskWidth * maskHeight);
    for (let i = 0; i < alphaMask.length; i++) {
      alphaMask[i] = imgData.data[i * 4 + 3];
    }

    maskCacheRef.current = {
      data: alphaMask,
      width: maskWidth,
      height: maskHeight,
    };
  }, [text, size.width, size.height, fontsReady]);

  // Main render + animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(1, Math.floor(size.width * dpr));
    const pixelHeight = Math.max(1, Math.floor(size.height * dpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    let rafId = 0;
    const startTime = performance.now();
    const shouldAnimate = animated && !reducedMotion && isVisible;

    const renderFrame = (now: number) => {
      const mask = maskCacheRef.current;
      if (!mask) return;

      const timeSec = (now - startTime) * 0.001;
      const sampleColumns = size.width < 640 ? 84 : 144;

      const ribbons = computeScanlineGrid({
        maskData: mask.data,
        maskWidth: mask.width,
        maskHeight: mask.height,
        canvasWidth: size.width,
        canvasHeight: size.height,
        timeSec,
        animated: shouldAnimate,
        pointer: pointerRef.current,
        config: {
          totalLines,
          sampleColumns,
          baseHalfHeight: showBackgroundLines ? 0.52 : 0,
          maxFillRatio: 0.44,
          waveAmplitude: 0.1,
          pointerRadius: size.width < 640 ? 110 : 185,
          pointerStrength: 0.45,
        },
      });

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size.width, size.height);

      for (const ribbon of ribbons) {
        const hasGlyph = ribbon.maxIntensity > 0.08;
        if (!hasGlyph) continue;

        const points = buildRibbonPolygonPoints(ribbon);
        if (points.length === 0) continue;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = accentColor;
        ctx.fill();
      }

      ctx.restore();

      if (shouldAnimate) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame(performance.now());

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    size.width,
    size.height,
    accentColor,
    lineColor,
    totalLines,
    animated,
    reducedMotion,
    isVisible,
    showBackgroundLines,
    text,
    fontsReady,
  ]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  // Lock height to exact multiple of totalLines * 14px pitch on desktop so scanlines match raster seamlessly
  const desktopHeight = totalLines * 14;

  return (
    <div
      ref={containerRef}
      style={{ height: `${desktopHeight}px` }}
      className="relative w-full max-h-[260px] sm:max-h-[340px] lg:max-h-none select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        data-testid="scanline-wordmark-canvas"
        aria-label={`${text} interactive scanline halftone wordmark`}
        role="img"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="block w-full h-full cursor-crosshair"
      />
    </div>
  );
};
