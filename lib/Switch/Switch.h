#ifndef SWITCH_H
#define SWITCH_H

#include <inttypes.h>

/**
 * Models a toggle switch around a digital input.
 */
class Switch {
 private:
  /**
   * The pin number that the switch is connected to.
   */
  const uint8_t PIN;

  /**
   * The update interval expressed in milliseconds.
   */
  const uint16_t UPDATE_INTERVAL_MILLIS;

  /**
   * The timestamp in milliseconds of when this instance's value can be updated
   * again.
   */
  uint32_t nextUpdate;

  /**
   * The current state.
   */
  bool state;

 public:
  /**
   * Creates a new instance of the Switch class.
   *
   * @param pin The number of the digital pin to which the switch is connected
   * @param updateIntervalMillis The update interval expressed in milliseconds
   */
  Switch(uint8_t pin, uint16_t updateIntervalMillis);

  /**
   * Prepares this instance for usage.
   */
  void begin(void);

  /**
   * Updates the current state of the switch.
   *
   * @param now The current time in milliseconds
   * @return True if the switch is currently in the on state
   */
  bool update(uint32_t now);
};

#endif
