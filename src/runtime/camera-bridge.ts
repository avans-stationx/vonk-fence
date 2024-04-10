import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { Encoder, Decoder } from 'frame-stream';
import { vonk_fence } from './generated_protos/protos';

type CameraBridgeEvents = {
  'photo-result': (
    filename: string,
    timeTakenMillis: number,
    wellKnown?: string,
  ) => void;
  'region-of-interest': (left: number, top: number) => void;
};

export default class CameraBridge extends (EventEmitter as new () => TypedEmitter<CameraBridgeEvents>) {
  private process: ChildProcessWithoutNullStreams;
  private encoder: Encoder;
  private decoder: Decoder;

  public constructor() {
    super();

    this.restart = this.restart.bind(this);
    this.start();
  }

  private start() {
    this.process = spawn('python', ['camera.py'], {
      cwd: process.env.NODE_ENV != 'production' ? 'src/runtime' : undefined,
      stdio: 'pipe',
    });

    this.encoder = new Encoder({
      lengthSize: 2,
      setLength: (buffer, value) => buffer.writeUint16BE(value),
    });

    this.encoder.pipe(this.process.stdin);

    this.decoder = new Decoder({
      lengthSize: 2,
      getLength: (buffer) => buffer.readUint16BE(),
    });

    this.decoder.on('data', this.handleResponse.bind(this));
    this.process.stdout.pipe(this.decoder);

    this.process.stderr.on('data', (data: Buffer) => {
      console.error(data.toString('ascii'));
    });

    this.process.on('exit', this.restart);
  }

  private restart() {
    this.start();
  }

  public stop() {
    this.process.off('exit', this.restart);
    this.process.kill();
  }

  public sendRequest(message: vonk_fence.ICameraIn) {
    const encoded = vonk_fence.CameraIn.encode(message).finish();
    this.encoder.write(encoded);
  }

  private handleResponse(data: Buffer) {
    const response = vonk_fence.CameraOut.decode(data);

    if (response.photoResult) {
      this.emit(
        'photo-result',
        response.photoResult.filename,
        response.photoResult.timeTakenMillis,
        response.photoResult.wellKnown,
      );
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
