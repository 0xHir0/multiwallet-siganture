import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Accordion,
  Card,
  Col,
  Container,
  Dropdown,
  ListGroup,
  Row,
  Tab,
  Tabs,
} from 'react-bootstrap'
import '../scss/information.scss'
import { Loading } from './Loading'
import { Toast, ToastContainer } from 'react-bootstrap'

import Wallet from '../contracts/Wallet.json'
import walletAds from '../contracts/contract-address_wallet.json'

const { ethers } = require('ethers')
const { REACT_APP_API_URL, REACT_APP_PRIVATE_KEY } = process.env
const walletAddress = walletAds.Wallet

export default function Information() {
  const provider = new ethers.providers.JsonRpcProvider(REACT_APP_API_URL)
  const _signer = new ethers.Wallet(REACT_APP_PRIVATE_KEY)
  const signer = _signer.connect(provider)
  const [safes, setSafes] = useState([])
  const [safe, setSafe] = useState('Choose your Safe')
  const [loadingFlag, setLoadingFlag] = useState(false)
  const [show, setShow] = useState(false)
  const [errShow, setErrShow] = useState(false)
  const [errDesc, setErrDesc] = useState()

  //setting
  const [ballance, setBallance] = useState([])
  const [threshold, setThreshold] = useState([])
  const [owners, setOwners] = useState([])
  const [totalOwners, setTotalOwners] = useState([])

  //pending
  const [pendTxList, setPendTxList] = useState([])
  const [pendThresholdList, setPendThresholdList] = useState([])
  const [pendAddOwnerList, setPendAddOwnerList] = useState([])
  const [pendRemoveOwnerList, setPendRemoveOwnerList] = useState([])

  //history
  const [historyTxList, setHistoryTxList] = useState([])
  const [historyThresholdList, setHistoryThresholdList] = useState([])
  const [historyAddOwnerList, setHistoryAddOwnerList] = useState([])
  const [historyRemoveOwnerList, setHistoryRemoveOwnerList] = useState([])

  useEffect(() => {
    if (!window.ethereum)
      throw new Error('No crypto wallet found. Please install it.')
    const initOwners = async () => {
      // const abi = new ethers.utils.Interface(Wallet.abi)
      // const wallet = new ethers.Contract(walletAddress, abi, signer)
      setLoadingFlag(true)

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
    setLoadingFlag(true)
    setSafe(eventKey)

    onInitSetting(eventKey)
    initPendingList()
    initHistoryList()
  }

  //handleTransactionSubmit
  const onInitSetting = async (eventKey) => {
    await getInitData({ eventKey })
  }

  const getInitData = async ({ eventKey }) => {
    console.log('eventKey--->' + eventKey)
    const abi = new ethers.utils.Interface(Wallet.abi)
    console.log(signer.address)
    const wallet = new ethers.Contract(eventKey, abi, signer)
    try {
      const AllOwners = await wallet.totalOwners()
      console.log(`total owners --> ${AllOwners.toString()}`)
      setTotalOwners(AllOwners.toString())
      const getOwnersAddres = await wallet.getOwnersAddress()
      console.log(`owner addresses --> ${getOwnersAddres}`)
      setOwners(getOwnersAddres)
      const walletBalance = await provider.getBalance(walletAddress)
      setBallance(ethers.utils.formatEther(walletBalance))
      const threshold = await wallet.threshold()
      setThreshold(threshold.toString())
      console.log('setting complete')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //initPendingList
  const initPendingList = () => {
    console.log("initPendingList")
    pendingTransactionList()
    pendingThresholdList()
    pendingRemoveOwnerList()
    pendingAddOwnerList()
  }

  //pendingTransactionList
  const pendingTransactionList = async () => {
    await pendingTransactionRequest()
  }

  const pendingTransactionRequest = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const wallet = new ethers.Contract(walletAddress, abi, signer)
    try {
      const dataList = await wallet.pendingTransactionsData()
      console.log('success')
      console.log(dataList)
      setPendTxList(dataList)
      // alert('success')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //pendingThresholdList
  const pendingThresholdList = async () => {
    await pendingQuorumUpdate()
  }

  const pendingQuorumUpdate = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const wallet = new ethers.Contract(walletAddress, abi, signer)
    try {
      const dataList = await wallet.pendingUpdatethresholdData()
      console.log('success')
      console.log(dataList)
      setPendThresholdList(dataList)
      // alert('success')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //pendingRemoveOwnerList
  const pendingRemoveOwnerList = async () => {
    await pendingRemoveOwner()
  }

  const pendingRemoveOwner = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const wallet = new ethers.Contract(walletAddress, abi, signer)
    try {
      const dataList = await wallet.pendingRemoveOwnerData()
      console.log('success')
      console.log(dataList)
      setPendRemoveOwnerList(dataList)
      // alert('success')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //pendingAddOwnerList
  const pendingAddOwnerList = async () => {
    await pendingAddOwner()
  }

  const pendingAddOwner = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const wallet = new ethers.Contract(walletAddress, abi, signer)
    try {
      const dataList = await wallet.pendingAddOwnerData()
      console.log(dataList)
      setPendAddOwnerList(dataList)
      console.log('success pendingList')
    } catch (e) {
      console.log(e) 
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //initHistoryList
  const initHistoryList = () => {
    console.log('initHistoryList')
    historyTransactionList()
    historyThrList()
    historyRemoveOwList()
    historyAddOwList()
  }

  //historyTransactionList
  const historyTransactionList = async () => {
    await historyTransactionRequest()
  }

  const historyTransactionRequest = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const wallet = new ethers.Contract(walletAddress, abi, signer)
    try {
      const dataList = await wallet.pendingTransactionsData()
      console.log('success')
      console.log(dataList)
      setHistoryTxList(dataList)
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //historyThrList
  const historyThrList = async () => {
    await historyQuorumUpdate()
  }

  const historyQuorumUpdate = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const wallet = new ethers.Contract(walletAddress, abi, signer)
    try {
      const dataList = await wallet.pendingUpdatethresholdData()
      console.log('success')
      console.log(dataList)
      setHistoryThresholdList(dataList)
      // alert('success')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //historyRemoveOwList
  const historyRemoveOwList = async () => {
    await historyRemoveOwner()
  }

  const historyRemoveOwner = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const wallet = new ethers.Contract(walletAddress, abi, signer)
    try {
      const dataList = await wallet.pendingRemoveOwnerData()
      console.log('success')
      console.log(dataList)
      setHistoryRemoveOwnerList(dataList)
      // alert('success')
    } catch (e) {
      console.log(e)
      setErrDesc(e.error.message)
      setLoadingFlag(false)
      setErrShow(true)
    }
  }

  //historyAddOwList
  const historyAddOwList = async () => {
    await historyAddOwner()
  }

  const historyAddOwner = async () => {
    const abi = new ethers.utils.Interface(Wallet.abi)
    const wallet = new ethers.Contract(walletAddress, abi, signer)
    try {
      const dataList = await wallet.pendingAddOwnerData()
      console.log(dataList)
      setHistoryAddOwnerList(dataList)
      console.log('success historyList')
      console.log('loading complete');
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
        <Tabs
          defaultActiveKey='setting'
          id='uncontrolled-tab-example'
          className='mb-3'
        >
          <Tab eventKey='setting' title='Setting'>
            <ListGroup>
              <ListGroup.Item>
                Contract's Balance: {ballance} ETH
              </ListGroup.Item>
              <ListGroup.Item>Contract's Quorum {threshold}</ListGroup.Item>
              <ListGroup.Item>Number of owners {totalOwners}</ListGroup.Item>
              <ListGroup.Item>
                <Card className='border-0'>
                  <Card.Body>
                    <Card.Text className='fw-bold'>
                      Addresses of owners
                    </Card.Text>

                    {owners.map((item) => (
                      <Card.Text key={item}>{item}</Card.Text>
                    ))}
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            </ListGroup>
          </Tab>
          <Tab eventKey='pending' title='Pending'>
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
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='1' id='tran_requirement'>
                <Accordion.Header>Transaction Request</Accordion.Header>
                <Accordion.Body>
                  {pendTxList.map((item) => (
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
                    </Row>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='2' id='quorum_update'>
                <Accordion.Header>Quorum Update</Accordion.Header>
                <Accordion.Body>
                  {pendThresholdList.map((item) => (
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
                    </Row>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='3' id='add_owner'>
                <Accordion.Header>Add Owner</Accordion.Header>
                <Accordion.Body>
                  {pendAddOwnerList.map((item) => (
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
                    </Row>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='4' id='remove_owner'>
                <Accordion.Header>Remove Owner</Accordion.Header>
                <Accordion.Body>
                  {pendRemoveOwnerList.map((item) => (
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
                    </Row>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Tab>
          <Tab eventKey='History' title='History'>
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
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='1' id='tran_requirement'>
                <Accordion.Header>Transaction Request</Accordion.Header>
                <Accordion.Body>
                  {historyTxList.map((item) => (
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
                    </Row>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='2' id='quorum_update'>
                <Accordion.Header>Quorum Update</Accordion.Header>
                <Accordion.Body>
                  {historyThresholdList.map((item) => (
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
                    </Row>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='3' id='add_owner'>
                <Accordion.Header>Add Owner</Accordion.Header>
                <Accordion.Body>
                  {historyAddOwnerList.map((item) => (
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
                    </Row>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='4' id='remove_owner'>
                <Accordion.Header>Remove Owner</Accordion.Header>
                <Accordion.Body>
                  {historyRemoveOwnerList.map((item) => (
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
                    </Row>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Tab>
        </Tabs>
      </Row>
    </Container>
  )
}
