import { TryCatch } from "../middlewares/errorMiddleware";
import { ErrorHandler } from "../utils/utility-classes";
import { User } from "../models/user.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { cloudinary, getDataUri } from "../utils/utils";

dotenv.config();

const getUser = TryCatch(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return next(new ErrorHandler("Not able to finde the user", 404));

    return res.status(200).json({ success: true, user });
});

const logout = TryCatch(async (req, res, next) => {
    return res.cookie("token", "", { maxAge: 0 }).json({
        success: true,
        message: "Logout successfully"
    })
});

const getSuggestedUser = TryCatch(async (req, res, next) => {
    const user = await User.find({}).select("-password");
    const suggestUser = user.filter(_id => _id !== req.user);

    if (!suggestUser) return next(new ErrorHandler("Currently do not have any user", 400));

    return res.status(200).json({ success: true, suggestUser });
});

const followOrUnfollow = TryCatch(async (req, res, next) => {
    const userId = req.user;
    const followUserId = req.params.id;

    if (userId === followUserId) return next(new ErrorHandler("You can not follow or unfollow yourself", 400));

    const user = await User.findById(userId);
    const targetUser = await User.findById(followUserId);

    if (!user || targetUser) return next(new ErrorHandler("User not found", 404));

    const isFollowing = user.following.includes(followUserId);

    if (isFollowing) {
        await Promise.all([
            User.updateOne({ _id: userId }, { $pull: followUserId }),
            User.updateOne({ _id: followUserId }, { $pull: { followers: userId } }),
        ]);

        return res.status(200).json({
            success:true,
            message:"Unfollowed successfull"
        })
    } else {
        await Promise.all([
            User.updateOne({ _id: userId }, { $push: followUserId }),
            User.updateOne({ _id: followUserId }, { $push: { followers: userId } }),
        ]);

        return res.status(200).json({
            success:true,
            message:"Followed successfull"
        })
    }
})

const editUser = TryCatch(async (req, res, next) => {
    const userId = req.user;
    const { bio, gender } = req.body;
    const porfilePicture = req.file;

    let cloudResponse;

    if (porfilePicture) {
        const fileUri = getDataUri(porfilePicture);
        cloudResponse = await cloudinary.uplaoder.upload(fileUri);
    };

    const user = await User.find(userId);

    if (!user) return next(new ErrorHandler("User not found", 404));

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (porfilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated", user });
});

const createUser = TryCatch(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) return new ErrorHandler("Invalid Credentials", 400);

    let existedUser = await User.findOne({});

    if (existedUser) return next(new ErrorHandler("User existed on this credentails", 400))

    const jwtStr = process.env.JWT_STR

    const hashPassword = bcrypt.hash(jwtStr, 10)

    const user = await User.create({
        username,
        email,
        hashPassword
    })

    return res.status(200).json({ success: true, user });
});

const loginUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return new ErrorHandler("Invalid Credentials", 400);

    let user = await User.findOne({ email });

    if (!user) return next(new ErrorHandler("Invalid credentails", 400));

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if (!isMatchedPassword) return next(new ErrorHandler("Invalid credentails", 400));

    user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        follwoers: user.follwoers,
        following: user.following,
        posts: user.posts
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_STR, { expiresIn: 'id' });

    return res.cookie("token", token, { httponly: true, sameSite: "strict", maxAge: 1 * 24 * 60 * 60 * 1000 }).status(200).json({ success: true, message: `Welcome back ${user.username}`, user })
})

export {
    createUser,
    loginUser,
    getUser,
    logout,
    editUser,
    getSuggestedUser,
    followOrUnfollow
}