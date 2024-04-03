#ifndef RAINBOWLED_H
#define RAINBOWLED_H

#include <Adafruit_NeoPixel.h>

class RainbowLed {
 private:
  const uint16_t HUE_INCREMENT;
  uint16_t hue;
  uint8_t saturation;
  uint8_t brightness;

 protected:
  Adafruit_NeoPixel leds;
  const uint16_t UPDATE_INTERVAL_MILLIS;
  uint32_t nextUpdate;

 public:
  RainbowLed(uint8_t count,
             uint8_t pin,
             neoPixelType type,
             uint16_t updateIntervalMillis,
             uint16_t hueIncrement);
  void begin(void);
  void setSaturation(uint8_t saturation);
  void setBrightness(uint8_t brightness);
  virtual void update(uint32_t now);
};

#endif
