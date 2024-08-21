//1ro. invoco los paquetes instalados
var express = require('express');
var mysql = require('mysql');
var cors = require('cors');



//2do. referencia al constructor de express
var app = express();
app.use(express.json());
app.use(cors());

// establecemos los parametros de conexion
const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'

});

//prueba de conexion
conexion.connect(function(error){
    if (error){
        throw error;
    }else{
        console.log('conexion exitosa a la base de datos');
    }
});

//3ro. configurar las rutas
app.get('/', function(req,res){
    res.send('ruta INICIO');

});


//creacion de metodos

//mostrar todos los articulos
app.get('/api/articulos',(req,res)=>{
    conexion.query('SELECT * FROM articulos',(error, filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
})

//mostrar un solo articulo
app.get('/api/articulos/:id',(req,res)=>{
    conexion.query('SELECT * FROM articulos WHERE id = ?', [req.params.id], (error, fila)=>{
        if(error){
            throw error;
        }else{
            //res.send(fila);
            res.send(fila[0].descripcion);
        }
    });
});

//insertar un articulo en la tabla
app.post('/api/articulos',(req,res)=>{
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    let sql = "INSERT INTO articulos SET ?";
    conexion.query(sql,data,function(error,resultado){
        if(error){
            throw error;
        }else{
            res.send(resultado);
        }
    });
});

//editar un articulo
app.put('/api/articulos/:id',(req,res)=>{
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
    conexion.query(sql,[descripcion,precio,stock,id],function(error,resultado){
        if(error){
            throw error;
        }else{
            res.send(resultado);
        }
        });
});

//eliminar un articulo
app.delete('/api/articulos/:id',(req,res)=>{
    conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id],function(error,filas){
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});


const puerto = process.env.puerta || 3000;

app.listen(puerto,function (){
    console.log("servidor ok en puerto :" + puerto);
});



