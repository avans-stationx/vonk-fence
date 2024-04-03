#ifndef POTMETER_H
#define POTMETER_H

#include <inttypes.h>

/**
 * Models a potentiometer around an analog input.
 */
class Potmeter {
 private:
  /**
   * The pin number that the potentiometer is connected to.
   */
  const uint8_t SENSOR_PIN;

  /**
   * The threshold that abs(newValue) has to cross to be set as the new value.
   */
  const uint8_t HYSTERESIS;

  /**
   * The update interval expressed in milliseconds.
   */
  const uint16_t UPDATE_INTERVAL_MILLIS;

  /**
   * The current value.
   */
  uint16_t value;

  /**
   * The timestamp in milliseconds of when this instance's value can be updated
   * again.
   */
  uint32_t nextUpdate;

 public:
  /**
   * Creates a new instance of the Potmeter class.
   *
   * @param pin The number of the analog pin to which the potmeter is connected
   * @param hysteresis The threshold that the new value has to cross
   * @param updateIntervalMillis The update interval expressed in milliseconds
   */
  Potmeter(uint8_t pin, uint8_t hysteresis, uint16_t updateIntervalMillis);

  /**
   * Prepares this instance for usage.
   */
  void begin(void);

  /**
   * Updates the current state of the potmeter when its value has crossed the
   * hysteresis threshold.
   *
   * @param now The current time in milliseconds
   * @return True if the value has changed
   */
  bool update(uint32_t now);

  /**
   * Gets the current value of the potmeter.
   *
   * @return The current value
   */
  uint16_t getValue(void);
};

#endif
