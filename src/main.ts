// startpunkt von der ganzen app, der browser lädt als erstes diese datei
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/* bootstrapApplication startet Angular ohne NgModule, ist die neuere Art das zu machen.
   ich geb einfach die Root-Komponente (App) mit und meine config mit den ganzen providern rein */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err)); // falls beim start was schief geht seh ich es wenigstens in der konsole
