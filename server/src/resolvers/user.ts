import { User } from "../entities/User";
import { Arg, Mutation, Resolver } from "type-graphql";
import * as bcrypt from "bcrypt";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/validateRegisterInput";

const saltRounds = 10;
@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserMutationResponse, { nullable: true })
  async register(
    @Arg("registerInput") registerInput: RegisterInput //Arg decorator used to bien thanh input for mutation register
  ): Promise<UserMutationResponse> {
    const validateRegisterInputErrors = validateRegisterInput(registerInput);
    if (validateRegisterInputErrors !== null)
      return {
        code: 400,
        success: false,
        ...validateRegisterInputErrors,
      };
    try {
      const { username, email, password } = registerInput;
      const exsistingUser = await User.findOne({
        where: [{ username }, { email }], //findOne username=username OR email=email
      });
      if (exsistingUser)
        return {
          code: 400,
          success: false,
          message: "Duplicate username or email",
          errors: [
            {
              field: exsistingUser.username === username ? "username" : "email",
              message: `${
                exsistingUser.username === username ? "Username" : "Email"
              } already taken`,
            },
          ],
        };
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = User.create({
        username,
        password: hashedPassword,
        email,
      });
      return {
        code: 200,
        success: true,
        message: "User registration successful",
        user: await User.save(newUser),
      };
    } catch (error) {
      console.log("error", error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
      //error if dont return null here: Not all code paths return a value
    }
  }
}
