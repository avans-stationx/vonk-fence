#ifndef RAINBOWLEDWITHFLASH_H
#define RAINBOWLEDWITHFLASH_H

#include <Adafruit_NeoPixel.h>
#include "RainbowLed.h"

class RainbowLedWithFlash : public RainbowLed {
 private:
  uint32_t flashDuration;
  bool flashOverride;
  void showWhite(void);

 public:
  RainbowLedWithFlash(uint8_t count,
                      uint8_t pin,
                      neoPixelType type,
                      uint16_t updateIntervalMillis,
                      uint16_t hueIncrement);

  void update(uint32_t now) override;
  void flash(void);
  void flash(uint32_t duration);
  void setFlashDuration(uint32_t duration);
  void setFlashOverride(bool state);
};

#endif
