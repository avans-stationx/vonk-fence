#include "Potmeter.h"
#include <Arduino.h>

Potmeter::Potmeter(uint8_t pin,
                   uint8_t hysteresis,
                   uint16_t updateIntervalMillis)
    : SENSOR_PIN(pin),
      HYSTERESIS(hysteresis),
      UPDATE_INTERVAL_MILLIS(updateIntervalMillis) {}

void Potmeter::begin() {
  nextUpdate = millis() + UPDATE_INTERVAL_MILLIS;
  value = analogRead(SENSOR_PIN);
}

bool Potmeter::update(uint32_t now) {
  if (now < nextUpdate) {
    return false;
  }

  uint16_t newValue = analogRead(SENSOR_PIN);
  int16_t difference = value - newValue;

  if (abs(difference) < HYSTERESIS) {
    return false;
  }

  value = newValue;
  nextUpdate = now + UPDATE_INTERVAL_MILLIS;

  return true;
}

uint16_t Potmeter::getValue() {
  return value;
}
