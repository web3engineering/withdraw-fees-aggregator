const crypto = require('crypto');
const fs = require('fs')

const BASE_URL = 'https://www.okx.com';

export const getFees = async (API_KEY, SECRET_KEY, PASSPHRASE) => {
    const timestamp = (new Date()).toISOString();
    const method = 'GET';
    const requestPath = '/api/v5/asset/currencies';
    const body = '';

    const preHash = timestamp + method + requestPath + body;

    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(preHash)
      .digest('base64');

    const headers = {
      'OK-ACCESS-KEY': API_KEY,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': PASSPHRASE,
    };

    const resp = await fetch(`${BASE_URL}${requestPath}`, { headers });
    const { data, code } = await resp.json();
    if (code !== "0") throw "OKX api query error";

    const wdData = data.filter(r => r.canWd)
    fs.writeFileSync('./okx.dump.js', JSON.stringify(wdData, undefined, 4))
    return []
        .concat(wdData.filter(r => r.chain === 'ATOM-Cosmos').map(r => ["ATOM-ATOM", r.minFee]))
        .concat(wdData.filter(r => r.chain === 'DOT-Polkadot').map(r => ["DOT-DOT", r.minFee]))
        .concat(wdData.filter(r => r.chain === 'AVAX-Avalanche X-Chain').map(r => ["AVAX-AVAX", r.minFee]))
        .concat(wdData.filter(r => r.chain === 'MATIC-Polygon').map(r => ["MATIC-MATIC", r.minFee]))
        .concat(wdData.filter(r => r.chain === 'SOL-Solana').map(r => ["SOL-SOL", r.minFee]))
        .concat(wdData.filter(r => r.chain === 'BNB-BSC').map(r => ["BNB-BSC", r.minFee]))
        .concat(wdData.filter(r => r.chain === 'FTM-Fantom').map(r => ["FTM-FTM", r.minFee]))
        .concat(wdData.filter(r => r.chain === 'ONE-Harmony').map(r => ["ONE-ONE", r.minFee]))
        .concat(wdData.filter(r => r.ccy === 'ETH').map(r => [r.chain, r.minFee]))
        .concat(wdData.filter(r => r.ccy === 'USDT').map(r => [r.chain, r.minFee]))
        .concat(wdData.filter(r => r.ccy === 'USDC').map(r => [r.chain, r.minFee]))
        .concat(wdData.filter(r => r.ccy === 'DAI').map(r => [r.chain, r.minFee]))
}
