# Botsebita Mega Drive Emulator v1.18

## Novedades v1.18

- **Nuevo cartucho:** *Battletoads in Blast Processing* (v1.0 por Soulchip TV), ya incluido en la biblioteca.
- **Labels renovadas:** nuevas portadas de cartucho completo, con fondo transparente, para Streets of Rage 2, Gunstar Heroes, Contra: Hard Corps, TMNT: Tournament Fighters, TMNT: The Hyperstone Heist, Micro Machines Turbo Tournament '96, Zombies Ate My Neighbors, World of Illusion, Golden Axe I, II y III y NBA Jam: Tournament Edition.
- 20 cartuchos incluidos. No hay más cambios respecto a v1.17.

## Novedades v1.17

- **Estados guardados:** botón «Estados» (también en el menú de pausa) con 4 ranuras por juego, miniatura y fecha. Atajos: F5 guarda en la última ranura usada y F8 la carga. No disponible durante partidas online ni con ROM dentro de un ZIP.
- **Modo de baja latencia** (Ajustes): reduce el búfer de audio de 60 a 45 ms y usa un lienzo sin composición adicional. Desactívalo si oyes cortes.
- **Biblioteca más rápida:** las ROM recientes se guardan en IndexedDB separando metadatos y datos, con una sola conexión compartida y un máximo de 12 ROM. Las bases de datos de versiones anteriores se migran solas.
- **Biblioteca completa:** botón «Ver biblioteca completa» con filtro de búsqueda.
- 19 cartuchos incluidos en v1.17. Para cambiar una portada, reemplaza `covers/<id>-cartridge.png`.

## Novedades v1.10

- Un solo flujo de multijugador: crear sala o introducir un código de seis caracteres.
- La negociación de WebRTC se realiza automáticamente a través de PeerJS Cloud; ya no hay que copiar ofertas, respuestas o candidatos ICE.
- Se usa la configuración STUN/TURN predeterminada de PeerJS, con posibilidad de especificar servidores ICE propios en `netplay-config.js`.
- Los títulos del selector de cartuchos aparecen centrados arriba de cada cartucho; se eliminó la información secundaria que deformaba el menú.
- El tablero arcade usa una ilustración local inspirada en el prototipo de paisaje retro: cuadros azules, colinas a cuadros, palmeras, anillos dorados, estrellas y líneas de velocidad. Los controles continúan siendo elementos interactivos independientes.
- El indicador P2 está disponible en el encabezado normal y dentro de pantalla completa. Las barras se actualizan con una estimación de latencia mediante mensajes ping/pong (y estadísticas WebRTC cuando el navegador las expone).

## Cómo jugar online

1. Ambos jugadores abren la misma publicación web y cargan exactamente la misma ROM.
2. El Jugador 1 abre «Jugar online con un amigo» y pulsa «Crear sala online».
3. Comparte el código de seis caracteres que aparece.
4. El Jugador 2 introduce el código y pulsa «Unirme».
5. Cuando se validan la ROM y los dos canales de datos, el anfitrión pulsa «Iniciar juntos».

La página requiere conexión a Internet para cargar PeerJS desde jsDelivr y usar PeerJS Cloud para la señalización. STUN/TURN predeterminado ayuda con distintas topologías de red, pero ninguna configuración pública puede garantizar conectividad en todas las redes. Si no aparece la sala, comprueba el código, que el anfitrión mantenga la página abierta y que la red no bloquee WebRTC.

## Limitaciones conocidas

Netplay sigue siendo experimental. La sincronización inicial transfiere el estado del anfitrión, pero las correcciones durante la partida pueden generar saltos; todavía no hay rollback como Dolphin. El indicador de barras representa una estimación de latencia, no una garantía de sincronización perfecta.

## Publicación

En itch.io elige **HTML**, sube este ZIP y activa **This file will be played in the browser**. El ZIP de publicación debe dejar `index.html` en la raíz.

**Nota sobre ROM:** el paquete actual conserva la ROM de *Snow Bros.*. Redistribúyela públicamente únicamente si tienes los derechos para hacerlo.
