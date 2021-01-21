# Setting up jasmine for testing

OSGS utilizes the jasmine testing standalone distribution for its testing purposes. The jasmine source shall not be
committed to the project, and should instead be installed by the user by visiting the standalone downloads page. You
should be able to and are encouraged to use the latest version available.

Download the standalone zip file, and extract and copy the lib directory to this directory (`OSGS/test/www/lib/`)

The spec runner is provided by the project and links to all specs included under the spec folder. If you add a new
capability to the front end, or you modify an existing capability such that one of the tests on the spec runner now
fails, you will be expected to provide new tests or fix the failing test, respectively.