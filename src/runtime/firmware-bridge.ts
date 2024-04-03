import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { SerialPort } from 'serialport';
import { Encoder, Decoder } from 'frame-stream';
import { vonk_fence } from './generated_protos/protos';
import NumericalSampleStorage from './sample-storage';

function sleep(millis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

type FirmwareBridgeEvents = {
  detected: (timestamp: number) => void;
  volume: (left: number, right: number) => void;
  'region-of-interest': (left: number, top: number) => void;
};

export default class FirmwareBridge extends (EventEmitter as new () => TypedEmitter<FirmwareBridgeEvents>) {
  private pings: Record<number, number>;
  private latencySamples: NumericalSampleStorage;
  private timestampSamples: NumericalSampleStorage;
  private port: SerialPort;
  private encoder: Encoder;
  private decoder: Decoder;
  private acknowledges: Record<number, () => void>;
  private ping?: NodeJS.Timeout;

  public constructor() {
    super();

    this.pings = {};
    this.latencySamples = new NumericalSampleStorage(20);
    this.timestampSamples = new NumericalSampleStorage(20);
    this.acknowledges = {};
  }

  public enablePing() {
    if (this.ping) {
      return;
    }

    this.ping = setInterval(() => {
      const pingId = Math.round(Math.random() * 1000);

      this.pings[pingId] = Date.now();

      const message = new vonk_fence.FirmwareIn({
        ping: pingId,
      });

      this.sendRequest(message);
    }, 5000);
  }

  public disablePing() {
    if (this.ping) {
      clearInterval(this.ping);
    }
  }

  public sendRequest(message: vonk_fence.IFirmwareIn) {
    if (!this.port.isOpen) {
      return Promise.resolve();
    }

    const encoded = vonk_fence.FirmwareIn.encode(message).finish();

    return new Promise<void>((resolve, reject) => {
      this.encoder.write(encoded, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  public sendRequestWithTimeout(
    message: vonk_fence.IFirmwareIn,
    timeout: number,
  ): Promise<void> {
    const acknowledgeId = Math.round(Math.random() * 1000);

    message.acknowledge = acknowledgeId;

    return this.sendRequest(message).then(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(
            () =>
              reject(
                `The acknowledgement for ${acknowledgeId} has not been received on time`,
              ),
            timeout,
          );
          this.acknowledges[acknowledgeId] = resolve;
        }),
    );
  }

  private pong(response: vonk_fence.IPong) {
    const ping = this.pings[response.id];

    const now = Date.now();
    const delta = now - ping;
    const timestampDifference = now - response.timestamp - delta / 2;

    this.latencySamples.addSample(delta);
    this.timestampSamples.addSample(timestampDifference);

    delete this.pings[response.id];
  }

  public async startCommunication() {
    const [{ path: portPath }] = await SerialPort.list();

    this.port = new SerialPort({
      baudRate: 115200,
      path: portPath,
    });

    this.encoder = new Encoder({
      lengthSize: 2,
    });

    this.encoder.pipe(this.port);

    this.decoder = new Decoder({
      lengthSize: 2,
    });

    this.decoder.on('data', this.handleResponse.bind(this));
    this.port.pipe(this.decoder);

    return sleep(5000);
  }

  private handleResponse(data: Buffer) {
    const response = vonk_fence.FirmwareOut.decode(data);

    if (response.acknowledge) {
      this.acknowledges[response.acknowledge]();

      delete this.acknowledges[response.acknowledge];
    }

    if (response.pong) {
      this.pong(response.pong);
    }

    if (response.detector) {
      this.emit('detected', Date.now() - this.latencySamples.getMean() / 2);
    }

    if (response.volume) {
      this.emit('volume', response.volume.left, response.volume.right);
    }

    if (response.regionOfInterest) {
      this.emit(
        'region-of-interest',
        response.regionOfInterest.left,
        response.regionOfInterest.top,
      );
    }
  }
}
