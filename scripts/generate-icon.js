const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const generateIcon = async (size, outputPath) => {
  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DA3743;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C12E39;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Red circular background -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#bg)"/>
  
  <!-- Lighter red inner circle for depth -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - size*0.04}" fill="#E84A55"/>
  
  <!-- White book icon -->
  <g transform="translate(${size*0.25}, ${size*0.25})">
    <!-- Book base - simplified open book -->
    <path d="M${size*0.1} ${size*0.2} L${size*0.5} ${size*0.1} L${size*0.9} ${size*0.2} L${size*0.9} ${size*0.85} L${size*0.5} ${size*0.75} L${size*0.1} ${size*0.85} Z" 
          fill="white" 
          stroke="white" 
          stroke-width="${size*0.015}"/>
    
    <!-- Book spine -->
    <line x1="${size*0.5}" y1="${size*0.1}" x2="${size*0.5}" y2="${size*0.75}" 
          stroke="white" 
          stroke-width="${size*0.025}" 
          stroke-linecap="round"/>
    
    <!-- Left page (blank/white) -->
    <rect x="${size*0.15}" y="${size*0.25}" width="${size*0.3}" height="${size*0.55}" 
          fill="white" 
          opacity="0.95"/>
    
    <!-- Right page with lines (text) -->
    <rect x="${size*0.55}" y="${size*0.25}" width="${size*0.3}" height="${size*0.55}" 
          fill="white" 
          opacity="0.95"/>
    
    <!-- Text lines on right page -->
    <line x1="${size*0.6}" y1="${size*0.35}" x2="${size*0.8}" y2="${size*0.35}" 
          stroke="#DA3743" 
          stroke-width="${size*0.018}" 
          stroke-linecap="round"/>
    <line x1="${size*0.6}" y1="${size*0.45}" x2="${size*0.8}" y2="${size*0.45}" 
          stroke="#DA3743" 
          stroke-width="${size*0.018}" 
          stroke-linecap="round"/>
    <line x1="${size*0.6}" y1="${size*0.55}" x2="${size*0.75}" y2="${size*0.55}" 
          stroke="#DA3743" 
          stroke-width="${size*0.018}" 
          stroke-linecap="round"/>
  </g>
</svg>`;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  
  console.log(`✅ Generated ${path.basename(outputPath)} (${size}x${size})`);
};

const generateAllIcons = async () => {
  const androidResPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
  
  for (const [folder, size] of Object.entries(iconSizes)) {
    const folderPath = path.join(androidResPath, folder);
    
    // Ensure directory exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }
    
    // Generate regular icon
    await generateIcon(size, path.join(folderPath, 'ic_launcher.png'));
    
    // Generate round icon (same design)
    await generateIcon(size, path.join(folderPath, 'ic_launcher_round.png'));
  }
  
  console.log('\n🎉 All app icons generated successfully!');
};

generateAllIcons().catch(console.error);
