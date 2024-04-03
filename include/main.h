#ifndef MAIN_H
#define MAIN_H

#include "firmware_in.pb.h"
#include "firmware_out.pb.h"

bool updateDetector(uint32_t now, vonk_fence_FirmwareOut* response);
bool handleRequest(uint32_t now,
                   vonk_fence_FirmwareIn* request,
                   vonk_fence_FirmwareOut* response);
void handleFlashRequest(vonk_fence_FlashRequest flashRequest);
bool handlePing(vonk_fence_FirmwareIn* request,
                vonk_fence_FirmwareOut* response);

#endif
