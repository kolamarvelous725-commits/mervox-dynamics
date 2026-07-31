async function run() {
  try {
    console.log("1. Fetching temporary domains from mail.tm...");
    const domainsRes = await fetch("https://api.mail.tm/domains");
    const domainsData = await domainsRes.json();
    const domain = domainsData["hydra:member"][0].domain;
    
    const rand = Math.random().toString(36).substring(2, 10);
    const email = `${rand}@${domain}`;
    const password = "MvxPassword123!";
    console.log(`Generated email: ${email}`);

    console.log("2. Creating mail.tm account...");
    const accountRes = await fetch("https://api.mail.tm/accounts", {
      method: "POST",
      body: JSON.stringify({ address: email, password }),
      headers: { "Content-Type": "application/json" }
    });
    if (!accountRes.ok) {
      throw new Error(`Failed to create mail account: ${await accountRes.text()}`);
    }

    console.log("3. Authenticating mail.tm account to get JWT token...");
    const tokenRes = await fetch("https://api.mail.tm/token", {
      method: "POST",
      body: JSON.stringify({ address: email, password }),
      headers: { "Content-Type": "application/json" }
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.token;

    console.log("4. Registering a new bucket on kvdb.io...");
    const kvdbRes = await fetch("https://kvdb.io/", {
      method: "POST",
      body: new URLSearchParams({ email: email }),
    });
    const bucketId = await kvdbRes.text();
    console.log(`Created KVDB Bucket ID (unverified): ${bucketId}`);

    console.log("5. Waiting for kvdb.io activation email (polling)...");
    let activationLink = null;
    for (let attempt = 1; attempt <= 20; attempt++) {
      console.log(`Polling mailbox (attempt ${attempt}/20)...`);
      const msgsRes = await fetch("https://api.mail.tm/messages", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const msgsData = await msgsRes.json();
      const msgs = msgsData["hydra:member"] || [];
      
      if (msgs.length > 0) {
        console.log("Activation email received! Fetching message details...");
        const msgId = msgs[0].id;
        const msgDetailRes = await fetch(`https://api.mail.tm/messages/${msgId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const msgDetail = await msgDetailRes.json();
        const html = msgDetail.html?.[0] || msgDetail.text || "";
        
        // Extract the activation link
        const match = html.match(/https:\/\/kvdb\.io\/activate\/[a-zA-Z0-9_\-]+/);
        if (match) {
          activationLink = match[0];
          console.log(`Activation Link found: ${activationLink}`);
          break;
        }
      }
      await new Promise((r) => setTimeout(r, 3000));
    }

    if (!activationLink) {
      throw new Error("Activation email timeout.");
    }

    console.log("6. Clicking activation link to verify bucket...");
    const activateRes = await fetch(activationLink);
    console.log(`Activation request status: ${activateRes.status}`);
    const activateText = await activateRes.text();
    console.log(`Verification Response: ${activateText.substring(0, 200)}`);

    console.log("\nSUCCESS!");
    console.log(`VERIFIED BUCKET ID: ${bucketId}`);
  } catch (err) {
    console.error("Failed:", err);
  }
}
run();
