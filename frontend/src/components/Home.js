import React from 'react'
require('dotenv').config();

const Home = () => {
  onInit();
  return (
    <div className='container main_container'>
      <div className='row'>
        <div className='col'>
          <div className='border border-primary request_border_info border-1 rounded mb-3 ml-1'>
            <div className='d-flex flex-column'>
              <div className='p-2 bg-light'>
                <h5 className='w-100 p-2 pb-5'>
                  <u>Already have an existing multi-signature wallet (safe)</u>
                </h5>
              </div>
              <div className='bg-warning'>
                <a
                  href='connectSafe'
                  className='btn btn-success w-100 p-2'
                  type='button'
                >
                  Enter
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='border border-primary request_border_info border-1 rounded mb-3 ml-1'>
            <div className='d-flex flex-column'>
              <div className='p-2 bg-light'>
                <h5 className='w-100  p-2 pb-5'>
                  <u>Create a new multi-signature wallet</u>
                </h5>
              </div>
              <div className='bg-warning'>
                <a
                  href='createSafe'
                  className='btn btn-warning w-100 p-2'
                  type='button'
                >
                  CREATE
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const onInit= async() =>{
  try {
    await window.ethereum.enable();
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error(error);
  }
}

export default Home
