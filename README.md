# NgTrackThings

A Todo list made with vuejs to track whatever you want, 
the initial ideia is create a list with tasks and provide a screen to list and check theses tasks

But in future new feature like add geolocalization to send a reminder to user that him need do a thing in that place

## Motivation
I'm a forgetful guy, I need to use tools like todoist and trello to keep my things doing fine, an example of this is that I do exercise in gym and there I have a 'script' to follow, with exercises(biceps, triceps etc), And I have a difficult to keep in mind all of these trains. I had used Whatsapp to write down the exercises this help me but have no a way to mark as done, and how you know a train repeat along of the week (Sunday, Tuesday), tools like trello and todoist have no a good support for repeated tasks maybe todoist but is not too good like I would want.

You can see that same project using Vuejs [here](https://github.com/valterbarros/trackthings)

## Drag n Drop

The drag n drop for cards and list's moviment things like colision, distance, future card position, etc was done using pure javascript and **0 libs to do that work** I did that to practice javacript and my logic, you can see more about those features on lists: src/pages/sub-lists/index-sub-list/index-sub-list.ts, src/pages/sub-lists/index-sub-list/index-sub-list.html, src/pages/sub-lists/index-sub-list/index-sub-list.scss. and cards on folder: src/pages/sub-lists/index-sub-list/card-sub-list/.ts, .html, .scss

## Development server

```
npm i
ng serve # Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
```

## Screenshots

![gif1](https://trello-attachments.s3.amazonaws.com/5b1f32fc8c8a6315142c70be/5b1f32fc8c8a6315142c70cf/64deffb46b571be4a508d4c2f116468b/Screen-Recording-2020-01-27-at-23.48.06.gif)
![gif2](https://trello-attachments.s3.amazonaws.com/5b1f32fc8c8a6315142c70be/5b1f32fc8c8a6315142c70cf/ac8df742554b2e65bbc71b20d33b8f2f/Screen-Recording-2020-01-27-at-23.39.28.gif)