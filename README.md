# FitnessTracker

Angular application for recording workouts and viewing training history. Users can select from a range of different exercise types and either complete the workout fully, or cancel mid-way through - the app will then calculate how the total duration along with how many calories were burnt.

The app is connected to a Firebase cloud database via Angular Firestore (for storing the exercise types and workout history, and for authentication), and uses Angular Material for the UI/styling elements (it is also fully responsive). NGRX is used for state management.

I built the application using Academind's Udemy Course, however I have expanded on the initial functionality by allowing users to only view their own exercise history, by implementing some Firebase rules along with new queries (the core project in the course allowed any user to view exercise history for all users).

The app is hosted on Firebase Hosting and can be accessed here: https://angular-fitness-tracker-c987b.web.app

![Showcase1](/showcase-1.png?raw=true "Showcase1")
![Showcase2](/showcase-2.png?raw=true "Showcase2")
![Showcase3](/showcase-3.png?raw=true "Showcase3")
