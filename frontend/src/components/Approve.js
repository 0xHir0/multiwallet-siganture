import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Accordion,
  Button,
  Col,
  Container,
  Dropdown,
  Row,
  Toast,
  ToastContainer,
} from 'react-bootstrap'
import '../scss/approve.scss'
import { Loading } from './Loading'
import Wallet from '../contracts/Wallet.json'
import walletAds from '../contracts/contract-address_wallet.json'

const { ethers } = require('ethers')
const walletAddress = walletAds.Wallet

export default function Approve() {
  const [safes, setSafes] = useState([])
  const [safe, setSafe] = useState('Choose your Safe')
  const [loadingFlag, setLoadingFlag] = useState(true)

  const [show, setShow] = useState(false)
  const [errShow, setErrShow] = useState(false)
  const [errDesc, setErrDesc] = useState()
  //list
  const [approveTxList, setApproveTxList] = useState([])
  const [approveThresholdList, setApproveThresholdList] = useState([])
  const [approveAddOwnerList, setApproveAddOwnerList] = useState([])
  const [approveRemoveOwnerList, setApproveRemoveOwnerList] = useState([])

  useEffect(() => {
    if (!window.ethereum)
      throw new Error('No crypto wallet found. Please install it.')
    const initOwners = async () => {
      const curAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setLoadingFlag(true)

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
          setLoadingFlag(false)
          setErrDesc(error.message)
          setErrShow(true)
        })

      window.ethereum.on('accountsChanged', function (accounts) {
        axios
          .post('http://localhost:5000/api/findSafeListByAccount', {
            account: accounts[0],
          })
          .then((response) => {
            // console.log(response.data)
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

  const handleSelect = (eventKey) => {
    setSafe(eventKey)
    initList()
  }

  //initList
  const initList = () => {
    setLoadingFlag(true)
    approveTransactionList()
    approveThrList()
    approveRemoveOwnList()
    approveAddOwnList()
  }

  //approveTransactionList
  const approveTransactionList = async () => {
    await approveTransactionRequest()
  }

  const approveTransactionRequest = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    try {
      const dataList = await wallet.pendingTransactionsData()
      console.log(dataList)
      setApproveTxList(dataList)
      // alert('success')
      console.log('success approveTransactionRequest')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //approveThrList
  const approveThrList = async () => {
    await approveQuorumUpdate()
  }

  const approveQuorumUpdate = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    try {
      const dataList = await wallet.pendingUpdatethresholdData()
      console.log(dataList)
      setApproveThresholdList(dataList)
      console.log('success approveQuorumUpdate')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setShow(true)
    }
  }

  //approveRemoveOwnList
  const approveRemoveOwnList = async () => {
    await approveRemoveOwner()
  }

  const approveRemoveOwner = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    try {
      const dataList = await wallet.pendingRemoveOwnerData()
      setApproveRemoveOwnerList(dataList)
      console.log('success approveRemoveOwner')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //approveAddOwnList
  const approveAddOwnList = async () => {
    await approveAddOwner()
  }

  const approveAddOwner = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    try {
      const dataList = await wallet.pendingAddOwnerData()
      console.log('success approveAddOwner')
      setApproveAddOwnerList(dataList)
      setLoadingFlag(false)
      setShow(true)
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //approve functions
  //txApproval
  const txApproval = async (index) => {
    setLoadingFlag(true)
    // const _signer2 = new ethers.Wallet(REACT_APP_PRIVATE_KEY_SECOND.toString())
    // const signer2 = _signer2.connect(provider)
    const abi = new ethers.utils.Interface(Wallet.abi)
    // const wallet = new ethers.Contract(walletAddress, abi, signer2)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)

    try {
      await wallet.transactionApproval(index)
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
  //updateThresholdApproval
  const updateThresholdApproval = async (index) => {
    setLoadingFlag(true)
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    const pendingUpdateThreshold = await wallet.pendingUpdatethresholdData()
    console.log(`pending update threshold data --> ${pendingUpdateThreshold}`)
    try {
      await wallet.updatethresholdApproval(index)
      console.log('success')
      setLoadingFlag(false)
      setShow(true)
    } catch (e) {
      console.error(e)
      setLoadingFlag(false)
      setErrDesc(e.error.message)
      setErrShow(true)
    }
  }

  //removeOwnerApproval
  const removeOwnerApproval = async (index) => {
    setLoadingFlag(true)
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    try {
      await wallet.removeOwnerApproval(index)
      console.log('success')
      setLoadingFlag(false)
      setShow(true)
    } catch (e) {
      console.log(e)
      setLoadingFlag(false)
      setErrDesc(e.error.message)
      setErrShow(true)
    }
  }
  //addOwnerApproval
  const addOwnerApproval = async (index) => {
    setLoadingFlag(true)
    const abi = new ethers.utils.Interface(Wallet.abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()
    // const wallet = new ethers.Contract(walletAddress, abi, signer)
    const wallet = new ethers.Contract(walletAddress, abi, newSigner)
    try {
      await wallet.addOwnerApproval(index)
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
      <Row className='justify-content-md-center text-center mt-3 pb-5'>
        <Dropdown id='dropdown-basic-button' onSelect={handleSelect}>
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
      <Row>
        <Accordion defaultActiveKey='-1'>
          <Accordion.Item eventKey='0' id='deploy_new_wallet'>
            <Accordion.Header>Deploy new wallet</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col>Provider Address</Col>
                <Col>0x56eBc3305A45082a89531b75C2a6C09f2e4E70A3</Col>
              </Row>
              <Row>
                <Col>Total Signatures</Col>
                <Col>0</Col>
              </Row>
              <Row>
                <Col>Index</Col>
                <Col>0</Col>
              </Row>
              <Row>
                <Col>
                  "Wallet.sol" doesn't have function for approving this.
                </Col>
                <Col></Col>
                <Col>
                  <Button
                    variant='primary'
                    className='btn_approve mb-1'
                    disabled
                  >
                    Approve
                  </Button>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='1' id='tran_requirement'>
            <Accordion.Header>Transaction Request</Accordion.Header>
            <Accordion.Body>
              {approveTxList.map((item) => (
                <Row className='pend_tx' key={item}>
                  <Row>
                    <Col>Address to</Col>
                    <Col>{item.to}</Col>
                  </Row>
                  <Row>
                    <Col>Value</Col>
                    <Col>{ethers.utils.formatEther(item.value)} ETH</Col>
                  </Row>
                  <Row>
                    <Col>Total Signatures</Col>
                    <Col>{item.signatures.toString()}</Col>
                  </Row>
                  <Row>
                    <Col>Approved: </Col>
                    <Col>{item.approved.toString()}</Col>
                  </Row>
                  <Row>
                    <Col>Transaction Index</Col>
                    <Col>{item.index.toString()}</Col>
                  </Row>
                  <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                      <Button
                        variant='primary'
                        className='btn_approve mb-1'
                        onClick={() => txApproval(item.index)}
                      >
                        Approve
                      </Button>
                    </Col>
                  </Row>
                </Row>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='2' id='quorum_update'>
            <Accordion.Header>Quorum Update</Accordion.Header>
            <Accordion.Body>
              {approveThresholdList.map((item) => (
                <Row className='pend_tx' key={item}>
                  <Row>
                    <Col>Threshold</Col>
                    <Col>{item.threshold.toString()} </Col>
                  </Row>
                  <Row>
                    <Col>index</Col>
                    <Col>{item.index.toString()}</Col>
                  </Row>
                  <Row>
                    <Col>Signatures</Col>
                    <Col>{item.signatures.toString()}</Col>
                  </Row>
                  <Row>
                    <Col>Approved: </Col>
                    <Col>{item.approved.toString()}</Col>
                  </Row>
                  <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                      <Button
                        // variant='primary'
                        // className='btn_approve mb-1'
                        onClick={() => updateThresholdApproval(item.index)}
                      >
                        Approve C
                      </Button>
                    </Col>
                  </Row>
                </Row>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='3' id='add_owner'>
            <Accordion.Header>Add Owner</Accordion.Header>
            <Accordion.Body>
              {approveAddOwnerList.map((item) => (
                <Row className='pend_tx' key={item}>
                  <Row>
                    <Col>owner to add</Col>
                    <Col>{item.add} </Col>
                  </Row>
                  <Row>
                    <Col>Index</Col>
                    <Col>{item.index.toString()}</Col>
                  </Row>
                  <Row>
                    <Col>Signatures</Col>
                    <Col>{item.signatures.toString()}</Col>
                  </Row>
                  <Row>
                    <Col>Approved: </Col>
                    <Col>{item.approved.toString()}</Col>
                  </Row>
                  <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                      <Button
                        variant='primary'
                        className='btn_approve mb-1'
                        onClick={() => addOwnerApproval(item.index)}
                      >
                        Approve
                      </Button>
                    </Col>
                  </Row>
                </Row>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='4' id='remove_owner'>
            <Accordion.Header>Remove Owner</Accordion.Header>
            <Accordion.Body>
              {approveRemoveOwnerList.map((item) => (
                <Row className='pend_tx' key={item}>
                  <Row>
                    <Col>owner to Remove</Col>
                    <Col>{item.remove} </Col>
                  </Row>
                  <Row>
                    <Col>Index</Col>
                    <Col>{item.index.toString()}</Col>
                  </Row>
                  <Row>
                    <Col>Signatures</Col>
                    <Col>{item.signatures.toString()}</Col>
                  </Row>
                  <Row>
                    <Col>Approved: </Col>
                    <Col>{item.approved.toString()}</Col>
                  </Row>
                  <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                      <Button
                        variant='primary'
                        className='btn_approve mb-1'
                        onClick={() => removeOwnerApproval(item.index)}
                      >
                        Approve
                      </Button>
                    </Col>
                  </Row>
                </Row>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </Container>
  )
}
