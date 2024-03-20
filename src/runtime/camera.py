import generated_protos.camera_in_pb2 as CameraIn
import generated_protos.camera_out_pb2 as CameraOut
from libcamera import controls
from picamera2 import Picamera2
import sys

crop_size = 1500

picam = Picamera2()
config = picam.create_still_configuration()
config['main']['size'] = (crop_size, crop_size)
picam.configure(config)

controls = {
    'AfMode': controls.AfModeEnum.Continuous,
    'AfRange': controls.AfRangeEnum.Macro,
    'AfSpeed': controls.AfSpeedEnum.Fast,
    'AwbMode': controls.AwbModeEnum.Fluorescent,
    'ScalerCrop': (1400, 1300, crop_size, crop_size),
}

picam.set_controls(controls)

picam.start()

while True:
    request_length = int.from_bytes(sys.stdin.buffer.read(2), byteorder='big', signed=False)
    encoded_request = sys.stdin.buffer.read(request_length)
    request = CameraIn.CameraIn()
    request.ParseFromString(encoded_request)

    has_response = False
    response = CameraOut.CameraOut()

    if request.HasField('photo_request'):
        filename = f'../../photos/{request.photo_request.timestamp}.png'
        picam.capture_file(filename)

        has_response = True
        response.filename = filename

    if request.HasField('region_of_interest'):
        left = request.region_of_interest.left
        top = request.region_of_interest.top
        controls['ScalerCrop'] = (left, top, crop_size, crop_size)
        picam.set_controls(controls)

    if has_response:
        encoded_response = response.SerializeToString()
        response_length = len(encoded_response).to_bytes(length=2, byteorder='big', signed=False)
        sys.stdout.buffer.write(response_length)
        sys.stdout.buffer.write(encoded_response)
        sys.stdout.buffer.flush()
