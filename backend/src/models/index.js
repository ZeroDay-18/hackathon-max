import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Sequelize, DataTypes } from 'sequelize'; // Добавили DataTypes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const db = {};
const sequelize = new Sequelize(process.env.DB_CONNECT_URL);

// 1. Отфильтруем файлы синхронно
const files = fs.readdirSync(__dirname).filter(file => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
});

// 2. Используем цикл for...of вместо .forEach для корректной работы await
for (const file of files) {
    const filePath = path.join(__dirname, file);
    
    // В Node.js импорты должны быть в формате URL (file://...)
    const fileUrl = pathToFileURL(filePath).href; 
    
    // Импортируем модуль
    const modelModule = await import(fileUrl);
    
    // Инициализируем модель (берем export default из файла модели)
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
}

// 3. Настраиваем связи между моделями, когда они уже ВСЕ загружены
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
