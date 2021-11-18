/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Provider, TransactionRequest } from "@ethersproject/providers";
import {
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
  Signer,
  utils,
} from "ethers";
import type { NFT, NFTInterface } from "../NFT";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "_tokenIdTracker",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001ddb38038062001ddb8339810160408190526200003491620001e2565b8451859085906200004d90600090602085019062000091565b5080516200006390600190602084019062000091565b505050600b829055600a81905582516200008590600c90602086019062000091565b505050505050620002d5565b8280546200009f9062000282565b90600052602060002090601f016020900481019282620000c357600085556200010e565b82601f10620000de57805160ff19168380011785556200010e565b828001600101855582156200010e579182015b828111156200010e578251825591602001919060010190620000f1565b506200011c92915062000120565b5090565b5b808211156200011c576000815560010162000121565b600082601f83011262000148578081fd5b81516001600160401b0380821115620001655762000165620002bf565b6040516020601f8401601f19168201810183811183821017156200018d576200018d620002bf565b6040528382528584018101871015620001a4578485fd5b8492505b83831015620001c75785830181015182840182015291820191620001a8565b83831115620001d857848185840101525b5095945050505050565b600080600080600060a08688031215620001fa578081fd5b85516001600160401b038082111562000211578283fd5b6200021f89838a0162000137565b9650602088015191508082111562000235578283fd5b6200024389838a0162000137565b9550604088015191508082111562000259578283fd5b50620002688882890162000137565b606088015160809098015196999598509695949350505050565b6002810460018216806200029757607f821691505b60208210811415620002b957634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b611af680620002e56000396000f3fe6080604052600436106101095760003560e01c80636352211e11610095578063a0712d6811610064578063a0712d68146102c1578063a22cb465146102d4578063b88d4fde146102f4578063c87b56dd14610314578063e985e9c51461033457610109565b80636352211e1461025757806370a082311461027757806395d89b411461029757806398bcede9146102ac57610109565b806318160ddd116100dc57806318160ddd146101b557806323b872dd146101d75780632f745c59146101f757806342842e0e146102175780634f6ccce71461023757610109565b806301ffc9a71461010e57806306fdde0314610144578063081812fc14610166578063095ea7b314610193575b600080fd5b34801561011a57600080fd5b5061012e610129366004611341565b610354565b60405161013b919061143d565b60405180910390f35b34801561015057600080fd5b50610159610381565b60405161013b9190611448565b34801561017257600080fd5b50610186610181366004611379565b610413565b60405161013b91906113ec565b34801561019f57600080fd5b506101b36101ae366004611318565b61045f565b005b3480156101c157600080fd5b506101ca6104f7565b60405161013b9190611964565b3480156101e357600080fd5b506101b36101f23660046111d7565b6104fd565b34801561020357600080fd5b506101ca610212366004611318565b610535565b34801561022357600080fd5b506101b36102323660046111d7565b610587565b34801561024357600080fd5b506101ca610252366004611379565b6105a2565b34801561026357600080fd5b50610186610272366004611379565b6105fd565b34801561028357600080fd5b506101ca61029236600461118b565b610632565b3480156102a357600080fd5b50610159610676565b3480156102b857600080fd5b506101ca610685565b6101b36102cf366004611379565b61068b565b3480156102e057600080fd5b506101b36102ef3660046112de565b61072b565b34801561030057600080fd5b506101b361030f366004611212565b6107f9565b34801561032057600080fd5b5061015961032f366004611379565b610838565b34801561034057600080fd5b5061012e61034f3660046111a5565b6108bb565b60006001600160e01b0319821663780e9d6360e01b14806103795750610379826108e9565b90505b919050565b606060008054610390906119fb565b80601f01602080910402602001604051908101604052809291908181526020018280546103bc906119fb565b80156104095780601f106103de57610100808354040283529160200191610409565b820191906000526020600020905b8154815290600101906020018083116103ec57829003601f168201915b5050505050905090565b600061041e82610929565b6104435760405162461bcd60e51b815260040161043a906117a2565b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b600061046a826105fd565b9050806001600160a01b0316836001600160a01b0316141561049e5760405162461bcd60e51b815260040161043a90611886565b806001600160a01b03166104b0610946565b6001600160a01b031614806104cc57506104cc8161034f610946565b6104e85760405162461bcd60e51b815260040161043a9061162d565b6104f2838361094a565b505050565b60085490565b61050e610508610946565b826109b8565b61052a5760405162461bcd60e51b815260040161043a906118c7565b6104f2838383610a3d565b600061054083610632565b821061055e5760405162461bcd60e51b815260040161043a9061145b565b506001600160a01b03919091166000908152600660209081526040808320938352929052205490565b6104f2838383604051806020016040528060008152506107f9565b60006105ac6104f7565b82106105ca5760405162461bcd60e51b815260040161043a90611918565b600882815481106105eb57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6000818152600260205260408120546001600160a01b0316806103795760405162461bcd60e51b815260040161043a906116d4565b60006001600160a01b03821661065a5760405162461bcd60e51b815260040161043a9061168a565b506001600160a01b031660009081526003602052604090205490565b606060018054610390906119fb565b600d5481565b80600a546106999190611999565b34146106b75760405162461bcd60e51b815260040161043a9061152f565b600b54816106c5600d610b6a565b6106cf919061196d565b11156106ed5760405162461bcd60e51b815260040161043a90611752565b60005b818110156107275761070b33610706600d610b6a565b610b6e565b610715600d610c4d565b8061071f81611a36565b9150506106f0565b5050565b610733610946565b6001600160a01b0316826001600160a01b031614156107645760405162461bcd60e51b815260040161043a906115aa565b8060056000610771610946565b6001600160a01b03908116825260208083019390935260409182016000908120918716808252919093529120805460ff1916921515929092179091556107b5610946565b6001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516107ed919061143d565b60405180910390a35050565b61080a610804610946565b836109b8565b6108265760405162461bcd60e51b815260040161043a906118c7565b61083284848484610c56565b50505050565b606061084382610929565b61085f5760405162461bcd60e51b815260040161043a90611837565b6000610869610c89565b9050600081511161088957604051806020016040528060008152506108b4565b8061089384610c98565b6040516020016108a49291906113bd565b6040516020818303038152906040525b9392505050565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061091a57506001600160e01b03198216635b5e139f60e01b145b80610379575061037982610db3565b6000908152600260205260409020546001600160a01b0316151590565b3390565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061097f826105fd565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60006109c382610929565b6109df5760405162461bcd60e51b815260040161043a906115e1565b60006109ea836105fd565b9050806001600160a01b0316846001600160a01b03161480610a255750836001600160a01b0316610a1a84610413565b6001600160a01b0316145b80610a355750610a3581856108bb565b949350505050565b826001600160a01b0316610a50826105fd565b6001600160a01b031614610a765760405162461bcd60e51b815260040161043a906117ee565b6001600160a01b038216610a9c5760405162461bcd60e51b815260040161043a90611566565b610aa7838383610dcc565b610ab260008261094a565b6001600160a01b0383166000908152600360205260408120805460019290610adb9084906119b8565b90915550506001600160a01b0382166000908152600360205260408120805460019290610b0990849061196d565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b5490565b6001600160a01b038216610b945760405162461bcd60e51b815260040161043a9061171d565b610b9d81610929565b15610bba5760405162461bcd60e51b815260040161043a906114f8565b610bc660008383610dcc565b6001600160a01b0382166000908152600360205260408120805460019290610bef90849061196d565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b80546001019055565b610c61848484610a3d565b610c6d84848484610e55565b6108325760405162461bcd60e51b815260040161043a906114a6565b6060600c8054610390906119fb565b606081610cbd57506040805180820190915260018152600360fc1b602082015261037c565b8160005b8115610ce75780610cd181611a36565b9150610ce09050600a83611985565b9150610cc1565b60008167ffffffffffffffff811115610d1057634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015610d3a576020820181803683370190505b5090505b8415610a3557610d4f6001836119b8565b9150610d5c600a86611a51565b610d6790603061196d565b60f81b818381518110610d8a57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350610dac600a86611985565b9450610d3e565b6001600160e01b031981166301ffc9a760e01b14919050565b610dd78383836104f2565b6001600160a01b038316610df357610dee81610f70565b610e16565b816001600160a01b0316836001600160a01b031614610e1657610e168382610fb4565b6001600160a01b038216610e3257610e2d81611051565b6104f2565b826001600160a01b0316826001600160a01b0316146104f2576104f2828261112a565b6000610e69846001600160a01b031661116e565b15610f6557836001600160a01b031663150b7a02610e85610946565b8786866040518563ffffffff1660e01b8152600401610ea79493929190611400565b602060405180830381600087803b158015610ec157600080fd5b505af1925050508015610ef1575060408051601f3d908101601f19168201909252610eee9181019061135d565b60015b610f4b573d808015610f1f576040519150601f19603f3d011682016040523d82523d6000602084013e610f24565b606091505b508051610f435760405162461bcd60e51b815260040161043a906114a6565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610a35565b506001949350505050565b600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b60006001610fc184610632565b610fcb91906119b8565b60008381526007602052604090205490915080821461101e576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b600854600090611063906001906119b8565b6000838152600960205260408120546008805493945090928490811061109957634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905080600883815481106110c857634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260099091526040808220849055858252812055600880548061110e57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b600061113583610632565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b3b151590565b80356001600160a01b038116811461037c57600080fd5b60006020828403121561119c578081fd5b6108b482611174565b600080604083850312156111b7578081fd5b6111c083611174565b91506111ce60208401611174565b90509250929050565b6000806000606084860312156111eb578081fd5b6111f484611174565b925061120260208501611174565b9150604084013590509250925092565b60008060008060808587031215611227578081fd5b61123085611174565b9350602061123f818701611174565b935060408601359250606086013567ffffffffffffffff80821115611262578384fd5b818801915088601f830112611275578384fd5b81358181111561128757611287611a91565b604051601f8201601f19168101850183811182821017156112aa576112aa611a91565b60405281815283820185018b10156112c0578586fd5b81858501868301379081019093019390935250939692955090935050565b600080604083850312156112f0578182fd5b6112f983611174565b91506020830135801515811461130d578182fd5b809150509250929050565b6000806040838503121561132a578182fd5b61133383611174565b946020939093013593505050565b600060208284031215611352578081fd5b81356108b481611aa7565b60006020828403121561136e578081fd5b81516108b481611aa7565b60006020828403121561138a578081fd5b5035919050565b600081518084526113a98160208601602086016119cf565b601f01601f19169290920160200192915050565b600083516113cf8184602088016119cf565b8351908301906113e38183602088016119cf565b01949350505050565b6001600160a01b0391909116815260200190565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061143390830184611391565b9695505050505050565b901515815260200190565b6000602082526108b46020830184611391565b6020808252602b908201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560408201526a74206f6620626f756e647360a81b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252601c908201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604082015260600190565b60208082526017908201527f4d7573742073656e6420636f7272656374207072696365000000000000000000604082015260600190565b60208082526024908201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646040820152637265737360e01b606082015260800190565b60208082526019908201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604082015260600190565b6020808252602c908201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860408201526b34b9ba32b73a103a37b5b2b760a11b606082015260800190565b60208082526038908201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760408201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000606082015260800190565b6020808252602a908201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604082015269726f206164647265737360b01b606082015260800190565b60208082526029908201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460408201526832b73a103a37b5b2b760b91b606082015260800190565b6020808252818101527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604082015260600190565b60208082526030908201527f4e6f7420656e6f75676820696e2074686520636f6c6c656374696f6e206c656660408201526f1d081d1bc81b5a5b9d08185b5bdd5b9d60821b606082015260800190565b6020808252602c908201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860408201526b34b9ba32b73a103a37b5b2b760a11b606082015260800190565b60208082526029908201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960408201526839903737ba1037bbb760b91b606082015260800190565b6020808252602f908201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60408201526e3732bc34b9ba32b73a103a37b5b2b760891b606082015260800190565b60208082526021908201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656040820152603960f91b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6020808252602c908201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60408201526b7574206f6620626f756e647360a01b606082015260800190565b90815260200190565b6000821982111561198057611980611a65565b500190565b60008261199457611994611a7b565b500490565b60008160001904831182151516156119b3576119b3611a65565b500290565b6000828210156119ca576119ca611a65565b500390565b60005b838110156119ea5781810151838201526020016119d2565b838111156108325750506000910152565b600281046001821680611a0f57607f821691505b60208210811415611a3057634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415611a4a57611a4a611a65565b5060010190565b600082611a6057611a60611a7b565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b031981168114611abd57600080fd5b5056fea2646970667358221220d8cf07a4ab366f6c3e2a8a5a465d2209676278bd3ef697b793749f6809c1cebf64736f6c63430008000033";

export class NFT__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    name: string,
    symbol: string,
    baseURI: string,
    limit: BigNumberish,
    price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NFT> {
    return super.deploy(
      name,
      symbol,
      baseURI,
      limit,
      price,
      overrides || {}
    ) as Promise<NFT>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    baseURI: string,
    limit: BigNumberish,
    price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name,
      symbol,
      baseURI,
      limit,
      price,
      overrides || {}
    );
  }
  attach(address: string): NFT {
    return super.attach(address) as NFT;
  }
  connect(signer: Signer): NFT__factory {
    return super.connect(signer) as NFT__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTInterface {
    return new utils.Interface(_abi) as NFTInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): NFT {
    return new Contract(address, _abi, signerOrProvider) as NFT;
  }
}