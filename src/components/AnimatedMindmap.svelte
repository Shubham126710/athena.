<script>
  export let nodes = [
    { id: 'notes', label: 'Notes' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'summary', label: 'Summary' },
    { id: 'mindmap', label: 'Mindmap' },
    { id: 'search', label: 'Semantic Search' }
  ];

  let angle = 0;
  const radius = 80;
  $: positioned = nodes.map((n, i) => {
    if (i === 0) return { ...n, x: 0, y: 0 };
    const a = angle + (i - 1) * (Math.PI * 2 / (nodes.length - 1));
    return { ...n, x: Math.cos(a) * radius, y: Math.sin(a) * radius };
  });
  const tick = () => {
    angle += 0.0035;
    requestAnimationFrame(tick);
  };
  tick();
</script>

<div class="relative w-56 h-56 select-none pointer-events-none">
  {#each positioned as n, i}
    <div class="absolute flex items-center justify-center rounded-full text-[10px] font-medium backdrop-blur-sm border border-white/10 shadow-lg shadow-black/40 transition-colors duration-500"
      style="width:{i===0?64:48}px;height:{i===0?64:48}px;left:50%;top:50%;transform:translate(-50%,-50%) translate({n.x}px,{n.y}px);background:rgba(30,30,40,{i===0?0.45:0.35});">
      <span class="px-2 text-center leading-tight">{n.label}</span>
    </div>
  {/each}
  <svg class="absolute inset-0" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <radialGradient id="pulse" r="65%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.25)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="96" fill="url(#pulse)">
      <animate attributeName="r" values="90;96;90" dur="6s" repeatCount="indefinite" />
    </circle>
  </svg>
</div>

<style>
  div { will-change: transform; }
</style>
