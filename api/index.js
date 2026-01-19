
const express = require('express');
const JavaScriptObfuscator = require('javascript-obfuscator');
const cors = require('cors');
const path = require('path'); // Tambahkan ini

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(cors());

// Tambahkan ini agar bisa buka tampilan website
app.use(express.static(path.join(__dirname, '../public')));

app.post('/obfuscate', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Mana kodenya, bang?' });

    try {
        const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 1,
            debugProtection: true,
            debugProtectionInterval: 4000,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            selfDefending: true,
            stringArray: true,
            stringArrayEncoding: ['base64', 'rc4'],
            stringArrayThreshold: 1,
            unicodeEscapeSequence: true
        });
        res.json({ result: obfuscationResult.getObfuscatedCode() });
    } catch (err) {
        res.status(500).json({ error: 'Gagal: ' + err.message });
    }
});

// Hapus bagian app.listen jika di-deploy ke Vercel, 
// tapi biarkan jika untuk test di local.
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log(`Server jalan di http://localhost:3000`));
}

module.exports = app;
