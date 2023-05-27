import { getFees as getBinanceFees } from './binance'

export default async function Home() {
  const data = await Promise.all([
    getBinanceFees(process.env.BINANCE_KEY_ID, process.env.BINANCE_SECRET),
  ])
  data[0] = data[0].map(r => ["Binance", ...r])

  const allFees = data.reduce((p, c) => p.concat(c), [])

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

