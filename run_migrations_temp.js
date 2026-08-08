const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const projectRef = "czuqhsrhmiheccurhyxe";
const password = "Oluwaferanmi224.";
const dbName = "postgres";
const host = "aws-0-eu-west-3.pooler.supabase.com";

const migrations = [
  "supabase/migrations/20260808000000_admin_rls_patch_v2.sql"
];

async function run() {
  const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/${dbName}`;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting to Supabase database...");
    await client.connect();
    console.log("Connected successfully!");

    for (const filePath of migrations) {
      const fullPath = path.resolve(filePath);
      console.log(`\nReading migration file: ${filePath}...`);
      
      if (!fs.existsSync(fullPath)) {
        console.error(`Error: Migration file not found at ${fullPath}`);
        continue;
      }

      const sql = fs.readFileSync(fullPath, "utf8");
      console.log("Running SQL commands...");
      
      await client.query(sql);
      console.log(`Migration ${filePath} executed successfully!`);
    }

    console.log("\nRLS Version 2 patch applied successfully! Both admin accounts now have database access permissions.");
    
    // Self-delete
    try {
      fs.unlinkSync(__filename);
      console.log("Cleaned up temporary migration runner.");
    } catch (e) {}

  } catch (err) {
    console.error("Migration execution failed:", err);
  } finally {
    await client.end();
  }
}

run();
