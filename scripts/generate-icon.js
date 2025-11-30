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

const sourceLogoPath = path.join(__dirname, '..', 'src', 'assets', 'images', 'bookable-logo.png');

const generateIcon = async (size, outputPath) => {
  try {
    // Make logo fill 90% of the icon size to reduce padding
    const logoSize = Math.floor(size * 0.9);
    const padding = Math.floor((size - logoSize) / 2);
    
    // Resize the source logo to fill more space
    await sharp(sourceLogoPath)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: {r: 255, g: 255, b: 255, alpha: 0} // Transparent background
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: {r: 255, g: 255, b: 255, alpha: 0} // Transparent
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated ${path.basename(outputPath)} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Error generating ${outputPath}:`, error.message);
  }
};

const generateAllIcons = async () => {
  // Check if source logo exists
  if (!fs.existsSync(sourceLogoPath)) {
    console.error(`❌ Source logo not found at: ${sourceLogoPath}`);
    console.error('Please ensure bookable-logo.png is in src/assets/images/');
    process.exit(1);
  }

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
