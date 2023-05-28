const crypto = require('crypto');

const BASE_URL = 'https://api.mexc.com';

export const getFees = async (API_KEY, SECRET_KEY) => {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const requestPath = `/api/v3/capital/config/getall?${queryString}`;

    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(queryString)
        .digest('hex');

    const headers = {
        'X-MEXC-APIKEY': API_KEY,
        'Content-Type': "application/json"
    };

    const url = `${BASE_URL}${requestPath}&signature=${signature}`;
    const resp = await fetch(url, { headers });
    const data = await resp.json();

    const targetCoins = ["USDT", "USDC", "ETH"];
    const targetCoinsData = data.filter(x => targetCoins.includes(x.coin));

    return targetCoinsData
            .map(x => x.networkList)
            .flatMap(x => x)
            .map(x => ([
                `${x.coin} - ${x.network}`,
                parseFloat(x.withdrawFee)
            ]))
}
