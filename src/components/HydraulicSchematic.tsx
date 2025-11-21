import React from 'react';

// Helper component to reference an SVG from public/svgs with positioning
const Part: React.FC<{ src: string; x: number; y: number; w?: number; h?: number; rotate?: number }> = ({ src, x, y, w = 28, h = 28, rotate = 0 }) => {
  return (
    <image href={`/svgs/${src}`} x={x} y={y} width={w} height={h} transform={rotate ? `rotate(${rotate} ${x + w / 2} ${y + h / 2})` : undefined} />
  );
};

export const HydraulicSchematic: React.FC<{ className?: string }>= ({ className }) => {
  // Canvas size chosen to allow precise placements across two columns
  const W = 1600;
  const H = 1000;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className="[&_*]:select-none">
        {/* background */}
        <rect x={0} y={0} width={W} height={H} fill="white" />

        {/* center dashed divider */}
        <line x1={W/2} y1={40} x2={W/2} y2={H-40} stroke="#444" strokeWidth={2} strokeDasharray="10 14" />

        {/* Section titles */}
        <g fontSize={24} fontWeight={600} fill="#111" textAnchor="start">
          <rect x={40} y={30} width={240} height={34} fill="white"/>
          <text x={50} y={55}>MILL HYD. SYSTEM</text>

          <rect x={W/2 + 40} y={30} width={240} height={34} fill="white"/>
          <text x={W/2 + 50} y={55}>AUX HYD. SYSTEM</text>

          <rect x={40} y={H/2 + 10} width={260} height={34} fill="white"/>
          <text x={50} y={H/2 + 34}>GEAR LUB. SYSTEM</text>
        </g>

        {/* Common tanks on each right edge of subsystems */}
        {/* Left-top sump */}
        <g>
          <Part src="U-shape-container.svg" x={680} y={260} w={36} h={140} />
          <Part src="LL.svg" x={720} y={342} w={20} h={20} />
          <Part src="L.svg" x={720} y={314} w={20} h={20} />
        </g>

        {/* Right-top sump for AUX */}
        <g>
          <Part src="U-shape-container.svg" x={W/2 + 680 - 800} y={260} w={36} h={140} />
          <Part src="LL.svg" x={W/2 + 720 - 800} y={342} w={20} h={20} />
          <Part src="L.svg" x={W/2 + 720 - 800} y={314} w={20} h={20} />
        </g>

        {/* Bottom-left tank for GEAR LUB with TEMP label */}
        <g>
          <Part src="U-shape-ext-container.svg" x={720} y={760} w={40} h={140} />
          <Part src="TEMP.svg" x={780} y={800} w={60} h={32} />
          <Part src="H.svg" x={770} y={784} w={24} h={24} />
          <Part src="LL.svg" x={770} y={848} w={24} h={24} />
        </g>

        {/* Left column: MILL HYD main loop */}
        <g stroke="#000" strokeWidth={3} fill="none">
          {/* main header */}
          <path d="M 80 120 H 720" />
          <Part src="12pm_arrow.svg" x={720} y={108} w={20} h={20} />

          {/* four branches with control valves and motors */}
          {[
            { x: 200, label: 'M1' },
            { x: 320, label: 'M2' },
            { x: 440, label: 'A1' },
            { x: 560, label: 'A2' },
          ].map((b, i) => (
            <g key={i}>
              <path d={`M ${b.x} 120 V 240`} />
              <Part src="green-vertical-triangles.svg" x={b.x - 14} y={190} w={28} h={28} />
              <Part src="circle.svg" x={b.x - 18} y={146} w={36} h={36} />
              <text x={b.x} y={170} fontSize={18} textAnchor="middle" fontWeight={700}>{i < 2 ? 'M' : 'A'}</text>
              <path d={`M ${b.x} 240 V 320`} />
            </g>
          ))}

          {/* return headers */}
          <path d="M 80 320 H 720" />
          <Part src="4pm_arrow.svg" x={690} y={308} w={20} h={20} />

          {/* pump and filter section bottom of mill hyd */}
          <path d="M 200 320 V 390 H 300" />
          <Part src="diamond-with-horizontal-cut.svg" x={300} y={368} w={28} h={28} />
          <path d="M 328 382 H 430" />
          <Part src="P_in_circle.svg" x={430} y={360} w={36} h={36} />
          <path d="M 466 382 H 560 V 320" />
        </g>

        {/* AUX HYD at top-right */}
        <g stroke="#000" strokeWidth={3} fill="none">
          <path d={`M ${W/2 + 80} 120 H ${W-80}`} />
          <Part src="12pm_arrow.svg" x={W-80} y={108} w={20} h={20} />

          {[W/2 + 260, W/2 + 380, W/2 + 500].map((x, i) => (
            <g key={i}>
              <path d={`M ${x} 120 V 240`} />
              <Part src="green-vertical-triangles.svg" x={x - 14} y={190} w={28} h={28} />
              <Part src="circle.svg" x={x - 18} y={146} w={36} h={36} />
              <text x={x} y={170} fontSize={18} textAnchor="middle" fontWeight={700}>{i === 0 ? 'M' : 'A'}</text>
              <path d={`M ${x} 240 V 320`} />
            </g>
          ))}

          <path d={`M ${W/2 + 80} 320 H ${W - 80}`} />
          <Part src="4pm_arrow.svg" x={W - 110} y={308} w={20} h={20} />

          {/* pump */}
          <path d={`M ${W/2 + 340} 320 V 390 H ${W/2 + 460}`} />
          <Part src="P_in_circle.svg" x={W/2 + 460} y={360} w={36} h={36} />
          <path d={`M ${W/2 + 496} 382 H ${W/2 + 580} V 320`} />
        </g>

        {/* Bottom-left: GEAR LUB system with two branches */}
        <g stroke="#000" strokeWidth={3} fill="none">
          <path d="M 80 560 H 720" />
          <Part src="12pm_arrow.svg" x={720} y={548} w={20} h={20} />

          {[220, 360, 500].map((x, i) => (
            <g key={i}>
              <path d={`M ${x} 560 V 660`} />
              <Part src="green-vertical-triangles.svg" x={x - 14} y={620} w={28} h={28} />
              <Part src="circle.svg" x={x - 18} y={586} w={36} h={36} />
              <text x={x} y={610} fontSize={18} textAnchor="middle" fontWeight={700}>M</text>
              <path d={`M ${x} 660 V 740`} />
            </g>
          ))}

          <path d="M 80 740 H 720" />
          <Part src="4pm_arrow.svg" x={690} y={728} w={20} h={20} />

          {/* pump and filter for gear lub */}
          <path d="M 260 740 V 820 H 360" />
          <Part src="diamond-with-vertical-cut.svg" x={360} y={798} w={28} h={28} />
          <path d="M 388 812 H 500" />
          <Part src="P_in_circle.svg" x={500} y={790} w={36} h={36} />
          <path d="M 536 812 H 620 V 740" />
        </g>

        {/* Sensor labels (examples) */}
        <Part src="TIC.svg" x={140} y={250} w={46} h={24} />
        <Part src="TICA.svg" x={W/2 + 140} y={250} w={46} h={24} />

        {/* Dotted connection examples to mimic drawing details */}
        <image href="/svgs/vertical-dotted_line.svg" x={110} y={140} width={8} height={160} />
        <image href="/svgs/vertical-dotted_line.svg" x={W/2 + 110} y={140} width={8} height={160} />
      </svg>
    </div>
  );
};

export default HydraulicSchematic;
