import { defineFunction } from '@aws-amplify/backend';

export const weatherFunction = defineFunction({
  name: 'weather',
  entry: './handler.ts',
  environment: {
    OPENWEATHER_API_KEY: '5b801d217dfdee6cc0c63f2206f422d0'
  }
}); 