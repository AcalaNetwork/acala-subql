### Acala SubQL

#### Basic Chain Data
+ [x] Block

+ [x] Extrinsic

+ [x] Event

+ [x] Call

### Basic System Data
+ [x] Account

+ [x] Token

+ [x] Price

### SubSystem Data

+ oracle
  + [ ] OracleFeedRecord 
  + [ ] OracleHourData

+ loan
  - [ ] UserPosition
    ` 用户债仓 `
    token
    address

    debit
    collateral

    debitAmount
    collateralAmount

    brrowedAUSDAmount

    createAtBlock
    updateAtBlock

  - [ ] UpdateAction

  - [ ] AuctionAction

+ Dex
  - [ ] LiquidityPool
    token0
    token1

    token0Price
    token1Price

    token0Volumn
    token1Volumn

    totalVolumnInUSD

  - [ ] LiquidityPoolDayData
    pool

    token0TotalVolumn
    token1TotalVolumn

    totalIssuance
    totalVolumnInUSD

    callCount

  - [ ] LiquidityPoolHourData
    pool

    token0TotalVolumn
    token1TotalVolumn

    totalIssuance
    totalVolumnInUSD

    callCount
    
  
  - [ ] SwapAction
    tokenIn
    tokenOut

    tokenInAmount
    tokenOutAmount

    tokenInAmountInUSD
    tokenOutAmountInUSD

    call 
    timestamp

  - [ ] AddLiquidityAction
    account
    pool
    token0Amount
    token1Amount

    receivedShare

    call
    timestamp

  - [ ] RemoveLiquidityAction
    account
    pool
    token0Amount
    token1Amount

    removedShare

    call
    timestamp

+ Incentive
  - [ ] IncentivePool
      totalShare
      isActive
      activeAtBlock
      reward
  
  - [ ] UserIncentive
      account
      poolId
      share
      derivedRatio

  - [ ] DexShareDepositAction
    ` 用户抵押 LP 到 Incentive Pool 记录 `
  
  - [ ] DexShareWithdrawAction
    用户从 Incentive Pool 中取出流动性的记录

  - [ ] LoanAction
    用户操作 Loan 获取 Share 记录

+ Liquid Token
  - StakingPool
    抵押池数据
  
  - StakeAction
    用户 Staking 记录

  - UnStakeAction
    用户 UnStake 记录

### Statistics Data

+ AccountAssets4HourData

+ dex
  - TokenDayData
  - PairDayData

+ loan (honzon)
  - LoanDayData

+ liquid token (homa)

  - LiquidTokenDayData