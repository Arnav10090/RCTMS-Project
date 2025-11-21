import React from 'react';

const PidDiagram: React.FC = () => {
  return (
    <div className="w-full h-full p-4 bg-white flex items-center justify-center overflow-auto">
      <svg width="1100" height="800" viewBox="0 0 1100 800" preserveAspectRatio="xMidYMid meet" className="block h-auto max-w-full">
        <defs>
          <marker id="arrowblack" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#000" />
          </marker>
        </defs>
        <g transform="translate(0, 180)">

          {/* DM Water label and vertical line with arrow */}
          <text x="10" y="-70" fontSize="20" fontFamily="Arial">DM Water</text>
          <line x1="40" y1="-50" x2="40" y2="68" stroke="#000" strokeWidth="1" />
          <image href="/svgs/6pm_arrow.svg" x="28" y="-40" width="25" height="25" />
          <line x1="40" y1="92" x2="40" y2="175" stroke="#000" strokeWidth="1" />

          {/* FT#1 Flow Transmitter - using circle svg */}
          <image href="/svgs/square.svg" x="20" y="60" width="40" height="40" />
          <image href="/svgs/baseball.svg" x="30" y="70" width="20" height="20" />
          <text x="60" y="85" fontSize="12" fontFamily="Arial">FT#1</text>  
          <line x1="39.5" y1="175" x2="382" y2="175" stroke="#000" strokeWidth="1" />

          {/* OIL TANK */}
          <image href="/svgs/U-shape-container.svg" x="-10" y="320" width="160" height="110" />
          <text x="40" y="430" fontSize="14" fontFamily="Arial" fontWeight="bold">OIL TANK</text>

          {/* Oil tank level indicators using H, L, LL svgs */}
          <image href="/svgs/H.svg" x="113" y="320" width="70" height="70" />
          <image href="/svgs/L.svg" x="113" y="340" width="70" height="70" />
          <image href="/svgs/LL.svg" x="113" y="360" width="70" height="70" />

          {/* Motor symbols on oil tank */}
          <image href="/svgs/M_in_circle.svg" x="13" y="300" width="30" height="30" />
          <image href="/svgs/rectangle.svg" x="4" y="340" width="50" height="50" />
          <image href="/svgs/infinity.svg" x="16" y="370" width="25" height="25" />
          <line x1="28.5" y1="340" x2="28.5" y2="383" stroke="#000" strokeWidth="1" />

          {/* 2nd and 3rd M symbols in Oil tank */}
          <image href="/svgs/M_in_circle.svg" x="65" y="290" width="30" height="30" />
          <image href="/svgs/M_in_circle.svg" x="105" y="290" width="30" height="30" />
          <image href="/svgs/filled_circle.svg" x="95" y="335" width="10" height="10" />
          <image href="/svgs/filled_circle.svg" x="95" y="265" width="10" height="10" />

          {/* Vertical lines to make rectangle around M symbols */}
          <line x1="80" y1="270" x2="80" y2="300" stroke="#000" strokeWidth="1" />
          <line x1="80" y1="311" x2="80" y2="340" stroke="#000" strokeWidth="1" />
          <line x1="120" y1="270" x2="120" y2="300" stroke="#000" strokeWidth="1" />
          <line x1="120" y1="311" x2="120" y2="340" stroke="#000" strokeWidth="1" />

          {/* Horizontal lines to make rectangle around M symbols */}
          <line x1="80" y1="270" x2="120" y2="270" stroke="#000" strokeWidth="1" />
          <line x1="80" y1="340" x2="120" y2="340" stroke="#000" strokeWidth="1" />

          {/* Baseball symbol with FT#1 label */}
          <image href="/svgs/square.svg" x="80" y="213" width="40" height="40" />
          <image href="/svgs/baseball.svg" x="90" y="222" width="20" height="20" />
          <image href="/svgs/FT2.svg" x="120" y="210" width="70" height="50" />
          <line x1="100" y1="245" x2="100" y2="268" stroke="#000" strokeWidth="1" />
          <line x1="100" y1="195" x2="100" y2="221" stroke="#000" strokeWidth="1" />
          <line x1="100" y1="195" x2="343" y2="195" stroke="#000" strokeWidth="1" />

          {/* Vertical line and valve from oil tank */}
          <line x1="100" y1="340" x2="100" y2="380" stroke="#000" strokeWidth="2" />
          <image href="/svgs/12pm_arrow.svg" x="87" y="350" width="25" height="25" />

          {/* LT label and symbol */}
          <image href="/svgs/LT.svg" x="220" y="190" width="90" height="70" />
          <image href="/LT.png" x="197" y="265" width="90" height="70" />

          {/* TIC label and symbol */}
          <image href="/svgs/TIC.svg" x="175" y="237  " width="80" height="40" />
          <image href="/TIC.png" x="180" y="360" width="70" height="60" />
          <line x1="200" y1="270" x2="200" y2="377" stroke="#000" strokeWidth="1" />

          {/* Rectangle  and infinity symbol*/}
          <line x1="285" y1="310" x2="285" y2="355" stroke="#000" strokeWidth="1" />
          <image href="/svgs/rectangle.svg" x="260" y="310" width="50" height="50" />
          <image href="/svgs/infinity.svg" x="272.5" y="345" width="25" height="20" />
          <image href="/svgs/M_in_circle.svg" x="270" y="289" width="30" height="30" />

          {/* Vertical triangle 1 */}
          <line x1="343" y1="194" x2="343" y2="273" stroke="#000" strokeWidth="1" />
          <image href="/svgs/vertical-triangles.svg" x="325" y="265" width="35" height="40" />
          <line x1="342" y1="295" x2="342" y2="365" stroke="#000" strokeWidth="2" />
          <image href="/svgs/6pm_arrow.svg" x="330" y="335" width="25" height="25" />

          {/* Vertical triangle 2 */}
          <line x1="382" y1="174" x2="382" y2="273" stroke="#000" strokeWidth="1" />
          <image href="/svgs/vertical-triangles.svg" x="365" y="265" width="35" height="40" />
          <line x1="382" y1="295" x2="382" y2="365" stroke="#000" strokeWidth="2" />
          <image href="/svgs/6pm_arrow.svg" x="369.5" y="335" width="25" height="25" />

          {/* Vertical line and arrow above trapezoid */}
          <line x1="555" y1="228" x2="555" y2="248" stroke="#000" strokeWidth="2" />
          <image href="/svgs/6pm_arrow.svg" x="543" y="238" width="25" height="25" />

          {/* Horizontal line above trapezoid */}
          <line x1="554" y1="227" x2="660" y2="227" stroke="#000" strokeWidth="2" />

          {/* CLEAN TANK */}
          <text x="360" y="430" fontSize="14" fontFamily="Arial" fontWeight="bold">CLEAN TANK</text>

          {/* Elements inside clean tank */}
          <image href="/svgs/trapezoid.svg" x="505" y="228" width="100" height="50" />

          {/* U shape Extended container of Clean and Dirty tanks */}
          <image href="/svgs/U-shape-ext-container.svg" x="220" y="285" width="550" height="150" />

          {/* Motors in clean tank */}
          <image href="/svgs/M_in_circle.svg" x="453" y="270" width="30" height="30" />
          <image href="/svgs/M_in_circle.svg" x="415.5" y="270" width="30" height="30" />
          <line x1="450" y1="323" x2="450" y2="375" stroke="#000" strokeWidth="1" />
          <image href="/svgs/12pm_arrow.svg" x="438" y="330" width="25" height="25" />
          <image href="/svgs/filled_circle.svg" x="445" y="315" width="10" height="10" />
          <image href="/svgs/filled_circle.svg" x="445" y="241" width="10" height="10" />

          {/* Vertical lines to make rectangle around M symbols */}
          <line x1="430" y1="246" x2="430" y2="279" stroke="#000" strokeWidth="1" />
          <line x1="468" y1="290" x2="468" y2="320" stroke="#000" strokeWidth="1" />
          <line x1="468" y1="246" x2="468" y2="279" stroke="#000" strokeWidth="1" />
          <line x1="430" y1="290" x2="430" y2="320" stroke="#000" strokeWidth="1" />

          {/* Horizontal lines to make rectangle around M symbols */}
          <line x1="430" y1="246" x2="468" y2="246" stroke="#000" strokeWidth="1" />
          <line x1="430" y1="320" x2="468" y2="320" stroke="#000" strokeWidth="1" />

          {/* Lines to clean tank from instruments with 12pm arrow in middle above the rectangle */}
          <line x1="450" y1="150" x2="450" y2="245" stroke="#000" strokeWidth="1" />
          <image href="/svgs/12pm_arrow.svg" x="438" y="165" width="25" height="25" />

          {/* Outlet from clean tank */}
          <line x1="555" y1="260" x2="555" y2="372" stroke="#000" strokeWidth="2" />
          <image href="/svgs/6pm_arrow.svg" x="542.5" y="340" width="25" height="25" />

          {/* XT#1 text */}
          <text x="540" y="100" fontSize="12" fontFamily="Arial" fontWeight="bold">XT#1</text>

          {/* Circle with filled circle inside it  */}
          <image href="/svgs/circle.svg" x="543" y="123" width="25" height="25" />
          <image href="/svgs/filled_circle.svg" x="551" y="130" width="10" height="10" />

          {/* Vertical pink lines below XT#1 text */}
          <image href="/svgs/pink-vertical-line.svg" x="507" y="130" width="30" height="60" />
          <image href="/svgs/pink-vertical-line.svg" x="575" y="130" width="30" height="60" />

          {/* Horizontal pink lines below XT#1 text */}
          <image href="/svgs/pink-horizontal-line.svg" x="520" y="120" width="25" height="25" />
          <image href="/svgs/pink-horizontal-line.svg" x="565" y="120" width="25" height="25" />

          {/* Pink dots below XT#1 text */}
          <image href="/svgs/pink-black-dot.svg" x="517" y="188" width="10" height="10" />
          <image href="/svgs/pink-black-dot.svg" x="585" y="188" width="10" height="10" />

          {/* Vertical Lines below XT#1 */}
          <line x1="555" y1="105" x2="555" y2="125" stroke="#000" strokeWidth="1" />
          <line x1="555" y1="145" x2="555" y2="170" stroke="#000" strokeWidth="1" />

          {/* Horizontal line connecting pink dots below XT#1 and dot at end */}
          <line x1="450" y1="192.5" x2="1095" y2="192.5" stroke="#000" strokeWidth="1" />
          <image href="/svgs/filled_circle.svg" x="1090" y="187" width="10" height="10" />
          <image href="/svgs/filled_circle.svg" x="795" y="187" width="10" height="10" />

          {/* DIRTY TANK */}
          <text x="645" y="430" fontSize="14" fontFamily="Arial" fontWeight="bold">DIRTY TANK</text>

          {/* Dirty tank level indicators (H,L,LL) */}
          <image href="/svgs/H.svg" x="740" y="320" width="70" height="70" />
          <image href="/svgs/L.svg" x="740" y="340" width="70" height="70" />
          <image href="/svgs/LL.svg" x="740" y="360" width="70" height="70" />

          {/* Pump elements */}
          <image href="/svgs/M_in_circle.svg" x="625" y="269" width="30" height="30" />
          <image href="/svgs/M_in_circle.svg" x="645" y="269" width="30" height="30" />
          <image href="/svgs/rectangle.svg" x="616" y="285" width="50" height="50" />
          <image href="/svgs/infinity.svg" x="629" y="320" width="25" height="25" />
          <line x1="660" y1="226" x2="660" y2="277" stroke="#000" strokeWidth="2" />
          <line x1="641" y1="290" x2="641" y2="332" stroke="#000" strokeWidth="1" />
          <line x1="660" y1="290" x2="660" y2="332" stroke="#000" strokeWidth="1" />
          <image href="/svgs/12pm_arrow.svg" x="648" y="298" width="25" height="25" />

          {/* Vertical and horizontal line and arrow at right end of dirty tank */}
          <line x1="693" y1="226" x2="693" y2="306" stroke="#000" strokeWidth="1" />
          <image href="/svgs/6pm_arrow.svg" x="680" y="298" width="25" height="25" />
          <line x1="693" y1="225" x2="935" y2="225" stroke="#000" strokeWidth="1" />

          {/* Motors at dirty tank */}
          <image href="/svgs/slanting-line-2pm.svg" x="733" y="225" width="50" height="50" />
          <image href="/svgs/moving-roll.svg" x="710" y="258" width="90" height="80" />
          <image href="/svgs/M_in_circle.svg" x="758" y="227" width="30" height="30" />

          {/* Vertical Dashed line in dirty tank */}
          <image href="/svgs/vertical-dotted_line.svg" x="565" y="280" width="100" height="140" />

          {/* Vertical line for Heat Exchanger */}
          <line x1="800" y1="230" x2="800" y2="-85" stroke="#000" strokeWidth="1" />

          {/* Heat exchanger circles - 6 circles with proper sizing */}
          {/* Top circle - largest */}
          <circle cx="935" cy="-90" r="22" fill="white" stroke="#000" strokeWidth="1" />

          {/* Second circle */}
          <circle cx="935" cy="-46" r="18" fill="white" stroke="#000" strokeWidth="1" />

          {/* Third circle - smallest */}
          <circle cx="935" cy="-13" r="13" fill="white" stroke="#000" strokeWidth="1" />

          {/* Fourth circle - smallest (on dashed line) */}
          <circle cx="935" cy="16" r="13" fill="white" stroke="#000" strokeWidth="1" />

          {/* Fifth circle */}
          <circle cx="935" cy="50" r="18" fill="white" stroke="#000" strokeWidth="1" />

          {/* Bottom circle - largest */}
          <circle cx="935" cy="93" r="22" fill="white" stroke="#000" strokeWidth="1" />

          {/* Bottom circle - largest */}
          <image href="/svgs/trapezoid.svg" x="860" y="85" width="150" height="100" />

          {/* Left inlet lines with dots and arrows */}
          <line x1="800" y1="-85" x2="875" y2="-85" stroke="#000" strokeWidth="1" />
          <image href="/svgs/filled_circle.svg" x="900" y="-78" width="6" height="6" />
          <line x1="875" y1="-85" x2="903" y2="-75" stroke="#000" strokeWidth="1" />
          <image href="/svgs/4pm_arrow.svg" x="900" y="-78" width="20" height="20" />

          <line x1="800" y1="-57" x2="875" y2="-57" stroke="#000" strokeWidth="1" />
          <image href="/svgs/filled_circle.svg" x="897" y="-38" width="6" height="6" />
          <line x1="874.5" y1="-57" x2="900" y2="-35" stroke="#000" strokeWidth="1" />
          <image href="/svgs/4pm_arrow.svg" x="894" y="-40" width="20" height="20" />

          <line x1="800" y1="-27" x2="865" y2="-27" stroke="#000" strokeWidth="1" />
          <image href="/svgs/filled_circle.svg" x="891" y="-15" width="6" height="6" />
          <line x1="865" y1="-27" x2="895" y2="-12" stroke="#000" strokeWidth="1" />
          <image href="/svgs/4pm_arrow.svg" x="890" y="-15" width="20" height="20" />

          {/* Dashed line across heat exchanger */}
          <image href="/svgs/Horizontal-dotted_line.svg" x="800" y="-6" width="270" height="15" />

          <line x1="800" y1="35" x2="865" y2="35" stroke="#000" strokeWidth="1" />
          <line x1="865" y1="35" x2="895" y2="17" stroke="#000" strokeWidth="1" />
          <image href="/svgs/2pm_arrow.svg" x="893" y="5.5" width="20" height="20" />

          <line x1="800" y1="63" x2="870" y2="63" stroke="#000" strokeWidth="1" />
          <line x1="870" y1="63" x2="900" y2="43" stroke="#000" strokeWidth="1" />
          <image href="/svgs/2pm_arrow.svg" x="898" y="31" width="20" height="20" />

          <line x1="800" y1="91" x2="875" y2="91" stroke="#000" strokeWidth="1" />
          <line x1="875" y1="91" x2="905" y2="80" stroke="#000" strokeWidth="1" />
          <image href="/svgs/2pm_arrow.svg" x="903" y="68" width="20" height="20" />

          {/* Vertical line below trapezoid */}
          <line x1="935" y1="145" x2="935" y2="225" stroke="#000" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};

export default PidDiagram;
