#ifndef POTMETER_H
#define POTMETER_H

#include <inttypes.h>

class Potmeter {
 private:
  const uint8_t SENSOR_PIN;
  const uint8_t HYSTERESIS;
  const uint16_t UPDATE_INTERVAL_MILLIS;
  uint16_t value;
  uint32_t nextUpdate;

 public:
  Potmeter(uint8_t pin, uint8_t hysteresis, uint16_t updateIntervalMillis);
  void begin(void);
  bool update(uint32_t now);
  uint16_t getValue(void);
};

#endif
