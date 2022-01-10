/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { EventFragment, FunctionFragment, Result } from "@ethersproject/abi";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  CallOverrides,
  ContractTransaction,
  ethers,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
} from "ethers";
import type { TypedEvent, TypedEventFilter, TypedListener } from "./common";

interface MarketInterface extends ethers.utils.Interface {
  functions: {
    "areStable(uint256)": FunctionFragment;
    "buy(uint256)": FunctionFragment;
    "c_0x95d3f9ef(bytes32)": FunctionFragment;
    "claimRoyalties()": FunctionFragment;
    "delist(uint256)": FunctionFragment;
    "listings(uint256)": FunctionFragment;
    "royalties(address)": FunctionFragment;
    "sellListing(uint256,uint256,bool)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "areStable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "buy", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "c_0x95d3f9ef",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "claimRoyalties",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "delist",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "listings",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "royalties", values: [string]): string;
  encodeFunctionData(
    functionFragment: "sellListing",
    values: [BigNumberish, BigNumberish, boolean]
  ): string;

  decodeFunctionResult(functionFragment: "areStable", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "buy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "c_0x95d3f9ef",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimRoyalties",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "delist", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "listings", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "royalties", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sellListing",
    data: BytesLike
  ): Result;

  events: {
    "Buy(uint256)": EventFragment;
    "Delist(uint256)": EventFragment;
    "SellListing(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Buy"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Delist"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SellListing"): EventFragment;
}

export type BuyEvent = TypedEvent<[BigNumber] & { tokenId: BigNumber }>;

export type DelistEvent = TypedEvent<[BigNumber] & { tokenId: BigNumber }>;

export type SellListingEvent = TypedEvent<
  [BigNumber, BigNumber] & { tokenId: BigNumber; price: BigNumber }
>;

export class Market extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MarketInterface;

  functions: {
    areStable(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    buy(
      tokenId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    c_0x95d3f9ef(
      c__0x95d3f9ef: BytesLike,
      overrides?: CallOverrides
    ): Promise<[void]>;

    claimRoyalties(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    delist(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    listings(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    royalties(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { stable: BigNumber; native: BigNumber }
    >;

    sellListing(
      tokenId: BigNumberish,
      price: BigNumberish,
      isStable: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  areStable(arg0: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

  buy(
    tokenId: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  c_0x95d3f9ef(
    c__0x95d3f9ef: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  claimRoyalties(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  delist(
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  listings(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  royalties(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber] & { stable: BigNumber; native: BigNumber }>;

  sellListing(
    tokenId: BigNumberish,
    price: BigNumberish,
    isStable: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    areStable(arg0: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    buy(tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    c_0x95d3f9ef(
      c__0x95d3f9ef: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    claimRoyalties(overrides?: CallOverrides): Promise<void>;

    delist(tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    listings(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    royalties(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { stable: BigNumber; native: BigNumber }
    >;

    sellListing(
      tokenId: BigNumberish,
      price: BigNumberish,
      isStable: boolean,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Buy(uint256)"(
      tokenId?: null
    ): TypedEventFilter<[BigNumber], { tokenId: BigNumber }>;

    Buy(tokenId?: null): TypedEventFilter<[BigNumber], { tokenId: BigNumber }>;

    "Delist(uint256)"(
      tokenId?: null
    ): TypedEventFilter<[BigNumber], { tokenId: BigNumber }>;

    Delist(
      tokenId?: null
    ): TypedEventFilter<[BigNumber], { tokenId: BigNumber }>;

    "SellListing(uint256,uint256)"(
      tokenId?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { tokenId: BigNumber; price: BigNumber }
    >;

    SellListing(
      tokenId?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { tokenId: BigNumber; price: BigNumber }
    >;
  };

  estimateGas: {
    areStable(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buy(
      tokenId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    c_0x95d3f9ef(
      c__0x95d3f9ef: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimRoyalties(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    delist(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    listings(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    royalties(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    sellListing(
      tokenId: BigNumberish,
      price: BigNumberish,
      isStable: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    areStable(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    buy(
      tokenId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    c_0x95d3f9ef(
      c__0x95d3f9ef: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimRoyalties(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    delist(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    listings(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    royalties(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    sellListing(
      tokenId: BigNumberish,
      price: BigNumberish,
      isStable: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
