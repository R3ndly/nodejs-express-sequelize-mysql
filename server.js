const express = require('express');
const app = express();
const mysql = require('mysql2');
const multer = require('multer');
const fs = require('fs');
const faker = require('faker');
const path = require('path');

// Создание папки для изображений, если она еще не существует
const dir = './images';
if (!fs.existsSync(dir)){
fs.mkdirSync(dir);
} 

const config = {
host: 'localhost',
user: 'root',
password: 'Q1qqqqqq',
database: 'Vue'
};

app.use(express.json());


// Настройка multer для сохранения изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'images');
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
    }
    });
    const upload = multer({ storage: storage }); 


    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
        }); 
        app.use('/images', express.static('images'));





// Получить всех студентов
app.get('/students', (req, res) => {
const connection = mysql.createConnection(config);

connection.query(
'SELECT * FROM students',
function(err, results, fields) {
if (err) {
console.error('Ошибка запроса:', err);
res.status(500).json({ error: 'Ошибка при получении данных' });
} else {
res.status(200).json(results);
}
connection.end();
}
);
});


// Получить всех продуктов
app.get('/products', (req, res) => {
    const connection = mysql.createConnection(config);
    
    connection.query(
    'SELECT * FROM products',
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при получении данных' });
    } else {
    res.status(200).json(results);
    }
    connection.end();
    }
    );
    });








// Получить данные студента по ID
app.get('/students/:id', (req, res) => {
const studentId = req.params.id;

const connection = mysql.createConnection(config);

connection.query(
'SELECT * FROM students WHERE id = ?',
[studentId],
function(err, results, fields) {
if (err) {
console.error('Ошибка запроса:', err);
res.status(500).json({ error: 'Ошибка при получении данных' });
} else {
if (results.length > 0) {
res.status(200).json(results[0]);
} else {
res.status(404).json({ message: 'Студент не найден' });
}
}
connection.end();
}
);
});


// Получить данные продукта по ID
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    
    const connection = mysql.createConnection(config);
    
    connection.query(
    'SELECT * FROM products WHERE id = ?',
    [productId],
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при получении данных' });
    } else {
    if (results.length > 0) {
    res.status(200).json(results[0]);
    } else {
    res.status(404).json({ message: 'Продукт не найден' });
    }
    }
    connection.end();
    }
    );
    });
    







// Добавить нового студента с изображением
app.post('/students', upload.single('image'), (req, res) => {
    const newStudent = req.body;
    newStudent.image = req.file.path; // Путь к изображению
    
    const connection = mysql.createConnection(config);
    
    connection.query(
    'INSERT INTO students (Surname, Name, Patronymic, `Groups`, Height, Birthday, AverageScore, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [newStudent.Surname, newStudent.Name, newStudent.Patronymic, newStudent.Groups, newStudent.Height, newStudent.Birthday, newStudent.AverageScore, newStudent.image],
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при добавлении студента' });
    } else {
    res.status(201).json({ message: 'Студент успешно добавлен' });
    }
    connection.end();
    }
    );
    });


// Добавить нового продукта с изображением
app.post('/products', upload.single('image'), (req, res) => {
    const newProduct = req.body;
    newProduct.image = req.file.path; // Путь к изображению
    
    const connection = mysql.createConnection(config);
    
    connection.query(
    'INSERT INTO products (Title, Material, Weight, Engraving, Price, Collection, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [newProduct.Title, newProduct.Material, newProduct.Weight, newProduct.Engraving, newProduct.Price, newProduct.Collection, newProduct.image],
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при добавлении продукта' });
    } else {
    res.status(201).json({ message: 'Продукт успешно добавлен' });
    }
    connection.end();
    }
    );
    });









// Обновить данные студента по ID
app.put('/students/:id', upload.single('image'), (req, res) => { // Изменено
    const studentId = req.params.id;
    const updatedStudent = req.body;
    updatedStudent.image = req.file.path; // Добавлено
    
    const connection = mysql.createConnection(config);
    
    connection.query(
    'UPDATE students SET Surname = ?, Name = ?, Patronymic = ?, `Groups` = ?, Height = ?, Birthday = ?, AverageScore = ?, image = ? WHERE id = ?',
    [updatedStudent.Surname, updatedStudent.Name, updatedStudent.Patronymic, updatedStudent.Groups, updatedStudent.Height, updatedStudent.Birthday, updatedStudent.AverageScore, updatedStudent.image, studentId],
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при обновлении данных студента' });
    } else {
    res.status(200).json({ message: 'Данные студента успешно обновлены' });
    }
    connection.end();
    }
    );
    });


// Обновить данные продукта по ID
app.put('/products/:id', upload.single('image'), (req, res) => { // Изменено
    const productId = req.params.id;
    const updatedProduct = req.body;
    updatedProduct.image = req.file.path; // Добавлено
    
    const connection = mysql.createConnection(config);
    
    connection.query(
    'UPDATE products SET Title = ?, Material = ?, Weight = ?, Engraving = ?, Price = ?, Collection = ?, image = ? WHERE id = ?',
    [updatedProduct.Title, updatedProduct.Material, updatedProduct.Weight, updatedProduct.Engraving, updatedProduct.Price, updatedProduct.Collection, updatedProduct.image, productId],
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при обновлении данных продукта' });
    } else {
    res.status(200).json({ message: 'Данные продукта успешно обновлены' });
    }
    connection.end();
    }
    );
    });








// Удалить студента по ID
app.delete('/students/:id', (req, res) => {
const studentId = req.params.id;

const connection = mysql.createConnection(config);

connection.query(
'DELETE FROM students WHERE id = ?',
[studentId],
function(err, results, fields) {
if (err) {
console.error('Ошибка запроса:', err);
res.status(500).json({ error: 'Ошибка при удалении студента' });
} else {
res.status(200).json({ message: 'Студент успешно удален' });
}
connection.end();
}
);
});



// Удалить продукт по ID
app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;
    
    const connection = mysql.createConnection(config);
    
    connection.query(
    'DELETE FROM products WHERE id = ?',
    [productId],
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при удалении продукта' });
    } else {
    res.status(200).json({ message: 'Продукт успешно удален' });
    }
    connection.end();
    }
    );
    });






// Функция для получения списка всех изображений в папке 'images'
function getImages() {
return fs.readdirSync(path.join(__dirname, 'images'));
}

    // Функция для генерации случайного студента
    function generateRandomStudent() {
    const images = getImages();
    const imageUrl = "images/" + images[Math.floor(Math.random() * images.length)];
    return {
    Surname: faker.name.lastName(),
    Name: faker.name.firstName(),
    Patronymic: faker.name.middleName(),
    Groups: faker.datatype.number({min: 10, max: 50}),
    Height: faker.datatype.number({min: 150, max: 200}),
    Birthday: faker.date.past(20, '2000-01-01'),
    AverageScore: faker.datatype.float({min: 5, max: 14, precision: 0.1}),
    image: imageUrl // Используйте случайное изображение из папки 'images'
    };
    }

 // Эндпоинт для автозаполнения таблицы студентов
 app.post('/students/autofill', (req, res) => {
    const connection = mysql.createConnection(config);
    for (let i = 0; i < 10; i++) {
    const student = generateRandomStudent();
    connection.query(
    'INSERT INTO students (Surname, Name, Patronymic, `Groups`, Height, Birthday, AverageScore, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [student.Surname, student.Name, student.Patronymic, student.Groups, student.Height, student.Birthday, student.AverageScore, student.image],
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при добавлении студента' });
    return;
    }
    }
    );
    }
    connection.end();
    res.status(201).json({ message: 'Студенты успешно добавлены' });
    });








// Функция для генерации случайного продукта
function generateRandomProduct() {
    const images = getImages();
    const imageUrl = "images/" + images[Math.floor(Math.random() * images.length)];
    return {
        Title: faker.random.arrayElement(['Кольцо', 'Ожерелье', 'Серёжки']),
        Material: faker.random.arrayElement(['Золото', 'Серебро', 'Бронза']),
        Weight: faker.random.arrayElement(['200гр', '185гр', '315гр']),
        Engraving: faker.random.arrayElement(['-', 'Есть']),
        Price: faker.random.arrayElement([20000, 25000, 30000]),
        Collection: faker.random.arrayElement(['Третья', 'Соколовская', 'Коллекция']),
    image: imageUrl // Используйте случайное изображение из папки 'images'
    };
    }


    // Эндпоинт для автозаполнения таблицы продукты
    app.post('/products/autofill', (req, res) => {
    const connection = mysql.createConnection(config);
    for (let i = 0; i < 10; i++) {
    const product = generateRandomProduct();
    connection.query(
    'INSERT INTO products (Title, Material, Weight, Engraving, Price, Collection, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [product.Title, product.Material, product.Weight, product.Engraving, product.Price, product.Collection, product.image],
    function(err, results, fields) {
    if (err) {
    console.error('Ошибка запроса:', err);
    res.status(500).json({ error: 'Ошибка при добавлении продукта' });
    return;
    }
    }
    );
    }
    connection.end();
    res.status(201).json({ message: 'Продукты успешно добавлены' });
    });




const PORT = 3000;
app.listen(PORT, () => {
console.log(`Сервер запущен на порту http://localhost:${PORT}/students`);
});