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
import type { Royalty, RoyaltyInterface } from "../Royalty";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cut",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "c__0xf05f41c1",
        type: "bytes32",
      },
    ],
    name: "c_0xf05f41c1",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "listings",
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
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "sellListing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001530380380620015308339818101604052810190620000379190620001bb565b6200006b7fe13ca1abcaf259b052d735a4f1c5eeb53806eacf73639d416514c8954015e0ae60001b6200018a60201b60201c565b6200009f7ffcf17cffc3f82788b608ac80f7dbb11e839c128768ea1ae6bc08d833d568156360001b6200018a60201b60201c565b620000d37f822ed318712f50ccf74d86cb22e1567648bcaca131507f2aa54da8adc021b90e60001b6200018a60201b60201c565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550620001477f26e957409e51f6c5b0af5f808d4bedd48e4d91cefe02882574a0260a78c8c71960001b6200018a60201b60201c565b6200017b7f5756f8df6cfb3712efce8bdde3cd460a28bed49757c6ccea5b78ab54f59b6a2160001b6200018a60201b60201c565b8160018190555050506200026e565b50565b6000815190506200019e816200023a565b92915050565b600081519050620001b58162000254565b92915050565b60008060408385031215620001cf57600080fd5b6000620001df85828601620001a4565b9250506020620001f2858286016200018d565b9150509250929050565b6000620002098262000210565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6200024581620001fc565b81146200025157600080fd5b50565b6200025f8162000230565b81146200026b57600080fd5b50565b6112b2806200027e6000396000f3fe60806040526004361061003f5760003560e01c8063a349365414610044578063d96a094a1461006d578063de74e57b14610089578063ffa3f123146100c6575b600080fd5b34801561005057600080fd5b5061006b60048036038101906100669190610e7b565b6100ef565b005b61008760048036038101906100829190610e52565b61051b565b005b34801561009557600080fd5b506100b060048036038101906100ab9190610e52565b610da6565b6040516100bd9190611072565b60405180910390f35b3480156100d257600080fd5b506100ed60048036038101906100e89190610e29565b610dbe565b005b61011b7ffcef7c415a95f641740aace6a3bda991a3c30a49f140b4f336ac90c01e1a63ab60001b610dbe565b6101477f5bfcd3a18886c200a1456427cd743c8c716fae319f3a571c0c885f956adc397160001b610dbe565b6101737ffb0b04aae66c536dec1b2b760594743884e8417f749c5132a331e926bb20e7cf60001b610dbe565b61019f7f9fd8486b99efbc51395a92e9fd27f7fb10da8dfe0e0238e01a40316fddb5eed260001b610dbe565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636352211e836040518263ffffffff1660e01b81526004016101f89190611072565b60206040518083038186803b15801561021057600080fd5b505afa158015610224573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102489190610e00565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ac90611052565b60405180910390fd5b6102e17ff3eb1a9f0febb993b82355117c0de3ba0f7363bff004de0d584f26f38fc24a0260001b610dbe565b61030d7f5e5fa11d21a34275e26c434153f5178af2d3fb0c3d970f4e3f001e1c7c8c6f7160001b610dbe565b6103397fc06ec8a0f4097501371ea837d69af6ff677c85532852e9a0df715cd64b02555e60001b610dbe565b6103657f3efe76a2b5b8fbf5e145df6dbcf3221c9c63a7c115f1f95a7a1f867ea6e59e1960001b610dbe565b3073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663081812fc846040518263ffffffff1660e01b81526004016103d59190611072565b60206040518083038186803b1580156103ed57600080fd5b505afa158015610401573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104259190610e00565b73ffffffffffffffffffffffffffffffffffffffff161461047b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161047290611032565b60405180910390fd5b6104a77feeec76ce751c71d91d390536d92c075cccd38fc296e1a48f994aa5f918d99c4160001b610dbe565b6104d37f7d7f69db4a9f93f1543a10e9125fad89b57814b8fe55a766a77c8df9a09d654960001b610dbe565b6104ff7f5e9bedd983fd22f691e6b63e7d9e12c30f06a632e3110c4bec0a9c5bf2800ef560001b610dbe565b8060026000848152602001908152602001600020819055505050565b6105477f91f61b296c817381cfbe076ee0fba74ba632f7db57197b13a033d914e0d9ab4c60001b610dbe565b6105737f85bc3b490db564a5a77a5fa8aee1dca7770ce89a3f46c83741519db483bcb0ed60001b610dbe565b61059f7fa18c4cf75ab04953ae2b049d1483b9982ff4b5aec4c55fa29a819eeeb456425260001b610dbe565b6105cb7fb9e94c9eaeb2b7f1021f16b6602e69394aac5d1655d48b86340bc634d87ac99360001b610dbe565b60026000828152602001908152602001600020543414610620576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161061790611012565b60405180910390fd5b61064c7f5c21f89632edd1a74ae2456207380846d9f78cb41d820dcb618ed5413b61fa1a60001b610dbe565b6106787fc1d9156578713c82e2091306c7aaefed8489c46b29f11c70f44e55dadc57f8fa60001b610dbe565b6106a47f2475a65ca63a1ddc4350427703460fbbc4322525ffa8c7c1c11e8a8c7f22ce3960001b610dbe565b6106d07f11411ffbf4c59077f3eb60068adc9320f91656e51d27db1cc2771a88a4212d4b60001b610dbe565b3073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663081812fc836040518263ffffffff1660e01b81526004016107409190611072565b60206040518083038186803b15801561075857600080fd5b505afa15801561076c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107909190610e00565b73ffffffffffffffffffffffffffffffffffffffff16146107e6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107dd90611032565b60405180910390fd5b6108127f201c681e20e7b5a8ef7dbb098e3b7dfa0b12854d4287b10c90391771d439f67060001b610dbe565b61083e7f8ff4a2a962efb4876a0e74d2fadcb26a5a019f58ff6b7efdfd5aa5a52e8c5dd960001b610dbe565b61086a7f93b3309ed9309ebf505cc4a709b80bab005a7624cab400b04919493ec501914c60001b610dbe565b600060646001543461087c91906110cf565b610886919061109e565b90506108b47f86cdf4f094d584c8590b96650f82ca4f92d2b942627188fb1c7f6f2dc70b0fda60001b610dbe565b6108e07f727eaea6a462a53adf3a7ca5158ee3c7e6008349c9cf85f2fbb5edbe7a9330a060001b610dbe565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166343bc16126040518163ffffffff1660e01b815260040160206040518083038186803b15801561094957600080fd5b505afa15801561095d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109819190610e00565b90506109af7fc0a50df93e7edae8607e266fea48cf79773c3fc093ddf2cee514126b900e9ea560001b610dbe565b6109db7f25765632d7e0ead8c7d640b7b44a4d55713f055d7179d032b986efadd75d2d7b60001b610dbe565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636352211e856040518263ffffffff1660e01b8152600401610a379190611072565b60206040518083038186803b158015610a4f57600080fd5b505afa158015610a63573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a879190610e00565b9050610ab57f3d1ee83609e694dad6f30e95b698fe450a6d0506311f4f2e58cb4d254cc4837960001b610dbe565b610ae17f341b5d293d77e7962dce9c2adc25931a64dd4ac048eab275d6ffba3da227e1cb60001b610dbe565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8230876040518463ffffffff1660e01b8152600401610b3e93929190610fa4565b600060405180830381600087803b158015610b5857600080fd5b505af1158015610b6c573d6000803e3d6000fd5b50505050610b9c7f866f2007921183eec71afb6cf00e271d512fa99a67535a2e93b373b6aebfc20760001b610dbe565b610bc87fabcc16e656bd22f94326d7442cc5a12ecfc4d3427f17347882330c466e5157e760001b610dbe565b8173ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051600060405180830381858888f19350505050158015610c0e573d6000803e3d6000fd5b50610c3b7fdbac827f88bfe990e0dda4e488488083d558b3a9b5a6a94ea056514aee9a873260001b610dbe565b610c677f25d044ebf594cf2ebbf4f79f2f3112dbaade320b2cfba0ebd6af00ee7cd382a560001b610dbe565b8073ffffffffffffffffffffffffffffffffffffffff166108fc8434610c8d9190611129565b9081150290604051600060405180830381858888f19350505050158015610cb8573d6000803e3d6000fd5b50610ce57f1ebfd5cd5254929b3ceac25f54694c4a0de24db97dcfb97bb391e0ff0cef34a360001b610dbe565b610d117f0776e223fca90681e404fd60bd3d5d0ec633cb407b59f490cca6256f2320e67b60001b610dbe565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3033876040518463ffffffff1660e01b8152600401610d6e93929190610fdb565b600060405180830381600087803b158015610d8857600080fd5b505af1158015610d9c573d6000803e3d6000fd5b5050505050505050565b60026020528060005260406000206000915090505481565b50565b600081519050610dd081611237565b92915050565b600081359050610de58161124e565b92915050565b600081359050610dfa81611265565b92915050565b600060208284031215610e1257600080fd5b6000610e2084828501610dc1565b91505092915050565b600060208284031215610e3b57600080fd5b6000610e4984828501610dd6565b91505092915050565b600060208284031215610e6457600080fd5b6000610e7284828501610deb565b91505092915050565b60008060408385031215610e8e57600080fd5b6000610e9c85828601610deb565b9250506020610ead85828601610deb565b9150509250929050565b610ec0816111a3565b82525050565b610ecf8161115d565b82525050565b6000610ee260178361108d565b91507f4d7573742073656e6420636f72726563742070726963650000000000000000006000830152602082019050919050565b6000610f2260188361108d565b91507f54686973204e4654206973206e6f7420617070726f76656400000000000000006000830152602082019050919050565b6000610f6260178361108d565b91507f596f7520646f206e6f74206f776e2074686973204e46540000000000000000006000830152602082019050919050565b610f9e81611199565b82525050565b6000606082019050610fb96000830186610eb7565b610fc66020830185610ec6565b610fd36040830184610f95565b949350505050565b6000606082019050610ff06000830186610ec6565b610ffd6020830185610ec6565b61100a6040830184610f95565b949350505050565b6000602082019050818103600083015261102b81610ed5565b9050919050565b6000602082019050818103600083015261104b81610f15565b9050919050565b6000602082019050818103600083015261106b81610f55565b9050919050565b60006020820190506110876000830184610f95565b92915050565b600082825260208201905092915050565b60006110a982611199565b91506110b483611199565b9250826110c4576110c3611208565b5b828204905092915050565b60006110da82611199565b91506110e583611199565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561111e5761111d6111d9565b5b828202905092915050565b600061113482611199565b915061113f83611199565b925082821015611152576111516111d9565b5b828203905092915050565b600061116882611179565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006111ae826111b5565b9050919050565b60006111c0826111c7565b9050919050565b60006111d282611179565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6112408161115d565b811461124b57600080fd5b50565b6112578161116f565b811461126257600080fd5b50565b61126e81611199565b811461127957600080fd5b5056fea264697066735822122029e452dd493304ec95d6a92101d917067fb71abcb4c38419ff78c5712875106b64736f6c63430008000033";

export class Royalty__factory extends ContractFactory {
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
    cut: BigNumberish,
    addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Royalty> {
    return super.deploy(cut, addr, overrides || {}) as Promise<Royalty>;
  }
  getDeployTransaction(
    cut: BigNumberish,
    addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(cut, addr, overrides || {});
  }
  attach(address: string): Royalty {
    return super.attach(address) as Royalty;
  }
  connect(signer: Signer): Royalty__factory {
    return super.connect(signer) as Royalty__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RoyaltyInterface {
    return new utils.Interface(_abi) as RoyaltyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Royalty {
    return new Contract(address, _abi, signerOrProvider) as Royalty;
  }
}
