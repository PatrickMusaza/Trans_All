import React, { useState } from 'react';
import './About.css';
import heroImage from '../../assets/images/download.jpg';
import patrickImage from '../../assets/images/1.jpg';
import ivanImage from '../../assets/images/1.jpg';

const teamMembers = [
  {
    id: 1,
    name: 'Musaza Patrick',
    title: 'Chief Executive Officer (CEO)',
    image: patrickImage,
    bio: `Musaza Patrick is the visionary behind the company. With over 15 years of experience in strategic leadership and business development, Patrick has successfully led teams to achieve exceptional results.`,
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
    bio: `Manzi Ivan is the technical backbone of the company. He leads the engineering team with a focus on creating scalable, secure, and efficient solutions.`,
    expertise: [
      'Software Architecture & Engineering',
      'Cybersecurity & Data Protection',
      'Cloud Infrastructure',
      'Team Leadership & Mentorship',
    ],
  },
  {
    id: 3,
    name: 'Ishimwe Claude',
    title: 'Head of Marketing',
    image: ivanImage,
    bio: `Jane Doe brings creativity and expertise to the marketing team, helping the company reach new audiences and strengthen its brand.`,
    expertise: [
      'Brand Development',
      'Digital Marketing',
      'Customer Engagement Strategies',
      'Market Analysis',
    ],
  },
  {
    id: 4,
    name: 'Mbabazi Yvette',
    title: 'Operations Manager',
    image: patrickImage,
    bio: `John Smith ensures smooth operations and efficient workflows across all departments, fostering a culture of collaboration.`,
    expertise: [
      'Process Optimization',
      'Logistics Management',
      'Team Coordination',
      'Risk Assessment',
    ],
  },
];

const AboutPage = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleDetails = (id) => {
    setExpanded((prevExpanded) => (prevExpanded === id ? null : id));
  };

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

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div className="team-card" key={member.id}>
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p className="team-title">{member.title}</p><button
                className="toggle-button"
                onClick={() => toggleDetails(member.id)}
              >
                {expanded === member.id ? (
                  <i className="fa fa-minus"></i>  
                ) : (
                  <i className="fa fa-plus"></i>  
                )}
              </button>
              {expanded === member.id && (
                <div className="team-details">
                  <p>{member.bio}</p>
                  <h4>Expertise:</h4>
                  <ul>
                    {member.expertise.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
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

    </div>
  );
};

export default AboutPage;
