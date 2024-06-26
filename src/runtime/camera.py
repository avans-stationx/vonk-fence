import gc
import generated_protos.camera_in_pb2 as CameraIn
import generated_protos.camera_out_pb2 as CameraOut
from libcamera import controls as camera_controls
from math import floor
from os import environ, path
from picamera2 import Picamera2
import sys
import time

def now_millis():
    now = time.time() * 1000
    return int(floor(now + 0.5))

environ['LIBCAMERA_LOG_LEVELS'] = '3'
Picamera2.set_logging(level=Picamera2.ERROR)

crop_size = 1500

picam = Picamera2()
config = picam.create_still_configuration()
config['main']['size'] = (crop_size, crop_size)
picam.configure(config)

controls = {
    'AfMode': camera_controls.AfModeEnum.Continuous,
    'AfRange': camera_controls.AfRangeEnum.Macro,
    'AfSpeed': camera_controls.AfSpeedEnum.Fast,
    'AwbMode': camera_controls.AwbModeEnum.Fluorescent,
    'ExposureTime': 10000,
    'ScalerCrop': (1400, 1300, crop_size, crop_size),
}

picam.set_controls(controls)
picam.options['quality'] = 80

picam.start()

(sensor_width, sensor_height) = picam.camera_properties['PixelArraySize']
half_sensor_width = sensor_width * 0.5
predefined_offset_width = sensor_width * 0.25
half_sensor_height = sensor_height * 0.5
predefined_offset_height = sensor_height * 0.15

gc.disable()
gc.collect()

while True:
    request_length = int.from_bytes(sys.stdin.buffer.read(2), byteorder='big', signed=False)
    encoded_request = sys.stdin.buffer.read(request_length)
    request = CameraIn.CameraIn()
    request.ParseFromString(encoded_request)

    has_response = False
    response = CameraOut.CameraOut()

    if request.HasField('photo_request'):
        photo_request = request.photo_request

        if (photo_request.HasField('well_known')):
            filename = path.join(photo_request.storage_path, photo_request.well_known)
            response.photo_result.well_known = photo_request.well_known
        else:
            filename = path.join(photo_request.storage_path, f'{photo_request.serial}_{photo_request.timestamp}.jpg')


        picam.capture_file(filename)
        now = now_millis()

        has_response = True
        response.photo_result.filename = filename
        response.photo_result.time_taken_millis = now - photo_request.timestamp
        gc.collect()

    if request.HasField('region_of_interest'):
        left = floor(predefined_offset_width + (request.region_of_interest.left * half_sensor_width))
        top = floor(predefined_offset_height + (request.region_of_interest.top * half_sensor_height))
        controls['ScalerCrop'] = (left, top, crop_size, crop_size)
        picam.set_controls(controls)

        has_response = True
        response.region_of_interest.left = left
        response.region_of_interest.top = top

    if has_response:
        encoded_response = response.SerializeToString()
        response_length = len(encoded_response).to_bytes(length=2, byteorder='big', signed=False)
        sys.stdout.buffer.write(response_length)
        sys.stdout.buffer.write(encoded_response)
        sys.stdout.buffer.flush()
