const { onRequest } = require("firebase-functions/v2/https"); // ✅ Gen 2
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");



const app = express()
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.use(express.json()); // 👈 สำคัญมาก! ช่วยให้ req.body ใช้งานได้

const mongoUri = `mongodb+srv://nippit62:ohm0966477158@testing.hgxbz.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongoUri).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});


const px_pm3250_schema = new mongoose.Schema({
    voltage: Number,
    current: Number,
    power: Number,
    active_power_phase_a: Number,
    active_power_phase_b: Number,
    active_power_phase_c: Number,
    voltage1: Number,
    voltage2: Number,
    voltage3: Number,
    voltageln: Number,
    voltagell: Number,
    timestamp: { type: Date, default: () => new Date(Date.now() + (7 * 60 * 60 * 1000)) },
});

const power_px_pm3250 = mongoose.model("power_px_pm3250", px_pm3250_schema);

const clinic = new mongoose.Schema({
    voltage: Number,
    current: Number,
    power: Number,

    timestamp: { type: Date, default: () => new Date(Date.now() + (7 * 60 * 60 * 1000)) },
});

const clinic_power = mongoose.model("clinic_power", clinic);

const px_dh_schema = new mongoose.Schema({
    voltage: Number,
    current: Number,
    power: Number,
    active_power_phase_a: Number,
    active_power_phase_b: Number,
    active_power_phase_c: Number,
    voltage1: Number,
    voltage2: Number,
    voltage3: Number,
    voltageln: Number,
    voltagell: Number,
    timestamp: { type: Date, default: () => new Date(Date.now() + (7 * 60 * 60 * 1000)) },
});

const power_px_dh11 = mongoose.model("power_px_dh11", px_dh_schema);

const sukhothai_schema = new mongoose.Schema({
    active_power_phase_a: Number,
    active_power_phase_b: Number,
    active_power_phase_c: Number,
    timestamp: { type: Date, default: () => new Date(Date.now() + (7 * 60 * 60 * 1000)) },
});

const sukhothai_power = mongoose.model("sukhothai_power", sukhothai_schema);

const resort_schema = new mongoose.Schema({
    voltage: Number,
    current: Number,
    power: Number,
    timestamp: { type: Date, default: () => new Date(Date.now() + (7 * 60 * 60 * 1000)) },
});

const resort_power = mongoose.model("resort_power", resort_schema);

const resident_schema = new mongoose.Schema({
    voltage: Number,
    current: Number,
    power: Number,
    active_power_phase_a: Number,
    active_power_phase_b: Number,
    active_power_phase_c: Number,
    timestamp: { type: Date, default: () => new Date(Date.now() + (7 * 60 * 60 * 1000)) },
});

const resident_power = mongoose.model("resident_power", resident_schema);

const hospital_schema = new mongoose.Schema({
    voltage: Number,
    current: Number,
    power: Number,
    active_power_phase_a: Number,
    active_power_phase_b: Number,
    active_power_phase_c: Number,
    timestamp: { type: Date, default: () => new Date(Date.now() + (7 * 60 * 60 * 1000)) },
});


const hospital_power = mongoose.model("hospital_power", hospital_schema);



// 👉 POST /api/sensor
app.post("/sensor", async (req, res) => {
    const data = req.body;
    console.log("📡 Received from ESP32:");
    console.log(data);

    // เก็บข้อมูลล่าสุดไว้ในตัวแปร
    lastSensorData = data;

    // บันทึกลง MongoDB
    try {
        const newEntry = new sukhothai_power({
            voltage: data.voltage,
            current: data.current,
            power: data.power,
        });

        await newEntry.save();

        return res.status(200).json({ message: "✅ Data saved to database!", data });
    } catch (err) {
        console.error("❌ Failed to save to DB:", err);
        return res.status(500).json({ message: "❌ Failed to save to database.", error: err });
    }
});

// 👉 POST /api/sensor
app.post("/sensor/px_pm3250", async (req, res) => {
    const data = req.body;
    console.log("📡 Received from ESP32:");
    console.log(data);

    // เก็บข้อมูลล่าสุดไว้ในตัวแปร
    lastSensorData = data;

    // บันทึกลง MongoDB
    try {
        const newEntry = new power_px_pm3250({
            voltage: data.voltage,
            current: data.current,
            power: data.power,
            active_power_phase_a: data.active_power_phase_a,
            active_power_phase_b: data.active_power_phase_b,
            active_power_phase_c: data.active_power_phase_c,
            voltage1: data.voltage1,
            voltage2: data.voltage2,
            voltage3: data.voltage3,
            voltageln: data.voltageln,
            voltagell: data.voltagell,
        });

        await newEntry.save();

        return res.status(200).json({ message: "✅ Data saved to database!", data });
    } catch (err) {
        console.error("❌ Failed to save to DB:", err);
        return res.status(500).json({ message: "❌ Failed to save to database.", error: err });
    }
});

// 👉 POST /api/sensor
app.post("/sensor/clinic", async (req, res) => {
    const data = req.body;
    console.log("📡 Received from ESP32:");
    console.log(data);

    // เก็บข้อมูลล่าสุดไว้ในตัวแปร
    lastSensorData = data;

    // บันทึกลง MongoDB
    try {
        const newEntry = new clinic_power({
            voltage: data.voltage,
            current: data.current,
            power: ((data.voltage * data.current) / 1000).toFixed(2),
            // active_power_phase_a: data.active_power_phase_a,
            // active_power_phase_b: data.active_power_phase_b,
            // active_power_phase_c: data.active_power_phase_c,
            // voltage1: data.voltage1,
            // voltage2: data.voltage2,
            // voltage3: data.voltage3,
            // voltageln: data.voltageln,
            // voltagell: data.voltagell,
        });

        await newEntry.save();

        return res.status(200).json({ message: "✅ Data saved to database!", data });
    } catch (err) {
        console.error("❌ Failed to save to DB:", err);
        return res.status(500).json({ message: "❌ Failed to save to database.", error: err });
    }
});


// 👉 POST /api/sensor
app.post("/sensor/px_dh", async (req, res) => {
    const data = req.body;
    console.log("📡 Received from ESP32:");
    console.log(data);

    // เก็บข้อมูลล่าสุดไว้ในตัวแปร
    lastSensorData = data;

    // บันทึกลง MongoDB
    try {
        const newEntry = new power_px_dh11({
            voltage: data.voltage,
            current: data.current,
            power: data.power,
            active_power_phase_a: data.active_power_phase_a,
            active_power_phase_b: data.active_power_phase_b,
            active_power_phase_c: data.active_power_phase_c,
            voltage1: data.voltage1,
            voltage2: data.voltage2,
            voltage3: data.voltage3,
            voltageln: data.voltageln,
            voltagell: data.voltagell,
        });

        await newEntry.save();

        return res.status(200).json({ message: "✅ Data saved to database!", data });
    } catch (err) {
        console.error("❌ Failed to save to DB:", err);
        return res.status(500).json({ message: "❌ Failed to save to database.", error: err });
    }
});
// 👉 POST /api/sensor
app.post("/sensorResort", async (req, res) => {
    const data = req.body;
    console.log("📡 Received from ESP32:");
    console.log(data);

    // เก็บข้อมูลล่าสุดไว้ในตัวแปร
    lastSensorData = data;

    // บันทึกลง MongoDB
    try {
        const newEntry = new resort_power({
            voltage: data.voltage,
            current: data.current,
            power: data.power,
        });

        await newEntry.save();

        return res.status(200).json({ message: "✅ Data saved to database!", data });
    } catch (err) {
        console.error("❌ Failed to save to DB:", err);
        return res.status(500).json({ message: "❌ Failed to save to database.", error: err });
    }
});

// 👉 POST /api/sensor
app.post("/sensorResident", async (req, res) => {
    const data = req.body;
    console.log("📡 Received from ESP32:");
    console.log(data);

    // เก็บข้อมูลล่าสุดไว้ในตัวแปร
    lastSensorData = data;

    // บันทึกลง MongoDB
    try {
        const newEntry = new resident_power({
            voltage: data.voltage,
            current: data.current,
            power: data.power,
        });

        await newEntry.save();

        return res.status(200).json({ message: "✅ Data saved to database!", data });
    } catch (err) {
        console.error("❌ Failed to save to DB:", err);
        return res.status(500).json({ message: "❌ Failed to save to database.", error: err });
    }
});

app.post("/sensorHospital", async (req, res) => {
    const data = req.body;
    console.log("📡 Received from ESP32:");
    console.log(data);

    // เก็บข้อมูลล่าสุดไว้ในตัวแปร
    lastSensorData = data;

    // บันทึกลง MongoDB
    try {
        const newEntry = new hospital_power({
            voltage: data.voltage,
            current: data.current,
            power: data.power,
            power_phase_a: data.power_phase_a,
            power_phase_b: data.power_phase_b,
            power_phase_c: data.power_phase_c,
        });

        await newEntry.save();

        return res.status(200).json({ message: "✅ Data saved to database!", data });
    } catch (err) {
        console.error("❌ Failed to save to DB:", err);
        return res.status(500).json({ message: "❌ Failed to save to database.", error: err });
    }
});





app.get("/", (req, res) => {
    res.send("Hello from Firebase Cloud Functions!");
});

// รายวัน (แต่สรุปเป็นรายชั่วโมงภายในวันนั้น) — JSON
app.get('/clinic/export-daily-json/:date', async (req, res) => {
    try {
        const { date } = req.params; // YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
        }

        const dayStart = new Date(`${date}T00:00:00`);
        const dayEnd = new Date(`${date}T23:59:59.999`);

        const docs = await clinic_power.aggregate([
            // เลือกเฉพาะข้อมูลของวันนั้น
            { $match: { timestamp: { $gte: dayStart, $lte: dayEnd } } },

            // รวมระดับ "รายนาที" ก่อน (กันกรณี 1 นาทีมีหลายเรคอร์ด)
            {
                $group: {
                    _id: { minute: { $dateTrunc: { date: "$timestamp", unit: "minute" } } },
                    power_minute_sum: { $sum: "$power" },
                    voltage_minute_avg: { $avg: "$voltage" },
                    current_minute_avg: { $avg: "$current" }
                }
            },

            // แล้วยกมาสรุปเป็น "รายชั่วโมง" (sum ของรายนาที)
            {
                $group: {
                    _id: { hour: { $dateTrunc: { date: "$_id.minute", unit: "hour" } } },
                    power_hour_sum: { $sum: "$power_minute_sum" },
                    voltage_hour_avg: { $avg: "$voltage_minute_avg" },
                    current_hour_avg: { $avg: "$current_minute_avg" }
                }
            },

            // จัดรูป + เรียงเวลา
            {
                $project: {
                    _id: 0,
                    hour_start: "$_id.hour",
                    power_hour_sum: 1,
                    voltage_hour_avg: { $ifNull: ["$voltage_hour_avg", null] },
                    current_hour_avg: { $ifNull: ["$current_hour_avg", null] }
                }
            },
            { $sort: { hour_start: 1 } }
        ]).toArray();

        res.json({
            date,
            granularity: "hourly",
            hours: docs.length,
            data: docs
        });
    } catch (err) {
        console.error('export-daily-json hourly error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// รายวัน (แต่สรุปเป็นรายชั่วโมงภายในวันนั้น) — CSV
app.get('/clinic/export-daily-csv/:date', async (req, res) => {
    try {
        const { date } = req.params; // YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).send('Invalid date format. Use YYYY-MM-DD');
        }

        const dayStart = new Date(`${date}T00:00:00`);
        const dayEnd = new Date(`${date}T23:59:59.999`);

        const cursor = clinic_power.aggregate([
            { $match: { timestamp: { $gte: dayStart, $lte: dayEnd } } },
            {
                $group: {
                    _id: { minute: { $dateTrunc: { date: "$timestamp", unit: "minute" } } },
                    power_minute_sum: { $sum: "$power" },
                    voltage_minute_avg: { $avg: "$voltage" },
                    current_minute_avg: { $avg: "$current" }
                }
            },
            {
                $group: {
                    _id: { hour: { $dateTrunc: { date: "$_id.minute", unit: "hour" } } },
                    power_hour_sum: { $sum: "$power_minute_sum" },
                    voltage_hour_avg: { $avg: "$voltage_minute_avg" },
                    current_hour_avg: { $avg: "$current_minute_avg" }
                }
            },
            {
                $project: {
                    _id: 0,
                    hour_start: "$_id.hour",
                    power_hour_sum: 1,
                    voltage_hour_avg: { $ifNull: ["$voltage_hour_avg", null] },
                    current_hour_avg: { $ifNull: ["$current_hour_avg", null] }
                }
            },
            { $sort: { hour_start: 1 } }
        ]);

        const filename = `clinic_daily_hourly_${date}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        res.write('hour_start,power_hour_sum,voltage_hour_avg,current_hour_avg\n');

        for await (const doc of cursor) {
            const hourISO = (doc.hour_start instanceof Date) ? doc.hour_start.toISOString() : doc.hour_start;
            res.write([
                hourISO,
                (doc.power_hour_sum ?? ''),
                (doc.voltage_hour_avg ?? ''),
                (doc.current_hour_avg ?? '')
            ].join(',') + '\n');
        }
        res.end();
    } catch (err) {
        console.error('export-daily-csv hourly error:', err);
        res.status(500).send('Server error');
    }
});

// ================== MONTHLY JSON ==================
app.get('/clinic/export-monthly-json/:ym', async (req, res) => {
    try {
        const parts = String(req.params.ym || '').split('-');
        const Y = Number(parts[0]);
        const M = Number(parts[1]);
        if (!Y || !M || M < 1 || M > 12) {
            return res.status(400).json({ error: 'ym must be YYYY-MM' });
        }

        const start = new Date(Date.UTC(Y, M - 1, 1, 0, 0, 0));
        const end = new Date(Date.UTC(Y, M, 1, 0, 0, 0));

        // ดึงคอลเลกชัน clinic_power (ลองทั้ง app.locals และ Mongoose)
        const col = (req.app?.locals?.clinicPower)
            ? req.app.locals.clinicPower
            : require('mongoose').connection.collection('clinic_power');

        const rows = await col.aggregate([
            { $match: { timestamp: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: {
                        y: { $year: '$timestamp' },
                        m: { $month: '$timestamp' },
                        d: { $dayOfMonth: '$timestamp' }
                    },
                    // ถ้า power เป็น W ให้เปลี่ยนเป็น: {$sum: {$divide: [{$divide: ['$power',1000]}, 60]}}
                    energy_kwh: { $sum: { $divide: ['$power', 60] } },
                    min_power: { $min: '$power' },
                    max_power: { $max: '$power' },
                    avg_voltage: { $avg: '$voltage' },
                    avg_current: { $avg: '$current' }
                }
            },
            { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } }
        ]).toArray();

        const pad2 = n => String(n).padStart(2, '0');

        const days = rows.map(r => ({
            date: `${r._id.y}-${pad2(r._id.m)}-${pad2(r._id.d)}`,
            energy_kwh: +((r.energy_kwh ?? 0).toFixed(3)),
            min_power: r.min_power == null ? null : +r.min_power.toFixed(3),
            max_power: r.max_power == null ? null : +r.max_power.toFixed(3),
            avg_voltage: r.avg_voltage == null ? null : +r.avg_voltage.toFixed(2),
            avg_current: r.avg_current == null ? null : +r.avg_current.toFixed(2),
        }));

        const total_energy_kwh = +days.reduce((s, x) => s + (x.energy_kwh || 0), 0).toFixed(3);

        return res.json({
            month: `${Y}-${pad2(M)}`,
            total_energy_kwh,
            days
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'internal error' });
    }
});

// ================== MONTHLY CSV ==================
app.get('/clinic/export-monthly-csv/:ym', async (req, res) => {
    try {
        const parts = String(req.params.ym || '').split('-');
        const Y = Number(parts[0]);
        const M = Number(parts[1]);
        if (!Y || !M || M < 1 || M > 12) {
            return res.status(400).send('ym must be YYYY-MM');
        }

        const start = new Date(Date.UTC(Y, M - 1, 1, 0, 0, 0));
        const end = new Date(Date.UTC(Y, M, 1, 0, 0, 0));

        const col = (req.app?.locals?.clinicPower)
            ? req.app.locals.clinicPower
            : require('mongoose').connection.collection('clinic_power');

        const rows = await col.aggregate([
            { $match: { timestamp: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: {
                        y: { $year: '$timestamp' },
                        m: { $month: '$timestamp' },
                        d: { $dayOfMonth: '$timestamp' }
                    },
                    // ถ้า power เป็น W ให้เปลี่ยนเป็น: {$sum: {$divide: [{$divide: ['$power',1000]}, 60]}}
                    energy_kwh: { $sum: { $divide: ['$power', 60] } },
                    min_power: { $min: '$power' },
                    max_power: { $max: '$power' },
                    avg_voltage: { $avg: '$voltage' },
                    avg_current: { $avg: '$current' }
                }
            },
            { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } }
        ]).toArray();

        const pad2 = n => String(n).padStart(2, '0');

        let csv = 'date,energy_kwh,min_power,max_power,avg_voltage,avg_current\n';
        rows.forEach(r => {
            const date = `${r._id.y}-${pad2(r._id.m)}-${pad2(r._id.d)}`;
            const e = (r.energy_kwh ?? 0).toFixed(3);
            const minP = r.min_power == null ? '' : r.min_power.toFixed(3);
            const maxP = r.max_power == null ? '' : r.max_power.toFixed(3);
            const v = r.avg_voltage == null ? '' : r.avg_voltage.toFixed(2);
            const c = r.avg_current == null ? '' : r.avg_current.toFixed(2);
            csv += `${date},${e},${minP},${maxP},${v},${c}\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="clinic_month_${Y}-${pad2(M)}.csv"`);
        return res.send(csv);
    } catch (e) {
        console.error(e);
        return res.status(500).send('internal error');
    }
});

// ================== YEARLY JSON ==================
app.get('/clinic/export-yearly-json/:year', async (req, res) => {
    try {
        const Y = Number(req.params.year);
        if (!Y) return res.status(400).json({ error: 'year must be YYYY' });

        const start = new Date(Date.UTC(Y, 0, 1, 0, 0, 0));
        const end = new Date(Date.UTC(Y + 1, 0, 1, 0, 0, 0));

        const col = (req.app?.locals?.clinicPower)
            ? req.app.locals.clinicPower
            : require('mongoose').connection.collection('clinic_power');

        const rows = await col.aggregate([
            { $match: { timestamp: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: { y: { $year: '$timestamp' }, m: { $month: '$timestamp' } },
                    // ถ้า power เป็น W ให้เปลี่ยนเป็น: {$sum: {$divide: [{$divide: ['$power',1000]}, 60]}}
                    energy_kwh: { $sum: { $divide: ['$power', 60] } }
                }
            },
            { $sort: { '_id.m': 1 } }
        ]).toArray();

        const pad2 = n => String(n).padStart(2, '0');

        const months = rows.map(r => ({
            month: `${r._id.y}-${pad2(r._id.m)}`,
            energy_kwh: +((r.energy_kwh ?? 0).toFixed(3))
        }));

        const total_energy_kwh = +months.reduce((s, x) => s + (x.energy_kwh || 0), 0).toFixed(3);

        return res.json({
            year: String(Y),
            total_energy_kwh,
            months
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'internal error' });
    }
});

// ================== YEARLY CSV ==================
app.get('/clinic/export-yearly-csv/:year', async (req, res) => {
    try {
        const Y = Number(req.params.year);
        if (!Y) return res.status(400).send('year must be YYYY');

        const start = new Date(Date.UTC(Y, 0, 1, 0, 0, 0));
        const end = new Date(Date.UTC(Y + 1, 0, 1, 0, 0, 0));

        const col = (req.app?.locals?.clinicPower)
            ? req.app.locals.clinicPower
            : require('mongoose').connection.collection('clinic_power');

        const rows = await col.aggregate([
            { $match: { timestamp: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: { y: { $year: '$timestamp' }, m: { $month: '$timestamp' } },
                    // ถ้า power เป็น W ให้เปลี่ยนเป็น: {$sum: {$divide: [{$divide: ['$power',1000]}, 60]}}
                    energy_kwh: { $sum: { $divide: ['$power', 60] } }
                }
            },
            { $sort: { '_id.m': 1 } }
        ]).toArray();

        const pad2 = n => String(n).padStart(2, '0');

        let csv = 'month,energy_kwh\n';
        rows.forEach(r => {
            csv += `${r._id.y}-${pad2(r._id.m)},${(r.energy_kwh ?? 0).toFixed(3)}\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="clinic_year_${Y}.csv"`);
        return res.send(csv);
    } catch (e) {
        console.error(e);
        return res.status(500).send('internal error');
    }
});

// แนะนำ: มี index ที่ { timestamp: 1, power: 1 }
app.get("/clinic/daily-extremes", async (req, res) => {
    try {
        const { date } = req.query;
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: "Missing/invalid date (YYYY-MM-DD)" });
        }

        // ใช้ UTC ล้วนให้ตรงกับที่ client ส่งมาแบบ Z
        const start = new Date(`${date}T00:00:00Z`);
        const end = new Date(`${date}T23:59:59.999Z`);

        const [r] = await clinic_power.aggregate([
            { $match: { timestamp: { $gte: start, $lte: end } } },
            {
                $facet: {
                    // เอกสารที่ power ต่ำสุด
                    min: [{ $sort: { power: 1, timestamp: 1 } }, { $limit: 1 }],
                    // เอกสารที่ power สูงสุด
                    max: [{ $sort: { power: -1, timestamp: 1 } }, { $limit: 1 }],
                }
            },
            {
                $project: {
                    minDoc: { $arrayElemAt: ["$min", 0] },
                    maxDoc: { $arrayElemAt: ["$max", 0] }
                }
            }
        ]);

        if (!r || (!r.minDoc && !r.maxDoc)) {
            return res.json({ date, minPower: null, minAt: null, maxPower: null, maxAt: null });
        }

        res.json({
            date,
            minPower: r.minDoc ? r.minDoc.power : null,
            minAt: r.minDoc ? r.minDoc.timestamp : null,
            maxPower: r.maxDoc ? r.maxDoc.power : null,
            maxAt: r.maxDoc ? r.maxDoc.timestamp : null,
        });
    } catch (err) {
        console.error("Error in /clinic/daily-extremes:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// แนะนำ: มี index ที่ { timestamp: 1, power: 1 }
app.get("/sensorpx_pm3250/daily-extremes", async (req, res) => {
    try {
        const { date } = req.query;
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: "Missing/invalid date (YYYY-MM-DD)" });
        }

        // ใช้ UTC ล้วนให้ตรงกับที่ client ส่งมาแบบ Z
        const start = new Date(`${date}T00:00:00Z`);
        const end = new Date(`${date}T23:59:59.999Z`);

        const [r] = await power_px_pm3250.aggregate([
            { $match: { timestamp: { $gte: start, $lte: end } } },
            {
                $facet: {
                    // เอกสารที่ power ต่ำสุด
                    min: [{ $sort: { power: 1, timestamp: 1 } }, { $limit: 1 }],
                    // เอกสารที่ power สูงสุด
                    max: [{ $sort: { power: -1, timestamp: 1 } }, { $limit: 1 }],
                }
            },
            {
                $project: {
                    minDoc: { $arrayElemAt: ["$min", 0] },
                    maxDoc: { $arrayElemAt: ["$max", 0] }
                }
            }
        ]);

        if (!r || (!r.minDoc && !r.maxDoc)) {
            return res.json({ date, minPower: null, minAt: null, maxPower: null, maxAt: null });
        }

        res.json({
            date,
            minPower: r.minDoc ? r.minDoc.power : null,
            minAt: r.minDoc ? r.minDoc.timestamp : null,
            maxPower: r.maxDoc ? r.maxDoc.power : null,
            maxAt: r.maxDoc ? r.maxDoc.timestamp : null,
        });
    } catch (err) {
        console.error("Error in /clinic/daily-extremes:", err);
        res.status(500).json({ message: "Server error" });
    }
});




app.get("/sensor", async (req, res) => {
    try {
        const data = await sukhothai_power.findOne().sort({ timestamp: -1 }).limit(1);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});

app.get("/sensorClinic", async (req, res) => {
    try {
        const data = await clinic_power.findOne().sort({ timestamp: -1 }).limit(1);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});


app.get("/sensorResort", async (req, res) => {
    try {
        const data = await resort_power.findOne().sort({ timestamp: -1 }).limit(1);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});

app.get("/sensorResident", async (req, res) => {
    try {
        const data = await resident_power.findOne().sort({ timestamp: -1 }).limit(1);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});



app.get("/sensor/px_pm3250", async (req, res) => {
    try {
        const data = await power_px_pm3250.findOne().sort({ timestamp: -1 }).limit(1);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});

app.get("/sensor/px_dh", async (req, res) => {
    try {
        const data = await power_px_dh11.findOne().sort({ timestamp: -1 }).limit(1);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});

const getLatestTime = async (model, res) => {
    try {
        const latestData = await model.findOne().sort({ timestamp: -1 }).select('timestamp');
        if (!latestData) return res.status(404).json({ error: 'No data found' });

        const timestamp = new Date(latestData.timestamp);
        const formattedTime = `${timestamp.getHours()}.${timestamp.getMinutes().toString().padStart(2, '0')}`;

        res.json({ time: formattedTime });
    } catch (err) {
        console.error('Error fetching latest time:', err);
        res.status(500).json({ error: 'Failed to fetch time' });
    }
};

app.get('/latest-time/px_pm3250', (req, res) => getLatestTime(power_px_pm3250, res));

app.get('/latest-time/sensor', (req, res) => getLatestTime(sukhothai_power, res));

app.get('/latest-time/px_dh', (req, res) => getLatestTime(power_px_dh11, res));

app.get('/latest-time/sensorResort', (req, res) => getLatestTime(resort_power, res));

app.get('/latest-time/sensorResident', (req, res) => getLatestTime(resident_power, res));

app.get('/latest-time/sensorHospital', (req, res) => getLatestTime(hospital_power, res));

app.get('/latest-time/sensorClinic', (req, res) => getLatestTime(clinic_power, res));


app.get('/daily-energy/sensorClinic', async (req, res) => {
    try {
        const { date } = req.query;



        // แปลงวันที่จาก request ให้เป็นเขตเวลาไทย
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00 (UTC)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59 (UTC)

        console.log("Start of Day:", startOfDay.toISOString());
        console.log("End of Day:", endOfDay.toISOString());

        // ค้นหาข้อมูลในช่วงเวลาเฉพาะวันที่
        const dailyData = await clinic_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        res.json({
            message: "Data retrieved successfully",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error);
        res.status(500).json({ error: "Failed to fetch daily data" });
    }
});


app.get('/daily-energy/sensorHospital', async (req, res) => {
    try {
        const { date } = req.query;



        // แปลงวันที่จาก request ให้เป็นเขตเวลาไทย
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00 (UTC)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59 (UTC)

        console.log("Start of Day:", startOfDay.toISOString());
        console.log("End of Day:", endOfDay.toISOString());

        // ค้นหาข้อมูลในช่วงเวลาเฉพาะวันที่
        const dailyData = await hospital_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        res.json({
            message: "Data retrieved successfully",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error);
        res.status(500).json({ error: "Failed to fetch daily data" });
    }
});

app.get('/daily-energy/sensorResident', async (req, res) => {
    try {
        const { date } = req.query;



        // แปลงวันที่จาก request ให้เป็นเขตเวลาไทย
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00 (UTC)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59 (UTC)

        console.log("Start of Day:", startOfDay.toISOString());
        console.log("End of Day:", endOfDay.toISOString());

        // ค้นหาข้อมูลในช่วงเวลาเฉพาะวันที่
        const dailyData = await resident_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        res.json({
            message: "Data retrieved successfully",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error);
        res.status(500).json({ error: "Failed to fetch daily data" });
    }
});

app.get('/daily-energy/sensor', async (req, res) => {
    try {
        const { date } = req.query;



        // แปลงวันที่จาก request ให้เป็นเขตเวลาไทย
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00 (UTC)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59 (UTC)

        console.log("Start of Day:", startOfDay.toISOString());
        console.log("End of Day:", endOfDay.toISOString());

        // ค้นหาข้อมูลในช่วงเวลาเฉพาะวันที่
        const dailyData = await sukhothai_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        res.json({
            message: "Data retrieved successfully",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error);
        res.status(500).json({ error: "Failed to fetch daily data" });
    }
});

app.get('/daily-energy/sensorResort', async (req, res) => {
    try {
        const { date } = req.query;

        // แปลงวันที่จาก request ให้เป็นเขตเวลาไทย
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00 (UTC)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59 (UTC)

        console.log("Start of Day:", startOfDay.toISOString());
        console.log("End of Day:", endOfDay.toISOString());

        // ค้นหาข้อมูลในช่วงเวลาเฉพาะวันที่
        const dailyData = await resort_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        res.json({
            message: "Data retrieved successfully",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error);
        res.status(500).json({ error: "Failed to fetch daily data" });
    }
});

app.get('/daily-energy/px_pm3250', async (req, res) => {
    try {
        const { date } = req.query;



        // แปลงวันที่จาก request ให้เป็นเขตเวลาไทย
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00 (UTC)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59 (UTC)

        console.log("Start of Day:", startOfDay.toISOString());
        console.log("End of Day:", endOfDay.toISOString());

        // ค้นหาข้อมูลในช่วงเวลาเฉพาะวันที่
        const dailyData = await power_px_pm3250.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        res.json({
            message: "Data retrieved successfully",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error);
        res.status(500).json({ error: "Failed to fetch daily data" });
    }
});
app.get('/daily-energy/px_dh', async (req, res) => {
    try {
        const { date } = req.query;



        // แปลงวันที่จาก request ให้เป็นเขตเวลาไทย
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00 (UTC)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59 (UTC)

        console.log("Start of Day:", startOfDay.toISOString());
        console.log("End of Day:", endOfDay.toISOString());

        // ค้นหาข้อมูลในช่วงเวลาเฉพาะวันที่
        const dailyData = await power_px_dh11.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        res.json({
            message: "Data retrieved successfully",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error);
        res.status(500).json({ error: "Failed to fetch daily data" });
    }
});


app.get('/daily-energy/sensorClinic', async (req, res) => {
    try {
        const { date } = req.query;



        // แปลงวันที่จาก request ให้เป็นเขตเวลาไทย
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00 (UTC)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59 (UTC)

        console.log("Start of Day:", startOfDay.toISOString());
        console.log("End of Day:", endOfDay.toISOString());

        // ค้นหาข้อมูลในช่วงเวลาเฉพาะวันที่
        const dailyData = await clinic_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        res.json({
            message: "Data retrieved successfully",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error);
        res.status(500).json({ error: "Failed to fetch daily data" });
    }
});

app.get('/latest-day-energy/sensorClinic', async (req, res) => {
    try {
        // กำหนดวันที่ปัจจุบันในเขตเวลาไทย (GMT+7)
        const now = new Date();
        const offset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที

        const startOfDay = new Date(now.getTime() + offset);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00:00 (Local)

        const endOfDay = new Date(now.getTime() + offset);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59:59 (Local)



        // ค้นหาข้อมูลในช่วงเวลาที่กำหนด
        const dailyData = await clinic_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({
                message: "No data found for today.",
                data: []
            });
        }

        res.json({
            message: "Data retrieved successfully for today.",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data for today:", error);
        res.status(500).json({ error: "Failed to fetch daily data for today." });
    }
});

app.get('/latest-day-energy/sensorHospital', async (req, res) => {
    try {
        // กำหนดวันที่ปัจจุบันในเขตเวลาไทย (GMT+7)
        const now = new Date();
        const offset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที

        const startOfDay = new Date(now.getTime() + offset);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00:00 (Local)

        const endOfDay = new Date(now.getTime() + offset);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59:59 (Local)



        // ค้นหาข้อมูลในช่วงเวลาที่กำหนด
        const dailyData = await hospital_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({
                message: "No data found for today.",
                data: []
            });
        }

        res.json({
            message: "Data retrieved successfully for today.",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data for today:", error);
        res.status(500).json({ error: "Failed to fetch daily data for today." });
    }
});


app.get('/latest-day-energy/sensorResident', async (req, res) => {
    try {
        // กำหนดวันที่ปัจจุบันในเขตเวลาไทย (GMT+7)
        const now = new Date();
        const offset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที

        const startOfDay = new Date(now.getTime() + offset);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00:00 (Local)

        const endOfDay = new Date(now.getTime() + offset);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59:59 (Local)



        // ค้นหาข้อมูลในช่วงเวลาที่กำหนด
        const dailyData = await resident_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({
                message: "No data found for today.",
                data: []
            });
        }

        res.json({
            message: "Data retrieved successfully for today.",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data for today:", error);
        res.status(500).json({ error: "Failed to fetch daily data for today." });
    }
});




app.get('/latest-day-energy/px_pm3250', async (req, res) => {
    try {
        // กำหนดวันที่ปัจจุบันในเขตเวลาไทย (GMT+7)
        const now = new Date();
        const offset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที

        const startOfDay = new Date(now.getTime() + offset);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00:00 (Local)

        const endOfDay = new Date(now.getTime() + offset);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59:59 (Local)



        // ค้นหาข้อมูลในช่วงเวลาที่กำหนด
        const dailyData = await power_px_pm3250.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({
                message: "No data found for today.",
                data: []
            });
        }

        res.json({
            message: "Data retrieved successfully for today.",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data for today:", error);
        res.status(500).json({ error: "Failed to fetch daily data for today." });
    }
});

app.get('/latest-day-energy/sensor', async (req, res) => {
    try {
        // กำหนดวันที่ปัจจุบันในเขตเวลาไทย (GMT+7)
        const now = new Date();
        const offset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที

        const startOfDay = new Date(now.getTime() + offset);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00:00 (Local)

        const endOfDay = new Date(now.getTime() + offset);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59:59 (Local)



        // ค้นหาข้อมูลในช่วงเวลาที่กำหนด
        const dailyData = await sukhothai_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({
                message: "No data found for today.",
                data: []
            });
        }

        res.json({
            message: "Data retrieved successfully for today.",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data for today:", error);
        res.status(500).json({ error: "Failed to fetch daily data for today." });
    }
});

app.get('/latest-day-energy/sensorResort', async (req, res) => {
    try {
        // กำหนดวันที่ปัจจุบันในเขตเวลาไทย (GMT+7)
        const now = new Date();
        const offset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที

        const startOfDay = new Date(now.getTime() + offset);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00:00 (Local)

        const endOfDay = new Date(now.getTime() + offset);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59:59 (Local)



        // ค้นหาข้อมูลในช่วงเวลาที่กำหนด
        const dailyData = await resort_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({
                message: "No data found for today.",
                data: []
            });
        }

        res.json({
            message: "Data retrieved successfully for today.",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data for today:", error);
        res.status(500).json({ error: "Failed to fetch daily data for today." });
    }
});

app.get('/latest-day-energy/px_dh', async (req, res) => {
    try {
        // กำหนดวันที่ปัจจุบันในเขตเวลาไทย (GMT+7)
        const now = new Date();
        const offset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที

        const startOfDay = new Date(now.getTime() + offset);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00:00 (Local)

        const endOfDay = new Date(now.getTime() + offset);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59:59 (Local)



        // ค้นหาข้อมูลในช่วงเวลาที่กำหนด
        const dailyData = await power_px_dh11.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({
                message: "No data found for today.",
                data: []
            });
        }

        res.json({
            message: "Data retrieved successfully for today.",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data for today:", error);
        res.status(500).json({ error: "Failed to fetch daily data for today." });
    }
});
app.get('/latest-day-energy/sensorResident', async (req, res) => {
    try {
        // กำหนดวันที่ปัจจุบันในเขตเวลาไทย (GMT+7)
        const now = new Date();
        const offset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที

        const startOfDay = new Date(now.getTime() + offset);
        startOfDay.setUTCHours(0, 0, 0, 0); // เริ่มต้นที่ 00:00:00 (Local)

        const endOfDay = new Date(now.getTime() + offset);
        endOfDay.setUTCHours(23, 59, 59, 999); // สิ้นสุดที่ 23:59:59 (Local)



        // ค้นหาข้อมูลในช่วงเวลาที่กำหนด
        const dailyData = await resident_power.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 });

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({
                message: "No data found for today.",
                data: []
            });
        }

        res.json({
            message: "Data retrieved successfully for today.",
            data: dailyData
        });
    } catch (error) {
        console.error("Error fetching daily data for today:", error);
        res.status(500).json({ error: "Failed to fetch daily data for today." });
    }
});



let cachedElectricityBillsensorHospital = null;
let cachedTotalEnergyKwhsensorHospital = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายวัน (ย้อนหลังได้)
app.get('/daily-bill/sensorpx_pm3250', async (req, res) => {
    try {
        // 1. ตรวจสอบว่ามีการส่งค่า `date` มาหรือไม่ ถ้าไม่มีให้ใช้วันที่ปัจจุบัน
        const selectedDate = req.query.date ? req.query.date : new Date().toISOString().split('T')[0];

        console.log("Fetching data for date:", selectedDate);

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) สำหรับวันที่เลือก
        const aggregationResult = await power_px_pm3250.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${selectedDate}T00:00:00Z`),
                        $lt: new Date(`${selectedDate}T23:59:59Z`),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_kW
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!aggregationResult.length) {
            return res.status(404).json({ error: `No data found for ${selectedDate}` });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟฟ้า
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];

            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายวัน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // 7. ส่งค่ากลับ
        res.json({
            date: selectedDate,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในวันนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายวัน (บาท)
        });

    } catch (err) {
        console.error('Error calculating daily electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});

let cachedElectricityBillsensorClinic = null;
let cachedTotalEnergyKwhsensorClinic = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายวัน (ย้อนหลังได้)
app.get('/daily-bill/sensorClinic', async (req, res) => {
    try {
        // 1. ตรวจสอบว่ามีการส่งค่า `date` มาหรือไม่ ถ้าไม่มีให้ใช้วันที่ปัจจุบัน
        const selectedDate = req.query.date ? req.query.date : new Date().toISOString().split('T')[0];

        console.log("Fetching data for date:", selectedDate);

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) สำหรับวันที่เลือก
        const aggregationResult = await clinic_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${selectedDate}T00:00:00Z`),
                        $lt: new Date(`${selectedDate}T23:59:59Z`),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_kW
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!aggregationResult.length) {
            return res.status(404).json({ error: `No data found for ${selectedDate}` });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟฟ้า
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];

            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายวัน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // 7. ส่งค่ากลับ
        res.json({
            date: selectedDate,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในวันนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายวัน (บาท)
        });

    } catch (err) {
        console.error('Error calculating daily electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});

// GET /daily-bill/sensorClinic/:date
app.get('/daily-bill/sensorClinic/:date', async (req, res) => {
    try {
        const dateStr = req.params.date.trim();

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        // ใช้ UTC ล้วน ๆ
        const start = new Date(`${dateStr}T00:00:00Z`);
        const end = new Date(`${dateStr}T23:59:59.999Z`);

        console.log('Daily bill range (UTC):', { start, end });

        const agg = await clinic_power.aggregate([
            { $match: { timestamp: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: null,
                    totalPowerKWsum: { $sum: '$power' },
                    count: { $sum: 1 },
                },
            },
        ]);

        if (!agg.length) {
            return res.status(404).json({ error: `No data found for ${dateStr}` });
        }

        const totalEnergyKwh = agg[0].totalPowerKWsum / 60;
        const electricityBill = Number((totalEnergyKwh * 4.4).toFixed(2));

        res.json({
            date: dateStr,
            timezone: 'UTC',
            samples: agg[0].count,
            total_energy_kwh: Number(totalEnergyKwh.toFixed(2)),
            electricity_bill: electricityBill,
        });
    } catch (err) {
        console.error('daily-bill error:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});





let monthcachedElectricityBillsensorHospital = null;
let monthcachedTotalEnergyKwhsensorHospital = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายเดือน
app.get('/monthly-bill/sensorHospital', async (req, res) => {
    try {
        // 1. ดึงเดือนปัจจุบันในรูปแบบ YYYY-MM
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของเดือนปัจจุบัน
        const aggregationResult = await hospital_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentMonth}-01T00:00:00Z`), // ตั้งแต่วันที่ 1 ของเดือน
                        $lt: new Date(`${currentMonth}-31T23:59:59Z`), // ถึงวันที่ 31 ของเดือน
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current month' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62 * 12; // ค่าบริการรายเดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายเดือน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        monthcachedElectricityBillsensorResident = electricityBill;
        monthcachedTotalEnergyKwhsensorResident = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            month: currentMonth,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในเดือนนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายเดือน (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating monthly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});

// GET /daily-bill/sensorpx_pm3250/:date
app.get('/daily-bill/sensorpx_pm3250/:date', async (req, res) => {
    try {
        const dateStr = req.params.date.trim();

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        // ใช้ UTC ล้วน ๆ
        const start = new Date(`${dateStr}T00:00:00Z`);
        const end = new Date(`${dateStr}T23:59:59.999Z`);

        console.log('Daily bill range (UTC):', { start, end });

        const agg = await power_px_pm3250.aggregate([
            { $match: { timestamp: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: null,
                    totalPowerKWsum: { $sum: '$power' },
                    count: { $sum: 1 },
                },
            },
        ]);

        if (!agg.length) {
            return res.status(404).json({ error: `No data found for ${dateStr}` });
        }

        const totalEnergyKwh = agg[0].totalPowerKWsum / 60;
        const electricityBill = Number((totalEnergyKwh * 4.4).toFixed(2));

        res.json({
            date: dateStr,
            timezone: 'UTC',
            samples: agg[0].count,
            total_energy_kwh: Number(totalEnergyKwh.toFixed(2)),
            electricity_bill: electricityBill,
        });
    } catch (err) {
        console.error('daily-bill error:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let monthcachedElectricityBillsensorClinic = null;
let monthcachedTotalEnergyKwhsensorClinic = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายเดือน
app.get('/monthly-bill/sensorClinic', async (req, res) => {
    try {
        // 1. ดึงเดือนปัจจุบันในรูปแบบ YYYY-MM
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของเดือนปัจจุบัน
        const aggregationResult = await clinic_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentMonth}-01T00:00:00Z`), // ตั้งแต่วันที่ 1 ของเดือน
                        $lt: new Date(`${currentMonth}-31T23:59:59Z`), // ถึงวันที่ 31 ของเดือน
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current month' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62 * 12; // ค่าบริการรายเดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายเดือน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        monthcachedElectricityBillsensorClinic = electricityBill;
        monthcachedTotalEnergyKwhsensorClinic = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            month: currentMonth,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในเดือนนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายเดือน (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating monthly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});
// วางไว้ "หลัง" route ปัจจุบันเดือน (ถ้ามี) เพื่อไม่ชนลำดับแมตช์
// --- Monthly: GET /monthly-bill/sensorClinic/:month  (เช่น 2025-08) ---
app.get('/monthly-bill/sensorClinic/:month', async (req, res) => {
    try {
        const monthStr = String(req.params.month || '').trim(); // 'YYYY-MM'

        // ตรวจรูปแบบ YYYY-MM
        if (!/^\d{4}-\d{2}$/.test(monthStr)) {
            return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM' });
        }

        const [yStr, mStr] = monthStr.split('-');
        const year = parseInt(yStr, 10);
        const monthIndex = parseInt(mStr, 10) - 1; // 0..11

        if (monthIndex < 0 || monthIndex > 11) {
            return res.status(400).json({ error: 'Invalid month. Use 01..12' });
        }

        // กรอบเวลา UTC: [start, nextMonthStart)
        const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
        const nextMonthStart = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0));

        console.log('Monthly bill range (UTC):', { start, endExclusive: nextMonthStart });

        const agg = await clinic_power.aggregate([
            { $match: { timestamp: { $gte: start, $lt: nextMonthStart } } },
            {
                $group: {
                    _id: null,
                    totalPowerKWsum: { $sum: '$power' }, // สมมติ power เป็น kW ราย sample
                    count: { $sum: 1 },
                },
            },
        ]);

        if (!agg.length) {
            return res.status(404).json({ error: `No data found for ${monthStr}` });
        }

        // แปลง kW ต่อ sample -> kWh (เหมือน daily ที่ใช้ /60)
        const totalEnergyKwh = agg[0].totalPowerKWsum / 60;
        const electricityBill = Number((totalEnergyKwh * 4.4).toFixed(2));

        return res.json({
            month: monthStr,
            timezone: 'UTC',
            samples: agg[0].count,
            total_energy_kwh: Number(totalEnergyKwh.toFixed(2)),
            electricity_bill: electricityBill,
        });
    } catch (err) {
        console.error('monthly-bill error:', err);
        return res.status(500).json({ error: 'Failed to process data' });
    }
});

// --- Monthly: GET /monthly-bill/sensorClinic/:month  (เช่น 2025-08) ---
app.get('/monthly-bill/sensorpx_pm3250/:month', async (req, res) => {
    try {
        const monthStr = String(req.params.month || '').trim(); // 'YYYY-MM'

        // ตรวจรูปแบบ YYYY-MM
        if (!/^\d{4}-\d{2}$/.test(monthStr)) {
            return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM' });
        }

        const [yStr, mStr] = monthStr.split('-');
        const year = parseInt(yStr, 10);
        const monthIndex = parseInt(mStr, 10) - 1; // 0..11

        if (monthIndex < 0 || monthIndex > 11) {
            return res.status(400).json({ error: 'Invalid month. Use 01..12' });
        }

        // กรอบเวลา UTC: [start, nextMonthStart)
        const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
        const nextMonthStart = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0));

        console.log('Monthly bill range (UTC):', { start, endExclusive: nextMonthStart });

        const agg = await power_px_pm3250.aggregate([
            { $match: { timestamp: { $gte: start, $lt: nextMonthStart } } },
            {
                $group: {
                    _id: null,
                    totalPowerKWsum: { $sum: '$power' }, // สมมติ power เป็น kW ราย sample
                    count: { $sum: 1 },
                },
            },
        ]);

        if (!agg.length) {
            return res.status(404).json({ error: `No data found for ${monthStr}` });
        }

        // แปลง kW ต่อ sample -> kWh (เหมือน daily ที่ใช้ /60)
        const totalEnergyKwh = agg[0].totalPowerKWsum / 60;
        const electricityBill = Number((totalEnergyKwh * 4.4).toFixed(2));

        return res.json({
            month: monthStr,
            timezone: 'UTC',
            samples: agg[0].count,
            total_energy_kwh: Number(totalEnergyKwh.toFixed(2)),
            electricity_bill: electricityBill,
        });
    } catch (err) {
        console.error('monthly-bill error:', err);
        return res.status(500).json({ error: 'Failed to process data' });
    }
});

let yearcachedElectricityBillsensorClinic = null;
let yearcachedTotalEnergyKwhsensorClinic = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายปี
app.get('/yearly-bill/sensorClinic', async (req, res) => {
    try {
        // 1. ดึงปีปัจจุบันในรูปแบบ YYYY
        const currentYear = new Date().getFullYear();

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของปีปัจจุบัน
        const aggregationResult = await clinic_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`), // ตั้งแต่ 1 มกราคม
                        $lt: new Date(`${currentYear}-12-31T23:59:59Z`), // ถึง 31 ธันวาคม
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current year' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62; // ค่าบริการรายเดือน คูณ 12 เดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายปี
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        yearcachedElectricityBillsensorClinic = electricityBill;
        yearcachedTotalEnergyKwhsensorClinic = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            year: currentYear,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในปีนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายปี (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating yearly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});

// --- Yearly: GET /yearly-bill/sensorClinic/:year  (เช่น 2025) ---
app.get('/yearly-bill/sensorClinic/:year', async (req, res) => {
    try {
        const yearStr = String(req.params.year || '').trim(); // 'YYYY'

        // ตรวจรูปแบบ YYYY
        if (!/^\d{4}$/.test(yearStr)) {
            return res.status(400).json({ error: 'Invalid year format. Use YYYY' });
        }

        const year = parseInt(yearStr, 10);

        // กรอบเวลา UTC: [startOfYear, startOfNextYear)
        const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
        const nextYearStart = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));

        console.log('Yearly bill range (UTC):', { start, endExclusive: nextYearStart });

        const agg = await clinic_power.aggregate([
            { $match: { timestamp: { $gte: start, $lt: nextYearStart } } },
            {
                $group: {
                    _id: null,
                    totalPowerKWsum: { $sum: '$power' },
                    count: { $sum: 1 },
                },
            },
        ]);

        if (!agg.length) {
            return res.status(404).json({ error: `No data found for ${yearStr}` });
        }

        const totalEnergyKwh = agg[0].totalPowerKWsum / 60;
        const electricityBill = Number((totalEnergyKwh * 4.4).toFixed(2));

        return res.json({
            year: yearStr,
            timezone: 'UTC',
            samples: agg[0].count,
            total_energy_kwh: Number(totalEnergyKwh.toFixed(2)),
            electricity_bill: electricityBill,
        });
    } catch (err) {
        console.error('yearly-bill error:', err);
        return res.status(500).json({ error: 'Failed to process data' });
    }
});

// --- Yearly: GET /yearly-bill/sensorClinic/:year  (เช่น 2025) ---
app.get('/yearly-bill/sensorpx_pm3250/:year', async (req, res) => {
    try {
        const yearStr = String(req.params.year || '').trim(); // 'YYYY'

        // ตรวจรูปแบบ YYYY
        if (!/^\d{4}$/.test(yearStr)) {
            return res.status(400).json({ error: 'Invalid year format. Use YYYY' });
        }

        const year = parseInt(yearStr, 10);

        // กรอบเวลา UTC: [startOfYear, startOfNextYear)
        const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
        const nextYearStart = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));

        console.log('Yearly bill range (UTC):', { start, endExclusive: nextYearStart });

        const agg = await power_px_pm3250.aggregate([
            { $match: { timestamp: { $gte: start, $lt: nextYearStart } } },
            {
                $group: {
                    _id: null,
                    totalPowerKWsum: { $sum: '$power' },
                    count: { $sum: 1 },
                },
            },
        ]);

        if (!agg.length) {
            return res.status(404).json({ error: `No data found for ${yearStr}` });
        }

        const totalEnergyKwh = agg[0].totalPowerKWsum / 60;
        const electricityBill = Number((totalEnergyKwh * 4.4).toFixed(2));

        return res.json({
            year: yearStr,
            timezone: 'UTC',
            samples: agg[0].count,
            total_energy_kwh: Number(totalEnergyKwh.toFixed(2)),
            electricity_bill: electricityBill,
        });
    } catch (err) {
        console.error('yearly-bill error:', err);
        return res.status(500).json({ error: 'Failed to process data' });
    }
});

let yearcachedElectricityBillsensorHospital = null;
let yearcachedTotalEnergyKwhsensorHospital = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายปี
app.get('/yearly-bill/sensorHospital', async (req, res) => {
    try {
        // 1. ดึงปีปัจจุบันในรูปแบบ YYYY
        const currentYear = new Date().getFullYear();

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของปีปัจจุบัน
        const aggregationResult = await hospital_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`), // ตั้งแต่ 1 มกราคม
                        $lt: new Date(`${currentYear}-12-31T23:59:59Z`), // ถึง 31 ธันวาคม
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current year' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62; // ค่าบริการรายเดือน คูณ 12 เดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายปี
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        yearcachedElectricityBillsensorResident = electricityBill;
        yearcachedTotalEnergyKwhsensorResident = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            year: currentYear,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในปีนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายปี (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating yearly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});




let cachedElectricityBillsensorResident = null;
let cachedTotalEnergyKwhsensorResident = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายวัน (ย้อนหลังได้)
app.get('/daily-bill/sensorResident', async (req, res) => {
    try {
        // 1. ตรวจสอบว่ามีการส่งค่า `date` มาหรือไม่ ถ้าไม่มีให้ใช้วันที่ปัจจุบัน
        const selectedDate = req.query.date ? req.query.date : new Date().toISOString().split('T')[0];

        console.log("Fetching data for date:", selectedDate);

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) สำหรับวันที่เลือก
        const aggregationResult = await resident_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${selectedDate}T00:00:00Z`),
                        $lt: new Date(`${selectedDate}T23:59:59Z`),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_kW
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!aggregationResult.length) {
            return res.status(404).json({ error: `No data found for ${selectedDate}` });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟฟ้า
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];

            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายวัน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // 7. ส่งค่ากลับ
        res.json({
            date: selectedDate,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในวันนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายวัน (บาท)
        });

    } catch (err) {
        console.error('Error calculating daily electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});
let monthcachedElectricityBillsensorResident = null;
let monthcachedTotalEnergyKwhsensorResident = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายเดือน
app.get('/monthly-bill/sensorResident', async (req, res) => {
    try {
        // 1. ดึงเดือนปัจจุบันในรูปแบบ YYYY-MM
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของเดือนปัจจุบัน
        const aggregationResult = await resident_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentMonth}-01T00:00:00Z`), // ตั้งแต่วันที่ 1 ของเดือน
                        $lt: new Date(`${currentMonth}-31T23:59:59Z`), // ถึงวันที่ 31 ของเดือน
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current month' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62 * 12; // ค่าบริการรายเดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายเดือน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        monthcachedElectricityBillsensorResident = electricityBill;
        monthcachedTotalEnergyKwhsensorResident = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            month: currentMonth,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในเดือนนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายเดือน (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating monthly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let yearcachedElectricityBillsensorResident = null;
let yearcachedTotalEnergyKwhsensorResident = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายปี
app.get('/yearly-bill/sensorResident', async (req, res) => {
    try {
        // 1. ดึงปีปัจจุบันในรูปแบบ YYYY
        const currentYear = new Date().getFullYear();

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของปีปัจจุบัน
        const aggregationResult = await resident_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`), // ตั้งแต่ 1 มกราคม
                        $lt: new Date(`${currentYear}-12-31T23:59:59Z`), // ถึง 31 ธันวาคม
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current year' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62; // ค่าบริการรายเดือน คูณ 12 เดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายปี
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        yearcachedElectricityBillsensorResident = electricityBill;
        yearcachedTotalEnergyKwhsensorResident = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            year: currentYear,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในปีนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายปี (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating yearly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let cachedElectricityBillsensorResort = null;
let cachedTotalEnergyKwhsensorResort = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายวัน (ย้อนหลังได้)
app.get('/daily-bill/sensorResort', async (req, res) => {
    try {
        // 1. ตรวจสอบว่ามีการส่งค่า `date` มาหรือไม่ ถ้าไม่มีให้ใช้วันที่ปัจจุบัน
        const selectedDate = req.query.date ? req.query.date : new Date().toISOString().split('T')[0];

        console.log("Fetching data for date:", selectedDate);

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) สำหรับวันที่เลือก
        const aggregationResult = await resort_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${selectedDate}T00:00:00Z`),
                        $lt: new Date(`${selectedDate}T23:59:59Z`),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_kW
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!aggregationResult.length) {
            return res.status(404).json({ error: `No data found for ${selectedDate}` });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟฟ้า
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];

            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายวัน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // 7. ส่งค่ากลับ
        res.json({
            date: selectedDate,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในวันนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายวัน (บาท)
        });

    } catch (err) {
        console.error('Error calculating daily electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});
let monthcachedElectricityBillsensorResort = null;
let monthcachedTotalEnergyKwhsensorResort = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายเดือน
app.get('/monthly-bill/sensorResort', async (req, res) => {
    try {
        // 1. ดึงเดือนปัจจุบันในรูปแบบ YYYY-MM
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของเดือนปัจจุบัน
        const aggregationResult = await resort_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentMonth}-01T00:00:00Z`), // ตั้งแต่วันที่ 1 ของเดือน
                        $lt: new Date(`${currentMonth}-31T23:59:59Z`), // ถึงวันที่ 31 ของเดือน
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current month' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62 * 12; // ค่าบริการรายเดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายเดือน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        monthcachedElectricityBillsensorResort = electricityBill;
        monthcachedTotalEnergyKwhsensorResort = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            month: currentMonth,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในเดือนนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายเดือน (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating monthly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let yearcachedElectricityBillsensorResort = null;
let yearcachedTotalEnergyKwhsensorResort = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายปี
app.get('/yearly-bill/sensorResort', async (req, res) => {
    try {
        // 1. ดึงปีปัจจุบันในรูปแบบ YYYY
        const currentYear = new Date().getFullYear();

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของปีปัจจุบัน
        const aggregationResult = await resort_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`), // ตั้งแต่ 1 มกราคม
                        $lt: new Date(`${currentYear}-12-31T23:59:59Z`), // ถึง 31 ธันวาคม
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current year' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62; // ค่าบริการรายเดือน คูณ 12 เดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายปี
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        yearcachedElectricityBillsensorResort = electricityBill;
        yearcachedTotalEnergyKwhsensorResort = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            year: currentYear,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในปีนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายปี (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating yearly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});



let cachedElectricityBillsensor = null;
let cachedTotalEnergyKwhsensor = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายวัน (ย้อนหลังได้)
app.get('/daily-bill/sensor', async (req, res) => {
    try {
        // 1. ตรวจสอบว่ามีการส่งค่า `date` มาหรือไม่ ถ้าไม่มีให้ใช้วันที่ปัจจุบัน
        const selectedDate = req.query.date ? req.query.date : new Date().toISOString().split('T')[0];

        console.log("Fetching data for date:", selectedDate);

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) สำหรับวันที่เลือก
        const aggregationResult = await sukhothai_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${selectedDate}T00:00:00Z`),
                        $lt: new Date(`${selectedDate}T23:59:59Z`),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_kW
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!aggregationResult.length) {
            return res.status(404).json({ error: `No data found for ${selectedDate}` });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟฟ้า
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];

            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายวัน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // 7. ส่งค่ากลับ
        res.json({
            date: selectedDate,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในวันนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายวัน (บาท)
        });

    } catch (err) {
        console.error('Error calculating daily electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});
let monthcachedElectricityBillsensor = null;
let monthcachedTotalEnergyKwhsensor = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายเดือน
app.get('/monthly-bill/sensor', async (req, res) => {
    try {
        // 1. ดึงเดือนปัจจุบันในรูปแบบ YYYY-MM
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของเดือนปัจจุบัน
        const aggregationResult = await sukhothai_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentMonth}-01T00:00:00Z`), // ตั้งแต่วันที่ 1 ของเดือน
                        $lt: new Date(`${currentMonth}-31T23:59:59Z`), // ถึงวันที่ 31 ของเดือน
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current month' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62 * 12; // ค่าบริการรายเดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายเดือน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        monthcachedElectricityBillsensor = electricityBill;
        monthcachedTotalEnergyKwhsensor = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            month: currentMonth,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในเดือนนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายเดือน (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating monthly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let yearcachedElectricityBillsensor = null;
let yearcachedTotalEnergyKwhsensor = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายปี
app.get('/yearly-bill/sensor', async (req, res) => {
    try {
        // 1. ดึงปีปัจจุบันในรูปแบบ YYYY
        const currentYear = new Date().getFullYear();

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของปีปัจจุบัน
        const aggregationResult = await sukhothai_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`), // ตั้งแต่ 1 มกราคม
                        $lt: new Date(`${currentYear}-12-31T23:59:59Z`), // ถึง 31 ธันวาคม
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current year' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62; // ค่าบริการรายเดือน คูณ 12 เดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายปี
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        yearcachedElectricityBillsensor = electricityBill;
        yearcachedTotalEnergyKwhsensor = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            year: currentYear,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในปีนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายปี (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating yearly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});

let cachedElectricityBill = null;
let cachedTotalEnergyKwh = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายวัน (ย้อนหลังได้)
app.get('/daily-bill/px_pm3250', async (req, res) => {
    try {
        // 1. ตรวจสอบว่ามีการส่งค่า `date` มาหรือไม่ ถ้าไม่มีให้ใช้วันที่ปัจจุบัน
        const selectedDate = req.query.date ? req.query.date : new Date().toISOString().split('T')[0];

        console.log("Fetching data for date:", selectedDate);

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) สำหรับวันที่เลือก
        const aggregationResult = await power_px_pm3250.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${selectedDate}T00:00:00Z`),
                        $lt: new Date(`${selectedDate}T23:59:59Z`),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$active_power_kW" }, // คำนวณผลรวม active_power_kW
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!aggregationResult.length) {
            return res.status(404).json({ error: `No data found for ${selectedDate}` });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟฟ้า
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];

            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายวัน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // 7. ส่งค่ากลับ
        res.json({
            date: selectedDate,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในวันนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายวัน (บาท)
        });

    } catch (err) {
        console.error('Error calculating daily electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let monthcachedElectricityBill = null;
let monthcachedTotalEnergyKwh = null;
// Route สำหรับคำนวณค่าไฟฟ้ารายเดือน
app.get('/monthly-bill/px_pm3250', async (req, res) => {
    try {
        // 1. ดึงเดือนปัจจุบันในรูปแบบ YYYY-MM
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของเดือนปัจจุบัน
        const aggregationResult = await power_px_pm3250.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentMonth}-01T00:00:00Z`), // ตั้งแต่วันที่ 1 ของเดือน
                        $lt: new Date(`${currentMonth}-31T23:59:59Z`), // ถึงวันที่ 31 ของเดือน
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$active_power_kW" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current month' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62 * 12; // ค่าบริการรายเดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายเดือน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        monthcachedElectricityBill = electricityBill;
        monthcachedTotalEnergyKwh = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            month: currentMonth,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในเดือนนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายเดือน (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating monthly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let yearcachedElectricityBill = null;
let yearcachedTotalEnergyKwh = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายปี
app.get('/yearly-bill/px_pm3250', async (req, res) => {
    try {
        // 1. ดึงปีปัจจุบันในรูปแบบ YYYY
        const currentYear = new Date().getFullYear();

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของปีปัจจุบัน
        const aggregationResult = await power_px_pm3250.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`), // ตั้งแต่ 1 มกราคม
                        $lt: new Date(`${currentYear}-12-31T23:59:59Z`), // ถึง 31 ธันวาคม
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$active_power_kW" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current year' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62; // ค่าบริการรายเดือน คูณ 12 เดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายปี
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        yearcachedElectricityBill = electricityBill;
        yearcachedTotalEnergyKwh = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            year: currentYear,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในปีนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายปี (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating yearly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});

let cachedElectricityBillnew = null;
let cachedTotalEnergyKwhnew = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายวัน
app.get('/daily-bill/px_dh', async (req, res) => {
    try {
        // 1. ดึงวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0];

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ในวันที่ปัจจุบัน
        const aggregationResult = await power_px_dh11.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentDate}T00:00:00Z`),
                        $lt: new Date(`${currentDate}T23:59:59Z`),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$active_power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current date' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];

            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายวัน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        cachedElectricityBillnew = electricityBill;
        cachedTotalEnergyKwhnew = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            date: currentDate,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในวันนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายวัน (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating daily electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let monthcachedElectricityBillnew = null;
let monthcachedTotalEnergyKwhnew = null;
// Route สำหรับคำนวณค่าไฟฟ้ารายเดือน
app.get('/monthly-bill/px_dh', async (req, res) => {
    try {
        // 1. ดึงเดือนปัจจุบันในรูปแบบ YYYY-MM
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของเดือนปัจจุบัน
        const aggregationResult = await power_px_dh11.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentMonth}-01T00:00:00Z`), // ตั้งแต่วันที่ 1 ของเดือน
                        $lt: new Date(`${currentMonth}-31T23:59:59Z`), // ถึงวันที่ 31 ของเดือน
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$active_power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current month' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62 * 12; // ค่าบริการรายเดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายเดือน
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        monthcachedElectricityBillnew = electricityBill;
        monthcachedTotalEnergyKwhnew = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            month: currentMonth,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในเดือนนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายเดือน (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating monthly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


let yearcachedElectricityBillnew = null;
let yearcachedTotalEnergyKwhnew = null;

// Route สำหรับคำนวณค่าไฟฟ้ารายปี
app.get('/yearly-bill/px_dh', async (req, res) => {
    try {
        // 1. ดึงปีปัจจุบันในรูปแบบ YYYY
        const currentYear = new Date().getFullYear();

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) ของปีปัจจุบัน
        const aggregationResult = await power_px_dh11.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`), // ตั้งแต่ 1 มกราคม
                        $lt: new Date(`${currentYear}-12-31T23:59:59Z`), // ถึง 31 ธันวาคม
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$active_power" }, // คำนวณผลรวม active_power_total
                },
            },
        ]);

        // 3. ตรวจสอบว่ามีข้อมูลหรือไม่
        if (aggregationResult.length === 0) {
            return res.status(404).json({ error: 'No data found for the current year' });
        }

        // 4. คำนวณพลังงานทั้งหมด (kWh)
        const totalEnergyKwh = aggregationResult[0].totalPower / 60; // แปลงจาก kW เป็น kWh

        // 5. ฟังก์ชันคำนวณค่าไฟ
        const calculateElectricityBill = (units) => {
            const rateTiers = [
                { limit: Infinity, rate: 4.4 },
            ];
            // const serviceCharge = 24.62; // ค่าบริการรายเดือน คูณ 12 เดือน
            let totalCost = 0;
            let remainingUnits = units;

            for (const tier of rateTiers) {
                if (remainingUnits > 0) {
                    const unitsInTier = Math.min(remainingUnits, tier.limit);
                    totalCost += unitsInTier * tier.rate;
                    remainingUnits -= unitsInTier;
                }
            }
            totalCost;
            return totalCost.toFixed(2);
        };

        // 6. คำนวณค่าไฟฟ้ารายปี
        const electricityBill = parseFloat(calculateElectricityBill(totalEnergyKwh));

        // Cache ค่าที่คำนวณได้
        yearcachedElectricityBillnew = electricityBill;
        yearcachedTotalEnergyKwhnew = totalEnergyKwh;

        // 7. ส่งค่ากลับ
        res.json({
            year: currentYear,
            total_energy_kwh: totalEnergyKwh.toFixed(2), // พลังงานที่ใช้ในปีนั้น (kWh)
            electricity_bill: electricityBill, // ค่าไฟฟ้ารายปี (บาท)
        });

        return electricityBill, totalEnergyKwh;
    } catch (err) {
        console.error('Error calculating yearly electricity bill:', err);
        res.status(500).json({ error: 'Failed to process data' });
    }
});


exports.api = onRequest(
    {
        region: "asia-northeast1",
        memory: "512MiB",
        cpu: 1,
        timeoutSeconds: 300,
        minInstances: 0,
        maxInstances: 2,
        concurrency: 80,
    },
    app
);
