#include "main.h"
#include <Arduino.h>
#include <Detector.h>
#include <Protobuf.h>
#include <RainbowLedWithFlash.h>

Detector detector(A0, 300, 50, 1000);
RainbowLedWithFlash cameraFlash(16, 6, NEO_GRB | NEO_KHZ800, 5, 10);

void setup() {
  Serial.begin(115200);

  while (!Serial) {
  }

  detector.begin();
  cameraFlash.begin();

  cameraFlash.setBrightness(63);
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

  cameraFlash.update(now);

  gotResponse = gotResponse || updateDetector(now, &response);

  if (gotRequest) {
    gotResponse = gotResponse || handleRequest(now, &request, &response);
  }

  if (gotResponse) {
    sendProtobuf(Serial, &vonk_fence_FirmwareOut_msg, &response,
                 sizeof(vonk_fence_FirmwareOut));
  }
}

bool updateDetector(uint32_t now, vonk_fence_FirmwareOut* response) {
  if (!detector.update(now)) {
    return false;
  }

  response->has_detector = true;
  response->detector.detected = true;
  response->detector.timestamp = now;

  return true;
}

bool handleRequest(uint32_t now,
                   vonk_fence_FirmwareIn* request,
                   vonk_fence_FirmwareOut* response) {
  bool gotResponse = false;

  if (request->has_flash_request) {
    handleFlashRequest(request->flash_request);
  }

  gotResponse = gotResponse || handlePing(request, response);

  if (request->has_data_request) {
    if (request->data_request.volume) {
      gotResponse = true;
      // TODO: calculate individual gains for left and right channels and set in
      // the response
    }

    if (request->data_request.region_of_interest) {
      gotResponse = true;
      // TODO: set region of interest in the response
    }
  }

  return gotResponse;
}

void handleFlashRequest(vonk_fence_FlashRequest flashRequest) {
  if (flashRequest.has_duration) {
    if (flashRequest.strobe) {
      cameraFlash.flash(flashRequest.duration);
    } else {
      cameraFlash.setFlashDuration(flashRequest.duration);
    }
  }

  if (flashRequest.has_override) {
    cameraFlash.setFlashOverride(flashRequest.override);
  }

  if (flashRequest.strobe && !flashRequest.has_duration) {
    cameraFlash.flash();
  }
}

bool handlePing(vonk_fence_FirmwareIn* request,
                vonk_fence_FirmwareOut* response) {
  if (!request->has_ping) {
    return false;
  }

  response->has_pong = true;
  response->pong.id = request->ping;
  response->pong.timestamp = millis();

  return true;
}
