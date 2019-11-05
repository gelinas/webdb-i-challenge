const express = require('express');

// database access using knex
const knex = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.query)
    let query = knex.select('*').from('accounts')
    if (req.query.name) {
        query = query.where({
          name: req.query.name
        });
      }
    if (req.query.orderBy && req.query.orderDir) {
        query = query.orderBy(req.query.orderBy, req.query.orderDir);
    } else if (req.query.orderBy) {
        query = query.orderBy(req.query.orderBy);
    }
    query
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to get accounts from database'});
        })
});

router.post('/', (req, res) => {
    knex
        .insert(req.body, 'id') // ignore the console warning on SQLite
        .into('accounts')
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to insert post' });
        });
});

router.get('/:id', (req, res) => {
    knex
        .select('*')
        .from('accounts')
        .where('id', '=', req.params.id)
        .first()
        .then(account => {
            if (account) {
                res.status(200).json(account);
            } else {
                res.status(400).json({ message: "invalid account id" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to get account from database'});
        })
});

router.put('/:id', (req, res) => {
    // const id = req.params.id;
    // const changes = req.body;
    knex('accounts')
        .where({ id: req.params.id })
        // .where('id', '=', req.params.id)
        .update({
            "name": "test"
        })
        .then(count => { // count: how many record rows were updated
            res.status(200).json(count);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to update post' });
        });
});

router.delete('/:id', (req, res) => {
    // const id = req.params.id;
    knex('accounts')
        .where({ id: req.params.id })
        .del()
        .then(count => { // count: how many record rows were deleted
            res.status(200).json(count);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to delete post' });
        });
});

module.exports = router;``