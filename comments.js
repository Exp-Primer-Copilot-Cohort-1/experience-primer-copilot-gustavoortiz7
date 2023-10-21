// Create web server application
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/comments');

var Comment = require('./models/comment');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {
  res.json({message: 'hooray! welcome to our api!'});
});

router.route('/comments')

  .post(function(req, res) {
    var comment = new Comment();
    comment.name = req.body.name;
    comment.text = req.body.text;

    comment.save(function(err) {
      if (err)
        res.send(err);

      res.json({message: 'Comment created!'});
    });
  })

  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);

      res.json(comments);
    });
  });

router.route('/comments/:comment_id')

  .get(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);

      res.json(comment);
    });
  })

  .put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);

      comment.name = req.body.name;
      comment.text = req.body.text;

      comment.save(function(err) {
        if (err)
          res.send(err);

        res.json({message: 'Comment updated!'});
      });
    });
  })

  .delete(function(req, res) {
    Comment.remove({
      _id: req.params.comment_id
    }, function(err, comment) {
      if (err)
        res.send(err);

      res.json({message: 'Successfully deleted'});
    });
  });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
