import { ReadStream } from "fs";
const recorder = require('node-record-lpcm16');

console.log('starting the recording...');

const stream = recorder.record({
  sampleRate: 16384,
  audioType: 'raw',
  channels: 1,
}).stream() as ReadStream;

const short = Math.pow(2, 15);
const invShort = 1 / short;

const n = Date.now();
console.log('starting recording loop...');
stream.on('data', (rawData: Buffer) => {
  console.log('new data');
  let minValue = 1;
  let maxValue = -1;

  for (let i = 0; i < rawData.length - 1; i += 2) {
    const samp = rawData.readInt16LE(i) * invShort;
    if (minValue > samp) {
      minValue = samp;
    }
    if (maxValue < samp) {
      maxValue = samp;
    }
  }

  console.log('volume:', maxValue - minValue);
})
