import { getFees as getBinanceFees } from './binance'
import { getFees as getOkxFees } from './okx'

export default async function Home() {
  const data = await Promise.all([
    getBinanceFees(process.env.BINANCE_KEY_ID, process.env.BINANCE_SECRET),
    getOkxFees(process.env.OKX_API_KEY, process.env.OKX_SECRET_KEY, process.env.OKX_PASSPHRASE),
  ])
  data[0] = data[0].map(r => ["Binance", ...r])
  data[1] = data[1].map(r => ["OKX", ...r])

  const allFees = data.reduce((p, c) => p.concat(c), [])
  allFees.sort((a, b) => { return parseFloat(a[2]) - parseFloat(b[2])})


  return (
    <>
      <table>
        <tbody>
          {allFees.map(feeInfo => (
            <tr key={`${feeInfo[0]}-${feeInfo[1]}`}>
              <td>{feeInfo[0]}</td>
              <td>{feeInfo[1]}</td>
              <td>{feeInfo[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

