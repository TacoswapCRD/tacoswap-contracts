import Layout from '../../components/layout/Layout'
import React from 'react'
import styled from 'styled-components'
import Spacer from '../../components/Spacer'

const FAQ = () => {
  return (
    <Layout>
      <StyledMain>
        <StyledH2>FAQ</StyledH2>
        <StyledFAQs>
          <StyledFAQsContent>
            <StyledFAQsHeader>
              <StyledNumber>1</StyledNumber>
              <StyledH3>What is Tacoswap?</StyledH3>
            </StyledFAQsHeader>
            <StyledP>
              Combine Finance is a mixture of great products in DEFI. All under one roof one platform. We have already
              integrated multiple things on our platform and more features to come.
            </StyledP>
          </StyledFAQsContent>

          <StyledFAQsContent>
            <StyledFAQsHeader>
              <StyledNumber>2</StyledNumber>
              <StyledH3>What products exist on the platform?</StyledH3>
            </StyledFAQsHeader>
            <StyledP>
              <ol>
                <li>Exchange (Combine.exchange) for swapping and adding liquidity</li>
                <li>Farming and Staking (Combstake.com)</li>
                <li>Definite Coin - (Defstake.com) - A Coin from advance pool, A financial Experimental Game.</li>
                <li>Liquidity Locked Mining (Core Vault Model) - Vault</li>
                <li>NFT - Karma Token (Redeemable & Tradeable).</li>
              </ol>
            </StyledP>
          </StyledFAQsContent>

          <StyledFAQsContent>
            <StyledFAQsHeader>
              <StyledNumber>3</StyledNumber>
              <StyledH3>What is the function of native TACO token?</StyledH3>
            </StyledFAQsHeader>
            <StyledP>
              TACO token will be used in following ways by the TACO owner.
              <ol>
                <li>Earn More TACO token by providing liquidity in the Pool.</li>
                <li>Governance for Combine Finance.</li>
                <li>Farm Token from Advanced Pool with no premine.</li>
                <li>Liquidity Locked Mining (Earn TACO & NFT karma Token too)</li>
              </ol>
            </StyledP>
          </StyledFAQsContent>

          <StyledFAQsContent>
            <StyledFAQsHeader>
              <StyledNumber>4</StyledNumber>
              <StyledH3>The Smart Contract is audited?</StyledH3>
            </StyledFAQsHeader>
            <StyledP>
              Yes
              <Spacer />
              Audit Report by Andranik. <br />
              <StyledLink
                target="_blank"
                href="https://medium.com/@combinefinance/combine-finance-audit-report-5909ccc25eda"
              >
                https://medium.com/@combinefinance/combine-finance-audit-report-5909ccc25eda
              </StyledLink>
            </StyledP>
          </StyledFAQsContent>

          <StyledFAQsContent>
            <StyledFAQsHeader>
              <StyledNumber>5</StyledNumber>
              <StyledH3>Future Roadmap for Combine Finance?</StyledH3>
            </StyledFAQsHeader>
            <StyledP>
              <ol>
                <li>
                  We will tweak our own exchange and run it properly like uniswap. The fees variation and some other
                  incentives will be added for people to use combine.exchange.
                </li>
                <li>More additions of coins on the advance pool. Currently Defstake.com is still running.</li>
                <li>Switch to Polkadot Ecosystem</li>
                <li>Create a StableCoin With lending and borrowing via TACO token</li>
                <li>More Vaults & Governance.</li>
                <li>Whatever that will make our ecosystem stronger we will integrate that.</li>
              </ol>
            </StyledP>
          </StyledFAQsContent>
        </StyledFAQs>
      </StyledMain>
    </Layout>
  )
}

export default FAQ

const StyledMain = styled.div`
  background: #fbfdff;
  box-shadow: 0 0 40px rgba(255, 150, 45, 0.06);
  word-wrap: break-word;
  box-sizing: border-box;
  border-radius: 16px;
  width: 80%;
  max-width: 1124px;
  margin-top: 22px;
  margin-bottom: 42px;
  padding: 52px 110px 74px;
  font-style: normal;
  color: ${({ theme }) => theme.brown1};
  @media (max-width: 850px) {
    padding: 62px 54px 74px;
  }
  @media (max-width: 750px) {
    padding: 62px 24px 74px;
  }
  @media (max-width: 678px) {
    width: 100%;
    border-radius: 0;
  }
  @media (max-width: 530px) {
    padding: 62px 11px 74px;
  }
`

const StyledH2 = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  font-family: Lora;
`

const StyledFAQs = styled.div``
const StyledFAQsContent = styled.div`
  padding-bottom: 40px;
  position: relative;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 1px;
    top: 51px;
    left: 25px;
    bottom: 0;
    background-color: #614e56;
  }
  @media (max-width: 750px) {
    margin: 0 9px;
  }
`

const StyledFAQsHeader = styled.div`
  display: flex;
  align-items: center;
`

const StyledNumber = styled.div`
  text-align: center;
  line-height: 47px;
  border-radius: 50%;
  border: 1px solid #614e56;
  font-size: 24px;
  width: 50px;
  height: 50px;
  min-width: 50px;
  box-sizing: border-box;
  align-self: flex-start;
`

const StyledH3 = styled.h3`
  font-size: 20px;
  margin-left: 15px;
  margin-bottom: 0;
  margin-top: 0;
  @media (max-width: 500px) {
    margin-left: 50px;
    margin-bottom: 16px;
  }
`

const StyledP = styled.div`
  font-size: 16px;
  font-weight: 20;
  margin-left: 67px;
  ol {
    padding: 0 0 0 20px;
  }
`

const StyledLink = styled.a`
  color: ${({ theme }) => theme.brown1};
  :hover {
    color: #7e7979;
  }
`
