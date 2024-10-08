/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.94.8
  Forc version: 0.64.0
  Fuel-Core version: 0.36.0
*/

import {
  BigNumberish,
  BN,
  Bytes,
  decompressBytecode,
  InputValue,
  Predicate,
  PredicateParams,
  Provider,
  StdString,
} from 'fuels';

export type CommentPredicateConfigurables = undefined;

export type CommentPredicateInputs = [message: StdString];

export type CommentPredicateParameters = Omit<
  PredicateParams<CommentPredicateInputs, CommentPredicateConfigurables>,
  'abi' | 'bytecode'
>;

const abi = {
  "programType": "predicate",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "bool",
      "concreteTypeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
    },
    {
      "type": "struct std::string::String",
      "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c",
      "metadataTypeId": 3
    }
  ],
  "metadataTypes": [
    {
      "type": "raw untyped ptr",
      "metadataTypeId": 0
    },
    {
      "type": "struct std::bytes::Bytes",
      "metadataTypeId": 1,
      "components": [
        {
          "name": "buf",
          "typeId": 2
        },
        {
          "name": "len",
          "typeId": 4
        }
      ]
    },
    {
      "type": "struct std::bytes::RawBytes",
      "metadataTypeId": 2,
      "components": [
        {
          "name": "ptr",
          "typeId": 0
        },
        {
          "name": "cap",
          "typeId": 4
        }
      ]
    },
    {
      "type": "struct std::string::String",
      "metadataTypeId": 3,
      "components": [
        {
          "name": "bytes",
          "typeId": 1
        }
      ]
    },
    {
      "type": "u64",
      "metadataTypeId": 4
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "message",
          "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c"
        }
      ],
      "name": "main",
      "output": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903",
      "attributes": null
    }
  ],
  "loggedTypes": [],
  "messagesTypes": [],
  "configurables": []
};

const bytecode = decompressBytecode('H4sIAAAAAAAAA31VTWsTWxh+k06vuXChB5qInGyGS6ljSyFw5XJX13OcSSdpLB5xYcWmreDXMgYtLvMTquDHskuXk9JF3QX8A9m4z0aw0IILhYqL+rxn5sRRawslZ5553+c87+fIjzV6RFQk+3em0z4eFMTxMckDQ0+puPJQ0cT6IUXtVhLd1n+TiZO9tTqRCZO9VU00jf9NRdPuuRtRcVp7CljhXzDCZwn+sQl3/oPvdrdBpaDu9WB/ZM+63DOtPvuVgqanoOVP+PwFnzp8Avj4Yx+2U2xXxv39kvXRM8rE/ZXvvDs05sW5HSeqXRe0fiiW+Mzvqo1yT9TLPWAKGPSJyybeEYjxsrmarHQN/JcnyehayZ51he8VweFF3LujcK8Iwl3VDhNVjcCFeKFXQdOGe2eu9zv2fM0DngzsWUdK7hP5R//QytdR0XwdeYj3lgyH0EcafHpWEUnV4edFfq6k+S3AjnP82vEgLwKxiDTmfs+eOeY42XI4/GuIbxFx6WrTh0Y/xDnM8lRDzCXTSnrdKzb3A6P9kj3r8gCcW+ldnN9kmHJGPbkvftY/L+MhgecBfAXzIJ9T8N+G/7msPnvwP5dpZS7gVivXw+Ecj8ODHJ6eLd7P238Y4zjDZ+TenaBRco5nkNvnRFMvSgBsf5OS4TbJeMT6fac/rfUM93jNxh3uoveQ7+w98npGfiZ6xv5fBL0C30vwLh1Z/kvf+Qsdy38D/HGycYq+d5xD5G2eexk1mp9tgKPRIfSjj7p5ppn1YrPCXIO0Hhd5JjJd5QFqPV9Br29Gtl8q+V444c63nBPcJxDbtuOQ+/7Pdm9YG2tydWKN8OFesflA37CGrG/QK+O6J2mNUj+eY1sv5LdQVR6JcJfn/t6aFjxfwMoOe+ww3idVPcbv5PCJHH4/h3s5/C7j2VxO2rmEDuh6ckotutk8ngffJH4XUO8F3nMyQm4V3eZn5Pp8BXMvIzufq+sHFAAPGEeuFnzsF551+f4XfvTEEFzjuV6G7xx85+C7cDbbncD/Z63AAvDN8b7C7yzX5wTOW7I1pM0Gat5KEleXE2q5yHdn++oCaqXWD0QJd1xYRd+YJk2tNfGb7mPm4H08yXMAjX/kcWDG7Qdo95Gf8c7nd0bTFH8P0CsbrB+aCtXmzEA0y73Vuo/vhqeyb4fHsQv4Q9PcY7J70OaCbbKcs02Q2QSwuYkeL8pPgr9dBfmJZxGz9sW4WbyUzeKEm0U3520NP8xubm4nTrGl39iOd0hqu0WyNaKzy6gd4pzGr/xcg5//w26IkZtv5NY6OHAHAAA=');

export class CommentPredicate extends Predicate<
  CommentPredicateInputs,
  CommentPredicateConfigurables
> {
  static readonly abi = abi;
  static readonly bytecode = bytecode;

  constructor(params: CommentPredicateParameters) {
    super({ abi, bytecode, ...params });
  }
}
