import React, { useState, useEffect } from 'react'
import '../scss/request.scss'
import axios from 'axios'
import {
  Container,
  Dropdown,
  Row,
  Toast,
  ToastContainer,
} from 'react-bootstrap'

import Wallet from '../contracts/Wallet.json'
import walletAds from '../contracts/contract-address_wallet.json'
import { Loading } from './Loading'

const { ethers } = require('ethers')
const walletAddress = walletAds.Wallet

const Req = () => {
  const [safes, setSafes] = useState([])
  const [safe, setSafe] = useState('Choose your Safe')
  const [loadingFlag, setLoadingFlag] = useState(true)
  const [show, setShow] = useState(false)
  const [errShow, setErrShow] = useState(false)
  const [errDesc, setErrDesc] = useState()

  useEffect(() => {
    if (!window.ethereum)
      throw new Error('No crypto wallet found. Please install it.')
    const initOwners = async () => {
      const curAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      axios
        .post('http://localhost:5000/api/findSafeListByAccount', {
          account: curAccounts[0],
        })
        .then((response) => {
          console.log(response.data)
          setSafes(response.data)
          setLoadingFlag(false)
        })
        .catch((error) => {
          console.log(error)
          setErrDesc(error.message)
          setLoadingFlag(false)
          setErrShow(true)
        })

      window.ethereum.on('accountsChanged', function (accounts) {
        axios
          .post('http://localhost:5000/api/findSafeListByAccount', {
            account: accounts[0],
          })
          .then((response) => {
            setSafes(response.data)
            setLoadingFlag(false)
          })
          .catch((error) => {
            console.log(error)
            setErrDesc(error.message)
            setLoadingFlag(false)
            setErrShow(true)
          })
      })
    }
    initOwners()
  }, [])

  const handleSelect = (e) => {
    console.log(e)
    setSafe(e)
  }

  //handleTransactionSubmit
  const handleTransactionSubmit = async (e) => {
    e.preventDefault()
    setLoadingFlag(true)
    const data = new FormData(e.target)
    // setError();
    await txRequest({
      receiver: data.get('receiver'),
      amount: data.get('amount'),
    })
  }

  const txRequest = async ({ receiver, amount }) => {
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const abi = new ethers.utils.Interface(Wallet.abi)
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = provider.getSigner();
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)

    const value = ethers.utils.parseEther(amount)
    try {
      await wallet.transactionRequest(receiver, value)
      console.log('success')
      setLoadingFlag(false)
      setShow(true)
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //handleThresholdSubmit
  const handleThresholdSubmit = async (e) => {
    e.preventDefault()
    setLoadingFlag(true)

    const data = new FormData(e.target)
    // setError();
    await updateThresholdRequest({
      newThreshold: data.get('threshold'),
    })
  }

  const updateThresholdRequest = async ({ newThreshold }) => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = provider.getSigner();

    const wallet = new ethers.Contract(walletAddress, abi, newSigner)

    console.log(newThreshold)
    try {
      await wallet.updatethresholdRequest(newThreshold)
      console.log('success')

      setLoadingFlag(false)
      setShow(true)
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //handleRemoveOwnerSubmit
  const handleRemoveOwnerSubmit = async (e) => {
    e.preventDefault()
    setLoadingFlag(true)

    const data = new FormData(e.target)
    // setError();
    await removeOwnerRequest({
      ownerToRemove: data.get('owner'),
    })
  }

  const removeOwnerRequest = async ({ ownerToRemove }) => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = provider.getSigner();

    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    console.log(ownerToRemove)
    try {
      await wallet.removeOwnerRequest(ownerToRemove)
      console.log('success')

      setLoadingFlag(false)
      setShow(true)
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //handleAddOwnerSubmit
  const handleAddOwnerSubmit = async (e) => {
    e.preventDefault()
    setLoadingFlag(true)

    const data = new FormData(e.target)
    // setError();
    await addOwnerRequest({
      ownerToAdd: data.get('ownerToAdd'),
    })
  }

  const addOwnerRequest = async ({ ownerToAdd }) => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = provider.getSigner();
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    console.log(ownerToAdd)
    try {
      await wallet.addOwnerRequest(ownerToAdd)
      console.log('success')

      setLoadingFlag(false)
      setShow(true)
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  if (loadingFlag) {
    return <Loading />
  }

  return (
    <Container>
      {show && (
        <ToastContainer className='p-5' position='top-end'>
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={3000}
            autohide
          >
            <Toast.Body className='Success bg-success text-white'>
              Success!
            </Toast.Body>
          </Toast>
        </ToastContainer>
      )}
      {errShow && (
        <ToastContainer className='p-5' position='top-end'>
          <Toast
            onClose={() => setShow(false)}
            show={errShow}
            delay={2000}
            autohide
          >
            <Toast.Body className='Success bg-danger text-white'>
            <strong className='me-auto'>Error!   </strong>
              {errDesc}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      )}
      <Row>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle variant='success' id='dropdown-basic'>
            {safe}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {safes.map((item) => (
              <Dropdown.Item eventKey={item.wallet} key={item.wallet}>
                {item.wallet}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Row>
      <div className='row'>
        <div className='col'>
          <form onSubmit={handleTransactionSubmit}>
            <div className='border border-primary request_border_info border-1 rounded mb-3 ml-1'>
              <div className='d-flex flex-column'>
                <div className='p-2 request_bg'>
                  <h4 className='text-start'>REQUEST A TRANSACTION</h4>
                </div>
                <div className='p-2 bd-highlight'>
                  <h5 className='w-100 pb-3 text-start'>
                    Input the address and the value in ETH
                  </h5>
                  <input
                    type='text'
                    name='receiver'
                    className='rounded w-100 p-2 mb-3  form-control'
                    placeholder="address 'receiver'"
                  />
                  <input
                    type='text'
                    name='amount'
                    className='rounded w-100 p-2 mb-5  form-control'
                    placeholder='amount'
                  />
                </div>
                <div className='bg-warning'>
                  <button className='btn btn-warning w-100 p-2' type='submit'>
                    Request Transaction
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className='col'>
          <form onSubmit={handleThresholdSubmit}>
            <div className='border border-primary request_border_info border-1 rounded mb-3'>
              <div className='d-flex flex-column'>
                <div className='p-2 request_bg'>
                  <h4 className='text-start'>REQUEST TO UPDATE THE QUORUM</h4>
                </div>
                <div className='p-2 bd-highlight'>
                  <h5 className='w-100 pb-3 text-start'>
                    Input the desired new quorum
                  </h5>
                  <input
                    type='text'
                    name='threshold'
                    className='rounded w-100 p-2 mb-5  form-control'
                    placeholder='new quorum'
                  />
                </div>
                <div className='bg-warning'>
                  <button className='btn btn-warning w-100 p-2' type='submit'>
                    Request to update the Quorum
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className='col'>
          <form onSubmit={handleRemoveOwnerSubmit}>
            <div className='border border-primary request_border_info border-1 rounded mb-3 '>
              <div className='d-flex flex-column'>
                <div className='p-2 request_bg'>
                  <h4 className='text-start'>REQUEST TO REMOVE AN OWNER</h4>
                </div>
                <div className='p-2 bd-highlight'>
                  <h5 className='w-100 pb-3 text-start'>
                    Input the owner's address to remove
                  </h5>
                  <input
                    type='text'
                    name='owner'
                    className='rounded w-100 p-2 mb-3  form-control'
                    placeholder='address to remove'
                  />
                </div>
                <div className='bg-warning'>
                  <button className='btn btn-warning w-100 p-2' type='submit'>
                    Request to remove this address
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className='col'>
          <form onSubmit={handleAddOwnerSubmit}>
            <div className='border border-primary request_border_info border-1 rounded mb-3 '>
              <div className='d-flex flex-column'>
                <div className='p-2 request_bg'>
                  <h4 className='text-start'>REQUEST TO ADD AN OWNER</h4>
                </div>
                <div className='p-2 bd-highlight'>
                  <h5 className='w-100 pb-3 text-start'>
                    Input the owner's address to add
                  </h5>
                  <input
                    type='text'
                    name='ownerToAdd'
                    className='rounded w-100 p-2 mb-3  form-control'
                    placeholder='address to remove'
                  />
                </div>
                <div className='bg-warning'>
                  <button className='btn btn-warning w-100 p-2' type='submit'>
                    Request to add this address
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Container>
  )
}
export default Req
