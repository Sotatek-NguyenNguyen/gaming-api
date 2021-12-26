export type Treasury = {
  version: '0.1.0';
  name: 'treasury';
  instructions: [
    {
      name: 'initializeTreasury';
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'sender';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'treasuryAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'treasuryTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenId';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'gameId';
          type: 'publicKey';
        },
        {
          name: 'bumps';
          type: {
            defined: 'TreasuryBumps';
          };
        },
      ];
    },
    {
      name: 'deposit';
      accounts: [
        {
          name: 'sender';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'depositUser';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'senderTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'treasuryAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'treasuryTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'gameId';
          type: 'publicKey';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'withdraw';
      accounts: [
        {
          name: 'owner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'sender';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'treasuryAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'treasuryTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'withdrawUser';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'withdrawTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenId';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'gameId';
          type: 'publicKey';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'nftMint';
      accounts: [
        {
          name: 'owner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'sender';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'treasuryAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftId';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'receiverUser';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'receiverTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'gameId';
          type: 'publicKey';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'treasuryAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'tokenId';
            type: 'publicKey';
          },
          {
            name: 'bumps';
            type: {
              defined: 'TreasuryBumps';
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'TreasuryBumps';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'treasuryAccount';
            type: 'u8';
          },
          {
            name: 'treasuryTokenAccount';
            type: 'u8';
          },
        ];
      };
    },
  ];
  events: [
    {
      name: 'DepositEvent';
      fields: [
        {
          name: 'user';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'gameId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'tokenId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'amount';
          type: 'u64';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        },
      ];
    },
    {
      name: 'WithdrawEvent';
      fields: [
        {
          name: 'user';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'gameId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'tokenId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'amount';
          type: 'u64';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        },
      ];
    },
    {
      name: 'NftMintEvent';
      fields: [
        {
          name: 'user';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'gameId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'nftId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'amount';
          type: 'u64';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        },
      ];
    },
  ];
};

export const IDL: Treasury = {
  version: '0.1.0',
  name: 'treasury',
  instructions: [
    {
      name: 'initializeTreasury',
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'treasuryAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'treasuryTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenId',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'gameId',
          type: 'publicKey',
        },
        {
          name: 'bumps',
          type: {
            defined: 'TreasuryBumps',
          },
        },
      ],
    },
    {
      name: 'deposit',
      accounts: [
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'depositUser',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'senderTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'treasuryAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'treasuryTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'gameId',
          type: 'publicKey',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'treasuryAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'treasuryTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'withdrawUser',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'withdrawTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenId',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'gameId',
          type: 'publicKey',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'nftMint',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'treasuryAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftId',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'receiverUser',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'receiverTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'gameId',
          type: 'publicKey',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'treasuryAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'gameId',
            type: 'publicKey',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'tokenId',
            type: 'publicKey',
          },
          {
            name: 'bumps',
            type: {
              defined: 'TreasuryBumps',
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'TreasuryBumps',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'treasuryAccount',
            type: 'u8',
          },
          {
            name: 'treasuryTokenAccount',
            type: 'u8',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'DepositEvent',
      fields: [
        {
          name: 'user',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'gameId',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'tokenId',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false,
        },
      ],
    },
    {
      name: 'WithdrawEvent',
      fields: [
        {
          name: 'user',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'gameId',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'tokenId',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false,
        },
      ],
    },
    {
      name: 'NftMintEvent',
      fields: [
        {
          name: 'user',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'gameId',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nftId',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false,
        },
      ],
    },
  ],
};
