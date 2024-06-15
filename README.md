# Fantasy Court
This repository contains the source code for the website of Fantasy Court.


# GoHugo
The new site utilises GoHugo to make everything more maintainable. It can be found under the `fantasycourt.nl/` folder.

Documentation: https://gohugo.io/

Before running any of the Hugo-commands, navigate to the correct folder:
- `cd fantasycourt.nl`

To run:
- `hugo server -D`

To build:
- `hugo`

In Windows, the relevant Execution Policy needs to be set to be able to run Hugo. In Powershell, this can be done using `Set-ExecutionPolicy RemoteSigned -scope Process`. The former Execution Policy is restored once this Powershell instance is closed.

# Credits
Utilises the following components:
- [Bootstrap5](https://getbootstrap.com/docs/5.2/) for general styling
- [bs-ligthbox](https://github.com/RatMD/bs-lightbox) for the image gallery (source modified)
