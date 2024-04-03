#ifndef MAIN_H
#define MAIN_H

#include "firmware_in.pb.h"
#include "firmware_out.pb.h"

/**
 * Updates the current state of the detector.
 *
 * This function will modify the response that will be sent to the host if the
 * detector has detected an object while it isn't in its recovery period.
 *
 * @param now The current time in milliseconds
 * @param response The response that will be sent to the host
 * @return True if the response has been modified
 */
bool updateDetector(uint32_t now, vonk_fence_FirmwareOut* response);

/**
 * Updates the current state of the audio balance.
 *
 * This function will modify the response that will be sent to the host if the
 * new value has crossed the hysteresis threshold. The values that will be sent
 * will be two floating-point numbers that represent unity gain for a left and a
 * right channel.
 *
 * @param now The current time in milliseconds
 * @param response The response that will be sent to the host
 * @return True if the response has been modified
 */
bool updateBalance(uint32_t now, vonk_fence_FirmwareOut* response);

/**
 * Updates the current state of the region of interest.
 *
 * This function will modify the response that will be sent to the host if the
 * new value has crossed the hysteresis threshold. The values that will be sent
 * will be two floating-point numbers ranging from 0 up to and including 1,
 * indicating a percentage offset from the left and the top of the frame.
 *
 * @param now The current time in milliseconds
 * @param response The response that will be sent to the host
 * @return True if the response has been modified
 */
bool updateRegionOfInterest(uint32_t now, vonk_fence_FirmwareOut* response);

/**
 * Handles incoming requests from the host.
 *
 * @param now The current time in milliseconds
 * @param request The incoming request
 * @param response The response that will be sent to the host
 * @return True if the response has been modified
 */
bool handleRequest(uint32_t now,
                   vonk_fence_FirmwareIn* request,
                   vonk_fence_FirmwareOut* response);

/**
 * Responds to acknowledgement requests from the host.
 *
 * @param request The incoming request
 * @param response The response that will be sent to the host
 * @return True if the response has been modified
 */
bool handleAcknowledge(vonk_fence_FirmwareIn* request,
                       vonk_fence_FirmwareOut* response);

/**
 * Configures and strobes the flash.
 *
 * @param flashRequest The requested actions to take
 */
void handleFlashRequest(vonk_fence_FlashRequest flashRequest);

/**
 * Handles pings from the host.
 *
 * This function will modify the response that will be sent to the host if the
 * incoming request contains a ping id.
 *
 * @param request The incoming request
 * @param response The response that will be sent to the host
 * @return True if the response has been modified
 */
bool handlePing(vonk_fence_FirmwareIn* request,
                vonk_fence_FirmwareOut* response);

/**
 * Calculates the left-right balance from the balance input.
 *
 * @param left The unity gain for the left channel
 * @param right The unity gain for the right channel
 */
void calculateBalance(float* left, float* right);

/**
 * Writes the current region of interest in the response that will be sent to
 * the host.
 *
 * @param response The response that will be sent to the host
 */
void setRegionOfInterest(vonk_fence_FirmwareOut* response);

#endif
