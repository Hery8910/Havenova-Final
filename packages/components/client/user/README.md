# Client User Components

Separación inicial de componentes de usuario por dominio:

- `auth/`: formularios y componentes orientados a autenticación
- `profile/`: componentes orientados a perfil y preferencias del usuario

Objetivo de esta fase:

- corregir ownership de componentes
- reducir imports cruzados entre auth y profile
- separar también la infraestructura de formulario:
  - `auth/userForm/*`
  - `profile/profileForm/*`
- dejar la siguiente fase enfocada en validadores, accesibilidad y tests por dominio
