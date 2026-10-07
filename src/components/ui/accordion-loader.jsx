import React from 'react';

const ACCORDION_LOADER_BLOCKS = ["█", "▓", "▒"];

export function AccordionLoader({
  className = "",
  blocks = ACCORDION_LOADER_BLOCKS,
  track = "░",
  trackLength = 16,
  style = {},
  ...props
}) {
  const columns = Math.max(2, Math.floor(trackLength));
  const glyphs = ACCORDION_LOADER_BLOCKS.map(
    (_, index) => blocks[index] ?? ACCORDION_LOADER_BLOCKS[index]
  );

  return (
    <>
      <style>{`
        @keyframes loading-ui-accordion-loader {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(var(--loader-x));
          }
        }
      `}</style>
      <span
        role="status"
        className={`relative inline-flex h-[1em] items-center overflow-hidden font-mono text-xl leading-none text-current select-none ${className}`}
        style={{
          width: 'var(--loader-width)',
          "--loader-width": `${columns}ch`,
          "--loader-x": `${columns - 1}ch`,
          ...style,
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 whitespace-nowrap text-neutral-800"
        >
          {track.repeat(columns)}
        </span>
        {glyphs.map((glyph, index) => (
          <span
            key={`${glyph}-${index}`}
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 left-0 flex h-full w-[1ch] items-center justify-center text-center text-white ${["z-30", "z-20", "z-10"][index]}`}
            style={{
              animation: "loading-ui-accordion-loader var(--duration, 2.8s) ease-in-out infinite",
              animationDelay: `calc(var(--delay, 0.04s) * ${index})`,
              backgroundColor: "var(--mask-color, #0a0a0a)", // Matches bg-neutral-950
            }}
          >
            {glyph}
          </span>
        ))}
        <span className="sr-only">Loading</span>
      </span>
    </>
  );
}

export default AccordionLoader;
