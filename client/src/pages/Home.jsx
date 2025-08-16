import React from 'react'
import Footer from '../components/global/footer'
import Testimonials from '../components/Home/testimonial'



import Hero from '../components/Home/hero'
import CallToAction from '../components/Home/callToAction'

import FAQ from '../components/Home/FAQ'
import PopularCategoriesPage from '../components/Home/Categories'
import AboutUsPage from '../components/Home/AboutUs'
import ConsultantCard from '../components/Home/ConsultantProfile/ConsultantCard'
import ImageSlider from '../components/Home/ImageSlide'

const Home = () => {
  return (
    <div className="min-h-screen ">
      {/* <ImageSlider /> */}
      <Hero />
      <ConsultantCard />
    
      <AboutUsPage />
      <PopularCategoriesPage />
      
      <FAQ />
      <Testimonials />
      <CallToAction/>
      <Footer />
    </div>
  )
}

export default Home