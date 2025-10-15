/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEnumString(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

 
export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value] // eslint-disable-line @typescript-eslint/no-unused-vars
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    if (error) toast.error(error);
    throw err;
  }
};

/**
 * Creates a new user in the database.
 * @param user - The user object from Cognito or Auth provider.
 * @param idToken - The ID token containing user info.
 * @param userRole - The role for the user ("admin", "manager", "user").
 * @param fetchWithBQ - The fetch function (RTK Query or similar).
 */
export const createNewUserInDatabase = async (
  user: any,
  idToken: any,
  userRole: string,
  fetchWithBQ: any
) => {
// Map the roles to the api endpoints
const createEndpoint = userRole?.toLowerCase() === "admin" ? "/admins" : "/users";

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
    method: "POST",
    body: {
      cognitoId: user.userId,
      name: user.username,
      email: user.idToken?.payload?.email || "",
      phoneNumber: "",
      role: userRole?.toLowerCase() || "user",
    },
  });

  if (createUserResponse.error) {
    throw new Error("Failed to create user record");
  }

  return createUserResponse;
};
