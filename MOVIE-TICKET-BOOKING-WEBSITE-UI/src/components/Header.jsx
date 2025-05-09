import React from 'react'
import "./Header.css"

function Header({title}) {
  return (
    <>
      <header className='header pt-9 pb-7 text-white'>
        <div className="overlay"></div>
        <div className='cover-color'></div>
        <div className="container">
          <div className="header d-flex flex-column align-items-center justify-content-between">
            <div className='d-flex align-items-center mb-1'>
              <a href="/home" className="navigation-link">
                <span className='navigation'>Home</span>
              </a>
              <i className="fas fa-chevron-right icon"></i>
              <a href="#" className="navigation-link">
                <span className='navigation'>{title}</span>
              </a>
            </div>
            <h2 className="display-4 fw-bold">
              {title}
            </h2>
          </div>
        </div>
      </header>
      <img src="https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/image-lines-header.jpg" alt="" className='w-100'/>
    </>

  )
}

export default Header