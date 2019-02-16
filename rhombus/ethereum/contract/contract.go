// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package lighthouse

import (
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = abi.U256
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// LighthouseABI is the input ABI used to generate the binding from.
const LighthouseABI = "[{\"constant\":true,\"inputs\":[],\"name\":\"peekData\",\"outputs\":[{\"name\":\"v\",\"type\":\"uint128\"},{\"name\":\"b\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"read\",\"outputs\":[{\"name\":\"x\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"peek\",\"outputs\":[{\"name\":\"v\",\"type\":\"bytes32\"},{\"name\":\"ok\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"peekUpdated\",\"outputs\":[{\"name\":\"v\",\"type\":\"uint32\"},{\"name\":\"b\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"peekLastNonce\",\"outputs\":[{\"name\":\"v\",\"type\":\"uint32\"},{\"name\":\"b\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"}]"

// Lighthouse is an auto generated Go binding around an Ethereum contract.
type Lighthouse struct {
	LighthouseCaller     // Read-only binding to the contract
	LighthouseTransactor // Write-only binding to the contract
	LighthouseFilterer   // Log filterer for contract events
}

// LighthouseCaller is an auto generated read-only Go binding around an Ethereum contract.
type LighthouseCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LighthouseTransactor is an auto generated write-only Go binding around an Ethereum contract.
type LighthouseTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LighthouseFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type LighthouseFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LighthouseSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type LighthouseSession struct {
	Contract     *Lighthouse       // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// LighthouseCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type LighthouseCallerSession struct {
	Contract *LighthouseCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts     // Call options to use throughout this session
}

// LighthouseTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type LighthouseTransactorSession struct {
	Contract     *LighthouseTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts     // Transaction auth options to use throughout this session
}

// LighthouseRaw is an auto generated low-level Go binding around an Ethereum contract.
type LighthouseRaw struct {
	Contract *Lighthouse // Generic contract binding to access the raw methods on
}

// LighthouseCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type LighthouseCallerRaw struct {
	Contract *LighthouseCaller // Generic read-only contract binding to access the raw methods on
}

// LighthouseTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type LighthouseTransactorRaw struct {
	Contract *LighthouseTransactor // Generic write-only contract binding to access the raw methods on
}

// NewLighthouse creates a new instance of Lighthouse, bound to a specific deployed contract.
func NewLighthouse(address common.Address, backend bind.ContractBackend) (*Lighthouse, error) {
	contract, err := bindLighthouse(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Lighthouse{LighthouseCaller: LighthouseCaller{contract: contract}, LighthouseTransactor: LighthouseTransactor{contract: contract}, LighthouseFilterer: LighthouseFilterer{contract: contract}}, nil
}

// NewLighthouseCaller creates a new read-only instance of Lighthouse, bound to a specific deployed contract.
func NewLighthouseCaller(address common.Address, caller bind.ContractCaller) (*LighthouseCaller, error) {
	contract, err := bindLighthouse(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &LighthouseCaller{contract: contract}, nil
}

// NewLighthouseTransactor creates a new write-only instance of Lighthouse, bound to a specific deployed contract.
func NewLighthouseTransactor(address common.Address, transactor bind.ContractTransactor) (*LighthouseTransactor, error) {
	contract, err := bindLighthouse(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &LighthouseTransactor{contract: contract}, nil
}

// NewLighthouseFilterer creates a new log filterer instance of Lighthouse, bound to a specific deployed contract.
func NewLighthouseFilterer(address common.Address, filterer bind.ContractFilterer) (*LighthouseFilterer, error) {
	contract, err := bindLighthouse(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &LighthouseFilterer{contract: contract}, nil
}

// bindLighthouse binds a generic wrapper to an already deployed contract.
func bindLighthouse(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(LighthouseABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Lighthouse *LighthouseRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _Lighthouse.Contract.LighthouseCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Lighthouse *LighthouseRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Lighthouse.Contract.LighthouseTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Lighthouse *LighthouseRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Lighthouse.Contract.LighthouseTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Lighthouse *LighthouseCallerRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _Lighthouse.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Lighthouse *LighthouseTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Lighthouse.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Lighthouse *LighthouseTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Lighthouse.Contract.contract.Transact(opts, method, params...)
}

// Peek is a free data retrieval call binding the contract method 0x59e02dd7.
//
// Solidity: function peek() constant returns(v bytes32, ok bool)
func (_Lighthouse *LighthouseCaller) Peek(opts *bind.CallOpts) (struct {
	V  [32]byte
	Ok bool
}, error) {
	ret := new(struct {
		V  [32]byte
		Ok bool
	})
	out := ret
	err := _Lighthouse.contract.Call(opts, out, "peek")
	return *ret, err
}

// Peek is a free data retrieval call binding the contract method 0x59e02dd7.
//
// Solidity: function peek() constant returns(v bytes32, ok bool)
func (_Lighthouse *LighthouseSession) Peek() (struct {
	V  [32]byte
	Ok bool
}, error) {
	return _Lighthouse.Contract.Peek(&_Lighthouse.CallOpts)
}

// Peek is a free data retrieval call binding the contract method 0x59e02dd7.
//
// Solidity: function peek() constant returns(v bytes32, ok bool)
func (_Lighthouse *LighthouseCallerSession) Peek() (struct {
	V  [32]byte
	Ok bool
}, error) {
	return _Lighthouse.Contract.Peek(&_Lighthouse.CallOpts)
}

// PeekData is a free data retrieval call binding the contract method 0x420b81f6.
//
// Solidity: function peekData() constant returns(v uint128, b bool)
func (_Lighthouse *LighthouseCaller) PeekData(opts *bind.CallOpts) (struct {
	V *big.Int
	B bool
}, error) {
	ret := new(struct {
		V *big.Int
		B bool
	})
	out := ret
	err := _Lighthouse.contract.Call(opts, out, "peekData")
	return *ret, err
}

// PeekData is a free data retrieval call binding the contract method 0x420b81f6.
//
// Solidity: function peekData() constant returns(v uint128, b bool)
func (_Lighthouse *LighthouseSession) PeekData() (struct {
	V *big.Int
	B bool
}, error) {
	return _Lighthouse.Contract.PeekData(&_Lighthouse.CallOpts)
}

// PeekData is a free data retrieval call binding the contract method 0x420b81f6.
//
// Solidity: function peekData() constant returns(v uint128, b bool)
func (_Lighthouse *LighthouseCallerSession) PeekData() (struct {
	V *big.Int
	B bool
}, error) {
	return _Lighthouse.Contract.PeekData(&_Lighthouse.CallOpts)
}

// PeekLastNonce is a free data retrieval call binding the contract method 0xbecfbf69.
//
// Solidity: function peekLastNonce() constant returns(v uint32, b bool)
func (_Lighthouse *LighthouseCaller) PeekLastNonce(opts *bind.CallOpts) (struct {
	V uint32
	B bool
}, error) {
	ret := new(struct {
		V uint32
		B bool
	})
	out := ret
	err := _Lighthouse.contract.Call(opts, out, "peekLastNonce")
	return *ret, err
}

// PeekLastNonce is a free data retrieval call binding the contract method 0xbecfbf69.
//
// Solidity: function peekLastNonce() constant returns(v uint32, b bool)
func (_Lighthouse *LighthouseSession) PeekLastNonce() (struct {
	V uint32
	B bool
}, error) {
	return _Lighthouse.Contract.PeekLastNonce(&_Lighthouse.CallOpts)
}

// PeekLastNonce is a free data retrieval call binding the contract method 0xbecfbf69.
//
// Solidity: function peekLastNonce() constant returns(v uint32, b bool)
func (_Lighthouse *LighthouseCallerSession) PeekLastNonce() (struct {
	V uint32
	B bool
}, error) {
	return _Lighthouse.Contract.PeekLastNonce(&_Lighthouse.CallOpts)
}

// PeekUpdated is a free data retrieval call binding the contract method 0xbdf384a8.
//
// Solidity: function peekUpdated() constant returns(v uint32, b bool)
func (_Lighthouse *LighthouseCaller) PeekUpdated(opts *bind.CallOpts) (struct {
	V uint32
	B bool
}, error) {
	ret := new(struct {
		V uint32
		B bool
	})
	out := ret
	err := _Lighthouse.contract.Call(opts, out, "peekUpdated")
	return *ret, err
}

// PeekUpdated is a free data retrieval call binding the contract method 0xbdf384a8.
//
// Solidity: function peekUpdated() constant returns(v uint32, b bool)
func (_Lighthouse *LighthouseSession) PeekUpdated() (struct {
	V uint32
	B bool
}, error) {
	return _Lighthouse.Contract.PeekUpdated(&_Lighthouse.CallOpts)
}

// PeekUpdated is a free data retrieval call binding the contract method 0xbdf384a8.
//
// Solidity: function peekUpdated() constant returns(v uint32, b bool)
func (_Lighthouse *LighthouseCallerSession) PeekUpdated() (struct {
	V uint32
	B bool
}, error) {
	return _Lighthouse.Contract.PeekUpdated(&_Lighthouse.CallOpts)
}

// Read is a free data retrieval call binding the contract method 0x57de26a4.
//
// Solidity: function read() constant returns(x bytes32)
func (_Lighthouse *LighthouseCaller) Read(opts *bind.CallOpts) ([32]byte, error) {
	var (
		ret0 = new([32]byte)
	)
	out := ret0
	err := _Lighthouse.contract.Call(opts, out, "read")
	return *ret0, err
}

// Read is a free data retrieval call binding the contract method 0x57de26a4.
//
// Solidity: function read() constant returns(x bytes32)
func (_Lighthouse *LighthouseSession) Read() ([32]byte, error) {
	return _Lighthouse.Contract.Read(&_Lighthouse.CallOpts)
}

// Read is a free data retrieval call binding the contract method 0x57de26a4.
//
// Solidity: function read() constant returns(x bytes32)
func (_Lighthouse *LighthouseCallerSession) Read() ([32]byte, error) {
	return _Lighthouse.Contract.Read(&_Lighthouse.CallOpts)
}
