import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { NFTPreview, MediaConfiguration } from '@zoralabs/nft-components';
import { Networks, Strategies, useNFT } from "@zoralabs/nft-hooks"

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

  const [marketPlaceURL, setMarketPlaceURL] = useState("");

  const [ asksNFT, setAsksNFT] = useState<nftInfo>({
    "contractAddress": "",
    "tokenId": ""
  })

  const { data } = useNFT(asksNFT.contractAddress, asksNFT.tokenId)

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
          style={{
            theme: {
              previewCard: {
                background: "lightgray",
                height: "300px",
                width: "300px"
              },
              linkColor: "black",
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
                placeholder="0x..."
                name="contractAddress"
                type="text"
                value={asksNFT.contractAddress}
                onChange={(e) => {
                    e.preventDefault();
                    setMarketPlaceURL("")
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
                placeholder="e.g. 1"
                name="tokenId"
                type="text"
                value={asksNFT.tokenId}
                onChange={(e) => {
                    e.preventDefault();
                    setMarketPlaceURL("")
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
              <label htmlFor="input">
                OR ... Marketplace URL
              </label>
              <input
                placeholder="NFT page from OpenSea, Rarible, Etc"
                name="marketPlaceURL"
                type="text"
                value={marketPlaceURL}
                onChange={(e) => {
                    e.preventDefault();
                    console.log(typeof(e.target.value))
                    if (e.target.value === "" || e.target.value === null) {
                      return
                    }
                    setMarketPlaceURL(e.target.value)
                    const [contractAddress] = e.target.value.match(/0x[a-f0-9]+/ig)
                    console.log(e.target.value)
                    const tokenId = e.target.value.match(/[\:\/][1-9][0-9]*/igm)[0].substring(1)
                    console.log(tokenId)
                    setAsksNFT(current => {
                      return {
                        contractAddress: contractAddress,
                        tokenId: tokenId,
                      }
                    })
                }}
              >
              </input>
            </div>

            <div>
              <label>Preview</label>
                <NFTPreview
                  contract={asksNFT.contractAddress}
                  id={asksNFT.tokenId}
                  showBids={false}
                  showPerpetual={false}
                />
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
                Zora
              </label>
              <a
                href={`https://zora.co/collections/${asksNFT.contractAddress}/${asksNFT.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`https://zora.co/collections/${asksNFT.contractAddress}/${asksNFT.tokenId}`}
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

            <div>
              <label>
                Nifty Gateway
              </label>
              <a
                href={`https://www.niftygateway.com/marketplace/item/${asksNFT.contractAddress}/${asksNFT.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`https://www.niftygateway.com/marketplace/item/${asksNFT.contractAddress}/${asksNFT.tokenId}`}
              </a>
            </div>


          </form>

        </MediaConfiguration>

        <form>
          <div>
            <label>Normalized Metadata</label>
            <pre>
              {JSON.stringify(typeof(data) !== 'undefined' ? data.metadata : null, null, 2) }
            </pre>
          </div>
        </form>

      </main>
    </div>
  )
}

export default Inspector
