#ifndef SWITCH_H
#define SWITCH_H

#include <inttypes.h>

class Switch {
 private:
  const uint8_t PIN;
  const uint16_t UPDATE_INTERVAL_MILLIS;
  uint32_t nextUpdate;
  bool state;

 public:
  Switch(uint8_t pin, uint16_t updateIntervalMillis);
  void begin(void);
  bool update(uint32_t now);
};

#endif
