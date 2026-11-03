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

## What would you test first?

1. **Protected endpoints reject requests without a valid token.** If this fails, anyone could see, change or delete devices and readings without logging in.
2. **Voltage must be a number.** Bad readings would be stored and alerts could be missed or created by mistake, so the data could no longer be trusted.
3. **Alerts at the boundary values (0 V, 60 V, 60.1 V).** Creating alerts is the main job of the system, and mistakes are most likely right at the edges of the safe range.
4. **Submitting a reading for a device that does not exist.** Readings must always belong to a real device, otherwise the data is meaningless and alerts point to nothing.
5. **Deleting a device that has readings.** The requirement says its readings must be deleted too; leftover readings would waste space and show up in the wrong places.

## Test cases

| #   | What I am testing                 | What I will do                                                                            | What I expect to happen                                                     |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Login with correct details        | Send POST /login with technician@pulseapi.com and password123                             | 200 and I get a token back                                                  |
| 2   | Login with wrong password         | Send POST /login with the right email but the password "wrongpassword"                    | 401, "Invalid email or password"                                            |
| 3   | Login with no password            | Send POST /login with only the email                                                      | 400, "Email and password are required"                                      |
| 4   | Protected endpoint with no token  | Send GET /api/devices without the Authorization header                                    | 401, "Missing token"                                                        |
| 5   | Register a device                 | Send POST /api/devices with a name, serial number and location                            | 201 and the new device comes back with an id                                |
| 6   | Register a device with no serial  | Send POST /api/devices with only a name                                                   | 400, "Name and serial number are required"                                  |
| 7   | Same serial number twice          | Register a device, then register another one with the same serial number                  | First one 201, second one 409, "Serial number already exists"               |
| 8   | Update a device                   | Send PATCH /api/devices/{id} with a new name, location and serial number                  | 200, name and location change but the serial number stays the same          |
| 9   | Device that does not exist        | Send GET /api/devices/9999                                                                | 404, "Device not found"                                                     |
| 10  | Text instead of a number          | Send POST /api/devices/{id}/readings with voltage "hello"                                 | 400, "Voltage must be a number", and no reading is saved                    |
| 11  | Reading for a device that is gone | Send POST /api/devices/9999/readings with voltage 12                                      | 404, "Device not found"                                                     |
| 12  | Exactly 0 V and exactly 60 V      | Send two readings, 0 and 60, then check GET /api/alerts                                   | Both readings 201, no new alerts                                            |
| 13  | 59.9 V and 60.1 V                 | Send two readings, 59.9 and 60.1, then check GET /api/alerts                              | Both readings 201, one new alert only for 60.1                              |
| 14  | Dismiss an alert                  | Send DELETE /api/alerts/{id}, check the list, then delete the same alert again            | First 204 and it's gone from the list, second time 404                      |
| 15  | Delete a device that has readings | Add a few readings (one above 60 V) to a device, delete the device, then get its readings | 204 on delete, readings request gives 404, its readings and alerts are gone |
