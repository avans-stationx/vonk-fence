#ifndef LEDRING_H
#define LEDRING_H

#include <Adafruit_NeoPixel.h>

class LedRing {
 private:
  Adafruit_NeoPixel ring;
  const uint16_t UPDATE_INTERVAL_MILLIS;
  const uint16_t HUE_INCREMENT;
  uint64_t nextUpdate;
  uint16_t hue;
  uint32_t flashDuration;

 public:
  LedRing(uint8_t count,
          uint8_t pin,
          neoPixelType type,
          uint16_t updateIntervalMillis,
          uint16_t hueIncrement);

  void begin(void);
  void update(uint32_t now);
  void flash(void);
  void flash(uint32_t duration);
  void setFlashDuration(uint32_t duration);
};

#endif
