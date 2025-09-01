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
            power: ((data.voltage*data.current)/1000).toFixed(2),
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
app.get('/daily-bill/sensorHospital', async (req, res) => {
    try {
        // 1. ตรวจสอบว่ามีการส่งค่า `date` มาหรือไม่ ถ้าไม่มีให้ใช้วันที่ปัจจุบัน
        const selectedDate = req.query.date ? req.query.date : new Date().toISOString().split('T')[0];

        console.log("Fetching data for date:", selectedDate);

        // 2. ใช้ MongoDB Aggregation เพื่อคำนวณพลังงานรวม (kWh) สำหรับวันที่เลือก
        const aggregationResult = await hospital_power.aggregate([
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

// Route สำหรับคำนวณค่าไฟฟ้ารายวัน โดยส่งวันที่ทาง path
app.get('/daily-bill/sensorClinic/:date', async (req, res) => {
    try {
        // 1. ดึงวันที่จาก path ถ้าไม่ส่งมาให้ใช้วันที่ปัจจุบัน
        const selectedDate = req.params.date || new Date().toISOString().split('T')[0];

        console.log("Fetching data for date:", selectedDate);

        // 2. คำนวณช่วงเวลาเริ่มและสิ้นสุดของวัน
        const dayStart = new Date(`${selectedDate}T00:00:00+07:00`);  // เวลาไทย
        const dayEnd = new Date(`${selectedDate}T23:59:59+07:00`);

        // 3. ใช้ MongoDB Aggregation
        const aggregationResult = await clinic_power.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: dayStart,
                        $lt: dayEnd,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPower: { $sum: "$power" },
                },
            },
        ]);

        if (!aggregationResult.length) {
            return res.status(404).json({ error: `No data found for ${selectedDate}` });
        }

        const totalEnergyKwh = aggregationResult[0].totalPower / 60;

        const calculateElectricityBill = (units) => {
            const rateTiers = [{ limit: Infinity, rate: 4.4 }];
            let totalCost = 0;
            let remainingUnits = units;
            for (const tier of rateTiers) {
                if (remainingUnits <= 0) break;
                const unitsInTier = Math.min(remainingUnits, tier.limit);
                totalCost += unitsInTier * tier.rate;
                remainingUnits -= unitsInTier;
            }
            return Number(totalCost.toFixed(2));
        };

        const electricityBill = calculateElectricityBill(totalEnergyKwh);

        res.json({
            date: selectedDate,
            total_energy_kwh: totalEnergyKwh.toFixed(2),
            electricity_bill: electricityBill,
        });

    } catch (err) {
        console.error('Error calculating daily electricity bill:', err);
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
