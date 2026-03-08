import React from 'react'
import { ArrowRight } from 'lucide-react'

const GetStarted = () => {
  return (
    <div>
        <div className="cta-band">
        <div className="container">
          <h2>Ready to simplify your home services?</h2>
          <p>Join thousands of homeowners who trust ServiceFlow every day.</p>
          <button type="button" className="btn btn-primary btn-lg">
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GetStarted
