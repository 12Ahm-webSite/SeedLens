// Helper to generate version-contextual SVG visual banners for map hover cards
// Lightweight, zero-latency, offline-capable, and pixel-crisp

export function getHoverCardBanner(
  typeOrCategory: string,
  version: string = '1.20.6',
  isBedrock: boolean = false
): string {
  const norm = typeOrCategory.toLowerCase();
  const is118 = version.startsWith('1.18');
  const is119 = version.startsWith('1.19');
  const is120 = version.startsWith('1.20');
  const is121Or26 = version.startsWith('1.21') || version.startsWith('26');

  // 1. Cherry Blossom Caldera / Cherry Grove
  if (norm.includes('cherry')) {
    if (is118 || is119) {
      // In 1.18/1.19, Cherry Grove didn't exist yet, show snowy mountain caldera
      return `
        <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="snowSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#93C5FD"/>
              <stop offset="100%" stop-color="#E2E8F0"/>
            </linearGradient>
          </defs>
          <rect width="210" height="60" fill="url(#snowSky)"/>
          <polygon points="0,60 35,15 70,60" fill="#CBD5E1"/>
          <polygon points="25,28 35,15 45,28" fill="#FFFFFF"/>
          <polygon points="50,60 105,8 160,60" fill="#94A3B8"/>
          <polygon points="90,20 105,8 120,20" fill="#FFFFFF"/>
          <polygon points="140,60 175,18 210,60" fill="#CBD5E1"/>
          <polygon points="165,29 175,18 185,29" fill="#FFFFFF"/>
          <rect y="44" width="210" height="16" fill="#15803D"/>
          <circle cx="105" cy="52" r="14" fill="#0284C7"/>
        </svg>
      `;
    }
    // 1.20+ / 1.21 / 26.x Cherry Blossom Caldera
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cherrySky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FCE7F3"/>
            <stop offset="100%" stop-color="#FBCFE8"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#cherrySky)"/>
        <!-- Background snow mountains -->
        <polygon points="0,60 40,12 80,60" fill="#E2E8F0"/>
        <polygon points="30,24 40,12 50,24" fill="#FFFFFF"/>
        <polygon points="60,60 115,5 170,60" fill="#CBD5E1"/>
        <polygon points="100,17 115,5 130,17" fill="#FFFFFF"/>
        <polygon points="150,60 185,14 210,60" fill="#E2E8F0"/>
        <polygon points="175,25 185,14 195,25" fill="#FFFFFF"/>
        <!-- Cherry Trees & Valley -->
        <rect y="42" width="210" height="18" fill="#4ADE80"/>
        <circle cx="105" cy="51" r="16" fill="#38BDF8"/>
        <!-- Cherry Tree canopies -->
        <rect x="20" y="32" width="16" height="12" fill="#F472B6" rx="2"/>
        <rect x="26" y="44" width="4" height="6" fill="#831843"/>
        <rect x="60" y="30" width="18" height="13" fill="#EC4899" rx="2"/>
        <rect x="67" y="43" width="4" height="7" fill="#831843"/>
        <rect x="135" y="31" width="18" height="13" fill="#EC4899" rx="2"/>
        <rect x="142" y="44" width="4" height="6" fill="#831843"/>
        <rect x="175" y="33" width="16" height="12" fill="#F472B6" rx="2"/>
        <rect x="181" y="45" width="4" height="5" fill="#831843"/>
        <!-- Falling Petals -->
        <circle cx="35" cy="22" r="1.5" fill="#FB7185"/>
        <circle cx="85" cy="26" r="1.5" fill="#FB7185"/>
        <circle cx="125" cy="20" r="1.5" fill="#FB7185"/>
        <circle cx="165" cy="24" r="1.5" fill="#FB7185"/>
      </svg>
    `;
  }

  // 2. Mountain Crater Ring
  if (norm.includes('crater') || norm.includes('mountain')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="craterSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#7DD3FC"/>
            <stop offset="100%" stop-color="#E0F2FE"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#craterSky)"/>
        <!-- Jagged Peak Wall -->
        <polygon points="-10,60 30,8 70,60" fill="#64748B"/>
        <polygon points="18,23 30,8 42,23" fill="#FFFFFF"/>
        <polygon points="50,60 95,4 140,60" fill="#475569"/>
        <polygon points="82,18 95,4 108,18" fill="#FFFFFF"/>
        <polygon points="120,60 165,10 210,60" fill="#64748B"/>
        <polygon points="153,24 165,10 177,24" fill="#FFFFFF"/>
        <!-- Crater Basin Interior -->
        <ellipse cx="105" cy="50" rx="90" ry="16" fill="#15803D"/>
        <ellipse cx="105" cy="51" rx="45" ry="9" fill="#0284C7"/>
      </svg>
    `;
  }

  // 3. Epic Clifftop / Vista
  if (norm.includes('cliff') || norm.includes('vista')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#C084FC"/>
            <stop offset="60%" stop-color="#F472B6"/>
            <stop offset="100%" stop-color="#FDE047"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#sunsetSky)"/>
        <!-- Ocean Horizon below -->
        <rect y="46" width="210" height="14" fill="#0369A1"/>
        <!-- Sheer Cliff Wall -->
        <polygon points="0,60 0,14 75,14 110,60" fill="#334155"/>
        <polygon points="0,14 75,14 70,18 0,18" fill="#22C55E"/>
        <!-- Clouds drifting across gap -->
        <rect x="80" y="32" width="40" height="6" fill="#FFFFFF" opacity="0.6" rx="3"/>
        <rect x="130" y="24" width="55" height="7" fill="#FFFFFF" opacity="0.5" rx="3"/>
        <rect x="40" y="22" width="35" height="5" fill="#FFFFFF" opacity="0.4" rx="2"/>
      </svg>
    `;
  }

  // 4. Prime Building Basin
  if (norm.includes('basin') || norm.includes('building')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="basinSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#60A5FA"/>
            <stop offset="100%" stop-color="#BAE6FD"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#basinSky)"/>
        <!-- Distant gentle hills -->
        <polygon points="0,60 50,30 100,60" fill="#86EFAC"/>
        <polygon points="80,60 140,26 200,60" fill="#4ADE80"/>
        <polygon points="160,60 190,32 220,60" fill="#86EFAC"/>
        <!-- Broad Flat Meadow -->
        <rect y="38" width="210" height="22" fill="#22C55E"/>
        <!-- Meandering River -->
        <path d="M 0,54 Q 60,44 110,52 T 210,48" stroke="#38BDF8" stroke-width="6" fill="none"/>
        <!-- Small Oak Trees -->
        <circle cx="45" cy="36" r="6" fill="#15803D"/>
        <rect x="44" y="42" width="2" height="4" fill="#78350F"/>
        <circle cx="165" cy="34" r="7" fill="#15803D"/>
        <rect x="164" y="41" width="2" height="4" fill="#78350F"/>
      </svg>
    `;
  }

  // 5. Isolated Survival Island
  if (norm.includes('island')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="islandSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38BDF8"/>
            <stop offset="100%" stop-color="#93C5FD"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#islandSky)"/>
        <!-- Endless Deep Ocean -->
        <rect y="32" width="210" height="28" fill="#0369A1"/>
        <path d="M 0,38 Q 25,36 50,38 T 100,38 T 150,38 T 200,38" stroke="#38BDF8" stroke-width="1.5" fill="none"/>
        <path d="M 0,48 Q 25,46 50,48 T 100,48 T 150,48 T 200,48" stroke="#0284C7" stroke-width="1.5" fill="none"/>
        <!-- Lone Island Dome -->
        <ellipse cx="105" cy="42" rx="42" ry="12" fill="#FDE047"/>
        <ellipse cx="105" cy="40" rx="36" ry="9" fill="#22C55E"/>
        <!-- Lone Palm/Tree -->
        <rect x="103" y="24" width="4" height="15" fill="#78350F"/>
        <ellipse cx="105" cy="22" rx="12" ry="6" fill="#15803D"/>
      </svg>
    `;
  }

  // 6. Trial Chambers (1.21+ / 26.x exclusive)
  if (norm.includes('trial') || norm.includes('chamber')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="trialBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="100%" stop-color="#1E293B"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#trialBg)"/>
        <!-- Tuff Bricks Pattern -->
        <rect x="20" y="10" width="35" height="15" fill="#475569" stroke="#334155"/>
        <rect x="55" y="10" width="35" height="15" fill="#64748B" stroke="#334155"/>
        <rect x="120" y="10" width="35" height="15" fill="#64748B" stroke="#334155"/>
        <rect x="155" y="10" width="35" height="15" fill="#475569" stroke="#334155"/>
        <rect x="35" y="25" width="40" height="15" fill="#334155" stroke="#1E293B"/>
        <rect x="135" y="25" width="40" height="15" fill="#334155" stroke="#1E293B"/>
        <!-- Oxidized Copper Pillars & Cut Copper Center -->
        <rect x="10" y="5" width="10" height="50" fill="#2DD4BF" stroke="#0D9488"/>
        <rect x="190" y="5" width="10" height="50" fill="#2DD4BF" stroke="#0D9488"/>
        <!-- Trial Spawner Pedestal -->
        <rect x="88" y="28" width="34" height="26" fill="#C2410C" stroke="#7C2D12" stroke-width="1.5"/>
        <!-- Glowing Trial Fire Core -->
        <rect x="97" y="34" width="16" height="14" fill="#F59E0B"/>
        <rect x="101" y="38" width="8" height="6" fill="#FEF08A"/>
        <circle cx="105" cy="41" r="10" fill="#F59E0B" opacity="0.3"/>
      </svg>
    `;
  }

  // 7. Ancient City (Deep Dark / Sculk)
  if (norm.includes('ancient') || norm.includes('city') || norm.includes('sculk')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sculkBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="100%" stop-color="#0B132B"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#sculkBg)"/>
        <!-- Deepslate Reinforced Portal Frame -->
        <rect x="75" y="8" width="60" height="46" fill="#0F172A" stroke="#1E293B" stroke-width="2"/>
        <rect x="87" y="16" width="36" height="38" fill="#020617"/>
        <!-- Sculk Tendrils & Soul Fire Lanterns -->
        <circle cx="50" cy="48" r="4" fill="#06B6D4"/>
        <circle cx="65" cy="52" r="3" fill="#0891B2"/>
        <circle cx="145" cy="50" r="4" fill="#06B6D4"/>
        <circle cx="160" cy="52" r="3" fill="#0891B2"/>
        <!-- Soul Lantern Glow -->
        <rect x="42" y="32" width="6" height="8" fill="#22D3EE"/>
        <rect x="162" y="32" width="6" height="8" fill="#22D3EE"/>
      </svg>
    `;
  }

  // 8. Village
  if (norm.includes('village')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="villageSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#93C5FD"/>
            <stop offset="100%" stop-color="#DBEAFE"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#villageSky)"/>
        <rect y="38" width="210" height="22" fill="#84CC16"/>
        <!-- Path -->
        <path d="M 0,55 Q 60,48 105,52 T 210,50" stroke="#A8A29E" stroke-width="7" fill="none"/>
        <!-- Village Houses -->
        <rect x="25" y="24" width="24" height="18" fill="#78350F"/>
        <polygon points="21,24 37,12 53,24" fill="#B45309"/>
        <rect x="33" y="32" width="6" height="10" fill="#38240D"/>
        <rect x="75" y="22" width="30" height="20" fill="#78350F"/>
        <polygon points="70,22 90,10 110,22" fill="#B45309"/>
        <rect x="86" y="28" width="8" height="8" fill="#FBBF24"/>
        <!-- Wheat Farm Plot -->
        <rect x="140" y="36" width="45" height="12" fill="#92400E"/>
        <rect x="142" y="34" width="41" height="4" fill="#FACC15"/>
      </svg>
    `;
  }

  // 9. Desert Pyramid
  if (norm.includes('pyramid') || norm.includes('desert')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="desertSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="100%" stop-color="#F59E0B"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#desertSky)"/>
        <rect y="40" width="210" height="20" fill="#FBBF24"/>
        <!-- Stepped Sandstone Pyramid Structure -->
        <polygon points="105,10 65,48 145,48" fill="#D97706"/>
        <rect x="80" y="40" width="50" height="8" fill="#B45309"/>
        <rect x="90" y="32" width="30" height="8" fill="#D97706"/>
        <rect x="98" y="24" width="14" height="8" fill="#B45309"/>
        <!-- Orange Terracotta diamond accent -->
        <polygon points="105,34 100,38 105,42 110,38" fill="#DC2626"/>
        <!-- Twin Towers -->
        <rect x="45" y="20" width="16" height="28" fill="#D97706"/>
        <rect x="149" y="20" width="16" height="28" fill="#D97706"/>
      </svg>
    `;
  }

  // 10. Woodland Mansion
  if (norm.includes('mansion')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mansionSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#mansionSky)"/>
        <!-- Dark Oak Forest Floor -->
        <rect y="46" width="210" height="14" fill="#14532D"/>
        <!-- Mansion Facade -->
        <rect x="40" y="16" width="130" height="32" fill="#3B2314" stroke="#1C1008"/>
        <!-- Cobblestone Base -->
        <rect x="40" y="42" width="130" height="6" fill="#64748B"/>
        <!-- Roof Gables -->
        <polygon points="35,16 60,6 85,16" fill="#1C1008"/>
        <polygon points="85,16 105,6 125,16" fill="#1C1008"/>
        <polygon points="125,16 150,6 175,16" fill="#1C1008"/>
        <!-- Windows with yellow warm light -->
        <rect x="50" y="22" width="8" height="10" fill="#FEF08A"/>
        <rect x="70" y="22" width="8" height="10" fill="#FEF08A"/>
        <rect x="90" y="22" width="8" height="10" fill="#FEF08A"/>
        <rect x="110" y="22" width="8" height="10" fill="#FEF08A"/>
        <rect x="130" y="22" width="8" height="10" fill="#FEF08A"/>
        <rect x="150" y="22" width="8" height="10" fill="#FEF08A"/>
      </svg>
    `;
  }

  // 11. Ocean Monument
  if (norm.includes('monument')) {
    return `
      <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="monumentSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0369A1"/>
            <stop offset="100%" stop-color="#082F49"/>
          </linearGradient>
        </defs>
        <rect width="210" height="60" fill="url(#monumentSky)"/>
        <!-- Prismarine Structure -->
        <polygon points="105,12 45,52 165,52" fill="#0D9488"/>
        <polygon points="105,18 60,52 150,52" fill="#14B8A6"/>
        <!-- Sea Lantern Core -->
        <rect x="98" y="26" width="14" height="12" fill="#67E8F9"/>
        <rect x="102" y="30" width="6" height="4" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // 12. Default / Generic Overworld Scene
  return `
    <svg viewBox="0 0 210 60" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="defaultSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#60A5FA"/>
          <stop offset="100%" stop-color="#BFDBFE"/>
        </linearGradient>
      </defs>
      <rect width="210" height="60" fill="url(#defaultSky)"/>
      <polygon points="0,60 55,22 110,60" fill="#64748B"/>
      <polygon points="45,30 55,22 65,30" fill="#FFFFFF"/>
      <polygon points="90,60 145,18 200,60" fill="#475569"/>
      <polygon points="135,26 145,18 155,26" fill="#FFFFFF"/>
      <rect y="44" width="210" height="16" fill="#22C55E"/>
    </svg>
  `;
}
