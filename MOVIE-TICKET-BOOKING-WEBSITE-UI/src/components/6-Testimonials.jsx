import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay } from 'swiper/modules'


function Testimonials() {
  const testimonials = [
    {
      name: 'Hubert J.Johnso',
      feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dui eu orci maximus. Cras at auctor lectus, pretium tellus.',
      image: 'https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/image-1-our-team.jpg'
    },
    {
      name: 'Pacific D.Lee',
      feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dui eu orci maximus. Cras at auctor lectus, pretium tellus.',
      image: 'https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/image-2-our-team.jpg'
    },
    {
      name: 'Mike Hardson',
      feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dui eu orci maximus. Cras at auctor lectus, pretium tellus.',
      image: 'https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/image-3-our-team.jpg'
    }
  ]

  return (
    <section className="testimonial-section">
      <div className="overlay"></div>
      <div className="container-sm">
        <div className="row">
          <div className="col-md-5">
            <img src="/src/assets/film-roll.png" alt="Film roll" className="mb-3" />
            <div className="fw-bold text-secondary mb-2">Our Feedbacks</div>
            <h2 className="fw-bold display-4">What They're talking about us</h2>
            <div className='text-secondary mb-4'>Proin a lacus arcu. Nullam id dui eu orci maximus. Cras at auctor lectus, pretium tellus.</div>
            <button className="view-all-feedbacks-btn btn btn-dark text-white fw-bold px-5 py-3">View All Feedbacks</button>
          </div>

          <div className="col-md-7">
            <Swiper
              modules={[Autoplay]}
              pagination={{ clickable: true }}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false
              }}
              loop={true}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className='testimonial-card'>
                    <div className='text-secondary mb-4'>{testimonial.feedback}</div>
                    <div className="d-flex gap-3 align-items-center position-relative overflow-hidden">
                      <div className='testimonial-image-container'>
                        <img src={testimonial.image} alt={testimonial.name} className='testimonial-image rounded-circle' />
                      </div>
                      <div>
                        <div className='fw-bold'>{testimonial.name}</div>
                        <div className="text-primary">Customer</div>
                      </div>
                      <div className="background"></div>
                    </div>
                    <div className="testimonial-quote-background"></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
