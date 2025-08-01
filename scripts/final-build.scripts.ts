#!/usr/bin/env bun
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 DigitalOcean Serverless Optimized Build\n");

const projectRoot = process.cwd();
const bundlePath = path.join(projectRoot, "packages/main/index/index.js");

// Check if we have the current bundle
let originalSize = 0;
if (fs.existsSync(bundlePath)) {
  const content = fs.readFileSync(bundlePath, "utf-8");
  originalSize = Buffer.byteLength(content, "utf-8");
  console.log(`📏 Current bundle: ${(originalSize / 1024).toFixed(2)} KB`);
}

console.log("\n📦 Building with docts (optimal serverless configuration)...");
console.log("ℹ️  Keeping dependencies external for optimal cold start performance");

try {
  // Build with docts - dependencies are external for serverless
  execSync("docts build", {
    cwd: projectRoot,
    stdio: "inherit"
  });
  
  console.log("\n✅ Build completed!");
  
  // Analyze the final bundle
  if (fs.existsSync(bundlePath)) {
    const content = fs.readFileSync(bundlePath, "utf-8");
    const newSize = Buffer.byteLength(content, "utf-8");
    const lines = content.split("\n").length;
    
    console.log("\n📊 Bundle Analysis:");
    console.log(`- Size: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`- Lines: ${lines}`);
    
    if (originalSize > 0) {
      const reduction = Number(((originalSize - newSize) / originalSize * 100).toFixed(2));
      console.log(`- Change: ${reduction > 0 ? "-" : "+"}${Math.abs(Number(reduction))}%`);
    }
    
    // Check what's in the bundle
    const hasMongoose = content.includes("mongoose");
    const hasTopsydeUtils = content.includes("topsyde-utils") || content.includes("Guards") || content.includes("Lib");
    
    console.log("\n📦 Dependencies:");
    console.log(`- Mongoose: ${hasMongoose ? "Bundled ⚠️" : "External ✅"}`);
    console.log(`- topsyde-utils: ${hasTopsydeUtils ? "Bundled ⚠️" : "External ✅"}`);
    
    // Skip post-process optimizations - they can break the code
    console.log("\n✅ Skipping aggressive minification to preserve code integrity");
    
    // Check package.json
    const packageJsonPath = path.join(projectRoot, "packages/main/index/package.json");
    if (fs.existsSync(packageJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      console.log("\n📋 Function dependencies:");
      console.log(JSON.stringify(pkgJson.dependencies || {}, null, 2));
    }
  }
  
  console.log("\n💡 Recommendations:");
  console.log("1. Dependencies are kept external for optimal cold start performance");
  console.log("2. DigitalOcean Functions handles dependency installation automatically");
  console.log("3. Use 'doctl serverless deploy' to deploy your optimized function");
  
} catch (error) {
  console.error("\n❌ Build failed:", error);
  process.exit(1);
}