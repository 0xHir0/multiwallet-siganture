import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../scss/createSafe.scss'
import Wallet from '../contracts/Wallet.json'
import { Loading } from './Loading'
import{Toast, ToastContainer} from "react-bootstrap";

const { ethers } = require('ethers')

const CreateSafe = () => {
  const [account, setAccount] = useState(0)
  const [loadingFlag, setLoadingFlag] = useState(false)
  const [show, setShow] = useState(false);
  const [errShow, setErrShow] = useState(false);
  const [errDesc, setErrDesc] = useState()

  useEffect(() => {
    if (!window.ethereum)
      throw new Error('No crypto wallet found. Please install it.')

    const initializeWalletAddress = async () => {
      const curAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      console.log(curAccounts[0]);
      setAccount(curAccounts[0])
      window.ethereum.on('accountsChanged', function (accounts) {
        getAccount()
      })
    }

    initializeWalletAddress()
  }, [])

  const getAccount = async () => {
    const accounts = await window.ethereum.enable()
    console.log(accounts[0]);
    setAccount(accounts[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingFlag(true)
    const data = new FormData(e.target)
    await deployWallet({
      owners: [account, data.get('owner2'), data.get('owner3')],
      threshold: data.get('threshold'),
    })
  }
  // DEPLOYING THE WALLET. When the user clicks the "create new wallet" button.
  // NOTE: This is highly inefficient for production, this is only for this project.
  const deployWallet = async ({ owners, threshold }) => {
    try {
    //using current account not signer
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = provider.getSigner();

    const walletFactory = new ethers.ContractFactory(
        Wallet.abi,
        Wallet.bytecode,
        newSigner,// you can also use signer instead newSigner
      )
    const wallet = await walletFactory.deploy(owners, threshold)
    axios
    .post('http://localhost:5000/api/save', {
      wallet: wallet.address, // This is the body part
      owners: owners,
    })
    .then((response) => {
      // this.setState({data:response.data});
          console.log(response.data)
          setLoadingFlag(false)
          setShow(true)
        })
    } catch (e) {
      console.error(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
      // setError(e.message);
    }
  }

  if (loadingFlag) {
    return <Loading />
  }

  return (
    <div className='container'>
    {
      show && 
      <ToastContainer className="p-5" position="top-end">
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          
          <Toast.Body className="Success bg-success text-white" >Success!</Toast.Body>
        </Toast> 
        </ToastContainer>
    }
    {
      errShow && 
      <ToastContainer className="p-5" position="top-end">
      <Toast onClose={() => setShow(false)} show={errShow} delay={2000} autohide>
          
          <Toast.Body className="Success bg-danger text-white" >
          <strong className='me-auto'>Error!   </strong>
              {errDesc}
          </Toast.Body>
        </Toast> 
        </ToastContainer>
    }
      <form onSubmit={handleSubmit}>
        <div className='row justify-content-md-center'>
          <h2 className='float-center mt-4'>
            Please, be sure to be connected in RINKEBY
          </h2>
        </div>
        <div className='m-2'>
          <div className='border border-primary border-1 rounded mb-3 bg-light'>
            <div className='card-body p-0'>
              <h4 className='card-title p-3 fw-bold'>
                Create a Multi Signature Wallet
              </h4>
              <h5 className='card-text p-3 fw-bold'>
                Requirements: *Minimum 1 owner and 1 quorum. *Owners need to be
                more than or equal to the quorum
              </h5>

              <div className='form-group p-3'>
                <input
                  className='form-control'
                  type='text'
                  step='1'
                  name='owner1'
                  placeholder='address owner (1) *MANDATORY'
                  disabled
                  value={account}
                />
              </div>
              <div className='form-group p-3'>
                <input
                  className='form-control'
                  type='text'
                  step='1'
                  name='owner2'
                  placeholder='address owner (2) *OPTIONAL'
                  required
                />
              </div>
              <div className='form-group p-3'>
                <input
                  className='form-control'
                  type='text'
                  step='1'
                  name='owner3'
                  placeholder='address owner (3) *OPTIONAL'
                  required
                />
              </div>
              <div className='form-group p-3'>
                <input
                  className='form-control mb-2'
                  type='text'
                  step='1'
                  name='threshold'
                  placeholder='quorum *MANDATORY'
                  required
                />
              </div>
            </div>
            <button className='btn btn-success w-100' type='submit'>
              Create Safe
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
export default CreateSafe