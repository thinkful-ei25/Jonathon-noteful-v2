'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();


router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  knex.select('id', 'name')
    .where('id', id)
    .from('tags')
    .then(results => {
      if(results){
        res.json(results);
      } 
      else{
        next();
      }
    })
    .catch(err => next(err));
});


router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const {name} = req.body;
  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateTag = {
    name: name
  };
  knex('tags')
    .update(updateTag)
    .where('id', id)
    .returning(['id', 'name'])
    .then(([result]) => {
      if(result){
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});


router.delete('/:id', (req, res, next) =>{
  req.id;
  knex.delete()
    .where('id', req.params.id)
    .from('tags')
    .then(() => {
      res.status(204).end();
    })
    .catch(err => next(err));
});

module.exports = router;