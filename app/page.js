import Image from 'next/image'

export default async function Home() {
  const data = await fetch(process.env["URL"])

  return (
    <>
      <pre>{JSON.stringify(data)}</pre>
    </>
  )
}

