const tbn = (x) => new BigNumber(x);
const tw = (x) => BigNumber.isBigNumber(x) ? x.times(1e18).integerValue() : tbn(x).times(1e18).integerValue();
const fw = (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber();
const ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];
const bzxABI = [{"constant":true,"inputs":[],"name":"DEBUG_MODE","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":true,"name":"oldOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"LogChangeLenderOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":true,"name":"oldOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"LogChangeTraderOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":true,"name":"lender","type":"address"},{"indexed":false,"name":"loanTokenAmountAdded","type":"uint256"},{"indexed":false,"name":"loanTokenAmountFillable","type":"uint256"}],"name":"LogIncreasedLoanableAmount","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"adder","type":"address"},{"indexed":true,"name":"maker","type":"address"},{"indexed":true,"name":"feeRecipientAddress","type":"address"},{"indexed":false,"name":"lenderRelayFee","type":"uint256"},{"indexed":false,"name":"traderRelayFee","type":"uint256"},{"indexed":false,"name":"maxDuration","type":"uint256"},{"indexed":false,"name":"makerRole","type":"uint256"}],"name":"LogLoanAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"maker","type":"address"},{"indexed":false,"name":"cancelLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"remainingLoanTokenAmount","type":"uint256"},{"indexed":true,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"lender","type":"address"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"loanCloser","type":"address"},{"indexed":false,"name":"isLiquidation","type":"bool"},{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"positionId","type":"uint256"}],"name":"LogLoanClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"lender","type":"address"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"loanTokenAddress","type":"address"},{"indexed":false,"name":"collateralTokenAddress","type":"address"},{"indexed":false,"name":"loanTokenAmount","type":"uint256"},{"indexed":false,"name":"collateralTokenAmount","type":"uint256"},{"indexed":false,"name":"loanEndUnixTimestampSec","type":"uint256"},{"indexed":false,"name":"firstFill","type":"bool"},{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"positionId","type":"uint256"}],"name":"LogLoanTaken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"initialMarginAmount","type":"uint256"},{"indexed":false,"name":"maintenanceMarginAmount","type":"uint256"},{"indexed":false,"name":"currentMarginAmount","type":"uint256"},{"indexed":false,"name":"positionId","type":"uint256"}],"name":"LogMarginLevels","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":true,"name":"lender","type":"address"},{"indexed":false,"name":"amountPaid","type":"uint256"},{"indexed":false,"name":"totalAccrued","type":"uint256"},{"indexed":false,"name":"loanCount","type":"uint256"}],"name":"LogPayInterestForOrder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":true,"name":"lender","type":"address"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"amountPaid","type":"uint256"},{"indexed":false,"name":"totalAccrued","type":"uint256"},{"indexed":false,"name":"positionId","type":"uint256"}],"name":"LogPayInterestForPosition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"sourceTokenAddress","type":"address"},{"indexed":false,"name":"destTokenAddress","type":"address"},{"indexed":false,"name":"sourceTokenAmount","type":"uint256"},{"indexed":false,"name":"destTokenAmount","type":"uint256"},{"indexed":false,"name":"positionId","type":"uint256"}],"name":"LogPositionTraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"loanOrderHash","type":"bytes32"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"profitWithdrawn","type":"uint256"},{"indexed":false,"name":"remainingPosition","type":"uint256"},{"indexed":false,"name":"positionId","type":"uint256"}],"name":"LogWithdrawProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowedValidators","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xV2Contract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"oracleData","type":"bytes"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrderWithHash","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"}],"name":"changeCollateral","outputs":[{"name":"collateralTokenAmountFilled","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"changeLenderOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"changeTraderOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"closeLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"closeAmount","type":"uint256"}],"name":"closeLoanPartially","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"depositAmount","type":"uint256"}],"name":"depositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"depositTokenAddress","type":"address"},{"name":"depositAmount","type":"uint256"}],"name":"depositPosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"forceCloanLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getActiveLoans","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"}],"name":"getInitialCollateralRequired","outputs":[{"name":"collateralTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getInterest","outputs":[{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"interestTotalAccrued","type":"uint256"},{"name":"interestPaidSoFar","type":"uint256"},{"name":"interestLastPaidDate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getLoanOrder","outputs":[{"components":[{"name":"loanTokenAddress","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"interestAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"maxDurationUnixTimestampSec","type":"uint256"},{"name":"loanOrderHash","type":"bytes32"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getLoanOrderAux","outputs":[{"components":[{"name":"maker","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"lenderRelayFee","type":"uint256"},{"name":"traderRelayFee","type":"uint256"},{"name":"makerRole","type":"uint256"},{"name":"expirationUnixTimestampSec","type":"uint256"},{"name":"description","type":"string"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"oracleData","type":"bytes"}],"name":"getLoanOrderHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionId","type":"uint256"}],"name":"getLoanPosition","outputs":[{"components":[{"name":"trader","type":"address"},{"name":"collateralTokenAddressFilled","type":"address"},{"name":"positionTokenAddressFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"loanTokenAmountUsed","type":"uint256"},{"name":"collateralTokenAmountFilled","type":"uint256"},{"name":"positionTokenAmountFilled","type":"uint256"},{"name":"loanStartUnixTimestampSec","type":"uint256"},{"name":"loanEndUnixTimestampSec","type":"uint256"},{"name":"active","type":"bool"},{"name":"positionId","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForLender","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForTrader","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getMarginLevels","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrdersFillable","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrdersForUser","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"},{"name":"positionTokenAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getSingleLoan","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getSingleOrder","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanTokenAmountToAdd","type":"uint256"}],"name":"increaseLoanableAmount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"interestPaid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"interestPaidDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"interestRefunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"interestTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"signer","type":"address"},{"name":"hash","type":"bytes32"},{"name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"liquidatePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"loanPositions","outputs":[{"name":"trader","type":"address"},{"name":"collateralTokenAddressFilled","type":"address"},{"name":"positionTokenAddressFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"loanTokenAmountUsed","type":"uint256"},{"name":"collateralTokenAmountFilled","type":"uint256"},{"name":"positionTokenAmountFilled","type":"uint256"},{"name":"loanStartUnixTimestampSec","type":"uint256"},{"name":"loanEndUnixTimestampSec","type":"uint256"},{"name":"active","type":"bool"},{"name":"positionId","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"loanPositionsIds","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleRegistryContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderAux","outputs":[{"name":"maker","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"lenderRelayFee","type":"uint256"},{"name":"traderRelayFee","type":"uint256"},{"name":"makerRole","type":"uint256"},{"name":"expirationUnixTimestampSec","type":"uint256"},{"name":"description","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderCancelledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderFilledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderLender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"orderList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"orderListIndex","outputs":[{"name":"index","type":"uint256"},{"name":"isSet","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"orderPositionList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"loanTokenAddress","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"interestAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"maxDurationUnixTimestampSec","type":"uint256"},{"name":"loanOrderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"payInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"payInterestForOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"positionList","outputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"positionId","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"positionListIndex","outputs":[{"name":"index","type":"uint256"},{"name":"isSet","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"signer","type":"address"},{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"oracleData","type":"bytes"},{"name":"signature","type":"bytes"}],"name":"preSign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"signer","type":"address"},{"name":"hash","type":"bytes32"},{"name":"signature","type":"bytes"}],"name":"preSignWithHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"preSigned","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"oracleData","type":"bytes"},{"name":"signature","type":"bytes"}],"name":"pushLoanOrderOnChain","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"desc","type":"string"}],"name":"setLoanOrderDesc","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"oracleData","type":"bytes"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"oracleData","type":"bytes"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"oracleData","type":"bytes"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsTraderAndWithdraw","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"takeLoanOrderOnChainAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"}],"name":"takeLoanOrderOnChainAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"}],"name":"takeLoanOrderOnChainAsTraderAndWithdraw","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"tradePositionWith0x","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"components":[{"name":"makerAddress","type":"address"},{"name":"takerAddress","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"senderAddress","type":"address"},{"name":"makerAssetAmount","type":"uint256"},{"name":"takerAssetAmount","type":"uint256"},{"name":"makerFee","type":"uint256"},{"name":"takerFee","type":"uint256"},{"name":"expirationTimeSeconds","type":"uint256"},{"name":"salt","type":"uint256"},{"name":"makerAssetData","type":"bytes"},{"name":"takerAssetData","type":"bytes"}],"name":"orders0x","type":"tuple[]"},{"name":"signatures0x","type":"bytes[]"}],"name":"tradePositionWith0xV2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"tradeTokenAddress","type":"address"}],"name":"tradePositionWithOracle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"withdrawAmount","type":"uint256"}],"name":"withdrawExcessCollateral","outputs":[{"name":"excessCollateral","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"withdrawAmount","type":"uint256"}],"name":"withdrawPosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"withdrawProfit","outputs":[{"name":"profitAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const WETHAddress = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const BZXAddress = "0xf5db2944BDD37ABB80FA0dff8f018fC89b52142e";
const BZXVault = "0x68373cAB353420ADc47D7230Ce19Ba0a260dC59a";

const web3 =  new Web3(
    new Web3.providers.HttpProvider('https://ropsten.infura.io/1u84gV2YFYHHTTnh8uVl')
);

async function get(instance, method, parameters) {
    return await instance.methods[method](...parameters).call();
}

async function createBorrowOrder(privateKey, amount) {
    const borrowOrder = {
        bZxAddress: BZXAddress,
        makerAddress: getAddress(privateKey),
        loanTokenAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        interestTokenAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        collateralTokenAddress: "0x0000000000000000000000000000000000000000",
        feeRecipientAddress: "0x0000000000000000000000000000000000000000",
        oracleAddress: "0xda2751f2c2d48e2ecdfb6f48f01545a73c7e74b9",
        loanTokenAmount: amount,
        interestAmount: amount*0.005,
        initialMarginAmount: "50",
        maintenanceMarginAmount: "25",
        lenderRelayFee: "0",
        traderRelayFee: "0",
        maxDurationUnixTimestampSec: "2419200",
        expirationUnixTimestampSec: (await web3.eth.getBlock("latest")).timestamp + 2019200,
        makerRole: "0", // 0=borrower, 1=trader
        salt: 23409857249479345342
    };

    console.log(borrowOrder);
    
    const orderAddresses = [
        borrowOrder.makerAddress,
        borrowOrder.loanTokenAddress,
        borrowOrder.interestTokenAddress,
        borrowOrder.collateralTokenAddress,
        borrowOrder.feeRecipientAddress,
        borrowOrder.oracleAddress
    ];

    const orderValues = [
      borrowOrder.loanTokenAmount.toString(),
      borrowOrder.interestAmount.toString(),
      borrowOrder.initialMarginAmount.toString(),
      borrowOrder.maintenanceMarginAmount.toString(),
      borrowOrder.lenderRelayFee.toString(),
      borrowOrder.traderRelayFee.toString(),
      borrowOrder.maxDurationUnixTimestampSec.toString(),
      borrowOrder.expirationUnixTimestampSec.toString(),
      borrowOrder.makerRole.toString(),
      borrowOrder.salt.toString()
    ];

    const oracleData = "0x";

    const objHash = W3_utils.soliditySha3(
        { t: "address", v: borrowOrder.bZxAddress },
        { t: "address[6]", v: orderAddresses },
        { t: "uint256[10]", v: orderValues },
        { t: "bytes", v: oracleData }
      );

    // const orderHashBuff = Eth_js_util.toBuffer(objHash);
    // const msgHashBuff = Eth_js_util.hashPersonalMessage(orderHashBuff);
    // const msgHashHex = Eth_js_util.bufferToHex(msgHashBuff);

    console.log("TxHash: " + objHash)

    const signature = Eth_crypto.sign(
        privateKey, // privateKey
        objHash // hash of message
    );

    const parseSignatureHexAsVRS = signatureHex => {
        const sig = Eth_js_util.fromRpcSig(signatureHex);
        const ecSignature = {
            v: sig.v,
            r: Eth_js_util.bufferToHex(sig.r),
            s: Eth_js_util.bufferToHex(sig.s)
        };
        return ecSignature;
    };

    const ecSignatureRSV = parseSignatureHexAsVRS(signature);

    const rpcSig =  Eth_js_util.toRpcSig(ecSignatureRSV.v, ecSignatureRSV.r, ecSignatureRSV.s);

    console.log("Signature: " + rpcSig)

    // const objHash = web3.utils.keccak256(borrowOrder);

    // const sigPrefix = '\x19Ethereum Signed Message:\n32';
    // const signature = await web3.eth.sign(objHash, getAddress(privateKey));
    // const signedBorrowOrder = { ...borrowOrder, signature: signature};

    const instance = getInstance(bzxABI, BZXAddress);
    const data = getCallData(instance , "takeLoanOrderAsLender" ,[orderAddresses, orderValues, oracleData, rpcSig+"03"]);
    const response = await set(privateKey, BZXAddress, 0, data);
    console.log(response)
    return response.transactionHash;
}

async function sendToken(tokenAddress, privateKey, receiver, amount) {
    const instance = getInstance(ABI, tokenAddress);
    const data = getCallData(instance, "transfer", [receiver, amount]);
    const response = await set(privateKey, instance, tokenAddress, data);
    return response.transactionHash;
}

async function setAllowance(privateKey, amount) {
    return approve(WETHAddress, privateKey, amount);
}

async function approve(tokenAddress, privateKey, amount) {
    const instance = getInstance(ABI, tokenAddress);
    const data = getCallData(instance, "approve", [BZXVault, "0x"+amount.toString(16)]);
    return set(privateKey, tokenAddress, 0, data);
}

async function depositToken(privateKey, amount) {
    const instance = getInstance(ABI, WETHAddress);
    const data = getCallData(instance, "deposit", []);
    return set(privateKey, WETHAddress, amount, data);

}

async function set(privateKey, receiver, amount, transactionData, gas = 210000) {
    const userAddress = getAddress(privateKey);
    const txParam = {
        nonce: "0x"+(await web3.eth.getTransactionCount(userAddress)).toString(16),
        to: receiver,
        contractAddress: receiver,
        value: amount,
        from: userAddress,
        data: transactionData !== undefined ? transactionData : '',
        gasPrice: "0x3b9bca00",
        gas: "0x"+gas.toString(16)
    };
    console.log(txParam)
    const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(privateKey.substring(2), 'hex');

    const tx = new ethereumjs.Tx(txParam);
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();

    return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
}

function getCallData(instance, method, parameters) {
    return instance.methods[method](...parameters).encodeABI();
}

function getInstance(ABI, address) {
    return new web3.eth.Contract(ABI, address);
}

function getAddress(privateKey) {
    let _privateKey = privateKey.substring(2, privateKey.length);
    return keythereum.privateKeyToAddress(_privateKey);
}

function getPrivateKey() {
    let params = {
        keyBytes: 32,
        ivBytes: 16
    };
    let dk = keythereum.create(params);
    return "0x" + dk.privateKey.reduce((memo, i) => {
        return memo + ('0' + i.toString(16)).slice(-2);
    }, '');
}

class Blockchain {
    constructor() {
        this.getPrivateKey = getPrivateKey;
        this.getAddress = getAddress;
        this.set = set;
        this.get = get;
        this.createBorrowOrder = createBorrowOrder;
        this.setAllowance = setAllowance;
        this.depositToken = depositToken;
    }
}