package ethereum

import (
	"github.com/EnoRage/rhombus-exchange-rates/ethereum/contract"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"math"
	"strconv"
)

func GetRate(currency string) (float64)  {
	addresss:= ""
	reverse := false

	switch currency {
	case "usd-eth":
		addresss = "0x9aED5cA00A44682cDC488b7778728a728717f7e3"
	case "eth-usd":
		reverse = true
		addresss = "0x9aED5cA00A44682cDC488b7778728a728717f7e3"
	case "usd-xdai":
		reverse = true
		addresss = "0xeC7eec5efa20B7E7E5C939765Ca0c7bF925dd488"
	case "xdai-usd":
		addresss = "0xeC7eec5efa20B7E7E5C939765Ca0c7bF925dd488"
	case "dai-usd":
		addresss = "0xa8A817211e4c763e7b1cf8531bC1528fF2348ADE"
	case "usd-dai":
		reverse = true
		addresss = "0xa8A817211e4c763e7b1cf8531bC1528fF2348ADE"
	case "usd-btc":
		addresss = "0x3a4d9066F186C7Af2b2bF08C1d9419B45bdd1Faa"
	case "btc-usd":
		reverse = true
		addresss = "0x3a4d9066F186C7Af2b2bF08C1d9419B45bdd1Faa"
	}

	client, err := ethclient.Dial("https://rinkeby.infura.io/")
	if err != nil {
		return 0
	}

	address := common.HexToAddress(addresss)
	instance, err := lighthouse.NewLighthouse(address, client)
	if err != nil {
		return 0
	}

	version, err := instance.PeekData(nil)
	if err != nil {
		return 0
	}

	var result float64
	if reverse {
		f, err := strconv.ParseFloat(version.V.String(), 64)
		if err != nil {
			return 0
		}
		return 1000000000000000000 / f
	}
	d, err := strconv.ParseFloat(version.V.String(), 64)

	if err !=nil {
		result = 0
	}
	result = d / 1000000000000000000

	return toFixed(result, 2)
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func toFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num * output)) / output
}