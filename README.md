## RabbitMQ X-Death Count Bug

Version v3.13.0 of RabbitMQ breaks the behaviour of the x-death header so that the count attribute is no longer incremented when messages are repeatedly rejected.

### Prerequisites
1. Docker
2. Docker Compose
3. Node 16 or higher

### Before
```
docker-compose start
# It may take a few seconds for RabbitMQ to initialise
```

### Working
```
npm run v3.12.9
```

### Broken
```
npm run v3.13.0
```



