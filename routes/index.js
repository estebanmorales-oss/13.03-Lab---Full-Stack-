var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res, next) {
    const { task } = req.body;
    try {
      req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }
        console.log('Todo added successfully:', results);
        // Redirect to the home page after adding
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      res.status(500).send('Error adding todo');
    }
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

/* This will edit */
router.get('/edit/:id', function (req, res) {
  const id = req.params.id;

  req.db.query('SELECT * FROM todos WHERE id = ?;', [id], (err, results) => {
    if (err) {
      console.error('Error finding todo:', err);
      return res.status(500).send('Error finding todo');
    }


    res.render('edit', { todo: results[0] });
  });
});

/*Updates information */
router.post('/update/:id', function (req, res) {
  const id = req.params.id;            
  const { task, completed } = req.body; 
  
  const isDone = completed === 'on';

  req.db.query(
    'UPDATE todos SET task = ?, completed = ? WHERE id = ?;',
    [task, isDone, id],
    (err, results) => {
      if (err) {
        console.error('Error updating todo:', err);
        return res.status(500).send('Error updating todo');
      }


      res.redirect('/');
    }
  );
});


module.exports = router;