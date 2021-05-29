import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { injected, walletconnect, walletlink, fortmatic, portis } from '../../connectors'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
// import Identicon from '../Identicon'
import { ButtonSecondary, ButtonSignOut } from '../Button'
import { TYPE } from '../../theme'
import { ReactComponent as Jar } from '../../assets/logos/tacoLogo.svg'
import useUTaco from '../../hooks/useUTaco'
import { useETHBalances, useTokenBalance } from '../../state/wallet/hooks'
import { getSushiAddress } from '../../utaco/utils'
// import Value from 'components/Value'
// import { getBalanceNumber } from '../../utils/formatBalance'
import { AccountElement } from '../Header'
import Button from '../Button/Button'
import { shortenAddress } from '../../utils'
import useAllEarnings from '../../hooks/useAllEarnings'
import { BigNumber } from '../../utaco'

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 40px 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.brown1};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const HeaderText = styled.div`
  color: ${({ theme }) => theme.brown1};
  font-size: 20px;
  font-weight: 800;
  font-family: Lora;
  display: flex;
  align-items: center;
  margin: auto;
`

const UpperSection = styled.div`
  position: relative;
  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 16px 24px;
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.brown1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  padding: 0 32px;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  display: flex;
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const ButtonSection = styled.div`
  margin: 62px 0 40px;
  button {
    margin: auto;
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 30px;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
    path {
      stroke: ${({ theme }) => theme.text4};
    }
  }
`

const CloseColor = styled(Close)`
  stroke: ${({ theme }) => theme.brown1};
`

const TacoSwapLogo = styled(Jar)`
  margin-top: 20px;
  width: 60px;
  height: 57px;
`

const WalletName = styled.div`
  width: initial;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 10px;
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

const WalletAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const MainWalletAction = styled(WalletAction)`
  color: ${({ theme }) => theme.primary1};
`

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

export default function AccountDetails({
  toggleWalletModal,

  ENSName
}: AccountDetailsProps) {
  const { account, connector, deactivate } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const handleSignOut = useCallback(() => {
    deactivate()
    toggleWalletModal()
    // eslint-disable-next-line
  }, [toggleWalletModal])

  const Taco = useUTaco()
  const TacoBalanceAmount = useTokenBalance(getSushiAddress(Taco))
  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (const earning of allEarnings) {
    sumEarning += new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }

  function formatConnectorName() {
    return (
      <div style={{ display: 'block' }}>
        <WalletName>TACO Balance</WalletName>
        {/* <Value value={TacoBalanceAmount ? getBalanceNumber(TacoBalanceAmount) : 0} size="lg" decimals={3} /> */}
      </div>
    )
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          {/* <Identicon /> */}
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <img src={CoinbaseWalletIcon} alt={'coinbase wallet logo'} />
        </IconWrapper>
      )
    } else if (connector === fortmatic) {
      return (
        <IconWrapper size={16}>
          <img src={FortmaticIcon} alt={'fortmatic logo'} />
        </IconWrapper>
      )
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper size={16}>
            <img src={PortisIcon} alt={'portis logo'} />
            <MainWalletAction
              onClick={() => {
                portis.portis.showPortis()
              }}
            >
              Show Portis
            </MainWalletAction>
          </IconWrapper>
        </>
      )
    }
    return null
  }

  console.log(getStatusIcon())

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <HeaderText>My Account</HeaderText>
        </HeaderRow>
        <AccountSection>
          <YourAccount>
            <TacoSwapLogo />
            <InfoCard>
              <AccountGroupingRow>{formatConnectorName()}</AccountGroupingRow>
              <AccountGroupingRow>
                <WalletName>
                  Unclaimed: &nbsp;&nbsp; <span>{sumEarning.toFixed(3)} TACO</span>
                </WalletName>
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
          <AccountElement active={!!account}>
            {account && userEthBalance ? (
              <TYPE.brown style={{ flexShrink: 0 }} margin="auto" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} ETH
              </TYPE.brown>
            ) : null}
            {account && (
              <Button width="50%" size="lg">
                {ENSName || shortenAddress(account)}
              </Button>
            )}
          </AccountElement>
          <ButtonSection>
            <ButtonSignOut size="signout-button" background="transparent" width="182px" onClick={handleSignOut}>
              Sign Out
            </ButtonSignOut>
          </ButtonSection>
        </AccountSection>
      </UpperSection>
    </>
  )
}
