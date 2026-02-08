import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionList'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1 >Popular Companions</h1>
     <section className='home-section'>
          <CompanionCard
          id="123"
          name="Neura the Brainy Explorer"
          topic="Neural Network of the Brain"
          subject="science"
          duration={45}
          color="#E5D0FF"
          />
         <CompanionCard
          id="456"
          name="Countsy the Number Wizard"
          topic="Derivatives & Integrals"
          subject="maths"
          duration={30}
          color="#FFDA6E"
          /> <CompanionCard
          id="789"
          name="Verba the Vocabulary Builder"
          topic="languages"
          subject="science"
          duration={30}
          color="#BDE7FF"
          />
     </section>

     <section className='home-section'>
      <CompanionList 
        title="Recently completed sessions"
        companions={recentSessions}
        classNames="w-2/3 max-lg:w-full"
      />
      <CTA/> 
      
     </section>
    </main>
  )
}

export default Page