#include "Protobuf.h"
#include <Arduino.h>

bool receiveProtobuf(Stream& source,
                     const pb_msgdesc_t* fields,
                     void* destination) {
  size_t count = ((uint8_t)source.read()) << 8;
  delayMicroseconds(500);
  count += (uint8_t)source.read();

  uint8_t buffer[count];
  source.readBytes(buffer, count);

  pb_istream_t input = pb_istream_from_buffer(buffer, count);

  return pb_decode(&input, fields, destination);
}

bool sendProtobuf(Stream& destination,
                  const pb_msgdesc_t* fields,
                  void* source,
                  size_t size) {
  uint8_t buffer[size];
  pb_ostream_t output = pb_ostream_from_buffer(buffer, size);

  if (!pb_encode(&output, fields, source)) {
    return false;
  }

  destination.write((uint8_t)(output.bytes_written >> 8));
  destination.write((uint8_t)output.bytes_written);
  destination.write(buffer, output.bytes_written);

  return true;
}
