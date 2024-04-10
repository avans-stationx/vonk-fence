#include "main.h"
#include <Arduino.h>
#include <Detector.h>
#include <Potmeter.h>
#include <Protobuf.h>
#include <RainbowLed.h>
#include <RainbowLedWithFlash.h>
#include <Switch.h>

Detector detector(A2, 300, 50, 1000);
Potmeter balance(A3, 20, 100);
Potmeter regionOfInterestLeft(A4, 20, 500);
Potmeter regionOfInterestTop(A5, 20, 500);
RainbowLed bus(16, 2, NEO_GRB | NEO_KHZ800, 100, 200);
RainbowLed diorama(16, 3, NEO_GRB | NEO_KHZ800, 100, 200);
RainbowLed illusion(16, 4, NEO_GRB | NEO_KHZ800, 100, 200);
RainbowLedWithFlash cameraFlash(16, 5, NEO_GRB | NEO_KHZ800, 100, 200);
Switch settingsGuard(6, 50);

void setup() {
  Serial.begin(115200);

  while (!Serial) {
  }

  detector.begin();
  balance.begin();
  regionOfInterestLeft.begin();
  regionOfInterestTop.begin();
  bus.begin();
  diorama.begin();
  illusion.begin();
  cameraFlash.begin();
  settingsGuard.begin();

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

  bus.update(now);
  diorama.update(now);
  illusion.update(now);
  cameraFlash.update(now);

  gotResponse = gotResponse || updateDetector(now, &response);

  if (settingsGuard.update(now)) {
    gotResponse = gotResponse || updateBalance(now, &response);
    gotResponse = gotResponse || updateRegionOfInterest(now, &response);
  }

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
  response->detector.test_mode = settingsGuard.update(now);

  return true;
}

bool updateBalance(uint32_t now, vonk_fence_FirmwareOut* response) {
  if (!balance.update(now)) {
    return false;
  }

  response->has_volume = true;
  calculateBalance(&response->volume.left, &response->volume.right);

  return true;
}

bool updateRegionOfInterest(uint32_t now, vonk_fence_FirmwareOut* response) {
  if (!regionOfInterestLeft.update(now) && !regionOfInterestTop.update(now)) {
    return false;
  }

  setRegionOfInterest(response);

  return true;
}

bool handleRequest(uint32_t now,
                   vonk_fence_FirmwareIn* request,
                   vonk_fence_FirmwareOut* response) {
  bool gotResponse = false;

  gotResponse = gotResponse || handleAcknowledge(request, response);

  if (request->has_flash_request) {
    handleFlashRequest(request->flash_request);
  }

  gotResponse = gotResponse || handlePing(request, response);

  if (request->has_data_request) {
    if (request->data_request.volume) {
      gotResponse = true;
      response->has_volume = true;
      calculateBalance(&response->volume.left, &response->volume.right);
    }

    if (request->data_request.region_of_interest) {
      gotResponse = true;
      setRegionOfInterest(response);
    }
  }

  return gotResponse;
}

bool handleAcknowledge(vonk_fence_FirmwareIn* request,
                       vonk_fence_FirmwareOut* response) {
  if (!request->has_acknowledge) {
    return false;
  }

  response->has_acknowledge = true;
  response->acknowledge = request->acknowledge;

  return true;
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

void calculateBalance(float* left, float* right) {
  *right = (float)balance.getValue() / 1023.0f;
  *left = 1.0f - *right;
}

void setRegionOfInterest(vonk_fence_FirmwareOut* response) {
  response->has_region_of_interest = true;
  response->region_of_interest.left =
      ((float)regionOfInterestLeft.getValue() / 1023.0f);
  response->region_of_interest.top =
      ((float)regionOfInterestTop.getValue() / 1023.0f);
}
