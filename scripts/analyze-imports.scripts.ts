#!/usr/bin/env bun
import { Glob } from "bun";
import fs from "fs";
import path from "path";

console.log("🔍 Analyzing imports in the codebase...");

const srcDir = path.join(process.cwd(), "src");
const glob = new Glob("**/*.ts");

const mongooseImports = new Set<string>();
const topsydeImports = new Set<string>();

// Scan all TypeScript files
for await (const file of glob.scan(srcDir)) {
  const filePath = path.join(srcDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Find mongoose imports
  const mongooseMatches = content.matchAll(/import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]mongoose['"]/g);
  for (const match of mongooseMatches) {
    if (match[1]) {
      // Named imports
      match[1].split(",").forEach(imp => {
        mongooseImports.add(imp.trim());
      });
    } else if (match[2]) {
      // Default import
      mongooseImports.add("default");
    }
  }
  
  // Find mongoose namespace imports
  const mongooseStarMatches = content.matchAll(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]mongoose['"]/g);
  for (const match of mongooseStarMatches) {
    mongooseImports.add("* as " + match[1]);
  }
  
  // Find topsyde-utils imports
  const topsydeMatches = content.matchAll(/import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]topsyde-utils['"]/g);
  for (const match of topsydeMatches) {
    if (match[1]) {
      // Named imports
      match[1].split(",").forEach(imp => {
        const cleaned = imp.trim().split(" as ")[0].trim();
        topsydeImports.add(cleaned);
      });
    }
  }
}

console.log("\n📦 Mongoose imports used:");
console.log([...mongooseImports].sort().join(", "));

console.log("\n📦 Topsyde-utils imports used:");
console.log([...topsydeImports].sort().join(", "));

// Generate optimization recommendations
console.log("\n💡 Optimization Recommendations:");
console.log("\n1. For Mongoose:");
if (mongooseImports.has("* as mongoose")) {
  console.log("   ⚠️  Using namespace import (* as mongoose) prevents tree shaking");
  console.log("   ✅ Consider importing only what you need:");
  console.log("      import { Schema, model, connect } from 'mongoose';");
}

console.log("\n2. For topsyde-utils:");
if (topsydeImports.size > 0) {
  console.log("   ✅ Already using named imports, which enables tree shaking");
  console.log("   📦 Imported modules:", [...topsydeImports].join(", "));
}

// Check actual usage in bundled file
const bundlePath = path.join(process.cwd(), "packages/main/index/index.js");
if (fs.existsSync(bundlePath)) {
  const bundleContent = fs.readFileSync(bundlePath, "utf-8");
  const bundleSize = (bundleContent.length / 1024).toFixed(2);
  console.log(`\n📊 Current bundle size: ${bundleSize} KB`);
}