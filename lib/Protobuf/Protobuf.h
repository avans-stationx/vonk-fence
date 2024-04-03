#ifndef PROTOBUF_H
#define PROTOBUF_H

#include <Stream.h>
#include <pb_decode.h>
#include <pb_encode.h>

/**
 * Receives a length-prefixed protobuf from the specified source.
 *
 * @param source The source to read from
 * @param fields The field description to use during decoding
 * @param destination The object to write the decoded data to
 * @return True if a protobuf was received successfully
 */
bool receiveProtobuf(Stream& source,
                     const pb_msgdesc_t* fields,
                     void* destination);

/**
 * Writes a length-prefixed protobuf to the specified destination.
 *
 * @param destination The destination to write to
 * @param fields The field description to use during encoding
 * @param source The object to encode
 * @param size The size of the object to encode
 * @return True if the object was written successfully
 */
bool sendProtobuf(Stream& destination,
                  const pb_msgdesc_t* fields,
                  void* source,
                  size_t size);

#endif
