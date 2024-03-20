#include <Arduino.h>
#include <Detector.h>
#include <LedRing.h>
#include <Protobuf.h>
#include "firmware_in.pb.h"
#include "firmware_out.pb.h"

Detector detector(A0, 500, 50, 1000);
LedRing ring(16, 6, NEO_GRB | NEO_KHZ800, 5, 10);

void setup() {
  Serial.begin(115200);

  while (!Serial) {
  }

  detector.begin();
  ring.begin();
}

void loop() {
  bool gotRequest = false;
  vonk_fence_FirmwareIn request = vonk_fence_FirmwareIn_init_zero;
  bool gotResponse = false;
  vonk_fence_FirmwareOut response = vonk_fence_FirmwareOut_init_zero;

  if (Serial.available()) {
    gotRequest = receiveProtobuf(Serial, &vonk_fence_FirmwareIn_msg, &request);
  }

  const uint32_t now = millis();

  ring.update(now);

  if (detector.update(now)) {
    gotResponse = true;
    response.has_detector = true;
    response.detector.detected = true;
    response.detector.timestamp = now;
    ring.flash();
  }

  if (gotRequest && request.flash_millis > 0) {
    ring.setFlashDuration(request.flash_millis);
  }

  if (gotRequest && request.has_ping) {
    gotResponse = true;
    response.has_pong = true;
    response.pong.id = request.ping;
    response.pong.timestamp = millis();
  }

  if (gotRequest && request.has_data_request) {
    if (request.data_request.volume) {
      gotResponse = true;
    }

    if (request.data_request.region_of_interest) {
      gotResponse = true;
    }
  }

  if (gotResponse) {
    sendProtobuf(Serial, &vonk_fence_FirmwareOut_msg, &response,
                 sizeof(vonk_fence_FirmwareOut));
  }
}
