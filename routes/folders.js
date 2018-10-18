'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();


router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  let folderId = req.params.id;
  knex.select('id', 'name')
    .from('folders')
    .where('id', folderId)
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const {name} = req.body;
  if (!name) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newFolder = {
    name: name,
  };

  knex.insert(newFolder)
    .into('folders')
    .returning(['id', 'name'])
    .then((results) => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateFolder = {
    name : name
  };

  knex('folders')
    .update(updateFolder)
    .where('id', noteId)
    .returning(['id', 'name'])
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  knex.del()
    .where('id', req.params.id)
    .from('folders')
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
