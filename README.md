# 🟦 Base Activity Dashboard

A minimal, open‑source dashboard that analyzes **onchain activity of any wallet on Base**.  
Connect your wallet to view interactions, protocols used, frequency of activity, and an experimental **Airdrop Farmer Score**.

Designed to help users explore their onchain footprint and understand their behavior on the Base network.

---

## 🚀 Features (v1)

- **Wallet Login (Base)**  
  Connect using a Base‑compatible wallet (e.g., Backpack, Coinbase Wallet, Rabby, Rainbow).

- **Transaction History (Base Scan API)**  
  Fetch and display all onchain interactions of the connected address.

- **Protocol Detection**  
  Identify which protocols the user interacted with (Aerodrome, Uniswap, FriendTech-like contracts, etc.).

- **Activity Frequency**  
  Daily and weekly breakdowns of activity.

- **Airdrop Farmer Score**  
  A fun, experimental scoring system based on:
  - Number of interactions  
  - Active days  
  - Protocol diversity  
  - Historical consistency  
  - Onchain engagement  

- **Clean dashboard UI**  
  A simple interface built for clarity and experimentation.

---

```
## 🧱 Architecture

base-activity-dashboard/
├─ src/
│   ├─ components/
│   ├─ lib/
│   ├─ pages/ or app/ (Next.js)
│   └─ styles/
├─ public/
├─ package.json
├─ next.config.js
├─ README.md
└─ tsconfig.json
```

### Tech Stack
- **Next.js 14**
- **React 18**
- **Wagmi + Viem** (wallet + RPC)
- **Base Scan API / Blockscout**
- **Tailwind (opcional)**
- **TypeScript**

---

## 💡 Why This Project?

This dashboard is a prototype designed to:

- Help users visualize their onchain behavior  
- Encourage more activity on Base  
- Serve as an educational tool  
- Support Base’s mission of bringing more users onchain  
- Provide an open-source foundation for analytics tools  
- Potentially qualify for **Base Builder Grants** (small grants for early projects)

It is intentionally simple — built fast, open, and iterated in public.

---


## 🌐 Live Demo

👉 [base-activity-dashboard.vercel.app](https://base-activity-dashboard.vercel.app)


---

## 🛠️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/AtiladDias/base-activity-dashboard
cd base-activity-dashboard

2. Install dependencies
npm install

3. Run the dev server
npm run dev

4. Open in browser
http://localhost:3000

🔌 Environment Variables
Create a .env.local file:
NEXT_PUBLIC_BASESCAN_API_KEY=YOUR_KEY
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

You can get an API key for free at:

BaseScan (recommended)
Blockscout (optional)
Alchemy / Infura (RPC)

📊 Airdrop Farmer Score (v1 Algorithm)
The score is computed from:

+1 per transaction
+0.5 per active day
+2 per protocol used
+5 for weekly consistency
+3 for interacting with high-value protocols
+10 for monthly active streak

This will evolve over time as we tune the algorithm.

🔧 Roadmap (public & iterative)
✅ v1 — MVP Dashboard

Wallet connect
Base transaction history
Activity frequency
Protocol identification
Basic score
Simple UI

⏳ v2 — Enhanced Analytics

Charts & visualizations
NFT interactions
Token transfers
Gas usage patterns
Paymaster usage detection

🔜 v3 — Social Features

Leaderboard
Profile pages
Wallet badges
Onchain reputation modules

🔮 v4 — Advanced Onchain Intelligence

Smart clustering
Airdrop prediction
Custom scoring models
ML heuristics

🤝 Contributing
This project is open to contributions!
You can help by:

Opening Issues
Submitting PRs
Improving UI
Adding new protocol mappings
Expanding farming score logic

All contributions are welcome.

📄 License
MIT License © 2026 Atila Dias

🧵 Follow the Build
Follow the public build log on:

Farcaster: @thedias
X (Twitter): @TheDiasBR
Base Build App (analytics enabled!)
DiasBuilds ecosystem

Stay based.
Keep building.
🚀
