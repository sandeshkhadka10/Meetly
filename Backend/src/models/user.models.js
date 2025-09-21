import mongoose,{Schema} from "mongoose";

const userSchema = new Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        username:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true
        },
        isLoggedIn:{
            type:Boolean,
            default:false
        }
    }
)
const User = mongoose.model("User",userSchema);
export {User};