import React from 'react'

function UpcomingEvent() {
  const event = {
      name: "Best Magical Movies Ever Made",
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/Event06.jpg",
      date: "26 MAR, 2025",
      time: "14:00 - 18:00",
      location: "New York",
  }
  const events = [
    {
      name: "Best Magical Movies Ever Made",
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/Event06.jpg",
      date: "26 MAR, 2025",
      time: "14:00 - 18:00",
      location: "New York",
    },
    {
      name: "The Strange Love Movie 2023 Festival",
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/Event05.jpg",
      date: "26 APR, 2025",
      time: "16:00 - 22:00",
      location: "New York",
    }
  ]
  return (
    <section className='upcoming-event-section py-5'>
      <div class="overlay"></div>
      <div className="container-sm">
        <div className="row">
          <div className="col-md-6">
            <img src="/src/assets/film-roll.png" alt="Film roll" className="mb-3" />
            <div className="fw-bold text-secondary mb-2">Upcoming Event</div>
            <h2 className="fw-bold display-4">Register Yourself Now for the Events</h2>
            <div className='text-secondary mb-4'>Every man must decide whether he will walk in the light of creative altruism or in the darkness of eritdestructive selfishness. Ut porttitor et lectus ut tempus. Aliquam lacinia justo.</div>
            <button className="more-info-btn btn btn-primary text-white fw-bold" >More Info</button>
          </div>
          <div className="col-md-6 vstack gap-4">
            {
              events.map(event => (
                <div className="row event-card">
                  <div className="col-md-4 p-0 position-relative">  
                    <div className="event-date">{event.date}</div>
                    <img src={event.image_link} className='w-100' alt="" />
                  </div>
                  <div className="col-md-8 event-card-content d-flex flex-column justify-content-center gap-3">
                    <div className='d-flex gap-3'>
                      <div className='text-secondary d-flex align-items-center gap-2'>
                        <img src="/src/assets/time.png" alt=""/>
                        {event.time}
                      </div>
                      <div className='text-secondary d-flex align-items-center gap-2'>
                        <img src="/src/assets/pin.png" alt=""/>
                        {event.location}
                      </div>
                    </div>
                    <div className="event-name fs-4 fw-bold text-hover-primary">{event.name}</div>
                    <a href="#" className='read-more-link text-decoration-none text-secondary text-hover-primary'>Read More</a>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvent