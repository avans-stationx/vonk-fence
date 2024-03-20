#ifndef PROTOBUF_H
#define PROTOBUF_H

#include <Stream.h>
#include <pb_decode.h>
#include <pb_encode.h>

bool receiveProtobuf(Stream& source,
                     const pb_msgdesc_t* fields,
                     void* destination);

bool sendProtobuf(Stream& destination,
                  const pb_msgdesc_t* fields,
                  void* source,
                  size_t size);

#endif
