# PulseAPI Test Plan

## What could go wrong?

### Authentication

- What if someone logs in with the right email but the wrong password — do they still get a token?
- What if someone leaves the email or password empty?
- What if someone calls a protected endpoint without a token, or with a fake token — can they still see or change data?

### Devices

- What if someone registers a device without a name or without a serial number?
- What if two devices are registered with the same serial number?
- What if someone asks for, updates or deletes a device that does not exist?
- What if someone tries to change a device's serial number with an update — should that be allowed?

### Readings

- What if someone submits a reading with a text value like "hello" instead of a number?
- What if someone submits a reading with no voltage at all?
- What if someone submits a reading for a device that does not exist?
- What if someone sends their own timestamp — does the server use it instead of setting its own?

### Alerts

- What if someone submits a reading of exactly 0 V or exactly 60 V — does the system treat those as alerts?
- What if a reading is just outside the safe range, like 60.1 V or -0.1 V — is an alert created?
- What if someone dismisses an alert that does not exist, or the same alert twice?
- What if a device is deleted — are its readings and alerts left behind?
