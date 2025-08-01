#!/usr/bin/env bun
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

console.log("🚀 Starting optimized docts build with tree shaking...");

// Step 1: Run docts build with dependencies included
console.log("📦 Building with docts...");
try {
  // Build with docts, including the dependencies for tree shaking
  execSync("docts build --include-dependencies mongoose topsyde-utils", {
    cwd: projectRoot,
    stdio: "inherit",
  });
} catch (error) {
  console.error("❌ docts build failed:", error);
  process.exit(1);
}

// Step 2: Post-process the generated bundle for additional optimization
console.log("🔧 Post-processing bundle for size optimization...");

const bundlePath = path.join(projectRoot, "packages/main/index/index.js");

if (fs.existsSync(bundlePath)) {
  let bundleContent = fs.readFileSync(bundlePath, "utf-8");
  
  // Get original size
  const originalSize = Buffer.byteLength(bundleContent, "utf-8");
  
  // Apply some manual optimizations
  // Remove unnecessary mongoose features if not used
  const mongooseOptimizations = [
    // Remove mongoose browser-specific code
    /if\s*\(typeof\s+window\s*!==?\s*['"]undefined['"]\)\s*{[^}]*}/g,
    // Remove mongoose debug logging in production
    /mongoose\.set\(['"]debug['"]/g,
  ];
  
  mongooseOptimizations.forEach(regex => {
    bundleContent = bundleContent.replace(regex, "");
  });
  
  // Write optimized bundle
  fs.writeFileSync(bundlePath, bundleContent);
  
  // Get new size
  const newSize = Buffer.byteLength(bundleContent, "utf-8");
  const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);
  
  console.log(`✅ Bundle optimized!`);
  console.log(`📊 Original size: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`📊 New size: ${(newSize / 1024).toFixed(2)} KB`);
  console.log(`📉 Size reduction: ${reduction}%`);
} else {
  console.error("❌ Bundle file not found at:", bundlePath);
  process.exit(1);
}

// Step 3: Create optimized package.json with minimal dependencies
console.log("📝 Updating package.json...");
const packageJsonPath = path.join(projectRoot, "packages/main/index/package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

// Since we're bundling dependencies, we might be able to remove them from package.json
// depending on how complete the bundling is
console.log("✅ Build complete!");