import React from 'react'
import Footer from '../components/global/footer'
import Testimonials from '../components/Home/testimonial'

import HowItWorks from '../components/Home/howItWorks'
import PopularCategories from '../components/Home/popular'
import Hero from '../components/Home/hero'
import CallToAction from '../components/Home/callToAction'

import ConsultantManager from '../components/ConsultantProfile/ConsultantManager'
import FAQ from '../components/Home/FAQ'
import PopularCategoriesPage from '../components/Home/Categories'
import AboutUsPage from '../components/Home/AboutUs'

const Home = () => {
  return (
    <div className="min-h-screen ">
      <Hero />
      <AboutUsPage />
      <PopularCategoriesPage />
      <HowItWorks />
      <ConsultantManager/>
      <FAQ />
      <Testimonials />
      <CallToAction/>
      <Footer />
    </div>
  )
}

export default Home