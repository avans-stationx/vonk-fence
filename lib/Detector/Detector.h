#ifndef DETECTOR_H
#define DETECTOR_H

#include <stdint.h>

class Detector {
 private:
  const uint8_t SENSOR_PIN;
  const uint16_t DETECTION_THRESHOLD;
  const uint16_t UPDATE_INTERVAL_MILLIS;
  const uint16_t RECOVERY_TIMEOUT_MILLIS;
  uint32_t nextUpdate;
  uint32_t recoveryTime;

 public:
  Detector(uint8_t sensorPin,
           uint16_t detectionThreshold,
           uint16_t updateIntervalMillis,
           uint16_t recoveryTimeoutMillis);
  void begin(void);
  bool update(uint32_t now);
};

#endif
