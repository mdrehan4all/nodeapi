const express = require('express');
const app = express();
const database = require("./database");
const sha256 = require('sha256');

const PORT = 8080;
const ROOTDIR = '/nodeapi'

app.use(express.json());

app.get(ROOTDIR+"/hello", (req, res)=>{
    res.status(200)
    res.send({
        "message": "Hello World"
    });
});

app.get(ROOTDIR+"/user/:id", (req, res)=>{
    let id = req.params.id;
    let body = req.body;

    var sql = "INSERT INTO todolist (heading, task) VALUES ('abc', 'abcd')";
    database.query(sql, (err, result)=>{
        console.log(err, result);
    })

    res.status(200)
    res.send({
        "message": "id="+id+" body="+body
    });
});

// Login and Signup
function updateToken(token, email){
    var sql = `UPDATE users SET token = '${token}' WHERE email = '${email}'`;
    database.query(sql, (err, result)=>{
        //if(err) throw err;
        //console.log(result);
    });
}
function getId(email){
    let id = 0;
    var sql = `SELECT * FROM users WHERE email='${email}'`;
    database.query(sql, (err, result, fields)=>{
        if(err) throw err;
        id = result.id;
    });
    return id;
}

app.post(ROOTDIR+"/signup", (req, res)=>{
    let body = req.body;
    let name = body.name;
    let email = body.email;
    let password = body.password;

    //console.log(body)

    var sql = `INSERT INTO users (email, password, name, token) VALUES ('${email}', '${password}', '${name}', '')`;
    database.query(sql, (err, result)=>{
        if(err){
            //throw err;
            res.status(200)
            res.send({
                "message": ""+err
            });
        }else{
            const random = Math.random() * 1000;
            const time = Date.now();
            const id = getId(email);
            let token = sha256(random+"-"+time+"-"+id);
            updateToken(token, email);
            console.log(id)
            
            res.status(200)
            res.send({
                "id": id,
                "message": "successfully inserted",
                "token": token
            });
        }
        //console.log(result);
    });
});

app.post(ROOTDIR+"/login", (req, res)=>{
    let body = req.body;
    let email = body.email;
    let password = body.password;
    
    let data = {
        "id": 0,
        "email": "",
        "token": ""
    };
    var sql = `SELECT * FROM users WHERE email='${email}'`;
    database.query(sql, (err, result, fields)=>{
        if(err) throw err;
        //console.log(result[0]);
        data.id = result[0].id;
        data.email = result[0].email;
        //data.token = result[0].token;

        const random = Math.random() * 1000;
        const time = Date.now();
        let token = sha256(random+"-"+time+"-"+data.id);
        updateToken(token, data.email);
        data.token = token;

        res.status(200);
        res.send({
            "id": data.id,
            "message": "successfully fetched",
            "token": token
        });
    })

    /*res.status(200);
    res.send({
        "message": "error in fetching",
        "data": data
    });*/
});


app.listen(PORT, ()=>{
    console.log(`App is listening at ${PORT}`);
})