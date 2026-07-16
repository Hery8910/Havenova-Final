# Reglas para `packages`

## Responsabilidad

Los paquetes contienen capacidades compartidas demostradas. No son un depósito para mover
código fuera de una app ni un sustituto de ownership.

## Dependencias

- Un paquete no importa desde `apps/*`.
- Declarar toda dependencia interna en su `package.json`.
- Evitar ciclos y barrels globales.
- No hacer self-import desde el index raíz del mismo paquete.
- Preferir imports por subpath explícito durante la migración.
- No crear aliases adicionales sin decisión registrada.

## Componentes

- Una feature específica permanece en su app.
- Promover una primitiva cuando su contrato sea neutral y tenga reutilización demostrada.
- Los componentes presentacionales no realizan fetch ni contienen reglas backend.
- Los view models específicos no pertenecen a `packages/types`.

## Servicios y BFF

- El navegador usa clientes same-origin.
- Los helpers BFF no contienen lógica de negocio.
- Preservar códigos de respuesta y errores tipados.
- No ampliar el cliente browser-direct transicional.

## Contextos y hooks

- Contextos poseen estado transversal real, no formularios o páginas completas.
- Evitar providers que dependan de componentes visuales.
- Dividir contextos sobredimensionados por responsabilidad y no por conveniencia de archivo.

## Assets y estilos

- `packages/assets` no almacena branding tenant-specific como si fuera neutral.
- No versionar copias sincronizadas en las apps.
- Mantener tokens semánticos independientes de Havenova.
- Todo nuevo asset debe registrarse.
