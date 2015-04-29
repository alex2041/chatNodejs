var User = require('./schema/user').User;
var admin = new User({
    name: 'root',
    password: 'pass@word1'
});
admin.save(function(err){
    if(err) console.dir(err);
});









/*
 var mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/test');

 var schemaCat = mongoose.Schema({
     name: String,
     age: Number 
 });

 schemaCat.methods.say = function(){
     console.log('Hello from ' + this.get('name'));
 }

 var Cat = mongoose.model('Cat', schemaCat);

 var murzik = new Cat({ name: 'Murzik', age: 5 });
 murzik.save(function (err) {
   if (err) // ...
   console.log('murzik says meow');
 });

 var barsik = new Cat({ name: 'Barsik', age: "5" });
 barsik.save(function (err) {
   if (err) // ...
   console.log('barsik says meow');
 });

 var tuzik = new Cat({ name: 'Tuzik', age: 44 });
 tuzik.save(function (err) {
   if (err) // ...
     console.log('tuzik says meow');
   else
     tuzik.say();
 });
 */

/*
 var MongoClient = require('mongodb').MongoClient,
     format = require('util').format;

 MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
     if(err) throw err;
     
     var collection = db.collection('test_insert');
     collection.insert({a:2}, function(err, docs) {
         
         collection.count(function(err, count) {
             console.log(format("count = %s", count));
         });
         
         collection.find().toArray(function(err, result) {
             console.dir(result);
             db.close();
         });
     });
 });
 */