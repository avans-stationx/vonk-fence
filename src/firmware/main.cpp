#include <Arduino.h>
#include <LedRing.h>
#include <pb_arduino.h>
#include "firmware_in.pb.h"
#include "firmware_out.pb.h"

LedRing ring(16, 6, NEO_GRB | NEO_KHZ800, 5, 10);

pb_istream_s input;
pb_ostream_s output;

void setup() {
  Serial.begin(115200);
  ring.begin();

  input = as_pb_istream(Serial);
  output = as_pb_ostream(Serial);
}

void loop() {
  bool gotRequest = false;
  vonk_fence_FirmwareIn request = vonk_fence_FirmwareIn_init_zero;

  if (Serial.available()) {
    gotRequest = pb_decode(&input, &vonk_fence_FirmwareIn_msg, &request);
  }

  const uint64_t now = millis();

  ring.update(now);

  if (gotRequest && request.flash_millis > 0) {
    ring.flash(request.flash_millis);
  }
}
