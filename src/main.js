import { createApp } from "vue"
import App from "./App.vue"
import "./assets/styles/app.css"

createApp(App).mount("#app")

const appTheme = localStorage.getItem('theme');

// Check what is the active theme
if (
  appTheme === 'dark' &&
  document.querySelector('body').classList.contains('app-theme')
) {
  document.querySelector('body').classList.add('bg-primary-dark');
} else {
  document.querySelector('body').classList.add('bg-secondary-light');
}
