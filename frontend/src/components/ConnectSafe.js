import React, { useState, useEffect } from 'react'
import '../scss/connectSafe.scss';
const ConnectSafe = () => {
  
  const [account, setAccount] = useState(0)

  useEffect(() => {
    if (!window.ethereum)
      throw new Error('No crypto wallet found. Please install it.')

    const initializeWalletAddress = async () => {
      const curAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccount(curAccounts[0])
      window.ethereum.on('accountsChanged', function (accounts) {
        getAccount()
      })
    }

    initializeWalletAddress();
  }, [])

  const getAccount = async () => {
    const accounts = await window.ethereum.enable()
    setAccount(accounts[0])
  }

  return (
    <div className='container'>
      <div className='row justify-content-md-center mt-3 '>
        <label className='btn btn-primary w-auto'>{account}</label>
      </div>
      <div className='row justify-content-md-center'>
        <h2 className='float-center mt-3 mb-5'>
          Please, be sure to be connected in RINKEBY
        </h2>
      </div>
      <div className='d-flex flex-wrap justify-content-around mb-3'>
        <div className='border border-primary border-1 rounded mb-3 bg-light'>
          <div className='card-body'>
            <h5 className='card-title'>Request new transactions and updates</h5>
          </div>
          <a href='request' className='btn btn-success w-100' type='button'>
            ENTER
          </a>
        </div>
        <div className='border border-primary border-1 rounded mb-3 bg-light'>
          <div className='card-body'>
            <h5 className='card-title'>
              Approve existing transactions and updates
            </h5>
          </div>
          <a href='approve' className='btn btn-danger w-100' type='button'>
            ENTER
          </a>
        </div>
        <div className='border border-primary border-1 rounded mb-3 bg-light'>
          <div className='card-body'>
            <h5 className='card-title'>Relevant Information</h5>
          </div>
          <a href='information' className='btn btn-warning w-100' type='button'>
            ENTER
          </a>
        </div>
      </div>
    </div>
  )
}
export default  ConnectSafe;