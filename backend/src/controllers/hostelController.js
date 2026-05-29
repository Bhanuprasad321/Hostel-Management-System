const {db} = require('../config/mysql');

const createHostel = async (req,res) => {
    try {
        const {hostel_name,address} = req.body;
        if (!hostel_name || !address) {
            return res.status(400).json({message: "All fields are required"});
        }
        const [rows]= await db.promise().query('SELECT * FROM hostels WHERE hostel_name = ?',[hostel_name]);
        if (rows.length!==0) {
            return res.status(409).json({message: "Hostel with entered name already exists"});
        }
        await db.promise().query('INSERT INTO hostels (hostel_name,address) VALUES (?,?)',[hostel_name,address]);
        return res.status(200).json({message: "New hostel is created"})

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}



module.exports = {createHostel}