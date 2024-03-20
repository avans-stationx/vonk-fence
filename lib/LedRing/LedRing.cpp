#include "LedRing.h"

LedRing::LedRing(uint8_t count,
                 uint8_t pin,
                 neoPixelType type,
                 uint16_t updateIntervalMillis,
                 uint16_t hueIncrement)
    : ring(count, pin, type),
      UPDATE_INTERVAL_MILLIS(updateIntervalMillis),
      HUE_INCREMENT(hueIncrement) {
  hue = 0;
  flashDuration = 200;
}

void LedRing::begin() {
  ring.begin();
  nextUpdate = millis();
}

void LedRing::update(uint32_t now) {
  if (now < nextUpdate) {
    return;
  }

  ring.fill(ring.ColorHSV(hue, 255, 63));
  ring.show();
  hue += HUE_INCREMENT;
  nextUpdate = now + UPDATE_INTERVAL_MILLIS;
}

void LedRing::flash() {
  flash(flashDuration);
}

void LedRing::flash(uint32_t duration) {
  ring.fill(0xffffffff);
  ring.show();

  nextUpdate = millis() + duration;
}

void LedRing::setFlashDuration(uint32_t duration) {
  flashDuration = duration;
}
