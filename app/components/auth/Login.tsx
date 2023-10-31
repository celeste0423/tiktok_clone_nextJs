import { ShowErrorObject } from "@/app/types";
import { useState } from "react";
import TextInput from "../TextInput";
import { BiLoaderCircle } from "react-icons/bi";
import { useUser } from "@/app/context/user";
import { useGeneralStore } from "@/app/stores/general";

export default function Login() {
  let { setIsLoginOpen } = useGeneralStore();

  const contextUser = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string | "">("");
  const [password, setPassword] = useState<string | "">("");
  const [error, setError] = useState<ShowErrorObject | null>(null);

  const showError = (type: string) => {
    if (error && Object.entries(error).length > 0 && error?.type == type) {
      return error.message;
    }
    return "";
  };

  const validate = () => {
    setError(null);
    let isError = false;
    //이메일 검사용 정규 표현식
    const reg =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if (!email) {
      setError({ type: "email", message: "A Email is required" });
      isError = true;
    } else if (!password) {
      setError({ type: "password", message: "A Password is required" });
      isError = true;
    }
    return isError;
  };

  const login = async () => {
    let isError = validate();
    if (isError) return;
    if (!contextUser) return;

    try {
      setLoading(true);
      await contextUser.login(email, password);
      setLoading(false);
      setIsLoginOpen(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(error);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-center text-[28px] mb-4 font-bold">Log in</h1>

        <div className="px-6 pb-2">
          <TextInput
            string={email}
            placeholder="Email address"
            onUpdate={setEmail}
            inputType="email"
            error={showError("email")}
          />
        </div>

        <div className="px-6 pb-2">
          <TextInput
            string={password}
            placeholder="Password address"
            onUpdate={setPassword}
            inputType="password"
            error={showError("password")}
          />
        </div>

        <div className="px-6 pb-2 mt-6">
          <button
            disabled={loading}
            onClick={async () => {
              await login();
            }}
            className={`flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm ${
              !email || !password ? "bg-gray-200" : "bg-[#F02C56]"
            }`}
          >
            {loading ? (
              <BiLoaderCircle
                className="animate-spin"
                color="#ffffff"
                size={25}
              />
            ) : (
              "Log in"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
