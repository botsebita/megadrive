import { BUNDLED_GAMES, buttonsFromActions, buttonsFromCodes, createSession } from './core/lib/session.js';
import { ACTIONS, ACTION_LABEL, DEFAULT_SETTINGS, keyLabel, loadSettings, saveSettings } from './core/lib/settings.js';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#game-screen');
const stage = $('#stage');
const fileInput = $('#rom-file');
const settingsDialog = $('#settings-dialog');
const pauseOverlay = $('#pause-overlay');
const actionNames = [...ACTIONS];
const LANGUAGE_PACKS = {
  es: { statesButton: 'Estados', statesMenu: '💾 Estados guardados', statesTitle: 'Estados guardados', stateSlot: 'Ranura', stateEmpty: 'Vacía', stateSave: 'Guardar', stateLoad: 'Cargar', stateDelete: 'Borrar', stateHint: 'Atajos: F5 guarda en la última ranura usada y F8 la carga.', lowLatency: 'Modo de baja latencia', lowLatencyDesc: 'Usa menos búfer de audio. Desactívalo si oyes cortes.', filterLibrary: 'Filtrar cartuchos…', closeDialog: 'Cerrar', viewFullLibrary: 'Ver biblioteca completa', fullLibraryTitle: 'Biblioteca completa', closeLibrary: 'Cerrar biblioteca', loadedByYou: 'ROM cargada por ti', cartridgeMenu: 'CARTUCHOS INCLUIDOS', carouselHint: 'Usa las flechas para cambiar de cartucho', prevCartridge: 'Cartucho anterior', nextCartridge: 'Cartucho siguiente', loadYourRomsTitle: '¿Tienes tus propias ROM?', loadYourRomsHint: 'Abre archivos de Mega Drive guardados en tu teléfono o equipo.', loadOwnRom: 'Cargar una ROM propia', touchSize: 'Tamaño del mando', touchSizeHint: 'Ajusta el tamaño para que te resulte cómodo',
    controllerStyle: 'Diseño del mando', segaPad: 'Mando clásico Mega Drive', arcadePad: 'Tablero arcade', arcadeTouchHint: 'Palanca arcade, botones de colores y START/SELECT.', player2: 'JUGADOR 2', p2Off: 'OFF', p2Active: 'ACTIVO', signalTitle: 'Señal', pageTitle: 'Botsebita Mega Drive Emulator', appTitle: 'Botsebita Mega Drive Emulator', appSubtitle: 'SEGA MEGA DRIVE · EDICIÓN WEB · V1.10', language: 'Idioma', loadRom: 'Cargar ROM', settings: '⚙ Ajustes', library: 'Biblioteca', searchPlaceholder: 'Buscar juego…', preloaded: 'CARTUCHO PRECARGADO', bundledRom: 'Cartucho precargado', autoStart: 'Se inicia automáticamente', homebrew: 'HOMEBREW GRATUITO', homebrewMIT: 'Homebrew · MIT', includedBrowser: 'Incluido en el navegador', recent: 'RECIENTES', recentEmpty: 'Las ROM que cargues aparecerán aquí.', romNotice: 'La ROM precargada es comercial y fue aportada al proyecto. Publícala solo si tienes derecho a redistribuirla. Minesweeper MD es homebrew con licencia MIT.', credits: 'Núcleo del emulador: Monte Ohrt · Licencia MIT', nowPlaying: 'AHORA EN REPRODUCCIÓN', gameScreen: 'Pantalla de la consola Mega Drive', paused: 'JUEGO EN PAUSA', resume: '▶ Continuar', restartConsole: '↻ Reiniciar consola', powerOff: 'Apagar consola', menu: 'Menú', restart: 'Reiniciar', fullscreen: 'Pantalla completa', keyboardHint: 'Flechas · Z X C · Enter', loadingBundled: 'Cargando el juego precargado…', playFriend: 'Jugar online con un amigo', peerToPeer: 'PeerJS Cloud · código de sala', disconnected: 'Desconectado', netplayIntro: 'El Jugador 1 crea una sala y comparte un código de seis caracteres. El Jugador 2 lo introduce y pulsa «Unirme». Ambos deben cargar exactamente la misma ROM.', createRoom: 'Crear sala', playerOne: 'Yo seré Jugador 1', joinRoom: 'Unirme a una sala', playerTwo: 'Mi amigo será Jugador 1', connectionStep: 'Paso de conexión', connectionHelp: 'Sigue las instrucciones de pantalla.', receivedCode: 'Código que recibiste', pasteCode: 'Pega aquí el código de tu amigo', connect: 'Conectar', yourCode: 'Tu código para compartir', copyCode: 'Copiar código', startTogether: 'Iniciar juntos', back: 'Volver', disconnect: 'Desconectar', netplayWarning: 'Netplay experimental: usa PeerJS Cloud para señalización y servidores STUN/TURN compartidos para establecer la conexión. La disponibilidad depende de esos servicios y de tu red; la sincronización puede tener tirones y todavía no incluye rollback como Dolphin.', touchControls: 'Controles táctiles', dpad: 'Cruceta direccional', up: 'Arriba', left: 'Izquierda', right: 'Derecha', down: 'Abajo', touchHint: 'Mando estilo Mega Drive: cruceta, A/B/C, X/Y/Z, START y botones auxiliares.', footerInputs: 'Compatible con teclado, mando USB y controles táctiles.', footerAudio: 'El sonido comienza tras la primera interacción.', preferences: 'PREFERENCIAS', consoleSettings: 'Ajustes de la consola', region: 'Región', regionAuto: 'Automática, según el cartucho', regionExport: 'Exportación (América / Europa)', japan: 'Japón', tvSystem: 'Sistema de televisión', automatic: 'Automático', controller: 'Mando', sixButtons: '6 botones (A B C X Y Z)', threeButtons: '3 botones (A B C)', volume: 'Volumen', sound: 'Sonido', emulatorAudio: 'Audio del emulador', crtFilter: 'Filtro CRT', scanlineDesc: 'Líneas de barrido retro', integerScale: 'Píxeles nítidos', pixelDesc: 'Mantiene los bordes nítidos al ampliar', keyMapping: 'Asignación de teclas', keyMappingHint: 'Pulsa un control y después la tecla que quieres asignarle. Escape cancela.', resetControls: 'Restaurar controles', saveSettings: 'Guardar ajustes', consoleActive: 'Consola activa', consoleReady: 'Consola lista', consoleOff: 'Consola apagada', error: 'Error', answerReceived: 'Pega la respuesta de tu amigo', sendOffer: 'Paso 1 · Envía el código de sala', sendOfferHelp: 'Copia tu código y envíaselo a tu amigo. Cuando te devuelva la respuesta, pégala en el campo de arriba.', sendAnswer: 'Paso 2 · Devuelve tu código', sendAnswerHelp: 'Copia este código y envíaselo a quien creó la sala. Cuando se conecte, el Jugador 1 iniciará la partida.', joinStep: 'Paso 1 · Pega el código de sala', joinHelp: 'Tu amigo debe crear una sala y enviarte su código. Pégalo aquí y pulsa Conectar.', completeConnection: 'Completar conexión', waitingConnection: 'Conectando…', connectedSameGame: 'Conectado · mismo juego', offerReady: 'Código de sala creado', responseReady: 'Respuesta creada', pasteRoomCode: '1. Pega aquí el código que te envió el Jugador 1', sendRoomCode: '1. Copia y envía este código al Jugador 2', pasteAnswer: '2. Pega aquí la respuesta del Jugador 2', sendAnswerCode: '2. Copia y envía esta respuesta al Jugador 1', sentCodeNext: 'Ya envié el código · continuar', hostStepSendOffer: 'Paso 1 · Comparte el código de sala', hostSendOfferHelp: 'Pulsa «Copiar código» y envíalo al Jugador 2. Después pulsa «Continuar» para pegar su respuesta.', hostStepPasteAnswer: 'Paso 2 · Pega la respuesta del Jugador 2', hostPasteAnswerHelp: 'El Jugador 2 debe pegar tu código, pulsar «Generar respuesta» y enviártela de vuelta.', guestStepPasteOffer: 'Paso 1 · Pega el código del Jugador 1', guestPasteOfferHelp: 'El Jugador 1 crea la sala y te envía el código. Pégalo aquí y pulsa «Generar respuesta».', acceptRoomCode: 'Generar respuesta', applyAnswer: 'Conectar con la respuesta', pasteAnswerPlaceholder: 'Pega aquí la respuesta del Jugador 2', pasteRoomPlaceholder: 'Pega aquí el código que te envió el Jugador 1', action_up: 'Arriba', action_down: 'Abajo', action_left: 'Izquierda', action_right: 'Derecha', action_a: 'Botón A', action_b: 'Botón B', action_c: 'Botón C', action_x: 'Botón X', action_y: 'Botón Y', action_z: 'Botón Z', action_start: 'Start', onlineModeTitle: 'Conexión sencilla por código', onlineModeIntro: 'El Jugador 1 crea una sala y comparte un código corto. El Jugador 2 lo introduce; el emulador negocia la conexión automáticamente.', hostOnline: 'Crear sala online', joinOnline: 'Unirme', roomCodeLabel: 'Código de sala', copyRoomCode: 'Copiar código', roomCodeHint: 'Envía este código a tu amigo. Él lo introduce en el campo de arriba.', joinRoomCodePlaceholder: 'ABC123', player2AutoStart: 'Iniciar juntos', serverNotConfigured: 'Las salas usan PeerJS Cloud para intercambiar la información de conexión. El emulador usa la configuración STUN/TURN predeterminada de PeerJS; algunas redes corporativas, móviles o restrictivas pueden impedir la conexión.', action_mode: 'Mode'
  },
  en: { statesButton: 'States', statesMenu: '💾 Save states', statesTitle: 'Save states', stateSlot: 'Slot', stateEmpty: 'Empty', stateSave: 'Save', stateLoad: 'Load', stateDelete: 'Delete', stateHint: 'Shortcuts: F5 saves to the last used slot and F8 loads it.', lowLatency: 'Low-latency mode', lowLatencyDesc: 'Uses a smaller audio buffer. Turn it off if you hear crackling.', filterLibrary: 'Filter cartridges…', closeDialog: 'Close', viewFullLibrary: 'View full library', fullLibraryTitle: 'Full library', closeLibrary: 'Close library', loadedByYou: 'ROM loaded by you', cartridgeMenu: 'INCLUDED CARTRIDGES', carouselHint: 'Use the arrows to switch cartridges', prevCartridge: 'Previous cartridge', nextCartridge: 'Next cartridge', loadYourRomsTitle: 'Have your own ROMs?', loadYourRomsHint: 'Open Mega Drive files saved on your phone or computer.', loadOwnRom: 'Load your own ROM', touchSize: 'Controller size', touchSizeHint: 'Adjust the size to suit your hands',
    controllerStyle: 'Controller style', segaPad: 'Classic Mega Drive pad', arcadePad: 'Arcade panel', arcadeTouchHint: 'Arcade stick, colored action buttons and START/SELECT.', player2: 'PLAYER 2', p2Off: 'OFF', p2Active: 'ACTIVE', signalTitle: 'Signal', pageTitle: 'Botsebita Mega Drive Emulator', appTitle: 'Botsebita Mega Drive Emulator', appSubtitle: 'SEGA MEGA DRIVE · WEB EDITION · V1.10', language: 'Language', loadRom: 'Load ROM', settings: '⚙ Settings', library: 'Library', searchPlaceholder: 'Search games…', preloaded: 'PRELOADED CARTRIDGE', bundledRom: 'Preloaded cartridge', autoStart: 'Starts automatically', homebrew: 'FREE HOMEBREW', homebrewMIT: 'Homebrew · MIT', includedBrowser: 'Included in browser', recent: 'RECENT', recentEmpty: 'ROMs you load will appear here.', romNotice: 'The preloaded ROM is commercial and was supplied with the project. Publish it only if you have redistribution rights. Minesweeper MD is MIT-licensed homebrew.', credits: 'Emulator core: Monte Ohrt · MIT License', nowPlaying: 'NOW PLAYING', gameScreen: 'Mega Drive console screen', paused: 'GAME PAUSED', resume: '▶ Resume', restartConsole: '↻ Restart console', powerOff: 'Power off console', menu: 'Menu', restart: 'Restart', fullscreen: 'Full screen', keyboardHint: 'Arrows · Z X C · Enter', loadingBundled: 'Loading preloaded game…', playFriend: 'Play online with a friend', peerToPeer: 'PeerJS Cloud · room code', disconnected: 'Disconnected', netplayIntro: 'Player 1 creates a room and shares a six-character code. Player 2 enters it and selects Join. Both players must load exactly the same ROM.', createRoom: 'Create room', playerOne: 'I will be Player 1', joinRoom: 'Join a room', playerTwo: 'My friend will be Player 1', connectionStep: 'Connection step', connectionHelp: 'Follow the on-screen instructions.', receivedCode: 'Code you received', pasteCode: 'Paste your friend’s code here', connect: 'Connect', yourCode: 'Your code to share', copyCode: 'Copy code', startTogether: 'Start together', back: 'Back', disconnect: 'Disconnect', netplayWarning: 'Experimental netplay uses PeerJS Cloud signaling and shared STUN/TURN services. Availability depends on those services and your network; gameplay synchronization may stutter and does not include rollback like Dolphin.', touchControls: 'Touch controls', dpad: 'Directional pad', up: 'Up', left: 'Left', right: 'Right', down: 'Down', touchHint: 'Mega Drive-style pad: D-pad, A/B/C, X/Y/Z, START and auxiliary buttons.', footerInputs: 'Works with keyboard, USB gamepad and touch controls.', footerAudio: 'Sound starts after your first interaction.', preferences: 'PREFERENCES', consoleSettings: 'Console settings', region: 'Region', regionAuto: 'Automatic, based on cartridge', regionExport: 'Export (America / Europe)', japan: 'Japan', tvSystem: 'TV system', automatic: 'Automatic', controller: 'Controller', sixButtons: '6 buttons (A B C X Y Z)', threeButtons: '3 buttons (A B C)', volume: 'Volume', sound: 'Sound', emulatorAudio: 'Emulator audio', crtFilter: 'CRT filter', scanlineDesc: 'Retro scanlines', integerScale: 'Crisp pixels', pixelDesc: 'Keeps edges crisp when enlarged', keyMapping: 'Key mapping', keyMappingHint: 'Choose a control, then press the key to assign. Escape cancels.', resetControls: 'Reset controls', saveSettings: 'Save settings', consoleActive: 'Console active', consoleReady: 'Console ready', consoleOff: 'Console off', error: 'Error', answerReceived: 'Paste your friend’s answer', sendOffer: 'Step 1 · Send the room code', sendOfferHelp: 'Copy your code and send it to your friend. When they send a reply, paste it in the field above.', sendAnswer: 'Step 2 · Send your code back', sendAnswerHelp: 'Copy this code and send it to the room host. Once connected, Player 1 will start the game.', joinStep: 'Step 1 · Paste the room code', joinHelp: 'Your friend must create a room and send you their code. Paste it here and press Connect.', completeConnection: 'Complete connection', waitingConnection: 'Connecting…', connectedSameGame: 'Connected · same game', offerReady: 'Room code created', responseReady: 'Answer created', pasteRoomCode: '1. Paste the room code from Player 1', sendRoomCode: '1. Copy this code and send it to Player 2', pasteAnswer: '2. Paste Player 2’s reply here', sendAnswerCode: '2. Copy this reply and send it to Player 1', sentCodeNext: 'I sent the code · continue', hostStepSendOffer: 'Step 1 · Share the room code', hostSendOfferHelp: 'Press “Copy code” and send it to Player 2. Then press “Continue” to paste their reply.', hostStepPasteAnswer: 'Step 2 · Paste Player 2’s reply', hostPasteAnswerHelp: 'Player 2 must paste your code, press “Generate reply”, and send the reply back to you.', guestStepPasteOffer: 'Step 1 · Paste Player 1’s code', guestPasteOfferHelp: 'Player 1 creates the room and sends you the code. Paste it here and press “Generate reply”.', acceptRoomCode: 'Generate reply', applyAnswer: 'Connect using reply', pasteAnswerPlaceholder: 'Paste Player 2’s reply here', pasteRoomPlaceholder: 'Paste the room code from Player 1 here', action_up: 'Up', action_down: 'Down', action_left: 'Left', action_right: 'Right', action_a: 'Button A', action_b: 'Button B', action_c: 'Button C', action_x: 'Button X', action_y: 'Button Y', action_z: 'Button Z', action_start: 'Start', onlineModeTitle: 'Easy connection by room code', onlineModeIntro: 'Player 1 creates a room and shares a short code. Player 2 enters it; the emulator negotiates the connection automatically.', hostOnline: 'Create online room', joinOnline: 'Join', roomCodeLabel: 'Room code', copyRoomCode: 'Copy code', roomCodeHint: 'Send this code to your friend. They enter it in the field above.', joinRoomCodePlaceholder: 'ABC123', player2AutoStart: 'Start together', serverNotConfigured: 'Rooms use PeerJS Cloud to exchange connection details. The emulator uses PeerJS default STUN/TURN settings; some corporate, mobile, or restrictive networks may still block connections.', action_mode: 'Mode'
  },
  pt: { statesButton: 'Estados', statesMenu: '💾 Estados salvos', statesTitle: 'Estados salvos', stateSlot: 'Slot', stateEmpty: 'Vazio', stateSave: 'Salvar', stateLoad: 'Carregar', stateDelete: 'Apagar', stateHint: 'Atalhos: F5 salva no último slot usado e F8 o carrega.', lowLatency: 'Modo de baixa latência', lowLatencyDesc: 'Usa menos buffer de áudio. Desative se ouvir cortes.', filterLibrary: 'Filtrar cartuchos…', closeDialog: 'Fechar', viewFullLibrary: 'Ver biblioteca completa', fullLibraryTitle: 'Biblioteca completa', closeLibrary: 'Fechar biblioteca', loadedByYou: 'ROM carregada por você', cartridgeMenu: 'CARTUCHOS INCLUÍDOS', carouselHint: 'Use as setas para trocar de cartucho', prevCartridge: 'Cartucho anterior', nextCartridge: 'Próximo cartucho', loadYourRomsTitle: 'Você tem suas próprias ROMs?', loadYourRomsHint: 'Abra arquivos de Mega Drive salvos no celular ou computador.', loadOwnRom: 'Carregar uma ROM própria', touchSize: 'Tamanho do controle', touchSizeHint: 'Ajuste o tamanho para ficar confortável',
    controllerStyle: 'Estilo do controle', segaPad: 'Controle clássico Mega Drive', arcadePad: 'Painel arcade', arcadeTouchHint: 'Joystick arcade, botões coloridos e START/SELECT.', player2: 'JOGADOR 2', p2Off: 'OFF', p2Active: 'ATIVO', signalTitle: 'Sinal', pageTitle: 'Botsebita Mega Drive Emulator', appTitle: 'Botsebita Mega Drive Emulator', appSubtitle: 'SEGA MEGA DRIVE · EDIÇÃO WEB · V1.10', language: 'Idioma', loadRom: 'Carregar ROM', settings: '⚙ Ajustes', library: 'Biblioteca', searchPlaceholder: 'Buscar jogo…', preloaded: 'CARTUCHO PRÉ-CARREGADO', bundledRom: 'Cartucho pré-carregado', autoStart: 'Inicia automaticamente', homebrew: 'HOMEBREW GRATUITO', homebrewMIT: 'Homebrew · MIT', includedBrowser: 'Incluído no navegador', recent: 'RECENTES', recentEmpty: 'As ROMs carregadas aparecerão aqui.', romNotice: 'A ROM pré-carregada é comercial e foi fornecida com o projeto. Publique-a apenas se tiver direito de redistribuição. Minesweeper MD é homebrew com licença MIT.', credits: 'Núcleo do emulador: Monte Ohrt · Licença MIT', nowPlaying: 'EM REPRODUÇÃO', gameScreen: 'Tela do console Mega Drive', paused: 'JOGO PAUSADO', resume: '▶ Continuar', restartConsole: '↻ Reiniciar console', powerOff: 'Desligar console', menu: 'Menu', restart: 'Reiniciar', fullscreen: 'Tela cheia', keyboardHint: 'Setas · Z X C · Enter', loadingBundled: 'Carregando o jogo pré-carregado…', playFriend: 'Jogar online com um amigo', peerToPeer: 'PeerJS Cloud · código da sala', disconnected: 'Desconectado', netplayIntro: 'O Jogador 1 cria uma sala e compartilha um código de seis caracteres. O Jogador 2 digita o código e toca em Entrar. Ambos devem carregar exatamente a mesma ROM.', createRoom: 'Criar sala', playerOne: 'Serei o Jogador 1', joinRoom: 'Entrar em uma sala', playerTwo: 'Meu amigo será o Jogador 1', connectionStep: 'Etapa de conexão', connectionHelp: 'Siga as instruções na tela.', receivedCode: 'Código recebido', pasteCode: 'Cole aqui o código do seu amigo', connect: 'Conectar', yourCode: 'Seu código para compartilhar', copyCode: 'Copiar código', startTogether: 'Iniciar juntos', back: 'Voltar', disconnect: 'Desconectar', netplayWarning: 'Netplay experimental: usa sinalização PeerJS Cloud e serviços STUN/TURN compartilhados. A disponibilidade depende desses serviços e da sua rede; a sincronização pode apresentar travamentos e ainda não inclui rollback como Dolphin.', touchControls: 'Controles de toque', dpad: 'Controle direcional', up: 'Cima', left: 'Esquerda', right: 'Direita', down: 'Baixo', touchHint: 'Controle estilo Mega Drive: direcional, A/B/C, X/Y/Z, START e botões auxiliares.', footerInputs: 'Compatível com teclado, controle USB e toque.', footerAudio: 'O som começa após a primeira interação.', preferences: 'PREFERÊNCIAS', consoleSettings: 'Configurações do console', region: 'Região', regionAuto: 'Automática, conforme o cartucho', regionExport: 'Exportação (América / Europa)', japan: 'Japão', tvSystem: 'Sistema de TV', automatic: 'Automático', controller: 'Controle', sixButtons: '6 botões (A B C X Y Z)', threeButtons: '3 botões (A B C)', volume: 'Volume', sound: 'Som', emulatorAudio: 'Áudio do emulador', crtFilter: 'Filtro CRT', scanlineDesc: 'Linhas de varredura retrô', integerScale: 'Pixels nítidos', pixelDesc: 'Mantém as bordas nítidas ao ampliar', keyMapping: 'Mapeamento de teclas', keyMappingHint: 'Escolha um controle e pressione a tecla desejada. Escape cancela.', resetControls: 'Restaurar controles', saveSettings: 'Salvar ajustes', consoleActive: 'Console ativo', consoleReady: 'Console pronto', consoleOff: 'Console desligado', error: 'Erro', answerReceived: 'Cole a resposta do seu amigo', sendOffer: 'Etapa 1 · Envie o código da sala', sendOfferHelp: 'Copie seu código e envie ao amigo. Quando ele responder, cole a resposta no campo acima.', sendAnswer: 'Etapa 2 · Devolva seu código', sendAnswerHelp: 'Copie este código e envie ao anfitrião. Quando conectar, o Jogador 1 iniciará a partida.', joinStep: 'Etapa 1 · Cole o código da sala', joinHelp: 'Seu amigo deve criar uma sala e enviar o código. Cole aqui e toque em Conectar.', completeConnection: 'Concluir conexão', waitingConnection: 'Conectando…', connectedSameGame: 'Conectado · mesmo jogo', offerReady: 'Código da sala criado', responseReady: 'Resposta criada', pasteRoomCode: '1. Cole aqui o código enviado pelo Jogador 1', sendRoomCode: '1. Copie este código e envie ao Jogador 2', pasteAnswer: '2. Cole aqui a resposta do Jogador 2', sendAnswerCode: '2. Copie esta resposta e envie ao Jogador 1', sentCodeNext: 'Já enviei o código · continuar', hostStepSendOffer: 'Etapa 1 · Compartilhe o código da sala', hostSendOfferHelp: 'Toque em “Copiar código” e envie ao Jogador 2. Depois toque em “Continuar” para colar a resposta.', hostStepPasteAnswer: 'Etapa 2 · Cole a resposta do Jogador 2', hostPasteAnswerHelp: 'O Jogador 2 deve colar seu código, tocar em “Gerar resposta” e enviar a resposta de volta.', guestStepPasteOffer: 'Etapa 1 · Cole o código do Jogador 1', guestPasteOfferHelp: 'O Jogador 1 cria a sala e envia o código. Cole aqui e toque em “Gerar resposta”.', acceptRoomCode: 'Gerar resposta', applyAnswer: 'Conectar com a resposta', pasteAnswerPlaceholder: 'Cole aqui a resposta do Jogador 2', pasteRoomPlaceholder: 'Cole aqui o código enviado pelo Jogador 1', action_up: 'Cima', action_down: 'Baixo', action_left: 'Esquerda', action_right: 'Direita', action_a: 'Botão A', action_b: 'Botão B', action_c: 'Botão C', action_x: 'Botão X', action_y: 'Botão Y', action_z: 'Botão Z', action_start: 'Start', onlineModeTitle: 'Conexão simples por código', onlineModeIntro: 'O Jogador 1 cria uma sala e compartilha um código curto. O Jogador 2 digita o código; o emulador negocia a conexão automaticamente.', hostOnline: 'Criar sala online', joinOnline: 'Entrar', roomCodeLabel: 'Código da sala', copyRoomCode: 'Copiar código', roomCodeHint: 'Envie este código ao amigo. Ele deve digitá-lo no campo acima.', joinRoomCodePlaceholder: 'ABC123', player2AutoStart: 'Iniciar juntos', serverNotConfigured: 'As salas usam o PeerJS Cloud para trocar os dados de conexão. O emulador usa a configuração STUN/TURN padrão do PeerJS; algumas redes corporativas, móveis ou restritivas ainda podem bloquear a conexão.', action_mode: 'Mode'
  },
  fr: { statesButton: 'États', statesMenu: '💾 États sauvegardés', statesTitle: 'États sauvegardés', stateSlot: 'Emplacement', stateEmpty: 'Vide', stateSave: 'Sauvegarder', stateLoad: 'Charger', stateDelete: 'Supprimer', stateHint: 'Raccourcis : F5 sauvegarde dans le dernier emplacement utilisé et F8 le charge.', lowLatency: 'Mode faible latence', lowLatencyDesc: 'Utilise un tampon audio plus petit. Désactivez-le si vous entendez des craquements.', filterLibrary: 'Filtrer les cartouches…', closeDialog: 'Fermer', viewFullLibrary: 'Voir toute la bibliothèque', fullLibraryTitle: 'Bibliothèque complète', closeLibrary: 'Fermer la bibliothèque', loadedByYou: 'ROM chargée par vous', cartridgeMenu: 'CARTOUCHES INCLUSES', carouselHint: 'Utilisez les flèches pour changer de cartouche', prevCartridge: 'Cartouche précédente', nextCartridge: 'Cartouche suivante', loadYourRomsTitle: 'Vous avez vos propres ROM ?', loadYourRomsHint: 'Ouvrez des fichiers Mega Drive enregistrés sur votre téléphone ou ordinateur.', loadOwnRom: 'Charger votre ROM', touchSize: 'Taille de la manette', touchSizeHint: 'Ajustez la taille selon votre confort',
    controllerStyle: 'Style de manette', segaPad: 'Manette Mega Drive classique', arcadePad: 'Panneau arcade', arcadeTouchHint: 'Joystick arcade, boutons colorés et START/SELECT.', player2: 'JOUEUR 2', p2Off: 'OFF', p2Active: 'ACTIF', signalTitle: 'Signal', pageTitle: 'Botsebita Mega Drive Emulator', appTitle: 'Botsebita Mega Drive Emulator', appSubtitle: 'SEGA MEGA DRIVE · ÉDITION WEB · V1.10', language: 'Langue', loadRom: 'Charger une ROM', settings: '⚙ Réglages', library: 'Bibliothèque', searchPlaceholder: 'Rechercher un jeu…', preloaded: 'CARTOUCHE PRÉCHARGÉE', bundledRom: 'Cartouche préchargée', autoStart: 'Démarrage automatique', homebrew: 'HOMEBREW GRATUIT', homebrewMIT: 'Homebrew · MIT', includedBrowser: 'Inclus dans le navigateur', recent: 'RÉCENTS', recentEmpty: 'Les ROM chargées apparaîtront ici.', romNotice: 'La ROM préchargée est commerciale et a été fournie avec le projet. Ne la publiez que si vous avez le droit de la redistribuer. Minesweeper MD est un homebrew sous licence MIT.', credits: 'Cœur de l’émulateur : Monte Ohrt · Licence MIT', nowPlaying: 'EN COURS DE LECTURE', gameScreen: 'Écran de la console Mega Drive', paused: 'JEU EN PAUSE', resume: '▶ Reprendre', restartConsole: '↻ Redémarrer la console', powerOff: 'Éteindre la console', menu: 'Menu', restart: 'Redémarrer', fullscreen: 'Plein écran', keyboardHint: 'Flèches · Z X C · Entrée', loadingBundled: 'Chargement du jeu préchargé…', playFriend: 'Jouer en ligne avec un ami', peerToPeer: 'PeerJS Cloud · code de salle', disconnected: 'Déconnecté', netplayIntro: 'Le joueur 1 crée une salle et partage un code de six caractères. Le joueur 2 le saisit puis choisit Rejoindre. Les deux joueurs doivent charger exactement la même ROM.', createRoom: 'Créer une salle', playerOne: 'Je serai le joueur 1', joinRoom: 'Rejoindre une salle', playerTwo: 'Mon ami sera le joueur 1', connectionStep: 'Étape de connexion', connectionHelp: 'Suivez les instructions à l’écran.', receivedCode: 'Code reçu', pasteCode: 'Collez ici le code de votre ami', connect: 'Connecter', yourCode: 'Votre code à partager', copyCode: 'Copier le code', startTogether: 'Démarrer ensemble', back: 'Retour', disconnect: 'Déconnecter', netplayWarning: 'Netplay expérimental : utilise la signalisation PeerJS Cloud et des services STUN/TURN partagés. La disponibilité dépend de ces services et de votre réseau ; la synchronisation peut saccader et ne comprend pas encore le rollback de Dolphin.', touchControls: 'Commandes tactiles', dpad: 'Croix directionnelle', up: 'Haut', left: 'Gauche', right: 'Droite', down: 'Bas', touchHint: 'Manette style Mega Drive : croix, A/B/C, X/Y/Z, START et boutons auxiliaires.', footerInputs: 'Compatible clavier, manette USB et commandes tactiles.', footerAudio: 'Le son démarre après la première interaction.', preferences: 'PRÉFÉRENCES', consoleSettings: 'Réglages de la console', region: 'Région', regionAuto: 'Automatique selon la cartouche', regionExport: 'Export (Amérique / Europe)', japan: 'Japon', tvSystem: 'Système TV', automatic: 'Automatique', controller: 'Manette', sixButtons: '6 boutons (A B C X Y Z)', threeButtons: '3 boutons (A B C)', volume: 'Volume', sound: 'Son', emulatorAudio: 'Audio de l’émulateur', crtFilter: 'Filtre CRT', scanlineDesc: 'Lignes de balayage rétro', integerScale: 'Pixels nets', pixelDesc: 'Garde des contours nets lors de l’agrandissement', keyMapping: 'Configuration des touches', keyMappingHint: 'Choisissez une commande, puis appuyez sur la touche. Échap annule.', resetControls: 'Réinitialiser les commandes', saveSettings: 'Enregistrer les réglages', consoleActive: 'Console active', consoleReady: 'Console prête', consoleOff: 'Console éteinte', error: 'Erreur', answerReceived: 'Collez la réponse de votre ami', sendOffer: 'Étape 1 · Envoyer le code de salle', sendOfferHelp: 'Copiez votre code et envoyez-le à votre ami. Collez sa réponse dans le champ ci-dessus.', sendAnswer: 'Étape 2 · Renvoyer votre code', sendAnswerHelp: 'Copiez ce code et envoyez-le à l’hôte. Une fois connectés, le joueur 1 démarrera la partie.', joinStep: 'Étape 1 · Coller le code de salle', joinHelp: 'Votre ami doit créer une salle et vous envoyer son code. Collez-le ici et appuyez sur Connecter.', completeConnection: 'Terminer la connexion', waitingConnection: 'Connexion…', connectedSameGame: 'Connecté · même jeu', offerReady: 'Code de salle créé', responseReady: 'Réponse créée', pasteRoomCode: '1. Collez ici le code envoyé par le joueur 1', sendRoomCode: '1. Copiez ce code et envoyez-le au joueur 2', pasteAnswer: '2. Collez ici la réponse du joueur 2', sendAnswerCode: '2. Copiez cette réponse et renvoyez-la au joueur 1', sentCodeNext: 'Code envoyé · continuer', hostStepSendOffer: 'Étape 1 · Partager le code de la salle', hostSendOfferHelp: 'Cliquez sur « Copier le code » et envoyez-le au joueur 2. Cliquez ensuite sur « Continuer » pour coller sa réponse.', hostStepPasteAnswer: 'Étape 2 · Collez la réponse du joueur 2', hostPasteAnswerHelp: 'Le joueur 2 doit coller votre code, cliquer sur « Générer la réponse » et vous la renvoyer.', guestStepPasteOffer: 'Étape 1 · Collez le code du joueur 1', guestPasteOfferHelp: 'Le joueur 1 crée la salle et vous envoie le code. Collez-le ici et cliquez sur « Générer la réponse ».', acceptRoomCode: 'Générer la réponse', applyAnswer: 'Se connecter avec la réponse', pasteAnswerPlaceholder: 'Collez ici la réponse du joueur 2', pasteRoomPlaceholder: 'Collez ici le code envoyé par le joueur 1', action_up: 'Haut', action_down: 'Bas', action_left: 'Gauche', action_right: 'Droite', action_a: 'Bouton A', action_b: 'Bouton B', action_c: 'Bouton C', action_x: 'Bouton X', action_y: 'Bouton Y', action_z: 'Bouton Z', action_start: 'Start', onlineModeTitle: 'Connexion simple par code', onlineModeIntro: 'Le joueur 1 crée une salle et partage un code court. Le joueur 2 le saisit ; l’émulateur négocie automatiquement la connexion.', hostOnline: 'Créer une salle en ligne', joinOnline: 'Rejoindre', roomCodeLabel: 'Code de salle', copyRoomCode: 'Copier le code', roomCodeHint: 'Envoyez ce code à votre ami. Il le saisit dans le champ ci-dessus.', joinRoomCodePlaceholder: 'ABC123', player2AutoStart: 'Démarrer ensemble', serverNotConfigured: 'Les salles utilisent PeerJS Cloud pour échanger les informations de connexion. L’émulateur utilise la configuration STUN/TURN par défaut de PeerJS ; certains réseaux d’entreprise, mobiles ou restrictifs peuvent bloquer la connexion.', action_mode: 'Mode'
  }
};
let currentLanguage = 'es';
function t(key) { return LANGUAGE_PACKS[currentLanguage]?.[key] ?? LANGUAGE_PACKS.es[key] ?? key; }
function setLanguage(language) {
  currentLanguage = LANGUAGE_PACKS[language] ? language : 'es';
  document.documentElement.lang = currentLanguage;
  document.title = t('pageTitle');
  for (const element of document.querySelectorAll('[data-i18n]')) {
    const value = t(element.dataset.i18n);
    if (value) element.textContent = value;
  }
  for (const element of document.querySelectorAll('[data-i18n-placeholder]')) element.placeholder = t(element.dataset.i18nPlaceholder);
  for (const element of document.querySelectorAll('[data-i18n-aria]')) element.setAttribute('aria-label', t(element.dataset.i18nAria));
  for (const element of document.querySelectorAll('[data-i18n-title]')) element.title = t(element.dataset.i18nTitle);
  const picker = $('#language-select');
  if (picker) picker.value = currentLanguage;
  try { localStorage.setItem('botsebita-md-language', currentLanguage); } catch {}
  if (activeGame) setStatus(t('consoleActive'));
  renderKeyBindings();
  applyControllerStyle();
  void updatePlayer2Indicator();
  const netplayState = $('#netplay-state');
  if (netplayState?.dataset.state === 'idle') netplayState.textContent = t('disconnected');
  else if (netplayState?.dataset.state === 'connected') netplayState.textContent = t('connectedSameGame');
  const autoStatus = $('#netplay-auto-status');
  if (autoStatus?.dataset.state === 'idle') autoStatus.textContent = t('disconnected');
  const configNote = $('#netplay-server-config-note');
  if (configNote) configNote.textContent = t('serverNotConfigured');
}
function initLanguage() {
  let saved = 'es';
  try { saved = localStorage.getItem('botsebita-md-language') || 'es'; } catch {}
  setLanguage(saved);
}
const heldKeys = new Set();
const heldPointers = new Map();
const arcadeStickPointers = new Set();
let settings = loadSettings();
let session = null;
let activeGame = null;
let activeId = null;
let paused = false;
let waitingForBinding = null;
let settingsBeforeOpen = null;
let resizeObserver = null;
let currentCanvasSize = '';
let mobileFullscreenActive = false;
let mobileFullscreenNative = false;
let touchSizeHomeMarker = null;
let controllerHomeMarker = null;
let cartridgeIndex = 0;
let recentCartridgeRows = [];
let rtcPeer = null;
let rtcChannel = null;
let rtcStateChannel = null;
let netplayRole = null;
let netplayTicker = null;
let netplaySnapshotTicker = null;
let netplaySnapshotBusy = false;
let netplaySnapshotSeq = 0;
let netplaySnapshotQueue = Promise.resolve();
let netplayPlaying = false;
let netplayStartPending = false;
let netplayStartId = 0;
let netplayStartSnapshotId = 0;
let snapshotIncoming = null;
let netplayRemoteReady = false;
let netplaySignature = null;
let localInputSeq = 0;
let remoteInputSeq = -1;
let player2StatsBusy = false;
let netplaySignalRtt = null;
let netplayLastPingAt = 0;
let netplayLastPingId = 0;
let netplayAutoRoomCode = "";
let peerJsPeer = null;
let peerJsConnections = { input: null, state: null };
let netplayConnectionTimeout = null;

function safeSaveSettings() {
  try { saveSettings(settings); } catch { /* Private browsing may block storage; gameplay can continue. */ }
}

function setStatus(message, state = 'ready') {
  $('#status-text').textContent = message;
  $('#status-pill').dataset.state = state;
}

function renderPlayer2Indicator(connected, level = 0, rtt = null) {
  const indicator = $('#player2-indicator');
  if (!indicator) return;
  const quality = connected ? Math.max(1, Math.min(5, level || 3)) : 0;
  indicator.dataset.state = connected ? 'connected' : 'off';
  indicator.dataset.quality = String(quality);
  $('#player2-connection-text').textContent = t(connected ? 'p2Active' : 'p2Off');
  const bars = $('#player2-signal');
  bars.dataset.level = String(quality);
  bars.title = connected && Number.isFinite(rtt) ? `${t('signalTitle')}: ${Math.round(rtt)} ms` : `${t('signalTitle')}: ${connected ? '—' : t('p2Off')}`;
  indicator.setAttribute('aria-label', `${t('player2')} ${t(connected ? 'p2Active' : 'p2Off')}${connected && Number.isFinite(rtt) ? `, ${Math.round(rtt)} ms` : ''}`);

  // Tiny status mirrors the same connection inside the game's fullscreen overlay,
  // while keeping the classic POWER lamp for its retro look.
  const mini = $('#fullscreen-player2-indicator');
  const miniText = $('#fullscreen-player2-connection-text');
  const miniBars = $('#fullscreen-player2-signal');
  if (mini && miniText && miniBars) {
    mini.dataset.state = connected ? 'connected' : 'off';
    mini.dataset.quality = String(quality);
    miniText.textContent = connected ? 'ON' : 'OFF';
    miniBars.dataset.level = String(quality);
    miniBars.title = bars.title;
    mini.setAttribute('aria-label', `${t('player2')} ${t(connected ? 'p2Active' : 'p2Off')}${connected && Number.isFinite(rtt) ? `, ${Math.round(rtt)} ms` : ''}`);
  }
}

async function updatePlayer2Indicator() {
  const connected = !!(netplayRemoteReady && rtcChannel?.readyState === 'open' && rtcStateChannel?.readyState === 'open');
  if (!connected) { renderPlayer2Indicator(false); return; }
  if (player2StatsBusy) return;
  player2StatsBusy = true;
  let level = 3;
  let rtt = Number.isFinite(netplaySignalRtt) ? netplaySignalRtt : null;
  try {
    if (!Number.isFinite(rtt) && rtcPeer?.getStats) {
      const peerAtStart = rtcPeer;
      const stats = await peerAtStart.getStats();
      for (const report of stats.values()) {
        if (report.type === 'candidate-pair' && (report.selected || report.nominated || report.state === 'succeeded') && Number.isFinite(report.currentRoundTripTime)) {
          rtt = report.currentRoundTripTime * 1000;
          break;
        }
      }
    }
    if (Number.isFinite(rtt)) level = rtt < 45 ? 5 : rtt < 85 ? 4 : rtt < 145 ? 3 : rtt < 230 ? 2 : 1;
  } catch { /* Keep a conservative, connection-based estimate if getStats is unavailable. */ }
  const stillConnected = !!(netplayRemoteReady && rtcChannel?.readyState === 'open' && rtcStateChannel?.readyState === 'open');
  renderPlayer2Indicator(stillConnected, stillConnected ? level : 0, stillConnected ? rtt : null);
  player2StatsBusy = false;
}

function setMessage(message, isError = false) {
  $('#message-line').textContent = message;
  $('#message-line').classList.toggle('error', isError);
  if (isError) setStatus('Error', 'error');
  else if ($('#status-pill').dataset.state !== 'loading') setStatus(activeGame ? t('consoleActive') : t('consoleReady'));
}

function drawLayout() {
  if (!canvas || !stage) return;
  const bounds = $('#screen-slot').getBoundingClientRect();
  const availW = Math.max(40, bounds.width - 6);
  const availH = Math.max(40, bounds.height - 6);
  const sourceW = canvas.width || 320;
  const sourceH = canvas.height || 224;
  // Fit the active Mega Drive frame to the largest possible size inside the black screen.
  // The previous integer floor could collapse the display to 1x on tall/wide layouts.
  const scale = Math.min(availW / sourceW, availH / sourceH);
  canvas.style.width = `${Math.max(2, Math.round(sourceW * scale))}px`;
  canvas.style.height = `${Math.max(2, Math.round(sourceH * scale))}px`;
  canvas.style.imageRendering = settings.integerScale ? 'pixelated' : 'auto';
}

function resetHeldInputs() {
  heldKeys.clear();
  session?.setKeyboard(0);
  for (const button of document.querySelectorAll('.pad-button.is-held')) button.classList.remove('is-held');
  heldPointers.clear();
  arcadeStickPointers.clear();
  if (session) session.setTouch(0);
  updateArcadeStickPosition();
}

function showGame(loaded, id = null) {
  activeGame = loaded;
  activeId = id;
  paused = false;
  pauseOverlay.hidden = true;
  $('#playing-title').textContent = loaded.title;
  $('#pause-title').textContent = loaded.title;
  $('#power-led').classList.add('on');
  $('#pause-button').disabled = false;
  $('#restart-button').disabled = false;
  $('#states-button').disabled = false;
  $('#pause-button').innerHTML = `Ⅱ <span>${t('menu')}</span>`;
  resetHeldInputs();
  const info = loaded.info;
  const details = [
    info.title ? `Cabecera: ${info.title}` : 'Cartucho Mega Drive',
    info.region === 'japan' ? 'Japón' : info.region === 'export' ? (info.tv === 'pal' ? 'Europa' : 'América') : null,
    info.tv?.toUpperCase(),
    info.saveRam ? 'SRAM' : null,
  ].filter(Boolean).join(' · ');
  setStatus('Consola activa');
  setMessage(`${loaded.title} cargado. ${details}`);
  $('#bundled-game').classList.toggle('selected', id === 'snow-bros');
  $('#homebrew-game').classList.toggle('selected', id === 'mines');
  $('#rangers-game').classList.toggle('selected', id === 'power-rangers');
  $('#sf2-game').classList.toggle('selected', id === 'street-fighter-ii-sce');
  $('#worms-game').classList.toggle('selected', id === 'worms');
  $('#sor3-game').classList.toggle('selected', id === 'streets-of-rage-3');
  $('#toejam-game').classList.toggle('selected', id === 'toejam-earl-funkotron');
  $('#extra-game').classList.toggle('selected', EXTRA_GAMES.some((game) => game.id === id));
  renderRecentList();
  drawLayout();
}

async function openRecentCart(cart) {
  if (!session || !cart) return;
  if (rtcPeer) disconnectNetplay();
  try {
    const stored = await getCartBytes(cart.id);
    if (!stored) throw new Error('Esa ROM ya no está guardada en este navegador. Vuelve a cargarla.');
    const loaded = session.loadBytes(new Uint8Array(stored.bytes), cart.fileName);
    showGame(loaded, cart.id);
    $('#bundled-game').classList.remove('selected');
    $('#homebrew-game').classList.remove('selected');
    $('#rangers-game').classList.remove('selected');
    $('#sf2-game').classList.remove('selected');
    $('#worms-game').classList.remove('selected');
    $('#sor3-game').classList.remove('selected');
    $('#toejam-game').classList.remove('selected');
    $('#extra-game').classList.remove('selected');
    setMessage(`${loaded.title || cart.fileName} cargado desde tus ROM recientes.`);
  } catch (error) { setMessage(errorText(error), true); }
}

async function openBundled(id) {
  if (!session) return;
  if (rtcPeer) disconnectNetplay();
  const bundled = BUNDLED_GAMES.find((entry) => entry.id === id);
  if (!bundled) return;
  setStatus('Cargando juego…', 'loading');
  setMessage('Leyendo el cartucho incluido…');
  try {
    const url = new URL(bundled.file.replace(/^\/+/, ''), document.baseURI);
    const response = await fetch(url);
    if (!response.ok) throw new Error('No se encontró el juego incluido en el paquete.');
    const bytes = new Uint8Array(await response.arrayBuffer());
    showGame({ ...session.loadBytes(bytes, bundled.file.split('/').pop() || `${bundled.title}.bin`), title: bundled.title }, bundled.id);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'No se pudo cargar el juego incluido.', true);
  }
}

function openPauseMenu() {
  if (!activeGame) return;
  paused = !paused;
  session?.setPaused(paused);
  resetHeldInputs();
  pauseOverlay.hidden = !paused;
  $('#pause-button').innerHTML = paused ? `<span>${t('resume')}</span>` : `Ⅱ <span>${t('menu')}</span>`;
}

function closeGame() {
  if (rtcPeer) disconnectNetplay();
  session?.powerOff();
  activeGame = null;
  activeId = null;
  paused = false;
  pauseOverlay.hidden = true;
  $('#playing-title').textContent = 'Consola apagada';
  $('#power-led').classList.remove('on');
  $('#pause-button').disabled = true;
  $('#restart-button').disabled = true;
  $('#states-button').disabled = true;
  $('#pause-button').innerHTML = `Ⅱ <span>${t('menu')}</span>`;
  setMessage('Consola apagada. Selecciona un juego de la biblioteca o carga una ROM.');
  resetHeldInputs();
}

function errorText(error) {
  return error instanceof Error ? error.message : 'No se pudo abrir la ROM.';
}

async function openRom(file) {
  if (!session || !file) return;
  if (rtcPeer) disconnectNetplay();
  setStatus('Leyendo ROM…', 'loading');
  setMessage(`Abriendo ${file.name}…`);
  try {
    const loaded = await session.loadFile(file);
    showGame(loaded, null);
    $('#bundled-game').classList.remove('selected');
    $('#homebrew-game').classList.remove('selected');
    $('#rangers-game').classList.remove('selected');
    $('#sf2-game').classList.remove('selected');
    $('#worms-game').classList.remove('selected');
    $('#sor3-game').classList.remove('selected');
    $('#toejam-game').classList.remove('selected');
    $('#extra-game').classList.remove('selected');
    if (!file.name.toLowerCase().endsWith('.zip')) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const fingerprint = cartFingerprint(bytes);
      activeId = fingerprint;
      await saveRecent(bytes, file.name, loaded);
      const rows = await getRecentCarts();
      recentCartridgeRows = rows;
      const index = rows.findIndex((cart) => cart.id === fingerprint);
      if (index >= 0) setCartridge(BUNDLED_GAMES.length + index, false);
    }
  } catch (error) {
    setMessage(errorText(error), true);
  }
}

function cartFingerprint(bytes) {
  let hash = 2166136261;
  const step = Math.max(1, Math.floor(bytes.length / 8192));
  for (let i = 0; i < bytes.length; i += step) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 16777619);
  }
  return `${(hash >>> 0).toString(16)}-${bytes.length}`;
}

let cartDbPromise = null;
const idbRequest = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});
const RECENT_LIMIT = 12;

/**
 * One shared IndexedDB connection (v2). ROM bytes live apart from their metadata so listing the
 * recent ROMs never loads megabytes of cartridge data; v1 databases are migrated on first open.
 */
function openCartDatabase() {
  if (cartDbPromise) return cartDbPromise;
  cartDbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB no disponible'));
    const request = indexedDB.open('retro-genesis', 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      const tx = request.transaction;
      if (!db.objectStoreNames.contains('cart-meta')) db.createObjectStore('cart-meta', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('cart-bytes')) db.createObjectStore('cart-bytes', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('states')) db.createObjectStore('states', { keyPath: 'key' });
      if (db.objectStoreNames.contains('carts')) {
        tx.objectStore('carts').openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const { bytes, ...meta } = cursor.value;
            tx.objectStore('cart-meta').put({ ...meta, size: bytes?.byteLength || 0 });
            tx.objectStore('cart-bytes').put({ id: cursor.value.id, bytes });
            cursor.continue();
          } else {
            db.deleteObjectStore('carts');
          }
        };
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => { db.close(); cartDbPromise = null; };
      resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
  cartDbPromise.catch(() => { cartDbPromise = null; });
  return cartDbPromise;
}

async function saveRecent(bytes, fileName, loaded) {
  try {
    const db = await openCartDatabase();
    const id = cartFingerprint(bytes);
    const title = loaded.info.title || fileName.replace(/\.[^.]+$/, '').replace(/_/g, ' ');
    const meta = {
      id, title, fileName, internalTitle: loaded.info.title || null,
      region: loaded.info.region || null, tv: loaded.info.tv || null,
      size: bytes.length, addedAt: Date.now(), lastPlayed: Date.now(),
    };
    const known = await idbRequest(db.transaction('cart-meta').objectStore('cart-meta').getAll());
    const stale = known.filter((row) => row.id !== id).sort((a, b) => b.lastPlayed - a.lastPlayed).slice(RECENT_LIMIT - 1);
    await new Promise((resolve, reject) => {
      const tx = db.transaction(['cart-meta', 'cart-bytes'], 'readwrite');
      tx.objectStore('cart-meta').put(meta);
      tx.objectStore('cart-bytes').put({ id, bytes: bytes.slice().buffer });
      for (const row of stale) {
        tx.objectStore('cart-meta').delete(row.id);
        tx.objectStore('cart-bytes').delete(row.id);
      }
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    renderRecentList();
  } catch { /* Recently loaded ROMs are optional. */ }
}

async function getRecentCarts() {
  try {
    const db = await openCartDatabase();
    const rows = await idbRequest(db.transaction('cart-meta').objectStore('cart-meta').getAll());
    return rows.sort((a, b) => b.lastPlayed - a.lastPlayed).slice(0, RECENT_LIMIT);
  } catch { return []; }
}

async function getCartBytes(id) {
  const db = await openCartDatabase();
  return idbRequest(db.transaction('cart-bytes').objectStore('cart-bytes').get(id));
}

async function renderRecentList() {
  const container = $('#recent-games');
  const rows = await getRecentCarts();
  recentCartridgeRows = rows;
  container.replaceChildren();
  setCartridge(cartridgeIndex, false);
  if (!rows.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-recent';
    empty.textContent = t('recentEmpty');
    container.append(empty);
    return;
  }
  for (const cart of rows) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recent-entry';
    const title = document.createElement('strong');
    title.textContent = cart.internalTitle || cart.title || cart.fileName;
    const filename = document.createElement('small');
    filename.textContent = cart.fileName;
    button.append(title, filename);
    button.addEventListener('click', () => {
      const recentIndex = recentCartridgeRows.findIndex((entry) => entry.id === cart.id);
      if (recentIndex >= 0) setCartridge(BUNDLED_GAMES.length + recentIndex, true);
      else void openRecentCart(cart);
    });
    container.append(button);
  }
}

function setControllerStatus(text) {
  const container = $('#controller-status');
  const icon = document.createElement('span');
  icon.className = 'controller-icon';
  icon.textContent = '⌘';
  container.replaceChildren(icon, document.createTextNode(text || 'Flechas · Z X C · Enter'));
}

function renderKeyBindings() {
  const container = $('#key-bindings');
  container.replaceChildren();
  for (const action of actionNames) {
    const wrapper = document.createElement('div');
    wrapper.className = 'key-binding';
    const label = document.createElement('span');
    label.textContent = t(`action_${action}`) || ACTION_LABEL[action];
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = waitingForBinding === action ? (currentLanguage === 'en' ? 'Press a key…' : currentLanguage === 'pt' ? 'Pressione uma tecla…' : currentLanguage === 'fr' ? 'Appuyez sur une touche…' : 'Pulsa tecla…') : keyLabel(settings.keys[action] || '—');
    button.classList.toggle('listening', waitingForBinding === action);
    button.addEventListener('click', () => {
      waitingForBinding = action;
      renderKeyBindings();
      $('#binding-hint').textContent = currentLanguage === 'en' ? 'Press the key to assign. Escape cancels.' : currentLanguage === 'pt' ? 'Pressione a tecla desejada. Escape cancela.' : currentLanguage === 'fr' ? 'Appuyez sur la touche à attribuer. Échap annule.' : 'Pulsa la tecla que quieres asignar. Escape cancela.';
    });
    wrapper.append(label, button);
    container.append(wrapper);
  }
}

function applyControllerStyle() {
  const shell = $('.controller-shell');
  shell?.classList.toggle('arcade-controller', settings.controllerStyle === 'arcade');
  const hint = $('.touch-hint');
  if (hint) hint.textContent = t(settings.controllerStyle === 'arcade' ? 'arcadeTouchHint' : 'touchHint');
  const wordmark = $('.controller-wordmark');
  if (wordmark) wordmark.textContent = settings.controllerStyle === 'arcade' ? '' : 'SEGA';
  updateArcadeStickPosition();
}

function applySettingsToUi() {
  $('#setting-region').value = settings.region;
  $('#setting-tv').value = settings.tv;
  $('#setting-pad').value = settings.pad;
  $('#setting-controller-style').value = settings.controllerStyle || 'sega';
  $('.controller-shell')?.classList.toggle('three-button-pad', settings.pad === 'three');
  applyControllerStyle();
  $('#setting-volume').value = String(Math.round(settings.volume * 100));
  $('#volume-value').textContent = `${Math.round(settings.volume * 100)}%`;
  $('#setting-sound').checked = settings.sound;
  $('#setting-crt').checked = settings.crt;
  $('#setting-integer').checked = settings.integerScale;
  $('#setting-latency').checked = settings.lowLatency !== false;
  updateTouchScale(settings.touchScale ?? 100);
  $('#scanlines').hidden = !settings.crt;
  renderKeyBindings();
  drawLayout();
}

function updateSetting(key, value) {
  settings = { ...settings, [key]: value };
  safeSaveSettings();
  session?.applyConsole(settings.region, settings.tv, settings.pad);
  session?.setSound(settings.sound, settings.volume);
  session?.setLowLatency(settings.lowLatency !== false);
  applySettingsToUi();
}

function showSettings() {
  settingsBeforeOpen = { ...settings, keys: { ...settings.keys } };
  waitingForBinding = null;
  applySettingsToUi();
  if (!settingsDialog.open) settingsDialog.showModal();
}

function handleKey(event) {
  if (waitingForBinding) {
    event.preventDefault();
    event.stopPropagation();
    if (event.code === 'Escape') {
      waitingForBinding = null;
      renderKeyBindings();
      return;
    }
    const action = waitingForBinding;
    const keys = { ...settings.keys };
    for (const name of actionNames) if (keys[name] === event.code) keys[name] = keys[action];
    keys[action] = event.code;
    settings = { ...settings, keys };
    waitingForBinding = null;
    safeSaveSettings();
    renderKeyBindings();
    return;
  }
  if (event.type === 'keydown' && event.code === 'Escape' && !event.repeat && !event.target.closest?.('input,select,textarea,button')) {
    if (settingsDialog.open) return;
    if (activeGame) {
      event.preventDefault();
      openPauseMenu();
    }
    return;
  }
  if (event.type === 'keydown' && !event.repeat && (event.code === 'F5' || event.code === 'F8') && activeGame && !settingsDialog.open && !$('#states-dialog').open && !$('#library-dialog').open) {
    event.preventDefault();
    if (event.code === 'F5') void saveStateToSlot(activeStateSlot);
    else void loadStateFromSlot(activeStateSlot);
    return;
  }
  if (event.type === 'keydown' && event.altKey && event.code === 'Enter') {
    event.preventDefault();
    toggleFullscreen();
    return;
  }
  if (settingsDialog.open || event.target.closest?.('input,select,textarea,button,[contenteditable="true"]') || event.ctrlKey || event.metaKey || event.altKey) return;
  const bound = Object.values(settings.keys).includes(event.code);
  if (!bound) return;
  event.preventDefault();
  if (event.type === 'keydown') heldKeys.add(event.code);
  else heldKeys.delete(event.code);
  session?.setKeyboard(buttonsFromCodes(heldKeys, settings.keys));
}

function isMobileTouchMode() {
  return window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
}

function enterMobileFullscreen(nativeFullscreen = false) {
  if (mobileFullscreenActive) return;
  mobileFullscreenActive = true;
  mobileFullscreenNative = nativeFullscreen;
  stage.classList.add('mobile-fullscreen-active');
  document.body.classList.add('mobile-game-fullscreen');
  const controls = $('#mobile-fullscreen-controls');
  controls.hidden = false;
  const sizeControl = $('.touch-size-control');
  const controller = $('.controller-shell');
  if (sizeControl && sizeControl.parentNode) {
    touchSizeHomeMarker = document.createComment('touch-size-home');
    sizeControl.parentNode.insertBefore(touchSizeHomeMarker, sizeControl);
    $('#mobile-fs-size-slot').append(sizeControl);
  }
  if (controller && controller.parentNode) {
    controllerHomeMarker = document.createComment('controller-home');
    controller.parentNode.insertBefore(controllerHomeMarker, controller);
    $('#mobile-fs-pad-slot').append(controller);
  }
  drawLayout();
}

function leaveMobileFullscreen() {
  if (!mobileFullscreenActive) return;
  if (mobileFullscreenNative) { try { screen.orientation?.unlock?.(); } catch {} }
  const sizeControl = $('#mobile-fs-size-slot .touch-size-control');
  const controller = $('#mobile-fs-pad-slot .controller-shell');
  if (sizeControl && touchSizeHomeMarker?.parentNode) touchSizeHomeMarker.replaceWith(sizeControl);
  if (controller && controllerHomeMarker?.parentNode) controllerHomeMarker.replaceWith(controller);
  touchSizeHomeMarker = null;
  controllerHomeMarker = null;
  $('#mobile-fullscreen-controls').hidden = true;
  stage.classList.remove('mobile-fullscreen-active');
  document.body.classList.remove('mobile-game-fullscreen');
  mobileFullscreenActive = false;
  mobileFullscreenNative = false;
  drawLayout();
}

async function exitMobileFullscreen() {
  if (mobileFullscreenNative && document.fullscreenElement === stage) {
    try { await document.exitFullscreen(); } catch { /* The CSS fallback still allows the user to exit. */ }
  }
  leaveMobileFullscreen();
}

async function toggleFullscreen() {
  if (isMobileTouchMode()) {
    if (mobileFullscreenActive) {
      await exitMobileFullscreen();
      return;
    }
    try {
      if (stage?.requestFullscreen) {
        await stage.requestFullscreen({ navigationUI: 'hide' });
        if (document.fullscreenElement === stage) {
          try { void screen.orientation?.lock?.('landscape')?.catch?.(() => {}); } catch {}
          enterMobileFullscreen(true);
          return;
        }
      }
    } catch { /* Some mobile browsers and embedded game frames reject element fullscreen. */ }
    // CSS fullscreen fallback for iOS Safari and restrictive itch.io embeds.
    enterMobileFullscreen(false);
    return;
  }
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await stage?.requestFullscreen();
  } catch { /* Fullscreen can be blocked by the browser or the itch.io embed. */ }
  drawLayout();
}

document.addEventListener('fullscreenchange', () => {
  if (mobileFullscreenActive && mobileFullscreenNative && document.fullscreenElement !== stage) leaveMobileFullscreen();
  drawLayout();
});

function updateArcadeStickPosition() {
  const hardware = $('.controller-shell .arcade-stick-hardware');
  if (!hardware) return;
  const active = new Set(heldPointers.values());
  let x = (active.has('right') ? 1 : 0) - (active.has('left') ? 1 : 0);
  let y = (active.has('down') ? 1 : 0) - (active.has('up') ? 1 : 0);
  const magnitude = Math.hypot(x, y);
  if (magnitude > 1) { x /= magnitude; y /= magnitude; }
  const travel = (hardware.clientWidth || 100) * 0.17;
  const travelX = x * travel;
  const travelY = y * travel;
  const length = Math.hypot(travelX, travelY);
  const angle = length > 0 ? (Math.atan2(-travelX, travelY) * 180) / Math.PI : 0;
  hardware.style.setProperty('--stick-x', `${travelX.toFixed(1)}px`);
  hardware.style.setProperty('--stick-y', `${travelY.toFixed(1)}px`);
  hardware.style.setProperty('--stick-len', `${length.toFixed(1)}px`);
  hardware.style.setProperty('--stick-angle', `${angle.toFixed(1)}deg`);
  hardware.dataset.direction = x === 0 && y === 0 ? 'center' : `${y < 0 ? 'up' : y > 0 ? 'down' : ''}${x < 0 ? 'left' : x > 0 ? 'right' : ''}`;
}

const ARCADE_DIRECTIONS = ['up', 'down', 'left', 'right'];
function clearArcadePointerDirections(pointerId) {
  const prefix = `arcade:${pointerId}:`;
  for (const key of [...heldPointers.keys()]) {
    if (typeof key === 'string' && key.startsWith(prefix)) heldPointers.delete(key);
  }
}
function getArcadeDirectionsAtPoint(event, dpad) {
  const rect = dpad.getBoundingClientRect();
  const dx = (event.clientX - (rect.left + rect.width / 2)) / Math.max(1, rect.width * 0.46);
  const dy = (event.clientY - (rect.top + rect.height / 2)) / Math.max(1, rect.height * 0.46);
  const ax = Math.abs(dx), ay = Math.abs(dy);
  if (Math.hypot(dx, dy) < 0.16) return [];
  const actions = [];
  if (ax > ay * 2.414) actions.push(dx < 0 ? 'left' : 'right');
  else if (ay > ax * 2.414) actions.push(dy < 0 ? 'up' : 'down');
  else {
    actions.push(dy < 0 ? 'up' : 'down');
    actions.push(dx < 0 ? 'left' : 'right');
  }
  return actions;
}
function applyArcadeStickPoint(pointerId, event, dpad) {
  clearArcadePointerDirections(pointerId);
  for (const action of getArcadeDirectionsAtPoint(event, dpad)) {
    heldPointers.set(`arcade:${pointerId}:${action}`, action);
  }
  const activeDirections = new Set(heldPointers.values());
  dpad.querySelectorAll('[data-action]').forEach((button) => button.classList.toggle('is-held', activeDirections.has(button.dataset.action)));
  session?.setTouch(buttonsFromActions(heldPointers.values()));
  updateArcadeStickPosition();
}
function releaseArcadeStickPointer(pointerId, dpad) {
  if (!arcadeStickPointers.has(pointerId)) return;
  arcadeStickPointers.delete(pointerId);
  clearArcadePointerDirections(pointerId);
  if (dpad) {
    const activeDirections = new Set(heldPointers.values());
    dpad.querySelectorAll('[data-action]').forEach((button) => button.classList.toggle('is-held', activeDirections.has(button.dataset.action)));
  }
  session?.setTouch(buttonsFromActions(heldPointers.values()));
  updateArcadeStickPosition();
}

function bindTouchControls() {
  for (const button of document.querySelectorAll('[data-action]')) {
    const action = button.dataset.action;
    const isArcadeDirection = () => ARCADE_DIRECTIONS.includes(action) && !!button.closest('.controller-shell.arcade-controller');
    button.addEventListener('pointerdown', (event) => {
      if (isArcadeDirection()) return; // The parent joystick handles directional gestures in arcade mode.
      event.preventDefault();
      try { button.setPointerCapture(event.pointerId); } catch {}
      heldPointers.set(event.pointerId, action);
      button.classList.add('is-held');
      session?.setTouch(buttonsFromActions(heldPointers.values()));
      updateArcadeStickPosition();
    });
    const release = (event) => {
      if (isArcadeDirection()) return;
      heldPointers.delete(event.pointerId);
      button.classList.remove('is-held');
      session?.setTouch(buttonsFromActions(heldPointers.values()));
      updateArcadeStickPosition();
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  const dpad = $('.controller-shell .dpad');
  if (dpad) {
    const isArcade = () => !!dpad.closest('.controller-shell.arcade-controller');
    dpad.addEventListener('pointerdown', (event) => {
      if (!isArcade()) return;
      event.preventDefault();
      arcadeStickPointers.add(event.pointerId);
      try { dpad.setPointerCapture(event.pointerId); } catch {}
      applyArcadeStickPoint(event.pointerId, event, dpad);
    });
    dpad.addEventListener('pointermove', (event) => {
      if (isArcade() && arcadeStickPointers.has(event.pointerId)) {
        event.preventDefault();
        applyArcadeStickPoint(event.pointerId, event, dpad);
      }
    });
    const releaseStick = (event) => releaseArcadeStickPointer(event.pointerId, dpad);
    dpad.addEventListener('pointerup', releaseStick);
    dpad.addEventListener('pointercancel', releaseStick);
    dpad.addEventListener('lostpointercapture', releaseStick);
    dpad.addEventListener('contextmenu', (event) => { if (isArcade()) event.preventDefault(); });
  }
}

function netplaySetState(label, state = 'idle') {
  const el = $('#netplay-state');
  if (el) { el.textContent = label; el.dataset.state = state; }
  const disconnectButton = $('#netplay-disconnect');
  if (disconnectButton) disconnectButton.disabled = !(peerJsPeer || rtcPeer);
  const canStart = netplayRole === 'host' && netplayRemoteReady && rtcChannel?.readyState === 'open' && rtcStateChannel?.readyState === 'open' && !netplayPlaying && !netplayStartPending;
  const oldStart = $('#netplay-start');
  if (oldStart) { oldStart.disabled = true; oldStart.hidden = true; }
  const autoStart = $('#netplay-auto-start');
  if (autoStart) { autoStart.disabled = !canStart; autoStart.hidden = !canStart; }
  const autoStatus = $('#netplay-auto-status');
  if (autoStatus) { autoStatus.textContent = label; autoStatus.dataset.state = state; }
  if (netplayRemoteReady && rtcChannel?.readyState === 'open' && rtcStateChannel?.readyState === 'open' && netplayConnectionTimeout) {
    clearTimeout(netplayConnectionTimeout); netplayConnectionTimeout = null;
  }
  void updatePlayer2Indicator();
}

function currentGameSignature() {
  const rom = activeGame?.info?.rom;
  if (!rom || !rom.length) throw new Error('Primero carga el mismo juego en ambos navegadores.');
  return cartFingerprint(rom);
}

function disconnectNetplay(showStatus = true) {
  const peerToDestroy = peerJsPeer;
  peerJsPeer = null;
  peerJsConnections = { input: null, state: null };
  if (netplayConnectionTimeout) { clearTimeout(netplayConnectionTimeout); netplayConnectionTimeout = null; }
  netplayAutoRoomCode = '';
  const autoRoomShare = $('#netplay-auto-room-share'); if (autoRoomShare) autoRoomShare.hidden = true;
  const autoStart = $('#netplay-auto-start'); if (autoStart) { autoStart.hidden = true; autoStart.disabled = true; }
  if ($('#netplay-auto-create-room')) $('#netplay-auto-create-room').disabled = false;
  if ($('#netplay-auto-join-room')) $('#netplay-auto-join-room').disabled = false;
  if (netplayTicker) clearInterval(netplayTicker);
  if (netplaySnapshotTicker) clearInterval(netplaySnapshotTicker);
  netplayTicker = null;
  netplaySnapshotTicker = null;
  netplaySnapshotBusy = false;
  netplaySnapshotSeq = 0;
  snapshotIncoming = null;
  netplayPlaying = false;
  if (netplayStartPending) { session?.setPaused(false); paused = false; pauseOverlay.hidden = true; }
  netplayStartPending = false;
  netplayStartId = 0;
  netplayStartSnapshotId = 0;
  netplaySignalRtt = null; netplayLastPingAt = 0; netplayLastPingId = 0;
  if (rtcChannel) {
    rtcChannel.onopen = null;
    rtcChannel.onmessage = null;
    rtcChannel.onclose = null;
    try { rtcChannel.close(); } catch {}
  }
  if (rtcStateChannel) {
    rtcStateChannel.onmessage = null;
    rtcStateChannel.onopen = null;
    rtcStateChannel.onclose = null;
    try { rtcStateChannel.close(); } catch {}
  }
  if (rtcPeer && !peerToDestroy) {
    rtcPeer.ondatachannel = null;
    rtcPeer.onconnectionstatechange = null;
    rtcPeer.oniceconnectionstatechange = null;
    try { rtcPeer.close(); } catch {}
  }
  if (peerToDestroy) { try { peerToDestroy.destroy(); } catch {} }
  rtcChannel = null;
  rtcStateChannel = null;
  rtcPeer = null;
  netplayRemoteReady = false;
  netplayRole = null;
  netplaySignature = null;
  localInputSeq = 0;
  remoteInputSeq = -1;
  netplaySnapshotQueue = Promise.resolve();
  session?.setRemoteButtons(0);
  session?.setNetplayRole(null);
  resetHeldInputs();
  netplaySetState(t('disconnected'), 'idle');
  renderPlayer2Indicator(false);
  if (showStatus) setMessage('Netplay desconectado. Puedes seguir jugando en local.');
}

function attachNetplayStateChannel(channel) {
  rtcStateChannel = channel;
  channel.binaryType = 'arraybuffer';
  channel.onopen = () => netplaySetState(netplayRemoteReady ? t('connectedSameGame') : 'Canal de sincronización conectado…', netplayRemoteReady ? 'connected' : 'connecting');
  channel.onmessage = (event) => {
    if (typeof event.data === 'string') {
      let packet;
      try { packet = JSON.parse(event.data); } catch { return; }
      if (packet?.t === 'snapshot' && Number.isInteger(packet.id) && Number.isInteger(packet.total) && Number.isInteger(packet.chunks) && packet.total > 0 && packet.chunks > 0 && packet.chunks < 2048) {
        // Ordered state channel: each descriptor is followed by exactly `chunks` binary messages.
        snapshotIncoming = { id: packet.id, total: packet.total, chunks: packet.chunks, startId: Number.isInteger(packet.startId) ? packet.startId : 0, parts: [] };
        return;
      }
      if (packet?.t === 'prepare' && netplayRole === 'guest' && activeGame && Number.isInteger(packet.id)) {
        netplayStartPending = true;
        netplayStartId = packet.id;
        netplayStartSnapshotId = 0;
        session?.setRemoteButtons(0);
        session?.setPaused(true);
        paused = true;
        pauseOverlay.hidden = true;
        resetHeldInputs();
        try { channel.send(JSON.stringify({ t: 'prepared', id: netplayStartId })); }
        catch (error) { setMessage(`No se pudo confirmar el inicio: ${errorText(error)}`, true); }
        netplaySetState('Preparando estado inicial…', 'connecting');
        setMessage('Recibiendo el estado inicial del Jugador 1 antes de comenzar…');
        return;
      }
      if (packet?.t === 'abort' && netplayRole === 'guest' && netplayStartPending && packet.id === netplayStartId) {
        snapshotIncoming = null;
        netplayStartPending = false;
        session?.setPaused(false);
        paused = false;
        pauseOverlay.hidden = true;
        netplaySetState(t('connectedSameGame'), 'connected');
        setMessage('El Jugador 1 canceló la sincronización inicial. Puedes volver a intentarlo.');
        return;
      }
      if (packet?.t === 'prepared' && netplayRole === 'host' && netplayStartPending && packet.id === netplayStartId) {
        void sendNetplaySnapshot(true);
        return;
      }
      if (packet?.t === 'snapshot-ack' && netplayRole === 'host' && netplayStartPending && packet.startId === netplayStartId && packet.id === netplayStartSnapshotId) {
        try {
          channel.send(JSON.stringify({ t: 'start', id: netplayStartId }));
          beginNetplayPlayback('host', true);
        } catch (error) { setMessage(`No se pudo iniciar la partida: ${errorText(error)}`, true); }
        return;
      }
      if (packet?.t === 'start' && netplayRole === 'guest' && netplayStartPending && packet.id === netplayStartId) {
        beginNetplayPlayback('guest', true);
      }
      return;
    }
    const finishChunk = (buffer) => {
      if (!snapshotIncoming || netplayRole !== 'guest' || (!netplayPlaying && !netplayStartPending)) return;
      const incoming = snapshotIncoming;
      incoming.parts.push(new Uint8Array(buffer));
      if (incoming.parts.length < incoming.chunks) return;
      snapshotIncoming = null;
      const bytes = new Uint8Array(incoming.total);
      let offset = 0;
      for (const part of incoming.parts) {
        if (offset + part.length > bytes.length) return;
        bytes.set(part, offset);
        offset += part.length;
      }
      if (offset !== bytes.length) return;
      const queueChannel = channel;
      netplaySnapshotQueue = netplaySnapshotQueue.then(async () => {
        if (rtcStateChannel !== queueChannel || netplayRole !== 'guest' || (!netplayPlaying && !netplayStartPending) || !session) return;
        await session.importNetplayState(bytes);
        // The first authoritative state is loaded while both sides are held. ACK only after
        // import completes; the host cannot resume until this message reaches it.
        if (incoming.startId && netplayStartPending && incoming.startId === netplayStartId) {
          session.setRemoteButtons(0);
          session.setPaused(true);
          paused = true;
          queueChannel.send(JSON.stringify({ t: 'snapshot-ack', id: incoming.id, startId: incoming.startId }));
          netplaySetState('Estado inicial sincronizado…', 'connecting');
        }
      }).catch((error) => setMessage(`No se pudo sincronizar el estado del juego: ${errorText(error)}`, true));
    };
    if (event.data instanceof ArrayBuffer) finishChunk(event.data);
    else if (event.data instanceof Blob) void event.data.arrayBuffer().then(finishChunk);
  };
  channel.onclose = () => {
    if (rtcStateChannel !== channel) return;
    snapshotIncoming = null;
    if (netplayStartPending) {
      session?.setPaused(false);
      paused = false;
      netplayStartPending = false;
      pauseOverlay.hidden = true;
    }
    if (netplayRole === 'guest' && netplayPlaying) setMessage('Se interrumpió la sincronización de pantalla; la partida ya no puede garantizar el mismo estado.', true);
  };
}

async function sendNetplaySnapshot(forceForStart = false) {
  const channel = rtcStateChannel;
  const canSend = netplayPlaying || (forceForStart && netplayStartPending);
  if (netplayRole !== 'host' || !canSend || !session || channel?.readyState !== 'open' || netplaySnapshotBusy) return;
  if (channel.bufferedAmount > 512 * 1024) return;
  netplaySnapshotBusy = true;
  try {
    const bytes = await session.exportNetplayState();
    const stillAllowed = netplayPlaying || (forceForStart && netplayStartPending);
    if (channel !== rtcStateChannel || channel.readyState !== 'open' || !stillAllowed) return;
    const chunkSize = 16 * 1024;
    const chunks = Math.ceil(bytes.byteLength / chunkSize);
    const id = ++netplaySnapshotSeq;
    if (forceForStart) netplayStartSnapshotId = id;
    channel.send(JSON.stringify({ t: 'snapshot', id, total: bytes.byteLength, chunks, startId: forceForStart ? netplayStartId : 0 }));
    for (let offset = 0; offset < bytes.byteLength; offset += chunkSize) {
      const part = bytes.slice(offset, Math.min(offset + chunkSize, bytes.byteLength));
      channel.send(part.buffer);
    }
  } catch (error) {
    setMessage(`No se pudo enviar la sincronización: ${errorText(error)}`, true);
    if (forceForStart && netplayStartPending) {
      try { channel?.send(JSON.stringify({ t: 'abort', id: netplayStartId })); } catch {}
      netplayStartPending = false;
      session?.setPaused(false);
      paused = false;
      netplaySetState('No se pudo sincronizar', 'error');
    }
  } finally {
    netplaySnapshotBusy = false;
  }
}

function startNetplaySnapshots() {
  if (netplaySnapshotTicker) clearInterval(netplaySnapshotTicker);
  if (netplayRole !== 'host') return;
  // Initial synchronization completed before both players were allowed to run.
  // Periodic corrections remain experimental and are intentionally less frequent on phones.
  netplaySnapshotTicker = setInterval(() => { void sendNetplaySnapshot(false); }, 1000);
}

function beginNetplayPlayback(role, alreadyPrepared = false) {
  if (!session || netplayRole !== role || (!alreadyPrepared && !netplayRemoteReady)) return;
  try {
    if (!alreadyPrepared) {
      session.setRemoteButtons(0);
      session.prepareNetplayStart();
    }
    session.setPaused(false);
    paused = false;
    netplayStartPending = false;
    netplayPlaying = true;
    pauseOverlay.hidden = true;
    $('#pause-button').innerHTML = `Ⅱ <span>${t('menu')}</span>`;
    resetHeldInputs();
    if (role === 'host') startNetplaySnapshots();
    netplaySetState(t('connectedSameGame'), 'connected');
    setMessage(`Partida Netplay iniciada. Eres el ${role === 'host' ? 'Jugador 1' : 'Jugador 2'}. El estado inicial se sincronizó antes de comenzar; las correcciones periódicas siguen siendo experimentales y pueden producir pequeños saltos.`);
  } catch (error) {
    netplayPlaying = false;
    netplayStartPending = false;
    setMessage(errorText(error), true);
  }
}

function attachNetplayChannel(channel) {
  rtcChannel = channel;
  channel.onopen = () => {
    if (!netplaySignature) {
      try { netplaySignature = currentGameSignature(); }
      catch (error) { setMessage(errorText(error), true); return; }
    }
    netplaySetState('Validando juego…', 'connecting');
    try {
      channel.send(JSON.stringify({ t: 'hello', sig: netplaySignature, title: activeGame?.title || '', role: netplayRole }));
    } catch { /* The connection may close while the first packet is being sent. */ }
    if (netplayTicker) clearInterval(netplayTicker);
    netplayLastPingAt = 0;
    netplayTicker = setInterval(() => {
      if (!netplayRemoteReady || rtcChannel?.readyState !== 'open' || !session) return;
      if (rtcChannel.bufferedAmount > 65536) return;
      try {
        rtcChannel.send(JSON.stringify({ t: 'i', b: session.localButtons(), s: ++localInputSeq }));
        const now = Date.now();
        if (now - netplayLastPingAt >= 1000) {
          netplayLastPingAt = now;
          netplayLastPingId += 1;
          rtcChannel.send(JSON.stringify({ t: 'ping', id: netplayLastPingId, sentAt: now }));
        }
      } catch { /* A transient close is handled by the connection-state listener. */ }
    }, 16);
  };
  channel.onmessage = (event) => {
    let packet;
    try { packet = JSON.parse(event.data); } catch { return; }
    if (!packet || typeof packet !== 'object') return;
    if (packet.t === 'hello') {
      if (packet.sig !== netplaySignature) {
        netplayRemoteReady = false;
        netplaySetState('ROM distinta', 'error');
        setMessage('El otro jugador tiene una ROM diferente. Carguen exactamente el mismo juego para continuar.', true);
        session?.setRemoteButtons(0);
        return;
      }
      netplayRemoteReady = true;
      void updatePlayer2Indicator();
      netplaySetState(t('connectedSameGame'), 'connected');
      setMessage(`Netplay conectado como ${netplayRole === 'host' ? 'Jugador 1' : 'Jugador 2'}. El Jugador 1 debe pulsar «Iniciar juntos».`);
      return;
    }
    if (packet.t === 'ping' && Number.isInteger(packet.id) && Number.isFinite(packet.sentAt)) {
      try { if (channel.readyState === 'open') channel.send(JSON.stringify({ t: 'pong', id: packet.id, sentAt: packet.sentAt })); } catch {}
      return;
    }
    if (packet.t === 'pong' && Number.isInteger(packet.id) && packet.id === netplayLastPingId && Number.isFinite(packet.sentAt)) {
      const measured = Date.now() - packet.sentAt;
      if (measured >= 0 && measured < 10000) { netplaySignalRtt = measured; void updatePlayer2Indicator(); }
      return;
    }
    if (packet.t === 'i' && netplayRemoteReady && Number.isInteger(packet.b) && Number.isInteger(packet.s)) {
      if (packet.s <= remoteInputSeq) return;
      remoteInputSeq = packet.s;
      session?.setRemoteButtons(packet.b & 0x0fff);
      return;
    }
  };
  channel.onclose = () => {
    if (!rtcPeer) return;
    netplayRemoteReady = false;
    netplayPlaying = false;
    if (netplayStartPending) { session?.setPaused(false); paused = false; netplayStartPending = false; pauseOverlay.hidden = true; }
    if (netplaySnapshotTicker) clearInterval(netplaySnapshotTicker);
    netplaySnapshotTicker = null;
    session?.setRemoteButtons(0);
    netplaySetState('Canal cerrado', 'error');
  };
}

function makePeerJsChannel(connection, kind) {
  const facade = {
    label: connection.label,
    binaryType: 'arraybuffer',
    onopen: null,
    onmessage: null,
    onclose: null,
    get readyState() { return connection.open ? 'open' : (connection.dataChannel?.readyState || 'connecting'); },
    get bufferedAmount() { return connection.dataChannel?.bufferedAmount || 0; },
    send(payload) {
      if (!connection.open) throw new Error('El canal todavía no está abierto.');
      connection.send(payload);
    },
    close() { try { connection.close(); } catch {} },
  };
  const onOpen = () => {
    try { if (connection.dataChannel) connection.dataChannel.binaryType = 'arraybuffer'; } catch {}
    const nativePc = connection.peerConnection || connection._peerConnection || null;
    if (nativePc) rtcPeer = nativePc;
    else if (!rtcPeer) rtcPeer = peerJsPeer;
    try { facade.onopen?.(); } catch (error) { console.warn('No se pudo abrir el canal Netplay', error); }
    void updatePlayer2Indicator();
  };
  connection.on('open', onOpen);
  connection.on('data', (incoming) => {
    let data = incoming;
    if (data instanceof Uint8Array) data = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    else if (ArrayBuffer.isView(data)) data = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    facade.onmessage?.({ data });
  });
  connection.on('close', () => {
    facade.onclose?.();
    if (peerJsConnections[kind] === connection) peerJsConnections[kind] = null;
    void updatePlayer2Indicator();
  });
  connection.on('error', (error) => {
    const type = String(error?.type || '');
    if (type === 'peer-unavailable' && netplayRole === 'guest' && !netplayRemoteReady) {
      netplaySetState('Sala no encontrada', 'error');
      setMessage('No encontramos esa sala. Comprueba el código y que el Jugador 1 mantenga abierta su sala.', true);
      if ($('#netplay-auto-join-room')) $('#netplay-auto-join-room').disabled = false;
      if ($('#netplay-auto-create-room')) $('#netplay-auto-create-room').disabled = false;
      return;
    }
    if (peerJsPeer) setMessage(`Canal Netplay: ${errorText(error)}`, true);
  });
  if (connection.open) queueMicrotask(onOpen);
  return facade;
}

function registerPeerJsConnection(connection, kind) {
  if (!connection || !['input', 'state'].includes(kind)) return;
  const old = peerJsConnections[kind];
  if (old && old !== connection && old.open) { try { connection.close(); } catch {} return; }
  peerJsConnections[kind] = connection;
  const facade = makePeerJsChannel(connection, kind);
  if (kind === 'input') attachNetplayChannel(facade);
  else attachNetplayStateChannel(facade);
}

function setupPeerJsPeer(peer, role) {
  peer.on('connection', (connection) => {
    if (role !== 'host') { try { connection.close(); } catch {} return; }
    const label = String(connection.label || '');
    if (label === 'genesis-input') registerPeerJsConnection(connection, 'input');
    else if (label === 'genesis-state') registerPeerJsConnection(connection, 'state');
    else { try { connection.close(); } catch {} }
  });
  peer.on('error', (error) => {
    if (peerJsPeer !== peer) return;
    if (error?.type === 'unavailable-id') return; // Host retries with another short room code.
    const type = String(error?.type || '');
    const text = type === 'peer-unavailable'
      ? 'No encontramos esa sala. Comprueba el código y que el Jugador 1 siga conectado.'
      : (type === 'network' || type === 'server-error' || type === 'socket-error')
        ? 'No se pudo acceder al servicio PeerJS Cloud. Comprueba tu conexión a Internet e inténtalo de nuevo.'
        : `Error de Netplay: ${errorText(error)}`;
    netplaySetState('Conexión fallida', 'error');
    setMessage(text, true);
    if (type === 'peer-unavailable' || type === 'network' || type === 'server-error' || type === 'socket-error') {
      if ($('#netplay-auto-create-room')) $('#netplay-auto-create-room').disabled = false;
      if ($('#netplay-auto-join-room')) $('#netplay-auto-join-room').disabled = false;
    }
  });
  peer.on('disconnected', () => {
    if (peerJsPeer === peer && !netplayRemoteReady) {
      netplaySetState('Servicio de salas desconectado', 'error');
      setMessage('PeerJS Cloud perdió la señalización. Vuelve a conectarte si la sala no llega a abrirse.', true);
    }
  });
}

function waitForPeerJsOpen(peer, timeoutMs = 16000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      peer.off?.('open', onOpen);
      peer.off?.('error', onError);
    };
    const finish = (error, id) => {
      if (settled) return;
      settled = true; cleanup();
      if (error) reject(error); else resolve(id);
    };
    const onOpen = (id) => finish(null, id);
    const onError = (error) => { if (!peer.open) finish(error || new Error('No se pudo abrir la sala.')); };
    const timer = setTimeout(() => finish(new Error('Tiempo agotado al contactar con PeerJS Cloud. Comprueba la conexión a Internet y vuelve a intentarlo.')), timeoutMs);
    peer.on('open', onOpen);
    peer.on('error', onError);
    if (peer.open) finish(null, peer.id);
  });
}

function generateRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(6);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return [...bytes].map((value) => alphabet[value % alphabet.length]).join('');
}

async function startAutomaticNetplay(role) {
  let peerForAttempt = null;
  try {
    if (!activeGame) throw new Error('Primero carga un juego de Mega Drive.');
    const PeerCtor = window.Peer;
    if (typeof PeerCtor !== 'function') throw new Error('No se cargó PeerJS. Comprueba la conexión a Internet y recarga la página.');
    const roomCode = String($('#netplay-auto-room-input')?.value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (role === 'guest' && !/^[A-Z0-9]{6}$/.test(roomCode)) throw new Error('Introduce el código de sala de seis caracteres que te pasó el Jugador 1.');

    disconnectNetplay(false);
    netplayRole = role;
    netplaySignature = currentGameSignature();
    session?.setNetplayRole(role);
    resetHeldInputs();
    $('#netplay-auto-create-room').disabled = true;
    $('#netplay-auto-join-room').disabled = true;
    $('#netplay-auto-room-share').hidden = true;
    netplaySetState('Conectando con PeerJS Cloud…', 'connecting');

    const config = window.BOTSEBITA_NETPLAY_CONFIG || {};
    const configuredIce = Array.isArray(config.iceServers) ? config.iceServers.filter((server) => server && server.urls) : [];
    const peerOptions = { debug: 0 };
    if (configuredIce.length) peerOptions.config = { iceServers: configuredIce, sdpSemantics: 'unified-plan' };

    if (role === 'host') {
      let opened = false;
      let lastError = null;
      for (let attempt = 0; attempt < 5 && !opened; attempt++) {
        const code = generateRoomCode();
        const peer = new PeerCtor(`bmd${code.toLowerCase()}`, peerOptions);
        peerForAttempt = peer;
        peerJsPeer = peer;
        rtcPeer = peer;
        netplayAutoRoomCode = code;
        setupPeerJsPeer(peer, 'host');
        try {
          await waitForPeerJsOpen(peer);
          opened = true;
        } catch (error) {
          lastError = error;
          if (peerJsPeer === peer) peerJsPeer = null;
          try { peer.destroy(); } catch {}
          rtcPeer = null;
          if (error?.type === 'unavailable-id') continue;
          throw error;
        }
      }
      if (!opened) throw lastError || new Error('No se pudo reservar un código de sala. Inténtalo otra vez.');
      $('#netplay-auto-room-code').textContent = netplayAutoRoomCode;
      $('#netplay-auto-room-input').value = netplayAutoRoomCode;
      $('#netplay-auto-room-share').hidden = false;
      netplaySetState('Sala creada · esperando al Jugador 2', 'connecting');
      setMessage('Sala lista. Comparte el código de seis caracteres. Mantén esta página abierta mientras tu amigo se conecta.');
    } else {
      const peer = new PeerCtor(peerOptions);
      peerForAttempt = peer;
      peerJsPeer = peer;
      rtcPeer = peer;
      setupPeerJsPeer(peer, 'guest');
      await waitForPeerJsOpen(peer);
      const hostId = `bmd${roomCode.toLowerCase()}`;
      registerPeerJsConnection(peer.connect(hostId, { label: 'genesis-input', reliable: true }), 'input');
      registerPeerJsConnection(peer.connect(hostId, { label: 'genesis-state', reliable: true }), 'state');
      netplayAutoRoomCode = roomCode;
      netplaySetState('Buscando sala…', 'connecting');
      setMessage('Buscando la sala. Si no se conecta en unos segundos, comprueba el código y que el Jugador 1 siga en la sala.');
      netplayConnectionTimeout = setTimeout(() => {
        if (peerJsPeer !== peer || netplayRemoteReady) return;
        disconnectNetplay(false);
        netplaySetState('Sala no encontrada', 'error');
        setMessage('No se pudo encontrar la sala. Verifica el código y vuelve a intentarlo.', true);
      }, 25000);
    }
    $('#netplay-disconnect').disabled = false;
  } catch (error) {
    if (peerForAttempt || peerJsPeer) disconnectNetplay(false);
    if ($('#netplay-auto-create-room')) $('#netplay-auto-create-room').disabled = false;
    if ($('#netplay-auto-join-room')) $('#netplay-auto-join-room').disabled = false;
    netplaySetState('No se pudo conectar', 'error');
    const message = error?.type === 'unavailable-id'
      ? 'No se pudo asignar un código de sala. Inténtalo otra vez.'
      : errorText(error);
    setMessage(message, true);
  }
}

function startNetplayTogether() {
  if (netplayRole !== 'host' || !netplayRemoteReady || rtcChannel?.readyState !== 'open' || rtcStateChannel?.readyState !== 'open') {
    setMessage('Espera a que ambos canales estén conectados y los dos navegadores hayan cargado exactamente la misma ROM.', true);
    return;
  }
  if (netplayStartPending || netplayPlaying) return;
  try {
    // Pause the host, ask the guest to pause, transfer one authoritative initial state,
    // and only then release both machines. This avoids the initial snapshot being discarded.
    netplayStartPending = true;
    netplayStartId = Date.now();
    netplayStartSnapshotId = 0;
    session?.setRemoteButtons(0);
    session?.prepareNetplayStart();
    session?.setPaused(true);
    paused = true;
    pauseOverlay.hidden = true;
    resetHeldInputs();
    rtcStateChannel.send(JSON.stringify({ t: 'prepare', id: netplayStartId }));
    const oldStart = $('#netplay-start'); if (oldStart) { oldStart.disabled = true; oldStart.hidden = true; }
    netplaySetState('Sincronizando estado inicial…', 'connecting');
    setMessage('Esperando a que el Jugador 2 reciba y confirme el estado inicial. La partida comenzará automáticamente al terminar.');
  } catch (error) {
    try { rtcStateChannel?.send(JSON.stringify({ t: 'abort', id: netplayStartId })); } catch {}
    netplayStartPending = false;
    session?.setPaused(false);
    paused = false;
    netplaySetState(t('connectedSameGame'), 'connected');
    setMessage(errorText(error), true);
  }
}

function updateTouchScale(value = settings.touchScale ?? 100, persist = false) {
  const numeric = Math.max(80, Math.min(115, Number(value) || 100));
  const mobile = window.matchMedia('(max-width: 700px)').matches || window.matchMedia('(pointer: coarse)').matches;
  const scale = numeric / 100;
  const controller = $('.controller-shell');
  const dimensions = mobile
    ? { dpad: 88, actionW: 128, actionH: 86, face: 34, center: 40, start: 42, shell: 164, utilityH: 17 }
    : { dpad: 116, actionW: 184, actionH: 118, face: 40, center: 60, start: 48, shell: 170, utilityH: 18 };
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--dpad-size', `${Math.round(dimensions.dpad * scale)}px`);
  rootStyle.setProperty('--action-width', `${Math.round(dimensions.actionW * scale)}px`);
  rootStyle.setProperty('--action-height', `${Math.round(dimensions.actionH * scale)}px`);
  rootStyle.setProperty('--face-size', `${Math.round(dimensions.face * scale)}px`);
  rootStyle.setProperty('--controller-center-width', `${Math.round(dimensions.center * scale)}px`);
  rootStyle.setProperty('--start-width', `${Math.round(dimensions.start * scale)}px`);
  rootStyle.setProperty('--controller-height', `${Math.round(dimensions.shell * scale)}px`);
  rootStyle.setProperty('--utility-height', `${Math.round(dimensions.utilityH * scale)}px`);
  rootStyle.setProperty('--secondary-utility-height', `${Math.round(dimensions.utilityH * scale * 0.8)}px`);
  rootStyle.setProperty('--secondary-width', `${Math.round(dimensions.center * scale * 0.48)}px`);
  $('#touch-size').value = String(numeric);
  $('#touch-size-value').textContent = `${numeric}%`;
  if (persist) {
    settings = { ...settings, touchScale: numeric };
    safeSaveSettings();
  }
}

function getCartridgeItems() {
  return [
    { type: 'bundled', id: 'snow-bros', title: 'Snow Bros. - Nick & Tom' },
    { type: 'bundled', id: 'mines', title: 'Minesweeper MD' },
    { type: 'bundled', id: 'power-rangers', title: 'Mighty Morphin Power Rangers' },
    { type: 'bundled', id: 'street-fighter-ii-sce', title: "Street Fighter II' - Special Champion Edition" },
    { type: 'bundled', id: 'worms', title: 'Worms' },
    { type: 'bundled', id: 'streets-of-rage-3', title: 'Streets of Rage 3' },
    { type: 'bundled', id: 'toejam-earl-funkotron', title: 'ToeJam & Earl in Panic on Funkotron' },
    ...EXTRA_GAMES.map((game) => ({ type: 'bundled', id: game.id, title: game.title })),
    ...recentCartridgeRows.map((cart) => ({ type: 'recent', id: cart.id, title: cart.internalTitle || cart.title || cart.fileName, cart })),
  ];
}

function setCartridge(index, launch = true) {
  const items = getCartridgeItems();
  if (!items.length) return;
  cartridgeIndex = ((index % items.length) + items.length) % items.length;
  const selected = items[cartridgeIndex];
  const snowSelected = selected.type === 'bundled' && selected.id === 'snow-bros';
  const minesSelected = selected.type === 'bundled' && selected.id === 'mines';
  const rangersSelected = selected.type === 'bundled' && selected.id === 'power-rangers';
  const sf2Selected = selected.type === 'bundled' && selected.id === 'street-fighter-ii-sce';
  const wormsSelected = selected.type === 'bundled' && selected.id === 'worms';
  const sor3Selected = selected.type === 'bundled' && selected.id === 'streets-of-rage-3';
  const toejamSelected = selected.type === 'bundled' && selected.id === 'toejam-earl-funkotron';
  const recentSelected = selected.type === 'recent';
  const extraGame = selected.type === 'bundled' ? EXTRA_GAMES.find((game) => game.id === selected.id) : null;
  const extraButton = $('#extra-game');
  extraButton.hidden = !extraGame;
  extraButton.classList.toggle('selected', Boolean(extraGame));
  extraButton.setAttribute('aria-pressed', String(Boolean(extraGame)));
  if (extraGame) {
    const cover = $('#extra-game-cover');
    const label = cover.closest('.cartridge-label');
    label.classList.remove('cover-missing');
    cover.hidden = false;
    if (cover.getAttribute('src') !== extraGame.cover) cover.src = extraGame.cover;
    cover.onerror = () => { cover.hidden = true; label.classList.add('cover-missing'); };
    $('#extra-game-fallback').textContent = extraGame.title.toUpperCase();
    $('#extra-game-title').textContent = extraGame.title;
  }
  $('#bundled-game').hidden = !snowSelected;
  $('#homebrew-game').hidden = !minesSelected;
  $('#rangers-game').hidden = !rangersSelected;
  $('#sf2-game').hidden = !sf2Selected;
  $('#worms-game').hidden = !wormsSelected;
  $('#sor3-game').hidden = !sor3Selected;
  $('#toejam-game').hidden = !toejamSelected;
  $('#recent-carousel-game').hidden = !recentSelected;
  $('#bundled-game').classList.toggle('selected', snowSelected);
  $('#homebrew-game').classList.toggle('selected', minesSelected);
  $('#rangers-game').classList.toggle('selected', rangersSelected);
  $('#sf2-game').classList.toggle('selected', sf2Selected);
  $('#worms-game').classList.toggle('selected', wormsSelected);
  $('#sor3-game').classList.toggle('selected', sor3Selected);
  $('#toejam-game').classList.toggle('selected', toejamSelected);
  $('#recent-carousel-game').classList.toggle('selected', recentSelected);
  $('#bundled-game').setAttribute('aria-pressed', String(snowSelected));
  $('#homebrew-game').setAttribute('aria-pressed', String(minesSelected));
  $('#rangers-game').setAttribute('aria-pressed', String(rangersSelected));
  $('#sf2-game').setAttribute('aria-pressed', String(sf2Selected));
  $('#worms-game').setAttribute('aria-pressed', String(wormsSelected));
  $('#sor3-game').setAttribute('aria-pressed', String(sor3Selected));
  $('#toejam-game').setAttribute('aria-pressed', String(toejamSelected));
  $('#recent-carousel-game').setAttribute('aria-pressed', String(recentSelected));
  $('#cartridge-position').textContent = `${cartridgeIndex + 1} / ${items.length}`;
  $('#library-count').textContent = String(items.length).padStart(2, '0');
  if (recentSelected) {
    const title = String(selected.title || selected.cart.fileName || 'ROM propia');
    $('#recent-carousel-title').textContent = title;
    $('#recent-cover-title').textContent = title.toUpperCase().slice(0, 22);
    const recentFileLabel = $('#recent-carousel-file');
    if (recentFileLabel) recentFileLabel.textContent = selected.cart.fileName || 'ROM propia';
  }
  if (launch) {
    if (recentSelected) void openRecentCart(selected.cart);
    else void openBundled(selected.id);
  }
}

/* Bundled games added from v1.16 on share one carousel button that is filled in from this list. */
const EXTRA_GAMES = [
  { id: 'streets-of-rage-2', title: 'Streets of Rage 2', cover: './covers/streets-of-rage-2-cartridge.png', terms: 'streets of rage 2 bare knuckle ii sor2' },
  { id: 'gunstar-heroes', title: 'Gunstar Heroes', cover: './covers/gunstar-heroes-cartridge.png', terms: 'gunstar heroes' },
  { id: 'contra-hard-corps', title: 'Contra: Hard Corps', cover: './covers/contra-hard-corps-cartridge.png', terms: 'contra hard corps probotector' },
  { id: 'tmnt-tournament-fighters', title: 'TMNT: Tournament Fighters', cover: './covers/tmnt-tournament-fighters-cartridge.png', terms: 'teenage mutant ninja turtles tmnt tortugas ninja tournament fighters' },
  { id: 'tmnt-hyperstone-heist', title: 'TMNT: The Hyperstone Heist', cover: './covers/tmnt-hyperstone-heist-cartridge.png', terms: 'teenage mutant ninja turtles tmnt tortugas ninja hyperstone heist' },
  { id: 'micro-machines-96', title: "Micro Machines: Turbo Tournament '96", cover: './covers/micro-machines-96-cartridge.png', terms: 'micro machines turbo tournament 96' },
  { id: 'zombies-ate-my-neighbors', title: 'Zombies Ate My Neighbors', cover: './covers/zombies-ate-my-neighbors-cartridge.png', terms: 'zombies ate my neighbors neighbours' },
  { id: 'world-of-illusion', title: 'World of Illusion', cover: './covers/world-of-illusion-cartridge.png', terms: 'world of illusion mickey mouse donald duck' },
  { id: 'golden-axe', title: 'Golden Axe', cover: './covers/golden-axe-cartridge.png', terms: 'golden axe 1' },
  { id: 'golden-axe-ii', title: 'Golden Axe II', cover: './covers/golden-axe-ii-cartridge.png', terms: 'golden axe ii 2' },
  { id: 'golden-axe-iii', title: 'Golden Axe III', cover: './covers/golden-axe-iii-cartridge.png', terms: 'golden axe iii 3' },
  { id: 'nba-jam-te', title: 'NBA Jam: Tournament Edition', cover: './covers/nba-jam-te-cartridge.png', terms: 'nba jam tournament edition basketball basquet' },
  { id: 'battletoads-blast-processing', title: 'Battletoads in Blast Processing', cover: './covers/battletoads-blast-processing-cartridge.png', terms: 'battletoads battle toads blast processing soulchip homebrew hackrom' },
];

/* ---------- Save states: four slots per game, kept in IndexedDB ---------- */
const STATE_SLOTS = 4;
let activeStateSlot = 1;
let resumeAfterStates = false;

function stateKey(slot) { return `${activeId}#${slot}`; }

function statesAvailable(notify = true) {
  if (!session || !activeGame) return false;
  if (rtcPeer) { if (notify) setMessage('Los estados guardados no están disponibles durante el juego online.'); return false; }
  if (!activeId) { if (notify) setMessage('Para usar estados guardados carga la ROM suelta (no un ZIP).'); return false; }
  return true;
}

function captureThumbnail() {
  const width = 160;
  const thumb = document.createElement('canvas');
  thumb.width = width;
  thumb.height = Math.max(1, Math.round((width * canvas.height) / canvas.width));
  thumb.getContext('2d').drawImage(canvas, 0, 0, thumb.width, thumb.height);
  return thumb.toDataURL('image/jpeg', 0.7);
}

async function saveStateToSlot(slot) {
  if (!statesAvailable()) return false;
  try {
    const bytes = await session.saveSnapshot();
    const db = await openCartDatabase();
    await idbRequest(db.transaction('states', 'readwrite').objectStore('states').put({
      key: stateKey(slot), gameId: activeId, slot, title: activeGame.title, savedAt: Date.now(),
      thumb: captureThumbnail(), bytes: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    }));
    activeStateSlot = slot;
    setMessage(`Estado guardado en la ranura ${slot}.`);
    return true;
  } catch (error) {
    setMessage(`No se pudo guardar el estado: ${errorText(error)}`, true);
    return false;
  }
}

async function loadStateFromSlot(slot) {
  if (!statesAvailable()) return false;
  try {
    const db = await openCartDatabase();
    const row = await idbRequest(db.transaction('states').objectStore('states').get(stateKey(slot)));
    if (!row) { setMessage(`La ranura ${slot} está vacía.`); return false; }
    await session.loadSnapshot(new Uint8Array(row.bytes));
    resetHeldInputs();
    activeStateSlot = slot;
    setMessage(`Estado de la ranura ${slot} cargado.`);
    return true;
  } catch (error) {
    setMessage(`No se pudo cargar el estado: ${errorText(error)}`, true);
    return false;
  }
}

async function deleteStateSlot(slot) {
  try {
    const db = await openCartDatabase();
    await idbRequest(db.transaction('states', 'readwrite').objectStore('states').delete(stateKey(slot)));
  } catch { /* Nothing to delete. */ }
}

async function renderStatesDialog() {
  const grid = $('#states-grid');
  $('#states-game').textContent = activeGame?.title || '';
  const rows = new Map();
  try {
    const db = await openCartDatabase();
    const found = await idbRequest(db.transaction('states').objectStore('states').getAll(IDBKeyRange.bound(`${activeId}#`, `${activeId}#\uffff`)));
    for (const row of found) rows.set(row.slot, row);
  } catch { /* An unavailable database simply shows empty slots. */ }
  grid.replaceChildren();
  for (let slot = 1; slot <= STATE_SLOTS; slot++) {
    const row = rows.get(slot);
    const card = document.createElement('div');
    card.className = 'state-slot' + (slot === activeStateSlot ? ' active' : '');
    const picture = document.createElement('div');
    picture.className = 'state-thumb';
    if (row?.thumb) {
      const img = document.createElement('img');
      img.src = row.thumb;
      img.alt = '';
      picture.append(img);
    } else picture.textContent = t('stateEmpty');
    const info = document.createElement('div');
    info.className = 'state-info';
    const name = document.createElement('strong');
    name.textContent = `${t('stateSlot')} ${slot}`;
    const when = document.createElement('small');
    when.textContent = row ? new Date(row.savedAt).toLocaleString(currentLanguage) : '—';
    info.append(name, when);
    const actions = document.createElement('div');
    actions.className = 'state-actions';
    const save = document.createElement('button');
    save.type = 'button'; save.className = 'button primary'; save.textContent = t('stateSave');
    save.addEventListener('click', async () => { if (await saveStateToSlot(slot)) await renderStatesDialog(); });
    const load = document.createElement('button');
    load.type = 'button'; load.className = 'button'; load.textContent = t('stateLoad'); load.disabled = !row;
    load.addEventListener('click', async () => { if (await loadStateFromSlot(slot)) $('#states-dialog').close(); });
    const del = document.createElement('button');
    del.type = 'button'; del.className = 'button subtle'; del.textContent = t('stateDelete'); del.disabled = !row;
    del.addEventListener('click', async () => { await deleteStateSlot(slot); await renderStatesDialog(); });
    actions.append(save, load, del);
    card.append(picture, info, actions);
    grid.append(card);
  }
}

async function openStatesDialog() {
  if (!statesAvailable()) return;
  const dialog = $('#states-dialog');
  if (dialog.open) return;
  // The game holds still while the dialog is open, then carries on exactly where it was.
  resumeAfterStates = !paused;
  if (resumeAfterStates) { paused = true; session.setPaused(true); resetHeldInputs(); }
  await renderStatesDialog();
  dialog.showModal();
}

function onStatesDialogClosed() {
  if (resumeAfterStates && activeGame) { paused = false; session?.setPaused(false); }
  resumeAfterStates = false;
}

const BUNDLED_COVERS = {
  ...Object.fromEntries(EXTRA_GAMES.map((game) => [game.id, game.cover])),
  'snow-bros': './covers/snow-bros-cartridge.png',
  'mines': './covers/minesweeper-md.svg',
  'power-rangers': './covers/power-rangers-cartridge.png',
  'street-fighter-ii-sce': './covers/street-fighter-ii-sce-cartridge.png',
  'worms': './covers/worms-cartridge.png',
  'streets-of-rage-3': './covers/streets-of-rage-3-cartridge.png',
  'toejam-earl-funkotron': './covers/toejam-earl-funkotron-cartridge.png',
};

function openFullLibrary() {
  const dialog = $('#library-dialog');
  const grid = $('#library-grid');
  const items = getCartridgeItems();
  grid.replaceChildren();
  $('#library-filter').value = '';
  items.forEach((item, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'library-tile' + (index === cartridgeIndex ? ' selected' : '');
    tile.setAttribute('aria-label', item.title);
    const art = document.createElement('span');
    art.className = 'library-tile-art';
    const cover = item.type === 'bundled' ? BUNDLED_COVERS[item.id] : null;
    if (cover) {
      const img = document.createElement('img');
      img.src = cover;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => { img.hidden = true; art.classList.add('cover-missing'); art.textContent = item.title; }, { once: true });
      art.append(img);
    } else {
      art.classList.add('cover-missing');
      art.textContent = String(item.title || 'ROM').toUpperCase().slice(0, 40);
    }
    const name = document.createElement('strong');
    name.textContent = item.title;
    tile.append(art, name);
    tile.addEventListener('click', () => {
      dialog.close();
      setCartridge(index, true);
    });
    grid.append(tile);
  });
  if (!dialog.open) dialog.showModal();
}

function bindCoverFallbacks() {
  document.querySelectorAll('.cartridge-label img').forEach((img) => {
    const showFallback = () => { img.hidden = true; img.closest('.cartridge-label')?.classList.add('cover-missing'); };
    img.addEventListener('error', showFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) showFallback();
  });
}

function bindUi() {
  $('#load-rom').addEventListener('click', () => fileInput.click());
  $('#mobile-load-rom').addEventListener('click', () => fileInput.click());
  $('#cartridge-prev').addEventListener('click', () => setCartridge(cartridgeIndex - 1));
  $('#open-full-library').addEventListener('click', openFullLibrary);
  $('#states-button').addEventListener('click', () => void openStatesDialog());
  $('#states-menu').addEventListener('click', () => void openStatesDialog());
  $('#states-dialog').addEventListener('close', onStatesDialogClosed);
  $('#library-filter').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    for (const tile of document.querySelectorAll('#library-grid .library-tile')) tile.hidden = !!query && !tile.textContent.toLowerCase().includes(query) && !(tile.getAttribute('aria-label') || '').toLowerCase().includes(query);
  });
  $('#library-dialog').addEventListener('click', (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  $('#cartridge-next').addEventListener('click', () => setCartridge(cartridgeIndex + 1));
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void openRom(file);
  });
  $('#bundled-game').addEventListener('click', () => setCartridge(0));
  $('#homebrew-game').addEventListener('click', () => setCartridge(1));
  $('#rangers-game').addEventListener('click', () => setCartridge(2));
  $('#sf2-game').addEventListener('click', () => setCartridge(3));
  $('#worms-game').addEventListener('click', () => setCartridge(4));
  $('#sor3-game').addEventListener('click', () => setCartridge(5));
  $('#toejam-game').addEventListener('click', () => setCartridge(6));
  $('#extra-game').addEventListener('click', () => setCartridge(cartridgeIndex));
  $('#netplay-auto-create-room').addEventListener('click', () => void startAutomaticNetplay('host'));
  $('#netplay-auto-join-room').addEventListener('click', () => void startAutomaticNetplay('guest'));
  $('#netplay-auto-room-input').addEventListener('input', (event) => { event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); });
  $('#netplay-auto-room-input').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); void startAutomaticNetplay('guest'); } });
  $('#netplay-auto-copy-room').addEventListener('click', async () => {
    const value = $('#netplay-auto-room-code').textContent.trim(); if (!value || value === '------') return;
    try { await navigator.clipboard.writeText(value); setMessage('Código de sala copiado. Envíalo al Jugador 2.'); }
    catch { const range = document.createRange(); range.selectNodeContents($('#netplay-auto-room-code')); const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); setMessage('Seleccioné el código. Cópialo y envíaselo al Jugador 2.'); }
  });
  $('#netplay-auto-start').addEventListener('click', startNetplayTogether);
  $('#netplay-disconnect').addEventListener('click', () => disconnectNetplay());
  $('#language-select').addEventListener('change', (event) => setLanguage(event.target.value));
  $('#open-settings').addEventListener('click', showSettings);
  $('#settings-menu').addEventListener('click', showSettings);
  $('#resume-game').addEventListener('click', () => {
    if (paused) openPauseMenu();
  });
  $('#pause-button').addEventListener('click', openPauseMenu);
  $('#restart-button').addEventListener('click', () => {
    session?.reset();
    paused = false;
    pauseOverlay.hidden = true;
    $('#pause-button').innerHTML = `Ⅱ <span>${t('menu')}</span>`;
    setMessage('Consola reiniciada.');
  });
  $('#restart-menu').addEventListener('click', () => {
    session?.reset();
    paused = false;
    pauseOverlay.hidden = true;
    $('#pause-button').innerHTML = `Ⅱ <span>${t('menu')}</span>`;
  });
  $('#close-game').addEventListener('click', closeGame);
  $('#fullscreen-button').addEventListener('click', toggleFullscreen);
  $('#mobile-fullscreen-exit').addEventListener('click', () => void exitMobileFullscreen());
  $('#setting-region').addEventListener('change', (event) => updateSetting('region', event.target.value));
  $('#setting-tv').addEventListener('change', (event) => updateSetting('tv', event.target.value));
  $('#setting-pad').addEventListener('change', (event) => updateSetting('pad', event.target.value));
  $('#setting-controller-style').addEventListener('change', (event) => updateSetting('controllerStyle', event.target.value));
  $('#touch-size').addEventListener('input', (event) => updateTouchScale(event.target.value, true));
  $('#setting-volume').addEventListener('input', (event) => {
    settings = { ...settings, volume: Number(event.target.value) / 100 };
    $('#volume-value').textContent = `${event.target.value}%`;
    session?.setSound(settings.sound, settings.volume);
  });
  $('#setting-volume').addEventListener('change', () => safeSaveSettings());
  $('#setting-sound').addEventListener('change', (event) => updateSetting('sound', event.target.checked));
  $('#setting-crt').addEventListener('change', (event) => updateSetting('crt', event.target.checked));
  $('#setting-integer').addEventListener('change', (event) => updateSetting('integerScale', event.target.checked));
  $('#setting-latency').addEventListener('change', (event) => updateSetting('lowLatency', event.target.checked));
  $('#save-settings').addEventListener('click', () => { safeSaveSettings(); settingsDialog.close(); });
  $('#reset-settings').addEventListener('click', () => {
    settings = { ...DEFAULT_SETTINGS, keys: { ...DEFAULT_SETTINGS.keys } };
    safeSaveSettings();
    applySettingsToUi();
    session?.applyConsole(settings.region, settings.tv, settings.pad);
    session?.setSound(settings.sound, settings.volume);
    session?.setLowLatency(settings.lowLatency !== false);
  });
  $('#search-games').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    const snowTerms = 'snow bros nick tom megadrive genesis';
    const minesTerms = 'minesweeper md mines homebrew gratis';
    const rangersTerms = 'mighty morphin power rangers';
    const sf2Terms = 'street fighter ii sf2 special champion edition';
    const wormsTerms = 'worms gusanos';
    const sor3Terms = 'streets of rage 3 bare knuckle iii sor3';
    const toejamTerms = 'toejam earl panic on funkotron toe jam';
    const carousel = $('.cartridge-carousel');
    if (!query) {
      carousel.hidden = false;
      setCartridge(cartridgeIndex, false);
    } else if (snowTerms.includes(query) || snowTerms.split(' ').some((word) => word.startsWith(query))) {
      carousel.hidden = false;
      setCartridge(0, false);
    } else if (minesTerms.includes(query) || minesTerms.split(' ').some((word) => word.startsWith(query))) {
      carousel.hidden = false;
      setCartridge(1, false);
    } else if (rangersTerms.includes(query) || rangersTerms.split(' ').some((word) => word.startsWith(query))) {
      carousel.hidden = false;
      setCartridge(2, false);
    } else if (sf2Terms.includes(query) || sf2Terms.split(' ').some((word) => word.startsWith(query))) {
      carousel.hidden = false;
      setCartridge(3, false);
    } else if (wormsTerms.includes(query) || wormsTerms.split(' ').some((word) => word.startsWith(query))) {
      carousel.hidden = false;
      setCartridge(4, false);
    } else if (sor3Terms.includes(query) || sor3Terms.split(' ').some((word) => word.startsWith(query))) {
      carousel.hidden = false;
      setCartridge(5, false);
    } else if (toejamTerms.includes(query) || toejamTerms.split(' ').some((word) => word.startsWith(query))) {
      carousel.hidden = false;
      setCartridge(6, false);
    } else if (EXTRA_GAMES.some((game) => `${game.title.toLowerCase()} ${game.terms}`.includes(query) || game.terms.split(' ').some((word) => word.startsWith(query)))) {
      const extraIndex = getCartridgeItems().findIndex((item) => item.type === 'bundled' && EXTRA_GAMES.some((game) => game.id === item.id && (`${game.title.toLowerCase()} ${game.terms}`.includes(query) || game.terms.split(' ').some((word) => word.startsWith(query)))));
      carousel.hidden = false;
      setCartridge(extraIndex, false);
    } else {
      const recentIndex = recentCartridgeRows.findIndex((cart) => `${cart.internalTitle || cart.title || ''} ${cart.fileName || ''}`.toLowerCase().includes(query));
      if (recentIndex >= 0) {
        carousel.hidden = false;
        setCartridge(BUNDLED_GAMES.length + recentIndex, false);
      } else carousel.hidden = true;
    }
    for (const entry of document.querySelectorAll('.recent-entry')) entry.hidden = !entry.textContent.toLowerCase().includes(query);
  });
  stage.addEventListener('dragover', (event) => { event.preventDefault(); stage.classList.add('drag-over'); });
  stage.addEventListener('dragleave', () => stage.classList.remove('drag-over'));
  stage.addEventListener('drop', (event) => {
    event.preventDefault(); stage.classList.remove('drag-over');
    const file = event.dataTransfer?.files?.[0];
    if (file) void openRom(file);
  });
  window.addEventListener('keydown', handleKey, true);
  window.addEventListener('keyup', handleKey, true);
  window.addEventListener('blur', resetHeldInputs);
  window.addEventListener('resize', () => { updateTouchScale(settings.touchScale ?? 100); drawLayout(); });
  window.setInterval(() => { if (!document.hidden) void updatePlayer2Indicator(); }, 1800);
  settingsDialog.addEventListener('close', () => {
    waitingForBinding = null;
    if (settingsBeforeOpen && !settingsDialog.returnValue) {
      // Settings update as controls are used, so closing keeps current values.
      settingsBeforeOpen = null;
    }
  });
  bindTouchControls();
}

async function boot() {
  initLanguage();
  bindUi();
  applySettingsToUi();
  updateTouchScale(settings.touchScale ?? 100);
  bindCoverFallbacks();
  const configNote = $('#netplay-server-config-note');
  if (configNote) configNote.textContent = t('serverNotConfigured');
  setCartridge(0, false);
  void renderRecentList();
  setStatus('Iniciando consola…', 'loading');
  try {
    session = await createSession(canvas);
    session.applyConsole(settings.region, settings.tv, settings.pad);
    session.setSound(settings.sound, settings.volume);
    session.setLowLatency(settings.lowLatency !== false);
    session.onChange(() => {
      setControllerStatus(session.padLabels());
    });
    session.onFrame(() => {
      const size = `${canvas.width}x${canvas.height}`;
      if (size !== currentCanvasSize) {
        currentCanvasSize = size;
        drawLayout();
      }
    });
    resizeObserver = new ResizeObserver(drawLayout);
    resizeObserver.observe($('#screen-slot'));
    setStatus(t('consoleReady'));
    await openBundled(BUNDLED_GAMES[0].id);
  } catch (error) {
    setMessage(`No se pudo iniciar el emulador: ${errorText(error)}`, true);
  }
}

boot();
