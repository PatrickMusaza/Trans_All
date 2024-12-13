import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Testimonials.css';
import busImage from '../../assets/images/download.jpg';

const testimonials = [
  {
    id: 1,
    name: 'M. Patrick',
    title: 'CEO of TransConnect',
    image: busImage,
    testimonial: `Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.`
  },
  {
    id: 2,
    name: 'M. Ivan',
    title: 'Manager at TransConnect',
    image: busImage,
    testimonial: `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.`
  },
  {
    id: 3,
    name: 'John Smith',
    title: 'CTO at TransConnect',
    image: busImage,
    testimonial: `It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`
  }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section py-5">
      <div className="container">
        <h2 className="text-center mb-5">Testimonials</h2>
        <div
          id="testimonialsCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          {/* Indicators */}
          <div className="carousel-indicators indicate">
            {testimonials.map((_, index) => (
              <button
                type="button"
                data-bs-target="#testimonialsCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
                key={index}
              ></button>
            ))}
          </div>

          {/* Carousel Items */}
          <div className="carousel-inner">
            {testimonials.map(({ id, name, title, image, testimonial }, index) => (
              <div
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                key={id}
              >
                <div className="testimonial-card mx-auto">
                  <img
                    src={image}
                    alt={name}
                    className="testimonial-image rounded-circle"
                  />
                  <h5 className="fw-bold mt-3">{name}</h5>
                  <p className="testimonial-title">{title}</p>
                  <p className="testimonial-text">{testimonial}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="prev"
          > 
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
