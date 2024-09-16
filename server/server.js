const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 设置静态文件目录
app.use(express.static('public'));

// 设置文件上传目录和文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 项目文件路径
const projectsPath = path.join(__dirname, '../data/projects.json');

// 初始化项目文件
function initializeProjectsFile() {
    if (!fs.existsSync(projectsPath)) {
        fs.writeFileSync(projectsPath, JSON.stringify([], null, 2));
    }
}

initializeProjectsFile();

// 验证是否为管理员的中间件
function verifyAdmin(req, res, next) {
    const isAdmin = req.headers['x-admin'];  // 从请求头中读取管理员标志
    if (isAdmin === 'true') {
        next();  // 如果是管理员，继续处理请求
    } else {
        res.status(403).json({ success: false, message: '无权限' });  // 否则返回403错误
    }
}

// 获取项目数据
app.get('/projects', (req, res) => {
    const fileData = fs.readFileSync(projectsPath, 'utf-8');
    if (fileData) {
        try {
            const projects = JSON.parse(fileData);
            return res.json(projects);
        } catch (err) {
            console.error('JSON解析错误：', err);
            return res.json([]);
        }
    } else {
        return res.json([]);
    }
});

// 处理上传文件 (仅管理员)
app.post('/upload', verifyAdmin, upload.single('file'), (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const file = req.file;

    if (!file) {
        return res.json({ success: false, message: '文件上传失败' });
    }

    const fileType = file.mimetype.startsWith('image') ? 'image' : 'video';

    const project = {
        title: title,
        description: description,
        file: file.filename,
        type: fileType
    };

    let projects = [];

    const fileData = fs.readFileSync(projectsPath, 'utf-8');
    if (fileData) {
        projects = JSON.parse(fileData);  // 解析已有数据
    }

    projects.push(project);

    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));

    res.json({ success: true });
});

// 更新项目数据 (仅管理员)
app.put('/projects/:id', verifyAdmin, upload.single('file'), (req, res) => {
    const projectId = req.params.id;
    const { title, description } = req.body;
    let projects = [];

    try {
        projects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));

        const project = projects[projectId];
        if (!project) {
            return res.status(404).json({ success: false, message: '项目未找到' });
        }

        // 更新项目数据
        project.title = title;
        project.description = description;

        // 如果有上传新文件，更新文件路径
        if (req.file) {
            project.file = req.file.filename;
            project.type = req.file.mimetype.startsWith('image') ? 'image' : 'video';
        }

        // 写入更新后的数据
        fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
        return res.json({ success: true });

    } catch (err) {
        console.error('项目更新错误:', err);
        return res.status(500).json({ success: false, message: '更新项目失败' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
