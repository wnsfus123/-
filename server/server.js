var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var http = require('http');
const socketUpload = require('socketio-file-upload');
var app = express();
var io = socketio();
var server = require('http').createServer(app);

io.attach(server);

const path = require('path');
const publicPath = path.join(__dirname, '../public');

var fileUpload = require('express-fileupload');
app.use(fileUpload());

var itemCount = 0;


io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('purchase', (purchaseInfo) => {
    console.log('Purchase received:', purchaseInfo);
    // 로그 메시지 전송
    io.emit('purchaseLog', purchaseInfo);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



var client = mysql.createConnection({
  user: 'root',   password: '1234',  database: 'moilkka'
});
app.use(socketUpload.router);
app.use(bodyParser.urlencoded({  extended: false   }));

app.use(express.static('public'));
app.use('/src', express.static(path.join(__dirname, "../src")));
app.get('/', function (req, res) {
    // 이제 서버 루트에서 index.html을 제공합니다.
    res.sendFile(path.join(publicPath, 'index.html'));
});
server.listen(52273, function () {
  console.log('server running at http://127.0.0.1:52273');
});




  
//질문

// app.get('/', function (request, response) {
//     fs.readFile('./public/main.html', 'utf8', function (error, data) {
//       // 데이터베이스 쿼리를 실행
//       client.query('SELECT * FROM products', function (error, results) {
//           if (error) throw error;
//           console.log(results);
//           response.send(ejs.render(data, {
//               data: results
//           }));
//       });
//   });
// });



//   app.get('/list', function (request, response) {
//     fs.readFile('public/list.html', 'utf8', function (error, data) {
//         // 데이터베이스 쿼리를 실행
//         client.query('SELECT * FROM products', function (error, results) {
//             if (error) throw error;
//             console.log(results);
//             response.send(ejs.render(data, {
//                 data: results
//             }));
//         });
//     });
// });
//   app.get('/delete/:id', function (request, response) {
//     client.query('DELETE FROM products WHERE id=?', [request.params.id], function () {
//       response.redirect('/list');
//    });
//  });

//   app.get('/insert', function (request, response) {
//     fs.readFile('public/insert.html', 'utf8', function (error, data) {
//       response.send(data);
//       console.log('get');
//     });
//   });
// app.post('/insert', (req, res) => {
//   const { body, files } = req;
//   const uploadedFile = files.file;

//   // 파일 이름을 현재 날짜 및 시간
//   const imageName = `product${Date.now()}.jpg`;
//   const imagePath = path.join(uploadFolder, imageName);

//   uploadedFile.mv(imagePath, (mvError) => {
//     if (mvError) return res.status(500).send(mvError);

//     const dbImagePath = '/images/' + imageName;
//     client.query('INSERT INTO products (name, img, content, qty ,price) VALUES (?, ?, ?, ?, ?)', [
//       body.name, dbImagePath, body.content, body.qty ,body.price
//     ], (dbError) => {
//       if (dbError) return res.status(500).send(dbError);
//       res.redirect('/list');
//     });
//   });
// });
  
  
//   app.get('/edit/:id', function (request, response) {
//     fs.readFile('public/edit.html', 'utf8', function (error, data) {
//       client.query('SELECT * FROM products WHERE id = ?', [
//           request.params.id
//       ], function (error, result) {
//         response.send(ejs.render(data, {
//           data: result[0]
//         }));
//       });
//     });
//   });
//   app.post('/edit/:id', function (request, response) {
//     var body = request.body;
//     client.query('UPDATE products SET name=?, img=?, content=?, price=?, qty=? WHERE id=?', 
//        [body.name, body.img, body.content, body.price, body.qty, request.params.id], function () {
//        response.redirect('/list');
//     });
//   });
  
             
//   app.post('/purchase/:id', (req, res) => {
//     const productId = req.params.id;
  
//     // 데이터베이스에서 해당 상품 정보를 가져옵니다.
//     client.query('SELECT * FROM products WHERE id = ?', [productId], (error, result) => {
//       if (error) {
//         console.error('Error retrieving product information:', error);
//         res.status(500).send('Internal Server Error');
//       } else {
//         // 상품 정보가 없으면 404 에러를 응답합니다.
//         if (result.length === 0) {
//           res.status(404).send('Product not found');
//         } else {
//           const product = result[0];
//           //수량 감소
//           if (product.qty > 0) {
//             client.query('UPDATE products SET qty = qty - 1 WHERE id = ?', [productId], (updateError, updateResult) => {
//                 // 성공 상태 응답
//                 res.sendStatus(200);
//             });
//           } else {
//             // 상품 수량 부족
//             res.status(400).send('Product out of stock');
//           }
//         }
//       }
//     });
//   });
