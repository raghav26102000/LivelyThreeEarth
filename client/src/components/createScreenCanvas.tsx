// The logic to create the 2D canvas content is extracted here.

// Helper function to draw a rounded rectangle
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export function createScreenCanvas(): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas');
  // Increase resolution for better quality (2x)
  canvas.width = 720;
  canvas.height = 1520;
  const ctx = canvas.getContext('2d', { 
    alpha: true, // Must be true for transparency
    desynchronized: true,
    willReadFrequently: false
  });
  
  if (!ctx) return null;
  
  // Scale all drawing operations by 2x
  ctx.scale(2, 2);

  // --- Theme Colors ---
  const PRIMARY_COLOR = '#1A73E8'; // Blue for calls to action
  const ACCENT_COLOR = '#34A853'; // Vibrant Green
  const BG_LIGHT = '#F4F7FB'; // Light background
  const TEXT_DARK = '#202124'; // Dark text
  const TEXT_MUTED = '#5F6368'; // Muted text

  // --- CRITICAL FIX: Set Clipping Path for Rounded Corners ---
  // The phone screen area is 360x760 (unscaled). We clip the drawing to this rounded shape.
  const phoneScreenRadius = 35; // Radius to match the phone's physical screen corners
  drawRoundedRect(ctx, 0, 0, 360, 760, phoneScreenRadius);
  ctx.clip(); // All subsequent drawing is confined to this rounded rectangle, leaving corners transparent.

  // 1. Draw the main app background (Fills the now-clipped area)
  ctx.fillStyle = BG_LIGHT;
  ctx.fillRect(0, 0, 360, 760);

  // --- UI Elements ---

  // Status Bar Area (A little inset is still needed for visuals)
  const insetX = 8;
  const insetY = 10;
  ctx.fillStyle = TEXT_MUTED;
  ctx.font = '14px system-ui';
  ctx.fillText('10:45', 20 + insetX, 30 + insetY);
  ctx.textAlign = 'right';
  ctx.fillText('92%', 335 - insetX, 30 + insetY);
  ctx.textAlign = 'left';

  // Header
  ctx.fillStyle = TEXT_DARK;
  ctx.font = 'bold 24px system-ui';
  ctx.fillText('Nutrition Dashboard', 20, 80);

  ctx.fillStyle = TEXT_MUTED;
  ctx.font = '14px system-ui';
  ctx.fillText('Track your daily fiber, protein, and micro intake.', 20, 105);


  // 2. Main Progress Card 
  const cardY = 130;
  const cardX = 20;
  const cardW = 320;
  const cardH = 200;
  const cardRadius = 16;
  
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  
  // Card Title
  ctx.fillStyle = PRIMARY_COLOR;
  ctx.font = 'bold 18px system-ui';
  ctx.fillText('Fiber Goal: 65% Complete', cardX + 16, cardY + 40);

  ctx.fillStyle = TEXT_MUTED;
  ctx.font = '14px system-ui';
  ctx.fillText('28 / 42 g needed today', cardX + 16, cardY + 65);

  // Big Circular Progress
  const circleX = cardX + 170;
  const circleY = cardY + 120;
  const circleRadius = 40;
  const progressRatio = 0.65;
  
  // Progress Ring Background
  ctx.strokeStyle = '#E9ECEF';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Progress Ring Foreground (Vibrant Green)
  ctx.strokeStyle = ACCENT_COLOR;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progressRatio));
  ctx.stroke();

  // Progress Text
  ctx.fillStyle = TEXT_DARK;
  ctx.font = 'bold 22px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('65%', circleX, circleY + 8);
  ctx.textAlign = 'left';


  // Key Stats beside progress
  ctx.fillStyle = TEXT_DARK;
  ctx.font = 'bold 16px system-ui';
  ctx.fillText('Protein', cardX + 16, cardY + 120);
  ctx.fillStyle = PRIMARY_COLOR;
  ctx.font = 'bold 18px system-ui';
  ctx.fillText('85 g', cardX + 16, cardY + 145);

  ctx.fillStyle = TEXT_DARK;
  ctx.font = 'bold 16px system-ui';
  ctx.fillText('Micros', cardX + 16, cardY + 175);
  ctx.fillStyle = ACCENT_COLOR;
  ctx.font = 'bold 18px system-ui';
  ctx.fillText('A+', cardX + 16, cardY + 200);


  // 3. Bar Chart Mockup (Recent Activity)
  const chartY = 360;
  ctx.fillStyle = TEXT_DARK;
  ctx.font = 'bold 18px system-ui';
  ctx.fillText('Weekly Trend', 20, chartY);

  const chartAreaY = chartY + 20;
  const barW = 12;
  const barGap = 35;
  const barHeights = [40, 60, 20, 75, 50, 80, 70];
  const chartStartX = 30;

  barHeights.forEach((h, i) => {
    const x = chartStartX + i * barGap;
    const y = chartAreaY + 100 - h;
    
    ctx.fillStyle = i === 5 ? PRIMARY_COLOR : '#CBD3DA'; // Highlight today's bar
    drawRoundedRect(ctx, x, y, barW, h, 4);
    ctx.fill();
    
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'][i], x + barW / 2, chartAreaY + 115);
  });
  ctx.textAlign = 'left'; // Reset alignment

  // 4. Navigation Bar (Bottom)
  const navY = 680;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, navY, 360, 760 - navY); // Fill the bottom area completely with white, which is already clipped to be rounded.
  
  ctx.strokeStyle = '#E9ECEF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, navY);
  ctx.lineTo(360, navY);
  ctx.stroke();

  // Navigation Items
  const navItems = [
    { x: 70, icon: '🏠', label: 'Home', active: true },
    { x: 180, icon: '🥕', label: 'Log', active: false },
    { x: 290, icon: '👤', label: 'Profile', active: false }
  ];

  navItems.forEach(item => {
    ctx.fillStyle = item.active ? PRIMARY_COLOR : TEXT_MUTED;
    ctx.font = '24px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(item.icon, item.x, navY + 30);
    
    ctx.font = '11px system-ui';
    ctx.fillText(item.label, item.x, navY + 58);
  });
  
  // Floating Action Button (FAB)
  const fabX = 300;
  const fabY = 610;
  const fabRadius = 28;
  
  ctx.fillStyle = ACCENT_COLOR;
  ctx.beginPath();
  ctx.arc(fabX, fabY, fabRadius, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(52, 168, 83, 0.4)';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0; // Clear shadow
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px system-ui';
  ctx.fillText('+', fabX, fabY + 10);


  return canvas;
}