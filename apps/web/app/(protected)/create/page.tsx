import { BrokerForm } from '@/components/broker/BrokerForm'

export const metadata = { title: 'Submit Broker | Woxa' }

export default function CreateBrokerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-[#f1f5f9]">Submit Broker</h1>
        <p className="text-[#94a3b8] mt-2">
          Register a new institutional entity within the Sterling Midnight ecosystem.
          Please ensure all data points align with regulatory documentation.
        </p>
      </div>
      <div className="bg-[#111827] border border-white/8 rounded-sm p-8">
        <BrokerForm />
      </div>
    </div>
  )
}
