/*
 * Serve JSON to our AngularJS client
 */
var express = require('express');
var validator = require('../public/js/validator');
var mongo   = require("mongoose");
var db        = require('../module/mongo');
var session     = require('express-session');
var mongoStore  = require('connect-mongo')(session);
var router = express.Router();
var monSchema = new mongo.Schema({
  _id     : {type:String},
  title   : {type:String},
  text    : {type:String},
  username: {type:String},
  date    : {type:Date},
  comment : {type:Array},
  isHide  : {type:Boolean}
});
var monModel = db.model('blog',monSchema);

function saveBlog(data, callback) {
  data.date = new Date();
  data._id = data.date.toString() + data.username;
  data.comment = [];
  var monInsert = new monModel(data);
  monInsert.save(callback);
}
function removeBlog(id, callback) {
  db.model('blog').findByIdAndRemove(id,callback);
}
function showBlogByPage(page,callback) {
  db.model('blog').find({}, null, {sort:{date:-1},skip:(page-1)*15,limit:15}, callback);
}
function handleDoc(err, page, doc, callback) {
  var p= {
    _id : doc._id,
    title: doc.title,
    text: doc.text,
    username:doc.username,
    date: doc.date,
    isHide:doc.isHide,
    comment:[],
    length: doc.comment.length
  };
  if(doc) {
    var k=p.length-1-(page-1)*10;
    var j=k>10?9:k;
    for(var i=0;i<=j;i++)
      p.comment.push(doc.comment[k-i]);
  }
  callback(err,p);
}
// function findBlogAtMost15(username, page, callback) {
//   db.model('blog').find({username:username},null,{sort:{date:-1},skip:(page-1)*15,limit:15},function(err,doc) {
//     handleDoc(err, 1, doc, callback);
//   });
// }
function findBlogById(id, page, callback) {
  if(typeof page === 'function') {
    callback = page;
    page = 1;
  } else if(page === NaN) {
    page = 1;
  }
  db.model('blog').findById(id,function(err,doc) {
    handleDoc(err, page, doc,callback);
  });
}
function updateBlog(id, data, callback) {
  var date = new Date();
  db.model('blog').findByIdAndUpdate(id,{$set:{
    date  : date,
    title : data.title,
    text  : data.text,
  }},callback);
}
function hideBlog(id, data, callback) {
  var date = new Date();
  db.model('blog').findByIdAndUpdate(id,{$set:{isHide:data.isHide}},callback);
}
function commentBlog(id, data, callback) {
  var date = new Date();
  db.model('blog').findByIdAndUpdate(id,{$push:{
    comment: {
      username : data.username,
      context  : data.context,
      date     : date,
      _id      : date.toString() + data.username
    }
  }},callback);
}
function removeBlogComment(id, data, callback) {
  db.model('blog').findByIdAndUpdate(id,{
    $pull:{comment: {_id : data.id}}
  },callback);
}
function updateBlogComment(id, data, callback) {
  db.model('blog').update({
    _id:id,
    'comment._id':data._id
  },{$set:{'comment.$.context': data.context}},callback);
}
function hideBlogComment(id, data, callback) {
  db.model('blog').update({
    _id:id,
    'comment._id':data.id
  },{$set:{'comment.$.isHide': data.isHide}},callback);
}
function loginValidator(req, res, callback) {
  if(req.session.username ) {
    new mongoStore({
      mongooseConnection : db,
      ttl : 6 * 60 * 60 * 1000 //6h
    }).get(req.sessionID,function(err,doc) {
      if(err)
        console.log(err);
      else if(doc.username === req.session.username) {
        callback(doc);
      } else
        res.json({isLogin: false});
    });
  } else
    res.json({isLogin: false});
}

// GET
exports.isLoginApp = function(req, res) {
  loginValidator(req,res,function(data) {
    db.isRepeatedUsername(data.username, function(err,doc) {
      if(err) {
        console.log(err)
        res.json({isLogin:false});
      } else {
        res.json({
          isLogin:true,
          isAdmin:doc.isAdmin,
          username:doc.username
        });
      }
    });
  })
}
exports.posts = function (req, res) {
  loginValidator(req, res, function(data) {
    showBlogByPage(req.query.p,function(err,doc) {
      if(err){
        console.log(err);
        res.json(false);
      } else {
        res.json({
          isLogin: true,
          user: data.username,
          posts: doc
        });
      }
    });
  });
};
exports.count = function (req, res) {
  db.model('blog').count(function(err,data) {
    if(err) {
      console.log(err);
      res.json(false);
    } else {
      res.json(data);
    }
  })
}
exports.post = function (req, res) {
  var id = req.params.id;
  loginValidator(req, res, function(data) {
    findBlogById(id,parseInt(req.query.p),function(err, doc) {
      if(err)
        res.json(false);
      else {
        res.json(doc);
      }
    });
  });
};

// POST

exports.addPost = function (req, res) {
  loginValidator(req, res, function(data) {
    req.body.username = data.username;
    saveBlog(req.body,function(err) {
      if(err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(req.body);
      }
    });
  });
};
exports.hidePost = function (req, res) {
  loginValidator(req, res, function(data) {
    hideBlog(req.params.id,req.body,function(err,doc) {
      if(err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    });
  });
};

// PUT

exports.editPost = function (req, res) {
  var id = req.params.id;
  loginValidator(req, res, function(data) {
    updateBlog(id, req.body, function(err, doc) {
      if(err)
        res.json(false);
      else
        res.json(true);
    });
  });
};
exports.addComment = function (req, res) {
  var id = req.params.id;
  loginValidator(req, res, function(data) {
    commentBlog(id, req.body, function(err, doc) {
      if(err)
        res.json(false);
      else {
        findBlogById(id,function(err,doc) {
          if(err)
            res.json(false);
          else
            res.json(doc);
        })
      }
    });
  });
};
exports.deleteComment = function (req, res) {
  var id = req.params.id;
  loginValidator(req, res, function(data) {
    removeBlogComment(id, req.body, function(err, doc) {
      if(err)
        res.json(false);
      else {
        findBlogById(id,function(err,doc) {
          if(err)
            res.json(false);
          else
            res.json(doc);
        });
      }
    });
  });
};
exports.updateComment = function (req, res) {
  var id = req.params.id;
  loginValidator(req, res, function(data) {
    updateBlogComment(id, req.body, function(err, doc) {
      if(err)
        res.json(false);
      else {
        findBlogById(id,function(err,doc) {
          if(err)
            res.json(false);
          else
            res.json(doc.comment);
        });
      }
    });
  });
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;
  loginValidator(req, res, function(data) {
    removeBlog(id, function(err) {
      if(err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    });
  });
};

//admin

exports.hideComment = function (req, res) {
  var id = req.params.id;
  loginValidator(req, res, function(data) {
    db.isRepeatedUsername(data.username, function(err,doc) {
      if(doc.isAdmin) {
        hideBlogComment(id, req.body, function(err) {
          if(err) {
            console.log(err);
            res.json(false);
          } else {
            res.json(true);
          }
        });
      } else {
        res.json(false);
      }
    });
  });
}

function returnBlogsBySeach(arr, o) {
  if(typeof o === 'object') {
    var k= arr.length;
    for(var i=0;i<o.length;++i) {
      var j=0;
      while(j<k)
        if(arr[j]._id === o[i]._id)
          break;
        else
          ++j;
      if(j===k)
        arr.push(o[i]);
    }
  }
}
exports.seach = function(req, res) {
  var filter = [];
  var resDoc = [];
  req.body.filter.forEach(function(s) {
    filter.push(new RegExp(s));
  });
  var count = filter.length;

  new Promise(function(resolve,reject) {
    for(var i=0;i<filter.length;++i)
      db.model('blog').find({
        $or:[
          {username:{$regex:filter[i]}},
          {title   :{$regex:filter[i]}},
          {text    :{$regex:filter[i]}}
        ]
      },function(err, doc) {
        returnBlogsBySeach(resDoc, doc);
        count--;
        if(count<=0) {
          return resolve();
        }
      });
  }).
  catch(function(err){
    console.log(err);
    res.json(false);
  }).
  then(function() {
    res.json(resDoc);
    return;
  });
}