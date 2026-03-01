import { ClipboardList, CheckCircle, Navigation } from 'lucide-react'

const steps = [
  {
    number: '01',
    Icon: ClipboardList,
    title: 'Request Service',
    description:
      'Choose a category, add your details, and submit your request in under a minute.',
  },
  {
    number: '02',
    Icon: CheckCircle,
    title: 'Get Confirmation',
    description:
      'Receive provider availability, pricing details, and time confirmation instantly.',
  },
  {
    number: '03',
    Icon: Navigation,
    title: 'Track & Complete',
    description:
      'Follow job progress live and close the booking securely once work is done.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            How It Works
          </div>
          <h2 id="how-heading">A simple 3-step booking flow</h2>
          <p>
            No complicated process. Just choose your service and let ServiceFlow
            handle the rest.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map(({ number, Icon, title, description }) => (
            <article className="step-card" key={number}>
              <div className="step-number">{number}</div>
              <div className="step-icon">
                <Icon size={20} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
