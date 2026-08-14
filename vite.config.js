import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services/index.html'),
        backPain: resolve(__dirname, 'services/back-pain-sciatica-physiotherapy-nashik/index.html'),
        neckShoulder: resolve(__dirname, 'services/neck-shoulder-pain-physiotherapy-nashik/index.html'),
        kneePain: resolve(__dirname, 'services/knee-pain-arthritis-physiotherapy-nashik/index.html'),
        sportsInjury: resolve(__dirname, 'services/sports-injury-physiotherapy-nashik/index.html'),
        postSurgery: resolve(__dirname, 'services/post-surgery-rehabilitation-nashik/index.html'),
        elderlyCare: resolve(__dirname, 'services/elderly-care-physiotherapy-nashik/index.html'),
      },
    },
  },
});
