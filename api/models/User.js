import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
});

/*
 In summary, const UserModel = model("User", UserSchema);
 compiles the UserSchema into a Mongoose model named "User"
 and assigns it to the variable UserModel, which can then
 be used to interact with the corresponding MongoDB collection.
*/

const UserModel = model("User", UserSchema);
export default UserModel;
