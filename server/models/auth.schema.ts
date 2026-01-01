import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface user {
  fullName: string;
  email: string;
  password: string;
  comparePassword(pass: string): Promise<boolean>;
}

const userSchema = new Schema<user>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {}
});

userSchema.methods.comparePassword = function (pass: string): Promise<boolean> {
  return bcrypt.compare(pass, this.password);
};

const UserModel = model<user>("User", userSchema);

export default UserModel;
