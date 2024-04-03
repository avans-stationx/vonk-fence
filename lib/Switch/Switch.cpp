#include "Switch.h"
#include <Arduino.h>

Switch::Switch(uint8_t pin, uint16_t updateIntervalMillis)
    : PIN(pin), UPDATE_INTERVAL_MILLIS(updateIntervalMillis) {}

void Switch::begin() {
  pinMode(PIN, INPUT_PULLUP);
  nextUpdate = millis();
}

bool Switch::update(uint32_t now) {
  if (now < nextUpdate) {
    return state;
  }

  state = !digitalRead(PIN);
  nextUpdate = now + UPDATE_INTERVAL_MILLIS;

  return state;
}
