import { getFees as getBinanceFees } from './binance'
import { getFees as getOkxFees } from './okx'
import { getFees as getBybitFees } from './bybit'
import { getFees as getMexcFees } from './mexc'

export default async function Home() {
  const data = await Promise.all([
    getBinanceFees(process.env.BINANCE_KEY_ID, process.env.BINANCE_SECRET),
    getOkxFees(process.env.OKX_API_KEY, process.env.OKX_SECRET_KEY, process.env.OKX_PASSPHRASE),
    getBybitFees(process.env.BYBIT_API_KEY, process.env.BYBIT_SECRET_KEY),
    getMexcFees(process.env.MEXC_API_KEY, process.env.MEXC_SECRET_KEY)
  ])

  data[0] = data[0].map(r => ["Binance", ...r])
  data[1] = data[1].map(r => ["OKX", ...r])
  data[2] = data[2].map(r => ["ByBIT", ...r])
  data[3] = data[3].map(r => ["MEXC", ...r])

  const allFees = data.reduce((p, c) => p.concat(c), [])
  allFees.sort((a, b) => { return parseFloat(a[2]) - parseFloat(b[2])})

  const enrichWithRef = (e) => {
    if (e === "OKX") return (<a href='https://www.okx.com/join/8702416'>OKX</a>);
    if (e === "ByBIT") return (<a href='https://www.bybit.com/invite?ref=N8PMO6'>ByBIT</a>);
    if (e === "MEXC") return (<a href='https://www.mexc.com/register?inviteCode=17rk5'>MEXC</a>);
    return e;
  }

  return (
    <>
      <p>Supported only subset of coins: ATOM, DOT, SOL, ETH, USDT, USDC, ONE, FTM.</p>
      <table>
        <thead>
          <tr>
            <th>Exchange</th>
            <th>Coin + Network</th>
            <th>Fee (in coin)</th>
          </tr>
        </thead>
        <tbody>
          {allFees.map(feeInfo => (
            <tr key={`${feeInfo[0]}-${feeInfo[1]}`}>
              <td>{enrichWithRef(feeInfo[0])}</td>
              <td>{feeInfo[1]}</td>
              <td>{feeInfo[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <section className="footer">
        Built for you by Let's Code + CryptoLodes Team.
        Please contact t.me/fz_nodes for collaborations, custom tools,
        LayerZero and ZkSync scripts.
      </section>
    </>
  )
}

