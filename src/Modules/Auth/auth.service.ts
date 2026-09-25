import { BadRequestException, ConflictException, encrypt, generateOTP, hash, NotFoundException, sendMail } from "../../common";
import { IMailProvider } from "../../common/email/email.interface";
import { nodemailerProvider } from "../../common/email/nodemailer/init";
import { NodemailerProvider } from "../../common/email/nodemailer/nodemailer.service";
import { ACCESS_TOKEN_SECRET } from "../../config";
import { deleteFromCache, getFromCache, setIntoCache } from "../../DB/Models/redis.service";
import { userRepo, UserRepository } from "../../DB/Models/user/user.repository";
import { LoginDTO, ResetPasswordDTO, SendOTPDTO, SignupDTO, VerifyAccountDTO } from "./auth.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
    constructor(private userRepository: UserRepository, private mailProvider: IMailProvider) {
    }

    async signup(signupDTO: SignupDTO) {
        const { email } = signupDTO;

        // Check if user already exists in database
        const userExist = await this.userRepository.getOne({ email });

        if (userExist) {
            throw new ConflictException("user already exists");
        }

        // Hash password
        signupDTO.password = await hash(signupDTO.password);

        // Encrypt phone number
        if (signupDTO.phoneNumber) {
            signupDTO.phoneNumber = encrypt(signupDTO.phoneNumber);
        }

        // Generate OTP
        const otp = generateOTP();

        // Send OTP to email
        await this.mailProvider.send(signupDTO.email, "confirm email", `<p>your otp to verify your account is ${otp}</p>`);

        // Store OTP in Redis for 3 minutes
        await setIntoCache(
            `${signupDTO.email}:otp`,
            otp,
            3 * 60
        );

        // Store user data in Redis for 3 days
        await setIntoCache(
            signupDTO.email,
            JSON.stringify(signupDTO),
            3 * 24 * 60 * 60
        );

        // DO NOT create user in database yet
        return;
    }

    async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
        // get user data from cache >> null >> fail
        const userData = await getFromCache(verifyAccountDTO.email);
        if (!userData) throw new NotFoundException("user not found");
        // verify otp
        const otp = await getFromCache(`${verifyAccountDTO.email}:otp`);
        if (!otp) throw new BadRequestException("expire otp");
        if (otp != verifyAccountDTO.otp)
            throw new BadRequestException("invalid otp");
        // convert to real user
        await this.userRepository.create(JSON.parse(userData));
        // delete otp
        await deleteFromCache(`${verifyAccountDTO.email}:otp`);
        await deleteFromCache(`${verifyAccountDTO.email}`);
    }

    //  ---- ForgetPassword --------
    async sendOTP(sendOtpDTO: SendOTPDTO) {
        // check email existence into DB
        const userExistIntoDB = await this.userRepository.getOne({
            email: sendOtpDTO.email,
        });

        // check email existence into cache
        const userExistIntoCache = await getFromCache(sendOtpDTO.email);
        if (!userExistIntoCache && !userExistIntoDB) {
            throw new NotFoundException("user not found, please signup");
        }

        // generate new otp
        const otp = generateOTP();
        sendMail({
            to: sendOtpDTO.email,
            subject: "re-send otp",
            html: `<p>your otp is ${otp}</p>`,
        });
        await setIntoCache(`${sendOtpDTO.email}:otp`, otp, 3 * 60);
    } 

    async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
        const userExist = await this.userRepository.getOne({
            email: resetPasswordDTO.email,
        });
        if (!userExist) {
            throw new NotFoundException("user not found");
        }
        // check otp valid
        const otp = await getFromCache(`${resetPasswordDTO.email}:otp`);
        if (otp != resetPasswordDTO.otp)
            throw new BadRequestException("invalid otp");
        // hash password
        resetPasswordDTO.newPassword = await hash(resetPasswordDTO.newPassword);
        // update password
        await this.userRepository.updateOne(
            { email: resetPasswordDTO.email },
            { password: resetPasswordDTO.newPassword },
        );
    }

    // ---- Login --------
    // 1. Service Method
    async login(loginDTO: LoginDTO) {
    const user = await this.userRepository.getOne({
        email: loginDTO.email
    });

    if (!user) {
        throw new BadRequestException("invalid email or password");
    }

    const isMatch = await bcrypt.compare(
        loginDTO.password,
        user.password
    );

    if (!isMatch) {
        throw new BadRequestException("invalid email or password");
    }

    const accessToken = jwt.sign(
        {
            sub: user._id.toString(),
            email: user.email
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1d'
        }
    );

    const refreshToken = jwt.sign(
        {
            sub: user._id.toString(),
            email: user.email
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: '7d'
        }
    );

    return {
        accessToken,
        refreshToken
    };
}
    }

export default new AuthService(userRepo, nodemailerProvider);