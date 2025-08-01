#!/usr/bin/env bun
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const bundlePath = path.join(process.cwd(), "packages/main/index/index.js");

console.log("📊 Bundle Size Analysis for DigitalOcean Serverless Functions\n");

// Check current bundle if it exists
if (fs.existsSync(bundlePath)) {
  const currentBundle = fs.readFileSync(bundlePath, "utf-8");
  const currentSize = Buffer.byteLength(currentBundle, "utf-8");
  console.log(`Current bundle size: ${(currentSize / 1024).toFixed(2)} KB`);
  
  // Analyze what's in the bundle
  const hasFullMongoose = currentBundle.includes("MongooseError") && currentBundle.includes("SchemaType");
  const hasTopsydeUtils = currentBundle.includes("Guards") || currentBundle.includes("Lib");
  
  console.log("\n📦 Bundle analysis:");
  console.log(`- Contains full Mongoose: ${hasFullMongoose ? "Yes ⚠️" : "No ✅"}`);
  console.log(`- Contains topsyde-utils: ${hasTopsydeUtils ? "Yes" : "No"}`);
}

console.log("\n🔨 Building with docts (including dependencies for tree shaking)...");

try {
  // Build with dependencies included to enable tree shaking
  execSync("docts build --include-dependencies mongoose topsyde-utils", {
    cwd: process.cwd(),
    stdio: "pipe",
  });
  
  console.log("✅ Build completed!");
  
  // Check new bundle size
  if (fs.existsSync(bundlePath)) {
    const newBundle = fs.readFileSync(bundlePath, "utf-8");
    const newSize = Buffer.byteLength(newBundle, "utf-8");
    
    console.log(`\n📏 New bundle size: ${(newSize / 1024).toFixed(2)} KB`);
    
    // Check if tree shaking worked
    const stillHasFullMongoose = newBundle.includes("MongooseError") && newBundle.includes("SchemaType");
    const onlyHasUsedMongoose = newBundle.includes("Schema") && newBundle.includes("model") && !newBundle.includes("MongooseArray");
    
    console.log("\n🌳 Tree shaking results:");
    if (!stillHasFullMongoose && onlyHasUsedMongoose) {
      console.log("✅ Mongoose successfully tree-shaken - only used exports included");
    } else if (stillHasFullMongoose) {
      console.log("⚠️  Mongoose might not be fully tree-shaken");
    }
    
    // Additional optimization suggestions
    console.log("\n💡 Additional optimization tips:");
    console.log("1. Ensure all imports use named imports (not namespace imports)");
    console.log("2. Consider using '--minify' flag with docts if available");
    console.log("3. For serverless, consider lazy loading heavy dependencies");
    
    // Check package.json dependencies
    const pkgJsonPath = path.join(process.cwd(), "packages/main/index/package.json");
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
      console.log("\n📋 Package dependencies:");
      console.log(JSON.stringify(pkgJson.dependencies, null, 2));
    }
  }
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}