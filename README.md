# netmobiel-vue-client

## Project setup
```
npm install
```

## Configuration
For local testing, set the following variables in your .env.local file:
```
# (Optional) Direct access config for the backend - development only!
VUE_APP_DEV_BACKEND_URL=http://localhost:8080

# Base url for the backend services
VUE_APP_SERVICE_URL=http://localhost:8080

# API keys in case you are using a API gateway
VUE_APP_PLANNER_SERVICE_API_KEY=<...>
VUE_APP_GEOCODE_SERVICE_API_KEY=<...>
VUE_APP_PROFILE_SERVICE_API_KEY=<...>
VUE_APP_RIDESHARE_SERVICE_API_KEY=<...>
VUE_APP_COMMUNICATOR_SERVICE_API_KEY=<...>
VUE_APP_BANKER_SERVICE_API_KEY=<...>
VUE_APP_MAPBOX_TOKEN=<...>
VUE_APP_CREDITS_ENABLED=<...>
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

For production settings run:
```
npm run lint-prod
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
