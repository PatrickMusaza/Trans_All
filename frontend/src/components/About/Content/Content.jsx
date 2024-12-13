import React from 'react';
import './Content.css';
import heroImage from '../../assets/images/hero-image.jpg';
import patrickImage from '../../assets/images/patrick.jpg';
import ivanImage from '../../assets/images/ivan.jpg';

const teamMembers = [
  {
    id: 1,
    name: 'Musaza Patrick',
    title: 'Chief Executive Officer (CEO)',
    image: patrickImage,
    bio: `Musaza Patrick is the visionary behind the company. With over 15 years of experience in strategic leadership and business development, Patrick has successfully led teams to achieve exceptional results. He specializes in fostering innovation, building partnerships, and driving organizational growth. Under his guidance, the company has expanded into multiple markets globally.`,
    expertise: [
      'Strategic Planning & Leadership',
      'Business Development',
      'Global Market Expansion',
      'Innovative Problem Solving',
    ],
  },
  {
    id: 2,
    name: 'Manzi Ivan',
    title: 'Chief Technology Officer (CTO)',
    image: ivanImage,
    bio: `Manzi Ivan is the technical backbone of the company. With a deep passion for technology and a decade of experience in software development, Ivan ensures the company's tech stack remains cutting-edge. He leads the engineering team with a focus on creating scalable, secure, and efficient solutions to meet customer demands.`,
    expertise: [
      'Software Architecture & Engineering',
      'Cybersecurity & Data Protection',
      'Cloud Infrastructure',
      'Team Leadership & Mentorship',
    ],
  },
];

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroImage} alt="Hero" className="hero-image" />
        <div className="hero-overlay">
          <h1>About Us</h1>
          <p>Meet the team that drives our vision forward.</p>
        </div>
      </section>

      {/* About Content Section */}
      <section className="about-content-section">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            Our mission is to create innovative solutions that transform industries and improve lives. 
            We believe in leveraging technology to drive positive change and achieve meaningful impact 
            on a global scale. With a team of dedicated professionals, we strive for excellence in everything 
            we do.
          </p>
          <p>
            Our core values of integrity, collaboration, and innovation guide us in every step of our journey. 
            By combining expertise with passion, we aim to build lasting partnerships and deliver results that matter.
          </p>
        </div>
        <div className="about-image">
          <img src={heroImage} alt="About Us" />
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-cards">
          {teamMembers.map((member) => (
            <div className="team-card" key={member.id}>
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p className="team-title">{member.title}</p>
              <p>{member.bio}</p>
              <h4>Expertise:</h4>
              <ul>
                {member.expertise.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
