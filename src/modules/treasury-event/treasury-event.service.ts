import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coder } from '@project-serum/anchor';
import { Connection, TransactionResponse } from '@solana/web3.js';
import { JobOptions, Queue } from 'bull';
import { FilterQuery, Model } from 'mongoose';
import { QueueName, TreasuryEventName } from 'src/common/constant';
import { sleep } from 'src/common/utils';
import { ApiConfigService } from '../shared/services';
import { ITreasuryDepositEventConsumerPayload } from '../treasury-event-consumer/interfaces';
import {
  LatestSignature,
  LatestSignatureDocument,
  Signature,
  SignatureDocument,
  TreasuryEvent,
  TreasuryEventDocument,
} from './schema';
import { IDecodedDepositEventFromTreasury } from './treasury-event.interface';
import { IDL } from './treasury.idl';

interface IEvent {
  signature: string;
  logIndex: number;
  isError: boolean;
  raw: string;
  data?: {
    transactionId: string;
    evtName: TreasuryEventName;
    userAddress: string;
    amount: string;
  };
}

@Injectable()
export class TreasuryEventService {
  private coder: Coder;

  private clusterHost: string;

  private programId: string;

  constructor(
    @InjectModel(Signature.name)
    private signatureModel: Model<SignatureDocument>,
    @InjectModel(LatestSignature.name)
    private latestSignatureModel: Model<LatestSignatureDocument>,
    @InjectModel(TreasuryEvent.name)
    private treasuryEventModel: Model<TreasuryEventDocument>,
    @InjectQueue(QueueName.DepositEventHandler) private depositQueue: Queue<ITreasuryDepositEventConsumerPayload>,
    configService: ApiConfigService,
  ) {
    this.clusterHost = configService.blockchain.rpcEndpoint;
    this.programId = configService.blockchain.programId;
    this.coder = new Coder(IDL);
  }

  /**
   * from signatures to events
   */
  async treasuryEvent() {
    const finalizeConnection = new Connection(this.clusterHost, 'finalized');
    const programPk = 'treasuryEvent';
    let latestSignature = (
      await this.latestSignatureModel
        .findOne({
          programPk,
        })
        .lean({ virtuals: true })
    )?.signature;

    while (true) {
      latestSignature = await this._treasuryEvent(finalizeConnection, latestSignature);
      await sleep(5 * 1000);
    }
  }

  private async _treasuryEvent(finalizedConnection: Connection, latestSignature: string | null): Promise<string> {
    const limit = 100;
    let findOptions: FilterQuery<SignatureDocument> = {};

    if (latestSignature) {
      const signatureRecord = await this.signatureModel
        .findOne({ signature: latestSignature })
        .lean({ virtuals: true });

      if (!signatureRecord) {
        throw new Error(`${latestSignature} not found`);
      }

      findOptions = { _id: { $gt: signatureRecord._id } };
    }

    const unProcessSignatures = await this.signatureModel
      .find(findOptions)
      .limit(limit)
      .sort({ _id: 1 })
      .lean({ virtuals: true });

    if (!unProcessSignatures.length) {
      console.log('empty signatures');
      return latestSignature;
    }

    const signatures = unProcessSignatures.map((s) => s.signature);
    const transactions = await Promise.all(
      signatures.map(async (signature) => {
        const fetchTx = await finalizedConnection.getTransaction(signature);
        return { ...fetchTx, signature };
      }),
    );

    const events = this._getEventFromTransactions(transactions);

    if (events.length === 0) {
      console.log('empty events');
      return latestSignature;
    }

    await Promise.all(
      events
        .filter((evt) => [TreasuryEventName.DepositEvent, TreasuryEventName.WithdrawEvent].includes(evt?.data?.evtName))
        .map((evt) => this.depositQueue.add(evt.data, <JobOptions>{ attempts: 3, backoff: 5000 })),
    );

    await this.treasuryEventModel.bulkWrite(
      events.map((event) => ({
        updateOne: {
          filter: { signature: event.signature, logIndex: event.logIndex },
          update: { $set: event },
          upsert: true,
        },
      })),
    );

    latestSignature = signatures[signatures.length - 1];
    await this.latestSignatureModel.updateOne(
      { programPk: 'treasuryEvent' },
      {
        programPk: 'treasuryEvent',
        signature: latestSignature,
      },
      { upsert: true },
    );

    return latestSignature;
  }

  private _getEventFromTransactions(transactions: (TransactionResponse & { signature: string })[]) {
    const events: IEvent[] = [];
    for (const transaction of transactions) {
      if (transaction.meta.err) {
        events.push({
          signature: transaction.signature,
          logIndex: 0,
          isError: true,
          raw: 'error',
        });
        continue;
      }

      const logMessages = transaction.meta.logMessages;
      if (logMessages.includes('Log truncated')) {
        throw new Error(`Log truncated ${transaction.signature}`);
      }
      const serializedLogMessages: any = [];

      const groupLogMessages = this._groupLogMessages(logMessages);
      const needLogs = groupLogMessages[this.programId] || [];

      for (let i = 0; i < needLogs.length; i++) {
        const logMessage = needLogs[i];
        const jsonStartStr = 'Program log: treasury-log';
        if (logMessage.startsWith(jsonStartStr)) {
          const serializedMangoLog = needLogs[i + 1].slice('Program log: '.length);
          serializedLogMessages.push(serializedMangoLog);
        }
      }

      for (let i = 0; i < serializedLogMessages.length; i++) {
        const log = serializedLogMessages[i];
        const decodedLog = this.coder.events.decode(log) as IDecodedDepositEventFromTreasury;

        if (!decodedLog) {
          continue;
        }

        events.push({
          signature: transaction.signature,
          logIndex: i,
          isError: false,
          raw: JSON.stringify(decodedLog),
          data: {
            transactionId: transaction.signature,
            evtName: decodedLog.name,
            userAddress: decodedLog.data.user.toBase58(),
            amount: decodedLog.data?.amount?.toString(),
          },
        });
      }
    }

    return events;
  }

  private _groupLogMessages(logMessages: string[]): { [key: string]: string[] } {
    if (!logMessages.length) {
      return {};
    }

    const logMapping: { [key: string]: string[] } = {};
    const programStack: string[] = [];
    for (const logMessage of logMessages) {
      const [_program, _programId, _method] = logMessage.split(' ');

      if (['Deployed', 'Upgraded'].includes(_program)) {
        continue;
      }

      if (_method === 'invoke') {
        if (!logMapping[_programId]) {
          logMapping[_programId] = [];
        }
        logMapping[_programId].push(logMessage);
        programStack.push(_programId);
        continue;
      }

      if (_method === 'consumed') {
        logMapping[_programId].push(logMessage);
        continue;
      }

      if (_method === 'success') {
        logMapping[_programId].push(logMessage);
        programStack.pop();
        continue;
      }

      const lastProgramId = programStack[programStack.length - 1];
      logMapping[lastProgramId].push(logMessage);
    }
    return logMapping;
  }
}
