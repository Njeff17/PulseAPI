# Bug Summary

| #   | Title                                                             | Severity | One-line description                                                                                   |
| --- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| 1   | Login returns 500 when the password is a number                   | High     | Sending a number as the password crashes the login check and returns 500 instead of a clear 400 error. |
| 2   | A device can be registered with a name made of only spaces        | Medium   | A name of only spaces passes the required check, so a device is saved with a blank name.               |
| 3   | Updating a device's serial number returns 200 but changes nothing | Low      | PATCH with a new serial number returns 200 and silently ignores it, so the client thinks it worked.    |
