import React from 'react';
import './Team.css';
import patrickImage from '../../../assets/images/1.jpg'; 
import ivanImage from '../../../assets/images/1.jpg'; 

const teamMembers = [
  {
    name: 'Musaza Patrick',
    title: 'CEO',
    description: 'Musaza Patrick brings visionary leadership, steering TransConnect to new heights.',
    image: patrickImage,
  },
  {
    name: 'Manzi Ivan',
    title: 'CTO',
    description: 'Manzi Ivan is the technical brain behind our innovative solutions.',
    image: ivanImage,
  },
];

const TeamSection = () => {
  return (
    <section className="team-section">
      <h2>Meet the Team</h2>
      <div className="team-cards">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.image} alt={member.name} />
            <h3>{member.name}</h3>
            <p className="team-title">{member.title}</p>
            <p>{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
