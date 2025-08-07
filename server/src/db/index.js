import mongoose from 'mongoose';
const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n DATABASE Connection Successfull Listening on - ${connectionInstance.connection.host}`);
        
    }catch(err){
        console.error("Cannot connect to database: Connection Failed", err);
        process.exit(1);
    }
}

export default connectDB;