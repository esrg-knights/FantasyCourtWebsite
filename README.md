# Fantasy Court
This repository contains the source code for the website of Fantasy Court.

# Legacy Code
The old code (pure HTML and CSS) is available under the `legacy/` folder.

# Hugo
The new site utilises Hugo to make everything more maintainable. It can be found under the `hugo/` folder.

Documentation: https://gohugo.io/

To run:
- `hugo server -D`

To build:
- `hugo`

In Windows, the relevant Execution Policy needs to be set to be able to run Hugo. In Powershell, this can be done using `Set-ExecutionPolicy RemoteSigned -scope Process`. The former Execution Policy is restored once this Powershell instance is closed.
