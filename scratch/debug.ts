import { db } from "../src/lib/db";
import { accounts, users } from "../src/lib/db/schema";

async function main() {
  const allUsers = await db.select().from(users);
  console.log("USERS:", allUsers);
  const allAccounts = await db.select().from(accounts);
  console.log("ACCOUNTS:", allAccounts);
}

main().catch(console.error);
