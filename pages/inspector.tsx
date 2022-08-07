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

  const [ asksNFT, setAsksNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "1"
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

            <div>
              <label>Preview</label>
                <NFTPreview
                  contract={asksNFT.contractAddress}
                  id={asksNFT.tokenId}
                  showBids={false}
                  showPerpetual={false}
                />
            </div>
          </form>

        </MediaConfiguration>

        <form>
          <div>
            <label>Metadata</label>
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
