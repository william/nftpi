import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { NFTPreview, MediaConfiguration } from '@zoralabs/nft-components';
import { Networks, Strategies } from "@zoralabs/nft-hooks"
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json"
import zmmABI from "@zoralabs/v3/dist/artifacts/ZoraModuleManager.sol/ZoraModuleManager.json"
import erc721abi from 'erc-token-abis/abis/ERC721Full.json'
import { erc721ABI, useAccount, useContractRead, useContractWrite } from 'wagmi'
// import { Header } from '../components/Header'
import AskRead_disclosure from "../components/Asks/AskRead_disclosure"
import AskWrite_disclosure from '../components/Asks/AskWrite_disclosure';
import OffersRead_disclosure from "../components/Offers/OffersRead_disclosure"
import OffersWrite_disclosure from '../components/Offers/OffersWrite_disclosure';
import AuctionRead_disclosure from "../components/Auctions/AuctionRead_disclosure"
import AuctionWrite_disclosure from '../components/Auctions/AuctionWrite_disclosure'

const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Mainnet,
}

const API_ENDPOINT = "https://api.zora.co/graphql";
const zdkArgs = {
  endPoint: API_ENDPOINT,
  networks: [networkInfo],
}

const zdk = new ZDK(zdkArgs) // All arguments are optional

const zdkStrategyMainnet = new Strategies.ZDKFetchStrategy(
  Networks.MAINNET
)

const Inspector: NextPage = () => {

  interface nftInfo {
    contractAddress: string,
    tokenId: string
  }

  interface nftABIInfo {
    nftABI: any
  }

  const [ asksNFT, setAsksNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "1"
  })

  const [ offersNFT, setOffersNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "2"
  })

  const [ auctionsNFT, setAuctionsNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "3"
  })

  // get account hook
  const { address, connector, isConnecting, isConnected, status} = useAccount();
  const currentUserAddress = address ? address : ""

  // ASKS: check if owner has approved ERC721 transfer helper for specific NFT
  const { data: asksRead, isError: asksError, isLoading: asksLoading, isSuccess: asksSuccess, isFetching: asksFetching  } = useContractRead({
    addressOrName: asksNFT.contractAddress,
    contractInterface: erc721abi,
    functionName: 'isApprovedForAll',
    args: [
      currentUserAddress, //owner
      mainnetZoraAddresses.ERC721TransferHelper // transferhelper
    ],
    watch: false,
    onError(error) {
      console.log("error: ", asksError)
    },
    onSuccess(data) {
      console.log("Asks ERC721TransferHelper Approved? --> ", asksRead)
    }
  })

  const transferHelperDataBoolAsks = () => {
    return Boolean(asksRead);
  }

  // ASKS: Apporve ERC721TransferHelper as an operator of the specific NFT
  const { data: asksTransferHelperData, isError: asksTransferHelperError, isLoading: asksTransferHelperLoading, isSuccess: asksTransferHelperSuccess, write: asksTransferHelperWrite } = useContractWrite({
    addressOrName: asksNFT.contractAddress,
    contractInterface: erc721ABI,
    functionName: 'setApprovalForAll',
    args: [
        mainnetZoraAddresses.ERC721TransferHelper,
        true,
    ],
    onError(error, variables, context) {
        console.log("error", error)
    },
    onSuccess(cancelData, variables, context) {
        console.log("Success!", asksTransferHelperData)
    },
  })

  // check if owner has approved Asks Module V1.1
  const { data: zmmAsksBool, isError: zmmAsksError, isLoading: zmmAsksLoading, isSuccess: zmmAsksSuccess, isFetching: zmmAsksFetching  } = useContractRead({
    addressOrName: mainnetZoraAddresses.ZoraModuleManager,
    contractInterface: zmmABI.abi,
    functionName: 'isModuleApproved',
    args: [
      currentUserAddress, //owner
      mainnetZoraAddresses.AsksV1_1 // AsksV1.1 address
    ],
    watch: false,
    onError(error) {
        console.log("error: ", zmmAsksError)
    },
    onSuccess(data) {
        console.log("AsksV1.1 Module Approved? --> ", zmmAsksBool)
    }
  })

  const zmmAsksApprovalCheck = () => {
    return Boolean(zmmAsksBool);
  }

  // ASKS: approve Asks Module
  const { data: asksZMMApproval, isError: asksZMMErrror, isLoading: asksZMMLoading, isSuccess: asksZMMSuccess, write: asksZMMWrite } = useContractWrite({
    addressOrName: mainnetZoraAddresses.ZoraModuleManager,
    contractInterface: zmmABI.abi,
    functionName: 'setApprovalForModule',
    args: [
        mainnetZoraAddresses.AsksV1_1,
        true,
    ],
    onError(error, variables, context) {
        console.log("error", error)
    },
    onSuccess(asksZMMApproval, variables, context) {
        console.log("Success!", asksZMMApproval)
    },
  })

  // ===== OFFERS =====
  // ===== OFFERS =====
  // ===== OFFERS =====

  // OFFERS: check if owner has approved ERC721 transfer helper for specific NFT
  const { data: offersData, isError: offersError, isLoading: offersLoading, isSuccess: offersSuccess, isFetching: offersFetching  } = useContractRead({
    addressOrName: offersNFT.contractAddress,
    contractInterface: erc721abi,
    functionName: 'isApprovedForAll',
    args: [
      currentUserAddress, //owner
      mainnetZoraAddresses.ERC721TransferHelper // transferhelper
    ],
    watch: false,
    onError(error) {
      console.log("error: ", offersError)
    },
    onSuccess(data) {
      console.log("Offers ERC721TransferHelper Approved? --> ", offersData)
    }
  })

  const transferHelperDataBoolOffers = () => {
    return Boolean(offersData);
  }

    // OFFERS: Apporve ERC721TransferHelper as an operator of the specific NFT
    const { data: offersTransferHelperData, isError: offersTransferHelperError, isLoading: offersTransferHelperLoading, isSuccess: offersTransferHelperSuccess, write: offersTransferHelperWrite } = useContractWrite({
      addressOrName: asksNFT.contractAddress,
      contractInterface: erc721ABI,
      functionName: 'setApprovalForAll',
      args: [
          mainnetZoraAddresses.ERC721TransferHelper,
          true,
      ],
      onError(error, variables, context) {
          console.log("error", error)
      },
      onSuccess(cancelData, variables, context) {
          console.log("Success!", offersTransferHelperData)
      },
  })

  // check if owner has approved OffersV1 Module
  const { data: zmmOffersBool, isLoading: zmmOffersLoading, isSuccess: zmmOffersSuccess, isFetching: zmmOffersFetching  } = useContractRead({
    addressOrName: mainnetZoraAddresses.ZoraModuleManager,
    contractInterface: zmmABI.abi,
    functionName: 'isModuleApproved',
    args: [
      currentUserAddress, //owner
      mainnetZoraAddresses.OffersV1 // OffersV1 address
    ],
    watch: false,
    onError(error) {
        console.log("error: ", error)
    },
    onSuccess(data) {
        console.log("OffersV1 Module Approved? --> ", data)
    }
  })

  const zmmOffersApprovalCheck = () => {
    return Boolean(zmmOffersBool);
  }

  // offers: approve Offers Module
  const { data: offersZMMApproval, isError: offersZMMErrror, isLoading: offersZMMLoading, isSuccess: offersZMMSuccess, write: offersZMMWrite } = useContractWrite({
    addressOrName: mainnetZoraAddresses.ZoraModuleManager,
    contractInterface: zmmABI.abi,
    functionName: 'setApprovalForModule',
    args: [
        mainnetZoraAddresses.OffersV1,
        true,
    ],
    onError(error, variables, context) {
        console.log("error", error)
    },
    onSuccess(offersZMMApproval, variables, context) {
        console.log("Success!", offersZMMApproval)
    },
  })

  // ===== AUCTIONS =====
  // ===== AUCTIONS =====
  // ===== AUCTIONS =====

  // auctions: check if owner has approved ERC721 transfer helper for specific NFT
  const { data: auctionsData, isError: auctionsError, isLoading: auctionsLoading, isSuccess: auctionsSuccess, isFetching: auctionsFetching  } = useContractRead({
    addressOrName: auctionsNFT.contractAddress,
    contractInterface: erc721abi,
    functionName: 'isApprovedForAll',
    args: [
      currentUserAddress, //owner
      mainnetZoraAddresses.ERC721TransferHelper // transferhelper
    ],
    watch: false,
    onError(error) {
      console.log("error: ", auctionsError)
    },
    onSuccess(data) {
      console.log("Auctions ERC721TransferHelper Approved? --> ", auctionsData)
    }
  })

  const transferHelperDataBoolAuctions = () => {
    return Boolean(auctionsData);
  }

  // auctions: Apporve ERC721TransferHelper as an operator of the specific NFT
  const { data: auctionsTransferHelperData, isError: auctionsTransferHelperError, isLoading: auctionsTransferHelperLoading, isSuccess: auctionsTransferHelperSuccess, write: auctionsTransferHelperWrite } = useContractWrite({
    addressOrName: asksNFT.contractAddress,
    contractInterface: erc721ABI,
    functionName: 'setApprovalForAll',
    args: [
        mainnetZoraAddresses.ERC721TransferHelper,
        true,
    ],
    onError(error, variables, context) {
        console.log("error", error)
    },
    onSuccess(cancelData, variables, context) {
        console.log("Success!", auctionsTransferHelperData)
    },
  })

  // check if owner has approved AuctionFindersEth Module
  const { data: zmmAuctionFindersEthBool, isLoading: zmmAuctionFindersEthLoading, isSuccess: zmmAuctionFindersEthSuccess, isFetching: zmmAuctionFindersEthFetching  } = useContractRead({
    addressOrName: mainnetZoraAddresses.ZoraModuleManager,
    contractInterface: zmmABI.abi,
    functionName: 'isModuleApproved',
    args: [
      currentUserAddress, //owner
      mainnetZoraAddresses.ReserveAuctionFindersEth // AuctionFindersEth address
    ],
    watch: false,
    onError(error) {
        console.log("error: ", error)
    },
    onSuccess(data) {
        console.log("AuctionFindersEth Module Approved? --> ", data)
    }
  })

  const zmmAuctionFindersEthApprovalCheck = () => {
    return Boolean(zmmAuctionFindersEthBool);
  }

  // offers: approve Auctions Module
  const { data: auctionsZMMApproval, isError: auctionsZMMErrror, isLoading: auctionsZMMLoading, isSuccess: auctionsZMMSuccess, write: auctionsZMMWrite } = useContractWrite({
    addressOrName: mainnetZoraAddresses.ZoraModuleManager,
    contractInterface: zmmABI.abi,
    functionName: 'setApprovalForModule',
    args: [
        mainnetZoraAddresses.ReserveAuctionFindersEth,
        true,
    ],
    onError(error, variables, context) {
        console.log("error", error)
    },
    onSuccess(auctionsZMMApproval, variables, context) {
        console.log("Success!", auctionsZMMApproval)
    },
  })

  return (
    <div>
      <Head>
        <title>NFT Private Investigator</title>
        <meta name="description" content="An NFT Inspection Tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}
      <main id="inspector">
        <h1>NFTPI🕵️‍♂️</h1>
        <MediaConfiguration
          networkId="1"
          strategy={zdkStrategyMainnet}
          strings={{
            CARD_OWNED_BY: "",
            CARD_CREATED_BY: "",
          }}
          style={{
            theme: {
              previewCard: {
                background: "black",
                height: "300px",
                width: "300px"
              },
              defaultBorderRadius: 0,
              lineSpacing: 0,
              textBlockPadding: "0"
            },
          }}
        >
          <form>

            <div>
              <label htmlFor="inputContract">
                Contract Address
              </label>
              <input
                placeholder="ContractAddress"
                name="contractAddress"
                type="text"
                value={asksNFT.contractAddress}
                onChange={(e) => {
                    e.preventDefault();
                    setAsksNFT(current => {
                      return {
                        ...current,
                        contractAddress: e.target.value
                      }
                    })
                }}
                required
              >
              </input>
            </div>

            <div>
              <label htmlFor="input">
                Token ID
              </label>
              <input
                placeholder="Input Token ID "
                name="tokenId"
                type="text"
                value={asksNFT.tokenId}
                onChange={(e) => {
                    e.preventDefault();
                    setAsksNFT(current => {
                      return {
                        ...current,
                        tokenId: e.target.value
                      }
                    })
                }}
                required
              >
              </input>
            </div>

            <div>
              <label>
                Etherscan
              </label>
              <a
                href={`https://etherscan.io/address/${asksNFT.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`https://etherscan.io/address/${asksNFT.contractAddress}`}
              </a>
            </div>

            <div>
              <label>
                OpenSea
              </label>
              <a
                href={`https://opensea.io/assets/ethereum/${asksNFT.contractAddress}/${asksNFT.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`https://opensea.io/assets/ethereum/${asksNFT.contractAddress}/${asksNFT.tokenId}`}
              </a>
            </div>

            <div>
              <label>
                Rarible
              </label>
              <a
                href={`https://rarible.com/token/${asksNFT.contractAddress}:${asksNFT.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`https://rarible.com/token/${asksNFT.contractAddress}:${asksNFT.tokenId}`}
              </a>
            </div>
          </form>

          <NFTPreview
            contract={asksNFT.contractAddress}
            id={asksNFT.tokenId}
            showBids={false}
            showPerpetual={false}
          />
        </MediaConfiguration>

      </main>
    </div>
  )
}

export default Inspector
