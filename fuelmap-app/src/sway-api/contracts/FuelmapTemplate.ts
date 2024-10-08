/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.94.8
  Forc version: 0.64.0
  Fuel-Core version: 0.36.0
*/

import { Contract, Interface } from "fuels";
import type {
  Provider,
  Account,
  StorageSlot,
  AbstractAddress,
  BigNumberish,
  BN,
  Bytes,
  FunctionFragment,
  InvokeFunction,
  StdString,
} from 'fuels';

import type { Option, Enum, Vec } from "./common";

export enum AccessErrorInput { NotOwner = 'NotOwner' };
export enum AccessErrorOutput { NotOwner = 'NotOwner' };
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export enum InitializationErrorInput { CannotReinitialized = 'CannotReinitialized' };
export enum InitializationErrorOutput { CannotReinitialized = 'CannotReinitialized' };
export enum OwnableNFTErrorInput { IncorrectAssetSent = 'IncorrectAssetSent', IncorrectAmountSent = 'IncorrectAmountSent', SendMoreToComment = 'SendMoreToComment', SendMoreToInstanciate = 'SendMoreToInstanciate' };
export enum OwnableNFTErrorOutput { IncorrectAssetSent = 'IncorrectAssetSent', IncorrectAmountSent = 'IncorrectAmountSent', SendMoreToComment = 'SendMoreToComment', SendMoreToInstanciate = 'SendMoreToInstanciate' };
export type StateInput = Enum<{ Uninitialized: undefined, Initialized: IdentityInput, Revoked: undefined }>;
export type StateOutput = Enum<{ Uninitialized: void, Initialized: IdentityOutput, Revoked: void }>;
export type TaskActionInput = Enum<{ Add: AddTaskInput, Update: UpdateTaskInput, Delete: BigNumberish }>;
export type TaskActionOutput = Enum<{ Add: AddTaskOutput, Update: UpdateTaskOutput, Delete: number }>;
export enum TaskErrorInput { IdOutOfBounds = 'IdOutOfBounds' };
export enum TaskErrorOutput { IdOutOfBounds = 'IdOutOfBounds' };

export type AddTaskInput = { id: BigNumberish, checked: boolean, name: string, description: Option<StdString> };
export type AddTaskOutput = { id: number, checked: boolean, name: string, description: Option<StdString> };
export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type CommentEventInput = { subId: BigNumberish, id: BigNumberish, message: StdString };
export type CommentEventOutput = { subId: BN, id: number, message: StdString };
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type DescriptionEventInput = { description: StdString };
export type DescriptionEventOutput = DescriptionEventInput;
export type OwnershipSetInput = { new_owner: IdentityInput };
export type OwnershipSetOutput = { new_owner: IdentityOutput };
export type OwnershipTransferredInput = { new_owner: IdentityInput, previous_owner: IdentityInput };
export type OwnershipTransferredOutput = { new_owner: IdentityOutput, previous_owner: IdentityOutput };
export type TaskInput = { id: BigNumberish, checked: boolean, name: string };
export type TaskOutput = { id: number, checked: boolean, name: string };
export type TaskDescriptionEventInput = { id: BigNumberish, description: StdString };
export type TaskDescriptionEventOutput = { id: number, description: StdString };
export type UpdateTaskInput = { id: BigNumberish, checked: Option<boolean>, name: Option<string>, description: Option<StdString> };
export type UpdateTaskOutput = { id: number, checked: Option<boolean>, name: Option<string>, description: Option<StdString> };

const abi = {
  "programType": "contract",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "enum galaxy_nft::TaskAction",
      "concreteTypeId": "d1a4acf4b3bf1279182cf84b94ab073d2bc2c2368bbd3a81f2175a7d598b8c05",
      "metadataTypeId": 2
    },
    {
      "type": "enum galaxy_nft::TaskError",
      "concreteTypeId": "d08991a38d116827a8febf1d145167831200e44f30d9afbbc15a8d80db8d1398",
      "metadataTypeId": 3
    },
    {
      "type": "enum ownable_nft::OwnableNFTError",
      "concreteTypeId": "07fbdf87444b05bed76519b24d084ebc651bff592e6efbbb29971b5a5b1990c4",
      "metadataTypeId": 4
    },
    {
      "type": "enum standards::src5::AccessError",
      "concreteTypeId": "3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d",
      "metadataTypeId": 5
    },
    {
      "type": "enum standards::src5::State",
      "concreteTypeId": "192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c",
      "metadataTypeId": 6
    },
    {
      "type": "enum std::identity::Identity",
      "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335",
      "metadataTypeId": 7
    },
    {
      "type": "enum std::option::Option<struct galaxy_nft::Task>",
      "concreteTypeId": "b35f35c5b6bca7d642537201f21baea351a365a48966e450efe3c8e56762e246",
      "metadataTypeId": 8,
      "typeArguments": [
        "bfccddce9db3e2c9674051114a2e02aabf3fbb1fc7bb5779b9d11a0481dc5b14"
      ]
    },
    {
      "type": "enum std::option::Option<struct std::string::String>",
      "concreteTypeId": "7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0",
      "metadataTypeId": 8,
      "typeArguments": [
        "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c"
      ]
    },
    {
      "type": "enum std::option::Option<struct std::vec::Vec<enum galaxy_nft::TaskAction>>",
      "concreteTypeId": "f4d0d1b4350cd82749fe5246fdc13625cd44fc2f6897831be6bef1b278c2aee2",
      "metadataTypeId": 8,
      "typeArguments": [
        "f5d6c0a4a92a9e4ae8eb3d8828587a048aba3d9257128f2e90c036c38f71419c"
      ]
    },
    {
      "type": "enum std::option::Option<u64>",
      "concreteTypeId": "d852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d",
      "metadataTypeId": 8,
      "typeArguments": [
        "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
      ]
    },
    {
      "type": "enum std::option::Option<u8>",
      "concreteTypeId": "2da102c46c7263beeed95818cd7bee801716ba8303dddafdcd0f6c9efda4a0f1",
      "metadataTypeId": 8,
      "typeArguments": [
        "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
      ]
    },
    {
      "type": "enum sway_libs::ownership::errors::InitializationError",
      "concreteTypeId": "1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893",
      "metadataTypeId": 9
    },
    {
      "type": "str[32]",
      "concreteTypeId": "fb7e1669a323f3a44bc211c080c2dba82a6dc71f69b366765a93dd88659643a2"
    },
    {
      "type": "struct galaxy_nft::CommentEvent",
      "concreteTypeId": "e4da92a3d281ca7178947da4a2fe001bd53eee4b811ec2bd7326758ccb4b0f99",
      "metadataTypeId": 14
    },
    {
      "type": "struct galaxy_nft::DescriptionEvent",
      "concreteTypeId": "8701a50bcbce08a7dac947d04f6d12a0133818e94e358bcf5316ebd62d27862e",
      "metadataTypeId": 15
    },
    {
      "type": "struct galaxy_nft::Task",
      "concreteTypeId": "bfccddce9db3e2c9674051114a2e02aabf3fbb1fc7bb5779b9d11a0481dc5b14",
      "metadataTypeId": 16
    },
    {
      "type": "struct galaxy_nft::TaskDescriptionEvent",
      "concreteTypeId": "6c829ac22611170d60dcdf854ab224205901e61fb16079771b1df75a7c46408f",
      "metadataTypeId": 17
    },
    {
      "type": "struct std::asset_id::AssetId",
      "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974",
      "metadataTypeId": 20
    },
    {
      "type": "struct std::string::String",
      "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c",
      "metadataTypeId": 24
    },
    {
      "type": "struct std::vec::Vec<enum galaxy_nft::TaskAction>",
      "concreteTypeId": "f5d6c0a4a92a9e4ae8eb3d8828587a048aba3d9257128f2e90c036c38f71419c",
      "metadataTypeId": 26,
      "typeArguments": [
        "d1a4acf4b3bf1279182cf84b94ab073d2bc2c2368bbd3a81f2175a7d598b8c05"
      ]
    },
    {
      "type": "struct std::vec::Vec<enum std::identity::Identity>",
      "concreteTypeId": "2f79033d0d3729398611309f48578b56cf5162ba85e50f4d8fb79c9d9d1abc7b",
      "metadataTypeId": 26,
      "typeArguments": [
        "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
      ]
    },
    {
      "type": "struct std::vec::Vec<struct galaxy_nft::Task>",
      "concreteTypeId": "01b746892000b7a599b7824d98026d726b80c6ab1262a0d54197598129fbbfe9",
      "metadataTypeId": 26,
      "typeArguments": [
        "bfccddce9db3e2c9674051114a2e02aabf3fbb1fc7bb5779b9d11a0481dc5b14"
      ]
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipSet",
      "concreteTypeId": "e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5",
      "metadataTypeId": 27
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipTransferred",
      "concreteTypeId": "b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308",
      "metadataTypeId": 28
    },
    {
      "type": "u16",
      "concreteTypeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
    },
    {
      "type": "u64",
      "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
    },
    {
      "type": "u8",
      "concreteTypeId": "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
    }
  ],
  "metadataTypes": [
    {
      "type": "b256",
      "metadataTypeId": 0
    },
    {
      "type": "bool",
      "metadataTypeId": 1
    },
    {
      "type": "enum galaxy_nft::TaskAction",
      "metadataTypeId": 2,
      "components": [
        {
          "name": "Add",
          "typeId": 13
        },
        {
          "name": "Update",
          "typeId": 18
        },
        {
          "name": "Delete",
          "typeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        }
      ]
    },
    {
      "type": "enum galaxy_nft::TaskError",
      "metadataTypeId": 3,
      "components": [
        {
          "name": "IdOutOfBounds",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum ownable_nft::OwnableNFTError",
      "metadataTypeId": 4,
      "components": [
        {
          "name": "IncorrectAssetSent",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "IncorrectAmountSent",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "SendMoreToComment",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "SendMoreToInstanciate",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum standards::src5::AccessError",
      "metadataTypeId": 5,
      "components": [
        {
          "name": "NotOwner",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum standards::src5::State",
      "metadataTypeId": 6,
      "components": [
        {
          "name": "Uninitialized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "Initialized",
          "typeId": 7
        },
        {
          "name": "Revoked",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum std::identity::Identity",
      "metadataTypeId": 7,
      "components": [
        {
          "name": "Address",
          "typeId": 19
        },
        {
          "name": "ContractId",
          "typeId": 23
        }
      ]
    },
    {
      "type": "enum std::option::Option",
      "metadataTypeId": 8,
      "components": [
        {
          "name": "None",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "Some",
          "typeId": 10
        }
      ],
      "typeParameters": [
        10
      ]
    },
    {
      "type": "enum sway_libs::ownership::errors::InitializationError",
      "metadataTypeId": 9,
      "components": [
        {
          "name": "CannotReinitialized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "generic T",
      "metadataTypeId": 10
    },
    {
      "type": "raw untyped ptr",
      "metadataTypeId": 11
    },
    {
      "type": "str[29]",
      "metadataTypeId": 12
    },
    {
      "type": "struct galaxy_nft::AddTask",
      "metadataTypeId": 13,
      "components": [
        {
          "name": "id",
          "typeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        },
        {
          "name": "checked",
          "typeId": 1
        },
        {
          "name": "name",
          "typeId": 12
        },
        {
          "name": "description",
          "typeId": 8,
          "typeArguments": [
            {
              "name": "",
              "typeId": 24
            }
          ]
        }
      ]
    },
    {
      "type": "struct galaxy_nft::CommentEvent",
      "metadataTypeId": 14,
      "components": [
        {
          "name": "subId",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "id",
          "typeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        },
        {
          "name": "message",
          "typeId": 24
        }
      ]
    },
    {
      "type": "struct galaxy_nft::DescriptionEvent",
      "metadataTypeId": 15,
      "components": [
        {
          "name": "description",
          "typeId": 24
        }
      ]
    },
    {
      "type": "struct galaxy_nft::Task",
      "metadataTypeId": 16,
      "components": [
        {
          "name": "id",
          "typeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        },
        {
          "name": "checked",
          "typeId": 1
        },
        {
          "name": "name",
          "typeId": 12
        }
      ]
    },
    {
      "type": "struct galaxy_nft::TaskDescriptionEvent",
      "metadataTypeId": 17,
      "components": [
        {
          "name": "id",
          "typeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        },
        {
          "name": "description",
          "typeId": 24
        }
      ]
    },
    {
      "type": "struct galaxy_nft::UpdateTask",
      "metadataTypeId": 18,
      "components": [
        {
          "name": "id",
          "typeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        },
        {
          "name": "checked",
          "typeId": 8,
          "typeArguments": [
            {
              "name": "",
              "typeId": 1
            }
          ]
        },
        {
          "name": "name",
          "typeId": 8,
          "typeArguments": [
            {
              "name": "",
              "typeId": 12
            }
          ]
        },
        {
          "name": "description",
          "typeId": 8,
          "typeArguments": [
            {
              "name": "",
              "typeId": 24
            }
          ]
        }
      ]
    },
    {
      "type": "struct std::address::Address",
      "metadataTypeId": 19,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::asset_id::AssetId",
      "metadataTypeId": 20,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::bytes::Bytes",
      "metadataTypeId": 21,
      "components": [
        {
          "name": "buf",
          "typeId": 22
        },
        {
          "name": "len",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct std::bytes::RawBytes",
      "metadataTypeId": 22,
      "components": [
        {
          "name": "ptr",
          "typeId": 11
        },
        {
          "name": "cap",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct std::contract_id::ContractId",
      "metadataTypeId": 23,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::string::String",
      "metadataTypeId": 24,
      "components": [
        {
          "name": "bytes",
          "typeId": 21
        }
      ]
    },
    {
      "type": "struct std::vec::RawVec",
      "metadataTypeId": 25,
      "components": [
        {
          "name": "ptr",
          "typeId": 11
        },
        {
          "name": "cap",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "typeParameters": [
        10
      ]
    },
    {
      "type": "struct std::vec::Vec",
      "metadataTypeId": 26,
      "components": [
        {
          "name": "buf",
          "typeId": 25,
          "typeArguments": [
            {
              "name": "",
              "typeId": 10
            }
          ]
        },
        {
          "name": "len",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "typeParameters": [
        10
      ]
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipSet",
      "metadataTypeId": 27,
      "components": [
        {
          "name": "new_owner",
          "typeId": 7
        }
      ]
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipTransferred",
      "metadataTypeId": 28,
      "components": [
        {
          "name": "new_owner",
          "typeId": 7
        },
        {
          "name": "previous_owner",
          "typeId": 7
        }
      ]
    }
  ],
  "functions": [
    {
      "inputs": [],
      "name": "owner",
      "output": "192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        }
      ],
      "name": "decimals",
      "output": "2da102c46c7263beeed95818cd7bee801716ba8303dddafdcd0f6c9efda4a0f1",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        }
      ],
      "name": "name",
      "output": "7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        }
      ],
      "name": "symbol",
      "output": "7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "total_assets",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        }
      ],
      "name": "total_supply",
      "output": "d852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "subId",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "id",
          "concreteTypeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        },
        {
          "name": "message",
          "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c"
        }
      ],
      "name": "comment",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_comment_fee",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "id",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "get_owner",
      "output": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_owners",
      "output": "2f79033d0d3729398611309f48578b56cf5162ba85e50f4d8fb79c9d9d1abc7b",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "fee",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "set_comment_fee",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "new_owner",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        }
      ],
      "name": "transfer_with_ownership",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "id",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "update_ownership_of_asset",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "owner",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        },
        {
          "name": "actions",
          "concreteTypeId": "f4d0d1b4350cd82749fe5246fdc13625cd44fc2f6897831be6bef1b278c2aee2"
        }
      ],
      "name": "constructor",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "actions",
          "concreteTypeId": "f5d6c0a4a92a9e4ae8eb3d8828587a048aba3d9257128f2e90c036c38f71419c"
        }
      ],
      "name": "batch_update",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_name",
      "output": "fb7e1669a323f3a44bc211c080c2dba82a6dc71f69b366765a93dd88659643a2",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "id",
          "concreteTypeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        }
      ],
      "name": "get_task",
      "output": "b35f35c5b6bca7d642537201f21baea351a365a48966e450efe3c8e56762e246",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_tasks",
      "output": "01b746892000b7a599b7824d98026d726b80c6ab1262a0d54197598129fbbfe9",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "description",
          "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c"
        }
      ],
      "name": "set_description",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "name",
          "concreteTypeId": "fb7e1669a323f3a44bc211c080c2dba82a6dc71f69b366765a93dd88659643a2"
        }
      ],
      "name": "set_name",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": "575299149479216574",
      "concreteTypeId": "07fbdf87444b05bed76519b24d084ebc651bff592e6efbbb29971b5a5b1990c4"
    },
    {
      "logId": "16490654217879538289",
      "concreteTypeId": "e4da92a3d281ca7178947da4a2fe001bd53eee4b811ec2bd7326758ccb4b0f99"
    },
    {
      "logId": "12970362301975156672",
      "concreteTypeId": "b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308"
    },
    {
      "logId": "2161305517876418151",
      "concreteTypeId": "1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893"
    },
    {
      "logId": "16280289466020123285",
      "concreteTypeId": "e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5"
    },
    {
      "logId": "15026701763330795559",
      "concreteTypeId": "d08991a38d116827a8febf1d145167831200e44f30d9afbbc15a8d80db8d1398"
    },
    {
      "logId": "7818982061721589517",
      "concreteTypeId": "6c829ac22611170d60dcdf854ab224205901e61fb16079771b1df75a7c46408f"
    },
    {
      "logId": "4571204900286667806",
      "concreteTypeId": "3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d"
    },
    {
      "logId": "9728238140179482791",
      "concreteTypeId": "8701a50bcbce08a7dac947d04f6d12a0133818e94e358bcf5316ebd62d27862e"
    }
  ],
  "messagesTypes": [],
  "configurables": []
};

const storageSlots: StorageSlot[] = [
  {
    "key": "1f18c12c19de7aced9553849a8f45a2e56becbc2bc301fc56b37439aa39c321d",
    "value": "464d617000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "365496ff02229cbb99e216aaba7199c078b7b291b8d708901368ef56b368215a",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "365496ff02229cbb99e216aaba7199c078b7b291b8d708901368ef56b368215b",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "5f6a417def5c36f4bcf230f8eb0d9b9d88b04e8cf90c9fbe523fd1c8254fc826",
    "value": "0000000000000001000000000000000000000000000000000000000000000000"
  },
  {
    "key": "630bb0922fcf99a7cfcc0c796ee3b9ffbf6eb8869d122666b4829e8ce419b9bd",
    "value": "0000000000000001000000000000000000000000000000000000000000000000"
  },
  {
    "key": "e2eaf9d9ee9640ee10b5f3c77242dc7941210e320ff14d36648f558bfa2c30bd",
    "value": "2020202020202020202020202020202020202020202020202020202020202020"
  }
];

export class FuelmapTemplateInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    owner: FunctionFragment;
    decimals: FunctionFragment;
    name: FunctionFragment;
    symbol: FunctionFragment;
    total_assets: FunctionFragment;
    total_supply: FunctionFragment;
    comment: FunctionFragment;
    get_comment_fee: FunctionFragment;
    get_owner: FunctionFragment;
    get_owners: FunctionFragment;
    set_comment_fee: FunctionFragment;
    transfer_with_ownership: FunctionFragment;
    update_ownership_of_asset: FunctionFragment;
    constructor: FunctionFragment;
    batch_update: FunctionFragment;
    get_name: FunctionFragment;
    get_task: FunctionFragment;
    get_tasks: FunctionFragment;
    set_description: FunctionFragment;
    set_name: FunctionFragment;
  };
}

export class FuelmapTemplate extends Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: FuelmapTemplateInterface;
  declare functions: {
    owner: InvokeFunction<[], StateOutput>;
    decimals: InvokeFunction<[asset: AssetIdInput], Option<number>>;
    name: InvokeFunction<[asset: AssetIdInput], Option<StdString>>;
    symbol: InvokeFunction<[asset: AssetIdInput], Option<StdString>>;
    total_assets: InvokeFunction<[], BN>;
    total_supply: InvokeFunction<[asset: AssetIdInput], Option<BN>>;
    comment: InvokeFunction<[subId: BigNumberish, id: BigNumberish, message: StdString], void>;
    get_comment_fee: InvokeFunction<[], BN>;
    get_owner: InvokeFunction<[id: BigNumberish], IdentityOutput>;
    get_owners: InvokeFunction<[], Vec<IdentityOutput>>;
    set_comment_fee: InvokeFunction<[fee: BigNumberish], void>;
    transfer_with_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
    update_ownership_of_asset: InvokeFunction<[id: BigNumberish], void>;
    constructor: InvokeFunction<[owner: IdentityInput, actions?: Option<Vec<TaskActionInput>>], void>;
    batch_update: InvokeFunction<[actions: Vec<TaskActionInput>], void>;
    get_name: InvokeFunction<[], string>;
    get_task: InvokeFunction<[id: BigNumberish], Option<TaskOutput>>;
    get_tasks: InvokeFunction<[], Vec<TaskOutput>>;
    set_description: InvokeFunction<[description: StdString], void>;
    set_name: InvokeFunction<[name: string], void>;
  };

  constructor(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider,
  ) {
    super(id, abi, accountOrProvider);
  }
}
