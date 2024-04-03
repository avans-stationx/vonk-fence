#include "RainbowLedWithFlash.h"

RainbowLedWithFlash::RainbowLedWithFlash(uint8_t count,
                                         uint8_t pin,
                                         neoPixelType type,
                                         uint16_t updateIntervalMillis,
                                         uint16_t hueIncrement)
    : RainbowLed(count, pin, type, updateIntervalMillis, hueIncrement) {
  flashDuration = 200;
  flashOverride = false;
}

void RainbowLedWithFlash::update(uint32_t now) {
  if (flashOverride) {
    return;
  }

  RainbowLed::update(now);
}

void RainbowLedWithFlash::flash() {
  flash(flashDuration);
}

void RainbowLedWithFlash::flash(uint32_t duration) {
  showWhite();
  nextUpdate = millis() + duration;
}

void RainbowLedWithFlash::showWhite() {
  leds.fill(0xffffffff);
  leds.show();
}

void RainbowLedWithFlash::setFlashDuration(uint32_t duration) {
  flashDuration = duration;
}

void RainbowLedWithFlash::setFlashOverride(bool state) {
  flashOverride = state;

  if (flashOverride) {
    showWhite();
    return;
  }

  nextUpdate = millis();
}
