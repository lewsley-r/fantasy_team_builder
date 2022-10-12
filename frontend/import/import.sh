#! /bin/bash


mongoimport  --db 'premierLeague' --collection 'players' --jsonArray import/dataset.json