import { useEffect, useState } from 'react'
import { ensureGuestSession } from './lib/supabase'

// Temporary screen: signs the visitor in as a guest and reports how it went.
export default function App() {
  const [status, setStatus] = useState('Signing you in as a guest…')

  useEffect(() => {
    ensureGuestSession().then(
      () => setStatus('Signed in as a guest. The board comes next.'),
      (error: Error) => setStatus(`Could not sign in: ${error.message}`),
    )
  }, [])

  return (
    <main style={{ padding: 32 }}>
      <h1>Relay</h1>
      <p>{status}</p>
    </main>
  )
}
