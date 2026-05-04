---
title: Асинхронное взаимодействие
sidebar_position: 2
description: Описание WebSocket/AsyncAPI процесса для Owner-check.
---

## 1. Выбранный асинхронный процесс

В качестве асинхронного взаимодействия в системе выбран процесс обмена сообщениями в реальном времени между пользователями в обычном чате после успешного подтверждения владельца.

Логика процесса выглядит следующим образом:

1. Пользователь откликается на объявление.

2. Система создаёт диалог между сторонами.

3. До подтверждения владельца общение ограничено режимом owner-check.

4. После успешного подтверждения owner-check диалог переводится в режим обычного чата.

5. Именно этот этап, то есть обмен сообщениями в обычном чате рассматривается как асинхронное взаимодействие.

## 3. Почему этот процесс является асинхронным

Данный процесс является асинхронным, так как отправка и получение сообщений не укладываются в модель «один HTTP-запрос – один HTTP-ответ». После установки соединения стороны продолжают обмениваться данными в рамках постоянного канала связи.

Асинхронный характер взаимодействия проявляется в следующем:

- отправитель сообщения не ждёт, пока второй пользователь выполнит какое-либо действие;

- сообщение передаётся через постоянное соединение и доставляется отдельно от момента отправки;

- сервер может самостоятельно отправлять события подключённым клиентам;

- обмен сообщениями происходит в реальном времени и не требует постоянного ручного обновления страницы.

## 4. Обоснование выбора технологии

### 4.1. Требования процесса к технологии

Для реализации выбранного процесса технология должна обеспечивать:

- двусторонний обмен данными между участниками;

- получение новых сообщений без перезагрузки страницы;

- быструю доставку сообщений;

- поддержку нескольких событий в рамках одного соединения;

- корректную работу в рамках веб-платформы.

### 4.2. Характер взаимодействия

В системе используется типичный web-стек, включающий frontend и backend. Для такого стека WebSocket естественно встраивается в слой клиент-серверного real-time взаимодействия. В качестве формата обмена используется JSON, так как он удобен для веб-разработки, легко обрабатывается на стороне клиента и сервера и хорошо подходит для описания событийных сообщений. 

В рамках чата оба участника одновременно являются и отправителями, и получателями сообщений. Серверу необходимо не только принимать сообщения от клиента, но и самостоятельно доставлять события другим подключённым клиентам. По этой причине WebSocket лучше соответствует данному сценарию, чем обычный HTTP polling.

### 4.3. Почему именно WebSocket

Технология WebSocket выбрана по следующим причинам:

- она поддерживает постоянное двустороннее соединение;

- подходит для передачи сообщений в реальном времени;

- естественно применяется в чатах;

- хорошо соответствует веб-платформе;

- позволяет использовать JSON и в дальнейшем описать контракт через AsyncAPI.

Следовательно, WebSocket является наиболее подходящей технологией.

## 5. Участники взаимодействия и компоненты системы

В выбранном процессе участвуют следующие компоненты:

- **Клиент пользователя A** – интерфейс пользователя, который открывает чат, устанавливает соединение и отправляет сообщения;

- **Клиент пользователя B** – интерфейс второго участника диалога, который получает сообщения и может отправлять ответные сообщения;

- **WebSocket Chat Gateway / сервер real-time соединений** – компонент, который принимает WebSocket-подключения, поддерживает соединение и передаёт события между клиентами;

- **Chat Service** – компонент бизнес-логики, который проверяет права доступа к диалогу, валидирует сообщения и управляет логикой чата;

- **База данных сообщений** – хранилище, в котором сохраняются сообщения и состояние диалога.

Взаимодействие происходит не только между пользователями, но и между несколькими внутренними компонентами системы.

## 6. Сценарий взаимодействия

Ниже приведён базовый сценарий выбранного асинхронного взаимодействия:

1. Пользователь открывает экран чата.

2. Клиент устанавливает WebSocket-соединение с сервером.

3. Сервер проверяет право доступа пользователя к диалогу.

4. Пользователь отправляет сообщение.

5. Сервер принимает и валидирует сообщение.

6. Сообщение сохраняется в базе данных.

7. Сервер отправляет событие о новом сообщении второму участнику диалога.

8. Получатель видит сообщение без перезагрузки страницы.

Данный сценарий демонстрирует, что обмен данными происходит непрерывно в рамках одного соединения, а доставка сообщений осуществляется в реальном времени.

## 7. Контракт AsyncAPI

```YAML
asyncapi: 3.1.0
info:
  title: Lost&Found Chat WebSocket API
  version: '1.0.0'
  description: Контракт AsyncAPI для WebSocket-чата в системе Lost&Found.

defaultContentType: application/json

servers:
  production:
    host: api.lostfound.example.com
    protocol: wss
    description: Основной WebSocket-сервер чата
    security:
      - $ref: '#/components/securitySchemes/bearerAuth'

channels:
  dialogChat:
    address: /chat/{dialogId}
    title: Канал чата по конкретному диалогу
    parameters:
      dialogId:
        description: Идентификатор диалога
    messages:
      chatJoin:
        $ref: '#/components/messages/chatJoin'
      chatMessageSend:
        $ref: '#/components/messages/chatMessageSend'
      chatConnected:
        $ref: '#/components/messages/chatConnected'
      chatMessageReceived:
        $ref: '#/components/messages/chatMessageReceived'
      chatError:
        $ref: '#/components/messages/chatError'

operations:
  receiveChatJoin:
    action: receive
    channel:
      $ref: '#/channels/dialogChat'
    summary: Клиент сообщает серверу, что хочет начать работу с диалогом.
    messages:
      - $ref: '#/channels/dialogChat/messages/chatJoin'

  receiveChatMessage:
    action: receive
    channel:
      $ref: '#/channels/dialogChat'
    summary: Клиент отправляет текстовое сообщение в диалог.
    messages:
      - $ref: '#/channels/dialogChat/messages/chatMessageSend'

  sendChatConnected:
    action: send
    channel:
      $ref: '#/channels/dialogChat'
    summary: Сервер подтверждает успешное подключение клиента к чату.
    messages:
      - $ref: '#/channels/dialogChat/messages/chatConnected'

  sendChatMessageReceived:
    action: send
    channel:
      $ref: '#/channels/dialogChat'
    summary: Сервер отправляет сохранённое сообщение участникам диалога, включая отправителя.
    messages:
      - $ref: '#/channels/dialogChat/messages/chatMessageReceived'

  sendChatError:
    action: send
    channel:
      $ref: '#/channels/dialogChat'
    title: Отправка ошибки в активной сессии чата
    summary: Сервер уведомляет клиента об ошибке обработки события.
    messages:
      - $ref: '#/channels/dialogChat/messages/chatError'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  messages:
    chatJoin:
      name: chat.join
      title: Запрос на подключение к диалогу
      payload:
        $ref: '#/components/schemas/ChatJoinPayload'

    chatMessageSend:
      name: chat.message.send
      title: Отправка сообщения в чат
      payload:
        $ref: '#/components/schemas/ChatMessageSendPayload'

    chatConnected:
      name: chat.connected
      title: Подключение подтверждено
      payload:
        $ref: '#/components/schemas/ChatConnectedPayload'

    chatMessageReceived:
      name: chat.message.received
      title: Сообщение доставлено участникам
      payload:
        $ref: '#/components/schemas/ChatMessageReceivedPayload'

    chatError:
      name: chat.error
      title: Ошибка обработки события
      summary: Сервер сообщает клиенту об ошибке в рамках активной сессии чата.
      payload:
        $ref: '#/components/schemas/ChatErrorPayload'

  schemas:
    ChatJoinPayload:
      type: object
      required:
        - eventType
      properties:
        eventType:
          type: string
          const: chat.join

    ChatMessageSendPayload:
      type: object
      required:
        - eventType
        - text
      properties:
        eventType:
          type: string
          const: chat.message.send
        text:
          type: string
          minLength: 1
          maxLength: 2000

    ChatConnectedPayload:
      type: object
      required:
        - eventType
        - dialogId
        - connectedAt
      properties:
        eventType:
          type: string
          const: chat.connected
        dialogId:
          type: string
          format: uuid
        connectedAt:
          type: string
          format: date-time

    ChatMessageReceivedPayload:
      type: object
      required:
        - eventType
        - dialogId
        - messageId
        - senderId
        - text
        - sentAt
      properties:
        eventType:
          type: string
          const: chat.message.received
        dialogId:
          type: string
          format: uuid
        messageId:
          type: string
          format: uuid
        senderId:
          type: string
          format: uuid
        text:
          type: string
          minLength: 1
          maxLength: 2000
        sentAt:
          type: string
          format: date-time

    ChatErrorPayload:
      type: object
      required:
        - eventType
        - code
        - message
        - sentAt
      properties:
        eventType:
          type: string
          const: chat.error
        code:
          type: string
          enum:
            - VALIDATION_ERROR
            - INTERNAL_ERROR
        message:
          type: string
        sentAt:
          type: string
          format: date-time
```
