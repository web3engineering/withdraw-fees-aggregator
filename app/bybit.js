const crypto = require('crypto');

const BASE_URL = 'https://api.bybit.com';

export const getFees = async (API_KEY, SECRET_KEY) => {
    const timestamp = (new Date()).valueOf()
    const requestPath = '/v5/asset/coin/query-info';

    const preHash = timestamp + API_KEY + '20000';

    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(preHash)
      .digest('hex');

    const headers = {
      'X-BAPI-API-KEY': API_KEY,
      'X-BAPI-SIGN': signature,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': '20000',
    };

    const resp = await fetch(`${BASE_URL}${requestPath}`, { headers })
    const data = await resp.json();
    if (data.retCode !== 0) throw "ByBit query error"

    const getOne = (coin, chain) => {
        const record = data.result.rows.filter(r => r.coin === coin)
        if (record.length !== 1) throw "ByBit No Such Coin"
        const networks = record[0].chains.filter(c => c.chain === chain)
        if (networks.length !== 1) throw "ByBit No Such Chain"
        return networks[0].withdrawFee
    }

    const getAll = (coin) => {
        const record = data.result.rows.filter(r => r.coin === coin)
        if (record.length !== 1) throw "ByBit No Such Coin"
        return record[0].chains.map(c => [`${coin}-${c.chain}`, c.withdrawFee])
    }

    const records = []
        .concat([["MATIC-MATIC", getOne("MATIC", "MATIC")]])
        .concat([["ATOM-ATOM", getOne("ATOM", "ATOM")]])
        .concat([["FTM-FTM", getOne("FTM", "FTM")]])
        .concat([["DOT-DOT", getOne("DOT", "DOT")]])
        .concat([["BNB-BSC", getOne("BNB", "BSC")]])
        .concat([["AVAX-AVAX", getOne("AVAX", "CAVAX")]])
        .concat([["SOL-SOL", getOne("SOL", "SOL")]])
        .concat(getAll("ETH"))
        .concat(getAll("DAI"))
        .concat(getAll("USDT"))
        .concat(getAll("USDC"))
        .concat(getAll("BUSD"))

    console.log(records)

    return records
}