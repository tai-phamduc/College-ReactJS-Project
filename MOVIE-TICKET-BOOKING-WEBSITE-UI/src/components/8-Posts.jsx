import React from 'react'

function Posts() {
  const posts = [
    {
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/blog-4.jpg",
      date: "23 Mar, 2023",
      title: "See Meila enjoyable capturing moment",
      author: {
        name: "Duno",
        avatar: "https://secure.gravatar.com/avatar/a80cf254529336610cb129d82c3e292caa4e35f27df7cc3e7b06c2964e0ed25c?s=192&d=mm&r=g"
      },
      comment: 0
    },
    {
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/blog-5.jpg",
      date: "23 Mar, 2023",
      title: "The Foreign Oscar Nominations 2023",
      author: {
        name: "Duno",
        avatar: "https://secure.gravatar.com/avatar/a80cf254529336610cb129d82c3e292caa4e35f27df7cc3e7b06c2964e0ed25c?s=192&d=mm&r=g"
      },
      comment: 0
    },
    {
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/blog-6.jpg",
      date: "23 Mar, 2023",
      title: "Upcoming New Season 5 Just Flow in !",
      author: {
        name: "Duno",
        avatar: "https://secure.gravatar.com/avatar/a80cf254529336610cb129d82c3e292caa4e35f27df7cc3e7b06c2964e0ed25c?s=192&d=mm&r=g"
      },
      comment: 0
    }
  ]
  return (
    <section className="posts-section py-6">
      <div className="container-sm">
        <div className="text-center mb-5">
          <img src="/src/assets/film-roll.png" alt="Film roll" className="mb-3" />
          <h5 className="text-muted">Directly Blog Posts</h5>
          <h1 className="display-4 fw-bold">
            Latest News & Articles
            from the Posts
          </h1>
        </div>
        <div className="row">
          { posts.map(post => (
              <div className="col-md-4">
              <div className="post-card">
                <div className="post-card__image">
                  <img 
                    src={post.image_link} 
                    alt={post.title} 
                  />
                  <div className="post-card__meta">
                    <span className="post-card__date">{post.date}</span>
                  </div>
                </div>
                <div className="post-card__content">
                  <div className='d-flex align-items-center gap-4'>
                    <div className="post-card__author">
                      <img src={post.author.avatar} alt={post.author.name} />
                      <div className="d-flex flex-column">
                        <div>by</div>
                        <div style={{marginTop: "-6px"}}>{post.author.name}</div>
                      </div>
                    </div>
                    <div className="line"></div>
                    <div className="post-card__comment">
                      <img src="/src/assets/comment.png" alt="" />
                      <span>{post.comment} Comments</span>
                    </div>
                  </div>
                  <h3 className="post-card__title">{post.title}</h3>
                  <a className='read-more-btn' href="#">Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Posts