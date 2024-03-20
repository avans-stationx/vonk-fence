import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { Encoder, Decoder } from 'frame-stream';
import { vonk_fence } from './generated_protos/protos';

type CameraBridgeEvents = {};

export default class CameraBridge extends (EventEmitter as new () => TypedEmitter<CameraBridgeEvents>) {
  private process: ChildProcessWithoutNullStreams;
  private encoder: Encoder;
  private decoder: Decoder;

  public constructor() {
    super();

    this.process = spawn('python', ['camera.py'], {
      cwd: 'src/runtime',
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
      console.log(data.toString('ascii'));
    });
  }

  public stop() {
    this.process.kill();
  }

  public sendRequest(message: vonk_fence.ICameraIn) {
    const encoded = vonk_fence.CameraIn.encode(message).finish();
    this.encoder.write(encoded);
  }

  private handleResponse(data: Buffer) {
    const response = vonk_fence.CameraOut.decode(data);
  }
}
