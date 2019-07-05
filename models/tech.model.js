const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const techSchema = new mongoose.Schema({
    techName: {
        type: String,
        required: true
    }
});

var list = ['Mulesoft'
    ,'Pega','Big Data','Middleware','DevOps','ServiceNOW','Databases','Cloud Tech','Infrastructure','Web Automation','Azure','Cyber','Java','Testing','C# .NET','Scala','Web Tech','BA','Angular','Python','Infrastructure/DevOps','DevOps/Testing','Java Tester','C# .NET/Azure/Robotics','Java/Testing','Big Data/DevOps','Blue Prism','Cloud','Performance Tester','Java EE','DevOps/Java','PowerBI','Cloudera','Test','Automated Testing','PMO','.NET','JavaScript/App Development','Full Stack Dev','DevOps/Azure'
    ,'API Developer','BA/PMO']

var Tech = module.exports = mongoose.model('Tech', techSchema);

Tech.count().then((count) => {
    if (count === 0) {
        list.map( techs => {
            console.log(techs);
            var newTech = new Tech({
                techName: techs
            });
            newTech.save();
        })
    }
  });