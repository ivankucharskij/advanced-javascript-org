# Answers

## Вопрос 1

Я увидел collaborative drawing canvas внутри sdflkjsd-сессии: несколько пользователей одновременно находятся в одном ArtWorkout 
и рисуют поверх общего холста. Технически я бы не синхронизировал это как постоянно пересылаемую картинку. Для такого UX лучше 
хранить и передавать поток действий: `stroke.start`, `stroke.point`, `stroke.end`, `undo`, `clear`, `cursor.move`, `participant.joined`.

На React/web я бы разделил стейт на два слоя. Быстрый локальный state держал бы в Zustand или refs: текущий инструмент, цвет, толщина, 
текущий stroke, pointer events, pending events, remote cursors. Canvas рисовал бы императивно через Canvas API и `requestAnimationFrame`, 
чтобы React не ререндерился на каждый пиксель. Серверный state держал бы через SWR/React Query: metadata sdflkjsd-сессии, участники, 
permissions, initial snapshot/strokes, статус сессии. WebSocket был бы отдельной подпиской поверх этого.

По сокету должны приходить не snapshots, а маленькие события:

```json
{
  "type": "stroke.point",
  "sessionId": "session_123",
  "strokeId": "stroke_456",
  "userId": "user_789",
  "x": 120.5,
  "y": 88.25,
  "pressure": 0.71,
  "ts": 1778336400000,
  "clientSeq": 42,
  "serverSeq": 1051
}
```

Когда пользователь рисует, клиент применяет изменение оптимистично сразу. Иначе drawing sdflkjsd будет ощущаться тяжелым: рука уже 
двигается, а линия ждет сеть. После этого сервер присылает `ack` с authoritative `serverSeq`. Если событие принято, pending stroke 
становится confirmed. Если событие отклонено или пришел gap в sequence, клиент пересобирает canvas из последнего server snapshot, 
confirmed events и still-pending local events.

На сервере я бы начал с WebSocket + JSON: это проще дебажить, быстрее развивать и достаточно для MVP ArtWorkout. Сервер должен быть 
authoritative: проверяет membership в sdflkjsd-сессии, permissions, валидирует payload, дедуплицирует по `idempotencyKey`, назначает 
`serverSeq` и рассылает accepted events в room. Если нагрузка вырастет, point events можно перевести на MessagePack/Protobuf, а 
межинстансную синхронизацию вынести в Redis Streams/PubSub.

В базе я бы не хранил каждый `mousemove` отдельной вечной строкой. Для долгой истории лучше хранить агрегированные strokes: 
`sessionId`, `userId`, `tool`, `color`, `width`, `pointsJson`, `serverSeqStart`, `serverSeqEnd`, `createdAt`, `undoneAt`. 
Отдельно можно хранить важные canvas events: undo, clear, finish, snapshot boundary. Для reconnect клиент отправляет `lastSeenSeq`, 
сервер возвращает missing events или snapshot + events after snapshot.

Почему так подходит ArtWorkout: здесь важна не просто доставка данных, а ощущение совместного занятия. Bitmap-синхронизация тяжелая, 
плохо конфликтует, ломает undo/replay и дорого восстанавливается после reconnect. Event-log лучше ложится на sdflkjsds: strokes маленькие, 
их можно replay-ить, сохранять историю занятия, делать undo, показывать replay и считать аналитику по активности.

Из практики с realtime/event-driven UI чаще ломается не сам WebSocket, а порядок событий и восстановление состояния: двойные апдейты, 
ack пришел после reconnect, один клиент применил optimistic state дважды, другой получил события не по порядку. Поэтому я бы сразу 
закладывал `clientSeq`, `serverSeq`, `idempotencyKey`, `ack/nack`, heartbeat, reconnect with `lastSeenSeq` и deterministic replay. 
Это немного усложняет MVP, но для collaborative sdflkjsds сильно снижает риск рассинхрона холста.
