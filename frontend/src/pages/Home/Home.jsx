import React from 'react'
import HeroSection from '../../components/Hero/Hero'
import FeaturesSection from '../../components/Feature/Feature'
import StatsSection from '../../components/Stats/Stats'
import TestimonialsSection from '../../components/Testimonials/Testimonials'
import ContactSection from '../../components/Subscription/Subscription'

const Home = () => {
    return (
        <div>
        <HeroSection/>
        <FeaturesSection/>
        <StatsSection/>
        <TestimonialsSection/>
        <ContactSection/>
        </div>
    )
}

export default Home