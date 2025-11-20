import DonationHero from './components/DonationHero'
import DonationForm from './components/DonationForm'
import DonationStats from './components/DonationStats'

function App() {
  const handleSuccess = () => {
    // After a successful donation, we can reload stats area via event
    const evt = new Event('refresh-donation-stats')
    window.dispatchEvent(evt)
    alert('Thank you for your generous support!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <DonationHero />

        <div className="grid lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2">
            <DonationForm onSuccess={handleSuccess} />
          </div>
          <aside className="lg:col-span-1">
            <DonationStats />
          </aside>
        </div>

        <footer className="mt-12 text-center text-slate-400 text-sm">
          Your gift is tax-deductible to the extent allowed by law.
        </footer>
      </div>
    </div>
  )
}

export default App