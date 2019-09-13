To simplify the creation of some things in the Redux store, I thought I would create some 'model' classes.
These are just to make creating an object of the correct shape simpler. It also helps with instances where
objects are not necessarily pure -- e.g., the Chapter model has a random uuid associated with it.