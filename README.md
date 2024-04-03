# VONK Fence Installation

This is the code that drives the VONK Fence Installation at Avansdag 2024.

## Getting started

The easiest way to get started is to enter the following commands in the terminal:

```sh
git clone https://github.com/avans-stationx/vonk-fence
cd vonk-fence
./install.sh
```

These commands will set everything up for you.

## Building protobufs

There are three different ways to compile the protobufs in this project.

1. TypeScript-only: `pnpm run generate:protos`
2. With Python:

   ```sh
   # Execute the first line if you haven't activated the venv already
   source .venv/bin/activated
   pnpm run generate:protos:python
   ```

3. For production (emits to build destination): `pnpm run generate:protos:build`

## Arduino

The easiest way to upload the code to the Arduino is by opening this repository in Visual Studio Code with the PlatformIO extension installed. The editor should prompt you to install the extension because it is recommended by this repository. Then you can upload the code by pressing <kbd>Ctrl</kbd> + <kbd>Option</kbd> + <kbd>U</kbd> on a Mac or <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>U</kbd> on Windows and Linux.

## Starting instructions

### Development

To start the app in development mode, you have three options: locally, locally (only frontend) and remotely (e.g. via SSH). Trying to start the app with the wrong method will cause the app to either crash immediately, or to have undefined behavior. To run the app locally, enter the following command in the terminal: `pnpm run dev`. To run it in frontend-only mode, execute `pnpm run dev:frontend`. To run it remotely, execute the following command: `pnpm run dev:remote`.

### Production

Before trying to start the app in production mode, make sure that you have installed and built it the proper way. The easiest way to do that is with the following command: `./install.sh --production`. To start the app in production mode, a block storage device has to be connected as well. After you have ensured that you have prepared your environment properly, you can start the app by issuing `pnpm run start` at the command line. That command can only be run on the device itself, not remotely.
