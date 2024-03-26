export default class NumericalSampleStorage {
  private readonly samples: number[];

  public constructor(private readonly maxSize: number) {
    this.samples = [];
  }

  public addSample(sample: number) {
    this.samples.push(sample);

    if (this.samples.length > this.maxSize) {
      this.samples.shift();
    }
  }

  public getMean(): number {
    const sum = this.samples.reduce(
      (previous, current) => previous + current,
      0,
    );

    return sum / this.samples.length;
  }
}
